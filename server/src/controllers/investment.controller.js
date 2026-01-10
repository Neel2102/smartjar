const User = require("../models/User");
const InvestmentProfile = require("../models/InvestmentProfile");
const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { GoogleGenerativeAI } = require("@google/generative-ai");

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY missing in environment");
  }
  return new GoogleGenerativeAI(apiKey);
}

// Strategy mapping based on experience and risk
function getInvestmentStrategy(experience, risk) {
  const strategyMap = {
    "Beginner": {
      "Low": "RD",
      "Medium": "Index SIP",
      "High": "ETF"
    },
    "Intermediate": {
      "Low": "RD",
      "Medium": "Hybrid MF",
      "High": "Hybrid MF"
    },
    "Advanced": {
      "Low": "Index SIP",
      "Medium": "Hybrid MF",
      "High": "Equity Mix"
    }
  };

  const expKey = experience.charAt(0).toUpperCase() + experience.slice(1);
  const riskKey = risk.charAt(0).toUpperCase() + risk.slice(1);

  return strategyMap[expKey]?.[riskKey] || "Index SIP";
}

// Get instrument name based on strategy
function getInstrumentName(strategy) {
  const instrumentMap = {
    "RD": "Recurring Deposit",
    "Index SIP": "Nifty Index Fund",
    "ETF": "Exchange Traded Fund",
    "Hybrid MF": "Balanced Mutual Fund",
    "Equity Mix": "Diversified Equity Fund"
  };

  return instrumentMap[strategy] || "Index SIP";
}

async function getRecommendation(req, res) {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: "userId required" });
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get jar balances (including expense deductions)
    const incomes = await Income.find({ userId });
    const expenses = await Expense.find({ userId });
    
    // Calculate balances from incomes
    const jarBalances = incomes.reduce((acc, income) => {
      acc.salary += income.allocations.salary || 0;
      acc.emergency += income.allocations.emergency || 0;
      acc.future += income.allocations.future || 0;
      return acc;
    }, { salary: 0, emergency: 0, future: 0 });

    // Deduct expenses in order: Salary → Emergency → Future
    expenses.forEach(expense => {
      let remaining = expense.amount || 0;
      
      if (remaining > 0 && jarBalances.salary > 0) {
        const deductFromSalary = Math.min(remaining, jarBalances.salary);
        jarBalances.salary -= deductFromSalary;
        remaining -= deductFromSalary;
      }
      
      if (remaining > 0 && jarBalances.emergency > 0) {
        const deductFromEmergency = Math.min(remaining, jarBalances.emergency);
        jarBalances.emergency -= deductFromEmergency;
        remaining -= deductFromEmergency;
      }
      
      if (remaining > 0 && jarBalances.future > 0) {
        const deductFromFuture = Math.min(remaining, jarBalances.future);
        jarBalances.future -= deductFromFuture;
        remaining -= deductFromFuture;
      }
    });

    const emergencyJar = jarBalances.emergency || 0;
    const futureJar = jarBalances.future || 0;
    
    // Always use emergencyGoal for consistency (with fallback for backward compatibility)
    const emergencyGoal = user.emergencyGoal || user.emergencyFundTarget || 0;

    // Block investing if emergencyGoal is missing or too low
    if (!emergencyGoal || emergencyGoal < 1000) {
      return res.json({
        eligible: false,
        reason: "Set your Emergency Fund Target to activate investing. Minimum target is ₹1,000.",
        emergencyCoveragePercent: 0
      });
    }

    // Calculate emergency coverage percentage
    let emergencyCoveragePercent = 0;
    if (emergencyGoal > 0) {
      emergencyCoveragePercent = (emergencyJar / emergencyGoal) * 100;
    }

    // Block investing if coverage < 30
    if (emergencyCoveragePercent < 30) {
      return res.json({
        eligible: false,
        reason: "Emergency fund too low. Build your emergency fund to at least 30% of your target before investing.",
        emergencyCoveragePercent: Math.round(emergencyCoveragePercent * 10) / 10
      });
    }

    // Calculate available amount = FutureJar × 0.7
    const availableAmount = Math.max(0, futureJar * 0.7);

    // Calculate SIP = min( Available × 0.25 , 1000 )
    const calculatedSIP = availableAmount * 0.25;
    const sipAmount = Math.max(0, Math.min(Math.round(calculatedSIP), 1000));

    // Get investment profile from user
    const experienceLevel = user.investmentProfile?.experience || "beginner";
    const riskAppetite = user.investmentProfile?.riskAppetite || "medium";
    const timeHorizon = user.investmentProfile?.timeHorizon || "medium";

    // Map to the format expected by strategy function
    const experienceMap = {
      "beginner": "Beginner",
      "intermediate": "Intermediate",
      "advanced": "Advanced"
    };

    const riskMap = {
      "low": "Low",
      "medium": "Medium",
      "high": "High"
    };

    const mappedExperience = experienceMap[experienceLevel] || "Beginner";
    const mappedRisk = riskMap[riskAppetite] || "Medium";

    // Get investment strategy
    const strategy = getInvestmentStrategy(mappedExperience, mappedRisk);
    const instrument = getInstrumentName(strategy);

    // Generate reason message
    let reason = "";
    if (emergencyCoveragePercent >= 50) {
      reason = "Stable income + emergency coverage healthy. Safe to invest.";
    } else if (emergencyCoveragePercent >= 30) {
      reason = "Emergency fund is building. Start with small investments.";
    } else {
      reason = "Build emergency fund first before investing.";
    }

    // Update or create InvestmentProfile
    await InvestmentProfile.findOneAndUpdate(
      { userId },
      {
        userId,
        experienceLevel: mappedExperience,
        riskAppetite: mappedRisk,
        timeHorizon: timeHorizon.charAt(0).toUpperCase() + timeHorizon.slice(1),
        monthlyAvailable: Math.round(availableAmount),
        emergencyCoveragePercent: Math.round(emergencyCoveragePercent * 100) / 100,
        lastCalculated: new Date()
      },
      { upsert: true, new: true }
    );

    // Return recommendation
    res.json({
      eligible: true,
      sipAmount: sipAmount,
      instrument: instrument,
      reason: reason,
      emergencyCoveragePercent: Math.round(emergencyCoveragePercent * 100) / 100,
      availableAmount: Math.round(availableAmount),
      strategy: strategy,
      jarBalances: {
        emergency: emergencyJar,
        future: futureJar,
        emergencyGoal: emergencyGoal
      }
    });

  } catch (err) {
    console.error("Investment recommendation error:", err);
    res.status(500).json({ error: err.message });
  }
}

// Generate investment explanation using Gemini (text only, no numbers)
async function generateInvestmentExplanation(context) {
  try {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemInstruction = [
      "You are SmartJar's Investment Coach. Your role is to provide motivational, personalized explanations about investment recommendations.",
      "CRITICAL RULES - YOU MUST FOLLOW THESE STRICTLY:",
      "1. NEVER generate, compute, calculate, or mention ANY specific financial numbers, rupee amounts, percentages, or monetary values",
      "2. NEVER use currency symbols (₹) or numeric values in your response",
      "3. The context includes pre-calculated backend values - you receive them ONLY to understand the situation",
      "4. You MUST use ONLY descriptive terms like 'small amount', 'adequate coverage', 'building progress', 'sufficient safety net'",
      "5. Return a single warm, encouraging paragraph (100-150 words) explaining WHY the recommendation exists",
      "6. Focus on: financial stability, emergency fund progress, readiness to invest, and building wealth gradually",
      "7. If state is 'blocked', explain why building emergency fund first is important (use terms like 'adequate safety net', 'sufficient coverage', never percentages)",
      "8. If state is 'eligible', explain why systematic investing now is beneficial (use terms like 'small regular amounts', 'appropriate for your situation', never specific amounts)",
      "9. Your explanation must be purely motivational and educational - NO NUMBERS WHATSOEVER"
    ].join("\n");

    // Context is already safe (no numeric values) - use directly
    const userInstruction = `Explain the investment recommendation in one motivational paragraph. Context (use these descriptive states only, never mention numbers): ${JSON.stringify(context)}`;

    const result = await model.generateContent({
      contents: [{
        role: "user",
        parts: [
          { text: systemInstruction },
          { text: userInstruction }
        ]
      }],
      generationConfig: {
        temperature: 0.7,
        topP: 0.9
      }
    });

    let explanation = result.response.text().trim();
    
    // Safety check: remove any numbers or currency symbols that might have slipped through
    explanation = explanation.replace(/₹[0-9,.]+/gi, 'amount');
    explanation = explanation.replace(/[0-9,.]+%/g, 'percentage');
    explanation = explanation.replace(/₹/g, '');
    // Remove standalone numbers that might represent amounts
    explanation = explanation.replace(/\b[0-9,]+(?:\.\d+)?\s*(?:rupees?|rs?|inr)?\b/gi, 'amount');
    
    return explanation;
  } catch (err) {
    console.error("Gemini explanation error:", err);
    // Fallback explanation if Gemini fails (no numbers)
    if (context.state === 'blocked' || context.emergencyFundStatus === 'needs_attention') {
      return "Your emergency fund needs attention before investing. Building a strong financial safety net first ensures you can handle unexpected expenses without disrupting your investment journey. This disciplined approach sets you up for long-term success.";
    }
    return "Based on your current financial stability and emergency fund progress, now is a good time to start your investment journey. Starting with a systematic approach allows you to build wealth gradually while maintaining your financial security.";
  }
}

// Generate investment tips using Gemini
async function generateInvestmentTips(context) {
  try {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemInstruction = [
      "You are SmartJar's Investment Coach. Generate 4 one-sentence investment habit tips.",
      "IMPORTANT RULES:",
      "1. NEVER generate or compute any financial numbers, rupee amounts, percentages, or calculations",
      "2. NEVER use currency symbols (₹) or specific numeric values",
      "3. Focus on habits, behaviors, and general principles",
      "4. Each tip should be actionable and educational",
      "5. Return a JSON array of exactly 4 strings, each being one sentence",
      "6. Tips should relate to: starting small, time in market, diversification, continuous learning",
      "Example format: [\"Start with small regular investments to build the habit.\", \"Long-term investments typically outperform short-term trading.\", \"Spread investments across different asset classes to reduce risk.\", \"Stay updated with market trends and financial education resources.\"]"
    ].join("\n");

    const userInstruction = `Generate 4 investment habit tips based on: ${JSON.stringify(context)}`;

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
      const tips = JSON.parse(text);
      if (Array.isArray(tips) && tips.length >= 4) {
        return tips.slice(0, 4);
      }
    } catch (e) {
      // Try to extract array from text
      const match = text.match(/\[.*\]/s);
      if (match) {
        const tips = JSON.parse(match[0]);
        if (Array.isArray(tips) && tips.length >= 4) {
          return tips.slice(0, 4);
        }
      }
    }

    // Fallback tips
    return [
      "Start with small regular investments to build the habit of consistent saving.",
      "Long-term investments typically outperform short-term trading strategies.",
      "Spread your investments across different asset classes to reduce overall risk.",
      "Stay updated with market trends and continue learning about personal finance."
    ];
  } catch (err) {
    console.error("Gemini tips error:", err);
    // Fallback tips
    return [
      "Start with small regular investments to build the habit of consistent saving.",
      "Long-term investments typically outperform short-term trading strategies.",
      "Spread your investments across different asset classes to reduce overall risk.",
      "Stay updated with market trends and continue learning about personal finance."
    ];
  }
}

async function getExplanation(req, res) {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: "userId required" });
    }

    // Get user and balances (same logic as getRecommendation but without calculations)
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const incomes = await Income.find({ userId });
    const expenses = await Expense.find({ userId });
    
    // Calculate balances from incomes
    const jarBalances = incomes.reduce((acc, income) => {
      acc.salary += income.allocations.salary || 0;
      acc.emergency += income.allocations.emergency || 0;
      acc.future += income.allocations.future || 0;
      return acc;
    }, { salary: 0, emergency: 0, future: 0 });

    // Deduct expenses in order: Salary → Emergency → Future
    expenses.forEach(expense => {
      let remaining = expense.amount || 0;
      
      if (remaining > 0 && jarBalances.salary > 0) {
        const deductFromSalary = Math.min(remaining, jarBalances.salary);
        jarBalances.salary -= deductFromSalary;
        remaining -= deductFromSalary;
      }
      
      if (remaining > 0 && jarBalances.emergency > 0) {
        const deductFromEmergency = Math.min(remaining, jarBalances.emergency);
        jarBalances.emergency -= deductFromEmergency;
        remaining -= deductFromEmergency;
      }
      
      if (remaining > 0 && jarBalances.future > 0) {
        const deductFromFuture = Math.min(remaining, jarBalances.future);
        jarBalances.future -= deductFromFuture;
        remaining -= deductFromFuture;
      }
    });

    const emergencyJar = jarBalances.emergency || 0;
    const futureJar = jarBalances.future || 0;
    // Always use emergencyGoal for consistency (with fallback for backward compatibility)
    const emergencyGoal = user.emergencyGoal || user.emergencyFundTarget || 0;

    // Calculate state and coverage (backend only - Gemini never sees these calculations)
    let state = 'blocked';
    let emergencyCoverage = 0;
    let sipAmount = 0;

    if (emergencyGoal >= 1000) {
      emergencyCoverage = emergencyGoal > 0 ? Math.round((emergencyJar / emergencyGoal) * 100 * 10) / 10 : 0;
      
      if (emergencyCoverage >= 30) {
        state = 'eligible';
        const availableAmount = Math.max(0, futureJar * 0.7);
        const calculatedSIP = availableAmount * 0.25;
        sipAmount = Math.max(0, Math.min(Math.round(calculatedSIP), 1000));
      }
    }

    // Analyze patterns (backend calculations only)
    const recentIncomes = incomes.slice(0, 10);
    const recentExpenses = expenses.slice(0, 10);
    
    const avgIncome = recentIncomes.length > 0 
      ? recentIncomes.reduce((sum, inc) => sum + (inc.amount || 0), 0) / recentIncomes.length 
      : 0;
    
    const avgExpense = recentExpenses.length > 0
      ? recentExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0) / recentExpenses.length
      : 0;

    const savingsPattern = avgIncome > avgExpense ? 'positive' : avgIncome < avgExpense ? 'negative' : 'neutral';
    const spendingSpike = recentExpenses.length > 3 && recentExpenses.slice(0, 3).reduce((sum, exp) => sum + (exp.amount || 0), 0) > avgExpense * 2.5 ? 'high' : 'normal';

    // Prepare safe context for Gemini (descriptive states only, no numeric values)
    // IMPORTANT: Gemini receives ONLY descriptive states - never numeric financial values
    // All financial calculations are done by backend, Gemini only explains why recommendations exist
    const safeContext = {
      state: state, // 'blocked' or 'eligible' - descriptive state only
      savingsPattern: savingsPattern, // 'positive', 'negative', 'neutral' - descriptive pattern
      spendingSpike: spendingSpike, // 'high', 'normal' - descriptive pattern
      hasSIPRecommendation: state === 'eligible', // boolean - has recommendation, not the amount
      emergencyFundStatus: emergencyCoverage >= 30 ? 'adequate' : emergencyCoverage > 0 ? 'building' : 'needs_attention' // descriptive status, not percentage
    };
    
    // Note: sipAmount and emergencyCoverage are backend-calculated but NOT sent to Gemini
    // Gemini receives only descriptive states to ensure no numeric values in explanations

    const explanation = await generateInvestmentExplanation(safeContext);

    res.json({
      explanation: explanation,
      state: state,
      emergencyCoverage: emergencyCoverage
    });
  } catch (err) {
    console.error("Investment explanation error:", err);
    res.status(500).json({ error: err.message });
  }
}

async function getInvestmentTips(req, res) {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: "userId required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const incomes = await Income.find({ userId });
    const expenses = await Expense.find({ userId });
    
    // Calculate balances from incomes
    const jarBalances = incomes.reduce((acc, income) => {
      acc.salary += income.allocations.salary || 0;
      acc.emergency += income.allocations.emergency || 0;
      acc.future += income.allocations.future || 0;
      return acc;
    }, { salary: 0, emergency: 0, future: 0 });

    // Deduct expenses in order: Salary → Emergency → Future
    expenses.forEach(expense => {
      let remaining = expense.amount || 0;
      
      if (remaining > 0 && jarBalances.salary > 0) {
        const deductFromSalary = Math.min(remaining, jarBalances.salary);
        jarBalances.salary -= deductFromSalary;
        remaining -= deductFromSalary;
      }
      
      if (remaining > 0 && jarBalances.emergency > 0) {
        const deductFromEmergency = Math.min(remaining, jarBalances.emergency);
        jarBalances.emergency -= deductFromEmergency;
        remaining -= deductFromEmergency;
      }
      
      if (remaining > 0 && jarBalances.future > 0) {
        const deductFromFuture = Math.min(remaining, jarBalances.future);
        jarBalances.future -= deductFromFuture;
        remaining -= deductFromFuture;
      }
    });

    const emergencyJar = jarBalances.emergency || 0;
    // Always use emergencyGoal for consistency (with fallback for backward compatibility)
    const emergencyGoal = user.emergencyGoal || user.emergencyFundTarget || 0;
    const emergencySaved = jarBalances.emergency || 0;
    const emergencyCoverage = emergencyGoal > 0 ? Math.round((emergencySaved / emergencyGoal) * 100 * 10) / 10 : 0;
    
    const futureJar = jarBalances.future || 0;
    const availableAmount = Math.max(0, futureJar * 0.7);
    const calculatedSIP = availableAmount * 0.25;
    const sipAmount = Math.max(0, Math.min(Math.round(calculatedSIP), 1000));

    const state = emergencyGoal >= 1000 && emergencyCoverage >= 30 ? 'stable' : 'building';
    const learningActivity = user.financialHealth?.badges?.length > 0 ? 'active' : 'beginner';

    // Context for Gemini (descriptive only, no numeric values)
    const context = {
      state: state, // 'stable' or 'building' - descriptive only
      learningActivity: learningActivity, // 'active' or 'beginner' - descriptive only
      emergencyFundStatus: emergencyCoverage >= 30 ? 'adequate' : emergencyCoverage > 0 ? 'building' : 'needs_attention', // descriptive status
      hasSIPCapacity: sipAmount > 0 // boolean - has capacity for SIP, not the amount
    };

    const tips = await generateInvestmentTips(context);

    res.json({
      tips: tips
    });
  } catch (err) {
    console.error("Investment tips error:", err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getRecommendation,
  getExplanation,
  getInvestmentTips
};
