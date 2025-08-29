const { GoogleGenerativeAI } = require("@google/generative-ai");

function getGeminiClient() {
	const apiKey = process.env.GEMINI_API_KEY;
	if (!apiKey) {
		throw new Error("GEMINI_API_KEY missing in environment");
	}
	return new GoogleGenerativeAI(apiKey);
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

		const genAI = getGeminiClient();
		const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

		// Compose a strictly JSON response contract
		const systemInstruction = [
			"You are SmartJar's AI Financial Coach.",
			"You must respond with strict JSON only. Do not include any prose outside JSON.",
			"JSON shape: {\n  \"summary\": string,\n  \"nudges\": [{\"title\": string, \"detail\": string}],\n  \"insights\": [{\"type\": string, \"message\": string}],\n  \"actions\": [{\"label\": string, \"suggestedEndpoint\": string, \"payload\": object}]\n}"
		].join("\n");

		const userInstruction = [
			"User prompt:",
			prompt,
			"Context (JSON string):",
			JSON.stringify(context || {}, null, 2)
		].join("\n\n");

		const result = await model.generateContent({
			contents: [{
				role: "user",
				parts: [
					{ text: systemInstruction },
					{ text: userInstruction }
				]
			}],
			generationConfig: {
				responseMimeType: "application/json"
			}
		});

		const text = result.response.text();
		// Validate JSON
		let json;
		try {
			json = JSON.parse(text);
		} catch (e) {
			return res.status(502).json({ error: "AI did not return valid JSON", raw: text });
		}

		return res.json(json);
	} catch (err) {
		console.error("AI coach error:", err);
		return res.status(500).json({ error: err.message });
	}
}

module.exports = { getCoachReply };
