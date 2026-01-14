const User = require("../models/User");
const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { calculateSalaryProjection } = require("../utils/salaryProjectionEngine");
const { processEarningsTrend } = require("../utils/earningsTrendUIEngine");
const { generateHeatmap } = require("../utils/heatmapEngine");
const { generateHeatmapLayout } = require("../utils/heatmapLayoutEngine");

// Calculate jar balances with expense deductions
function calculateJarBalances(incomes, expenses) {
	// Start with income allocations
	const balances = incomes.reduce((acc, income) => {
		acc.salary += income.allocations.salary || 0;
		acc.emergency += income.allocations.emergency || 0;
		acc.future += income.allocations.future || 0;
		return acc;
	}, { salary: 0, emergency: 0, future: 0 });

	// Deduct expenses in order: Salary → Emergency → Future
	expenses.forEach(expense => {
		let remaining = expense.amount || 0;
		
		if (remaining > 0 && balances.salary > 0) {
			const deductFromSalary = Math.min(remaining, balances.salary);
			balances.salary -= deductFromSalary;
			remaining -= deductFromSalary;
		}
		
		if (remaining > 0 && balances.emergency > 0) {
			const deductFromEmergency = Math.min(remaining, balances.emergency);
			balances.emergency -= deductFromEmergency;
			remaining -= deductFromEmergency;
		}
		
		if (remaining > 0 && balances.future > 0) {
			const deductFromFuture = Math.min(remaining, balances.future);
			balances.future -= deductFromFuture;
			remaining -= deductFromFuture;
		}
	});

	return balances;
}

async function getFinanceSummary(req, res) {
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

		// Get all incomes and expenses
		const incomes = await Income.find({ userId }).sort({ receivedAt: -1 });
		const expenses = await Expense.find({ userId }).sort({ date: -1 });

		// If no incomes, create sample data for testing
		if (incomes.length === 0) {
			console.log('No incomes found, creating sample data for testing');
			const today = new Date();
			const sampleIncomes = [];
			
			// Create sample data for last 14 days
			for (let i = 0; i < 14; i++) {
				const sampleDate = new Date(today);
				sampleDate.setDate(today.getDate() - i);
				
				// Add income for some days
				if (i % 2 === 0 || i === 0) { // Today and every other day
					sampleIncomes.push({
						userId: userId,
						amount: Math.floor(Math.random() * 1000) + 500,
						source: 'sample',
						receivedAt: sampleDate,
						allocations: {
							salary: 600,
							emergency: 250,
							future: 150
						}
					});
				}
			}
			
			// Insert sample data temporarily for testing
			await Income.insertMany(sampleIncomes);
			console.log(`Inserted ${sampleIncomes.length} sample income records`);
			
			// Refetch incomes
			const updatedIncomes = await Income.find({ userId }).sort({ receivedAt: -1 });
			incomes.push(...updatedIncomes);
		}

		// Calculate jar balances (with expense deductions)
		const jarBalances = calculateJarBalances(incomes, expenses);

		// Calculate summary values
		const totalIncome = incomes.reduce((sum, inc) => sum + (inc.amount || 0), 0);
		const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
		const netIncome = totalIncome - totalExpenses;

		// Calculate emergency coverage (using emergencyGoal consistently)
		const emergencyGoal = user.emergencyGoal || user.emergencyFundTarget || 0;
		const emergencySaved = jarBalances.emergency || 0;
		const emergencyCoveragePercent = emergencyGoal > 0 ? Math.round((emergencySaved / emergencyGoal) * 100 * 10) / 10 : 0;

		// Prepare transactions for salary projection engine
		const transactions = incomes.map(inc => ({
			date: new Date(inc.receivedAt).toISOString().slice(0, 10),
			amount: inc.amount || 0
		}));

		// Use new salary projection engine
		const today = new Date().toISOString().slice(0, 10);
		const salaryProjection = calculateSalaryProjection(transactions, emergencySaved, today);

		// Emergency achieved logic: emergencyJar >= emergencyGoal
		const emergencyAchieved = emergencySaved >= emergencyGoal;

		// Determine salary status
		let salaryStatus = "BUILDING HISTORY";
		if (salaryProjection.eligible) {
			salaryStatus = "ELIGIBLE FOR PAYOUT";
		}

		// Calculate next payout date (1st of next month only if eligible)
		let nextPayoutDate = null;
		if (salaryStatus === "ELIGIBLE FOR PAYOUT") {
			const nextMonth = new Date();
			nextMonth.setMonth(new Date().getMonth() + 1);
			nextMonth.setDate(1);
			nextPayoutDate = nextMonth.toISOString();
		}

		// Build last14DaysEarnings array for chart compatibility
		const last14DaysEarnings = salaryProjection.recent_trend.map(item => ({
			date: item.date,
			total: item.income,
			zone: item.zone
		}));

		// Return complete finance summary
		res.json({
			totalIncome,
			totalExpenses,
			netIncome,
			salaryJar: jarBalances.salary,
			emergencyJar: jarBalances.emergency,
			futureJar: jarBalances.future,
			emergencyGoal,
			emergencyCoveragePercent,
			emergencyAchieved,
			avgDailyIncome: salaryProjection.average_daily,
			projectedSalary: salaryProjection.monthly_salary,
			eligibilityDays: salaryProjection.salary_streak,
			remainingDays: salaryProjection.remaining_days,
			salaryStatus,
			nextPayoutDate,
			last14DaysEarnings
		});

	} catch (err) {
		console.error("Finance summary error:", err);
		return res.status(500).json({ error: err.message });
	}
}

async function calculateSalaryProjectionAPI(req, res) {
	try {
		const { transactions, emergency_fund_current, today } = req.body;
		
		if (!transactions || !Array.isArray(transactions)) {
			return res.status(400).json({ error: "transactions array is required" });
		}
		
		if (typeof emergency_fund_current !== "number") {
			return res.status(400).json({ error: "emergency_fund_current number is required" });
		}
		
		// Calculate salary projection using the engine
		const result = calculateSalaryProjection(transactions, emergency_fund_current, today);
		
		// Output only JSON
		res.json(result);
		
	} catch (err) {
		console.error("Salary projection error:", err);
		return res.status(500).json({ error: err.message });
	}
}

async function getEarningsTrendUI(req, res) {
	try {
		const { recent_trend } = req.body;
		
		if (!recent_trend || !Array.isArray(recent_trend)) {
			return res.status(400).json({ error: "recent_trend array is required" });
		}
		
		// Process earnings trend for UI
		const result = processEarningsTrend(recent_trend);
		
		// Output JSON only
		res.json(result);
		
	} catch (err) {
		console.error("Earnings trend UI error:", err);
		return res.status(500).json({ error: err.message });
	}
}

async function getHeatmapLayout(req, res) {
	try {
		const { userId } = req.query;
		
		if (!userId) {
			return res.status(400).json({ error: "userId required" });
		}

		// Get user income history
		const incomes = await Income.find({ userId }).sort({ receivedAt: -1 });

		// Prepare daily income data
		const daily_income = incomes.reduce((acc, income) => {
			const date = new Date(income.receivedAt).toISOString().slice(0, 10);
			if (!acc[date]) {
				acc[date] = 0;
			}
			acc[date] += income.amount || 0;
			return acc;
		}, {});

		// Convert to array format
		const daily_income_array = Object.entries(daily_income).map(([date, income]) => ({
			date: date,
			income: income
		}));

		// Calculate average daily income
		const total_income = daily_income_array.reduce((sum, day) => sum + day.income, 0);
		const average_daily = daily_income_array.length > 0 ? Math.round(total_income / daily_income_array.length) : 0;

		// Generate basic heatmap
		const today = new Date().toISOString().slice(0, 10);
		const basic_heatmap = generateHeatmap(daily_income_array, average_daily, today);

		// Generate layout using only real past dates
		const result = generateHeatmapLayout(basic_heatmap.heatmap, today);

		// Output JSON only
		res.json(result);

	} catch (err) {
		console.error("Heatmap layout error:", err);
		res.status(500).json({ error: err.message });
	}
}

module.exports = {
	getFinanceSummary,
	calculateSalaryProjectionAPI,
	getEarningsTrendUI,
	getHeatmapLayout
};
