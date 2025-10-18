const { GoogleGenerativeAI } = require("@google/generative-ai");

function getGeminiClient() {
	const apiKey = process.env.GEMINI_API_KEY;
	if (!apiKey) {
		throw new Error("GEMINI_API_KEY missing in environment");
	}
	return new GoogleGenerativeAI(apiKey);
}

// Simple in-memory pacing to avoid provider 429s (1 req/min limit)
let lastCoachCallMs = 0;
const MIN_INTERVAL_MS = 65_000; // slightly above 60s to be safe

// Simple in-memory cache to reduce duplicate calls
// Key: `${userId || 'anon'}::${normalizedPrompt}` -> { data, expiresAt }
const coachCache = new Map();
const CACHE_TTL_MS = 120_000; // 2 minutes

function getFromCache(userId, prompt) {
  const key = `${userId || 'anon'}::${String(prompt).toLowerCase().trim()}`;
  const entry = coachCache.get(key);
  if (entry && entry.expiresAt > Date.now()) return entry.data;
  if (entry) coachCache.delete(key);
  return null;
}

function setInCache(userId, prompt, data) {
  const key = `${userId || 'anon'}::${String(prompt).toLowerCase().trim()}`;
  coachCache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}

async function waitForRateWindow() {
  const now = Date.now();
  const elapsed = now - lastCoachCallMs;
  if (elapsed >= MIN_INTERVAL_MS) {
    return;
  }
  const delay = MIN_INTERVAL_MS - elapsed;
  await new Promise((resolve) => setTimeout(resolve, delay));
}

// POST /api/ai/coach
// Body: { prompt: string, context?: object }
// Returns strict JSON from Gemini
async function getCoachReply(req, res) {
	try {
		const { prompt, context } = req.body || {};
		if (!prompt || typeof prompt !== "string") {
			return res.status(400).json({ error: "prompt is required" });
		}

    // We'll call the provider via a helper that includes pacing and robust JSON handling

		// Compose a strictly JSON response contract
		const systemInstruction = [
			"You are SmartJar's AI Financial Coach.",
			"Always tailor responses to the specific USER PROMPT and the provided CONTEXT.",
			"Vary your guidance so that different prompts produce different, targeted advice.",
			"In the summary, reference the user's question briefly before giving advice.",
			"Special handling for greetings: If the user says hi, hello, hey, good morning/afternoon/evening, greetings, how are you, what's up, howdy, respond warmly with their name and offer to help with financial questions. For greetings, keep nudges, insights, and actions arrays empty to show only the main summary message.",
			"Always acknowledge the user by name when available in the context.",
			"Return STRICT JSON ONLY, no markdown or extra prose outside JSON.",
			"JSON shape: {\n  \"summary\": string,\n  \"nudges\": [{\"title\": string, \"detail\": string}],\n  \"insights\": [{\"type\": string, \"message\": string}],\n  \"actions\": [{\"label\": string, \"suggestedEndpoint\": string, \"payload\": object}]\n}",
			"Guidelines: 1) Use user's ratios, balances, incomes/expenses if present. 2) Provide 2-4 nudges specific to the prompt. 3) Provide 1-3 actionable next steps in actions. 4) Keep summary concise (<= 120 words)."
		].join("\n");

		const userInstruction = [
			"User prompt:",
			prompt,
			"Context (JSON string):",
			JSON.stringify(context || {}, null, 2)
		].join("\n\n");

    const callProvider = async () => {
      await waitForRateWindow();
      const genAI = getGeminiClient();
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent({
        contents: [{
          role: "user",
          parts: [
            { text: systemInstruction },
            { text: userInstruction }
          ]
        }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7,
          topP: 0.9
        }
      });
      const text = result.response.text();
      try {
        const json = JSON.parse(text);
        lastCoachCallMs = Date.now();
        return json;
      } catch (_) {
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}');
        if (start !== -1 && end !== -1 && end > start) {
          const maybe = text.slice(start, end + 1);
          try {
            const json = JSON.parse(maybe);
            lastCoachCallMs = Date.now();
            return json;
          } catch (_) {}
        }
        throw new Error("AI did not return valid JSON");
      }
    };

    // Try cache first
    const cached = getFromCache(req.body?.context?.user?._id, prompt);
    if (cached) {
      return res.json(cached);
    }

    // Try once, then retry on rate limit; finally synthesize a local JSON reply
    try {
      const json = await callProvider();
      setInCache(req.body?.context?.user?._id, prompt, json);
      return res.json(json);
    } catch (firstErr) {
      if (firstErr?.status === 429 || /RATE_LIMIT/i.test(String(firstErr?.message))) {
        await waitForRateWindow();
        try {
          const json = await callProvider();
          setInCache(req.body?.context?.user?._id, prompt, json);
          return res.json(json);
        } catch (retryErr) {
          if (retryErr?.status === 429 || /RATE_LIMIT/i.test(String(retryErr?.message))) {
            // Generate a tailored offline response so UI gets variety without provider
            const prompt = String(req.body?.prompt || '').toLowerCase();
            const ctx = req.body?.context || {};
            const balances = ctx?.user?.jarBalances || { salary: 0, emergency: 0, future: 0 };
            const incomeTarget = ctx?.user?.monthlyIncomeTarget || 0;

            let summary;
            const nudges = [];
            const insights = [];
            const actions = [];

            if (prompt.includes('salary') || prompt.includes('payout')) {
              summary = "Based on your current balances and consistency, aim for 90 days of stable inflows before fixed salary payouts. I’ve estimated steps you can take this week.";
              nudges.push(
                { title: 'Stability Window', detail: 'Maintain consistent weekly deposits for the next 3–4 weeks.' },
                { title: 'Emergency Cushion', detail: `Grow emergency jar to at least ₹${Math.max(10000, Math.round(incomeTarget * 0.5))}.` }
              );
              insights.push({ type: 'Progress', message: `Future jar: ₹${balances.future}, Emergency: ₹${balances.emergency}.` });
              actions.push({ label: 'View Salary Projection', suggestedEndpoint: 'viewSalary', payload: {} });
            } else if (prompt.includes('invest') || prompt.includes('sip') || prompt.includes('mutual') || prompt.includes('stock')) {
              summary = "Given your balances and risk appetite is unknown here, start with a small SIP and increase monthly as the emergency jar grows.";
              nudges.push(
                { title: 'Start Small SIP', detail: 'Begin with ₹500–₹1000 per month in a large-cap index fund.' },
                { title: 'Rule of Thumb', detail: 'Keep 3–6 months of expenses in Emergency before increasing risk.' }
              );
              insights.push({ type: 'Capacity', message: `You have ₹${balances.future} available in Future jar.` });
              actions.push({ label: 'Create SIP Plan', suggestedEndpoint: 'createSIP', payload: { amount: 1000, frequency: 'monthly' } });
            } else if (prompt.includes('fuel') || prompt.includes('expense') || prompt.includes('spend') || prompt.includes('budget')) {
              summary = "Your question relates to spending control. Focus on the top categories and set micro-budgets for the next 2 weeks.";
              nudges.push(
                { title: 'Fuel Budget', detail: 'Cap weekly fuel at a fixed amount and track per trip cost.' },
                { title: 'Top-3 Audit', detail: 'Identify top-3 categories and reduce each by 10% this week.' }
              );
              insights.push({ type: 'Spending', message: 'Small percentage cuts across largest categories drive quick wins.' });
              actions.push({ label: 'Open Analytics', suggestedEndpoint: 'openAnalytics', payload: { focus: 'expenses' } });
            } else if (prompt.includes('emergency') || prompt.includes('rainy') || prompt.includes('safety')) {
              summary = "Build a robust emergency cushion before aggressive investing; here’s a simple ramp-up plan.";
              nudges.push(
                { title: 'Target Setting', detail: `Set target to ₹${Math.max(10000, Math.round((incomeTarget || 20000) * 3))} (≈3 months).` },
                { title: 'Auto-Transfer', detail: 'Move 10–20% of each income to Emergency jar automatically.' }
              );
              insights.push({ type: 'Progress', message: `Current Emergency: ₹${balances.emergency}.` });
              actions.push({ label: 'Update Jar Ratios', suggestedEndpoint: 'updateRatios', payload: { emergency: 30 } });
            } else if (prompt.includes('debt') || prompt.includes('loan') || prompt.includes('emi')) {
              summary = "Tackle high-interest debt with a structured snowball or avalanche plan while protecting essentials.";
              nudges.push(
                { title: 'Minimums First', detail: 'Pay minimum on all loans, then focus extra on highest interest.' },
                { title: 'Refinance Check', detail: 'Explore refinancing to reduce EMI burden if rates allow.' }
              );
              insights.push({ type: 'Tradeoff', message: 'Balance debt paydown with emergency savings to avoid new borrowing.' });
              actions.push({ label: 'Debt Planner', suggestedEndpoint: 'openTools', payload: { tool: 'debt' } });
            } else if (prompt.includes('hi') || prompt.includes('hello') || prompt.includes('hey') || prompt.includes('good morning') || prompt.includes('good afternoon') || prompt.includes('good evening') || prompt.includes('greetings') || prompt.includes('how are you') || prompt.includes('what\'s up') || prompt.includes('howdy')) {
              const userName = ctx?.user?.name || 'there';
              summary = `Hello ${userName}! 👋 I'm your SmartJar AI Financial Coach. I'm here to help you with your financial goals and decisions. How can I assist you today?`;
              // Keep nudges, insights, and actions empty for clean greeting response
              nudges = [];
              insights = [];
              actions = [];
            } else {
              summary = "Here's guidance based on your jars and goals while AI is cooling down. Ask a follow-up for more detail.";
              nudges.push(
                { title: 'Jar Priorities', detail: 'Keep Emergency ahead of Future until cushion is built.' },
                { title: 'Weekly Check-in', detail: 'Review incomes/expenses every Sunday and rebalance jars.' }
              );
              insights.push({ type: 'Balances', message: `Salary: ₹${balances.salary}, Emergency: ₹${balances.emergency}, Future: ₹${balances.future}.` });
              actions.push({ label: 'Go to Dashboard', suggestedEndpoint: 'openDashboard', payload: {} });
            }

            const offline = { summary, nudges, insights, actions };
            setInCache(req.body?.context?.user?._id, prompt, offline);
            return res.status(200).json(offline);
          }
          if (retryErr?.message === 'AI did not return valid JSON') {
            return res.status(502).json({ error: retryErr.message });
          }
          return res.status(500).json({ error: retryErr.message });
        }
      }
      if (firstErr?.message === 'AI did not return valid JSON') {
        return res.status(502).json({ error: firstErr.message });
      }
      throw firstErr;
    }
	} catch (err) {
		console.error("AI coach error:", err);
    // Surface retry hints on rate-limit errors
    if (err?.status === 429 || /RATE_LIMIT/i.test(String(err?.message))) {
      const now = Date.now();
      const elapsed = now - lastCoachCallMs;
      const retryAfter = Math.ceil((MIN_INTERVAL_MS - Math.max(0, elapsed)) / 1000);
      return res.status(429).json({ error: "Rate limited by AI provider", retryAfter: Math.max(1, retryAfter) });
    }
    return res.status(500).json({ error: err.message });
	}
}

module.exports = { getCoachReply };
