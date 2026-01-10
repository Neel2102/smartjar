const User = require("../models/User");
const Income = require("../models/Income");
const Expense = require("../models/Expense");

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

		// Calculate salary projection metrics
		const today = new Date();
		const ninetyDaysAgo = new Date(today);
		ninetyDaysAgo.setDate(today.getDate() - 90);
		
		const fourteenDaysAgo = new Date(today);
		fourteenDaysAgo.setDate(today.getDate() - 14);

		// Get incomes from last 90 days
		const last90DaysIncomes = incomes.filter(inc => {
			const incomeDate = new Date(inc.receivedAt);
			return incomeDate >= ninetyDaysAgo;
		});

		// Get incomes from last 14 days
		const last14DaysIncomes = incomes.filter(inc => {
			const incomeDate = new Date(inc.receivedAt);
			return incomeDate >= fourteenDaysAgo;
		});

		// Count unique days with income > 0 in last 90 days
		const uniqueDaysWithIncome = new Set();
		last90DaysIncomes.forEach(inc => {
			if (inc.amount > 0) {
				const dateStr = new Date(inc.receivedAt).toDateString();
				uniqueDaysWithIncome.add(dateStr);
			}
		});
		const eligibilityDays = uniqueDaysWithIncome.size;
		const remainingDays = Math.max(0, 90 - eligibilityDays);

		// Calculate average daily income from last 14 days (only active days)
		const activeDaysInLast14 = new Set();
		last14DaysIncomes.forEach(inc => {
			if (inc.amount > 0) {
				const dateStr = new Date(inc.receivedAt).toDateString();
				activeDaysInLast14.add(dateStr);
			}
		});
		const activeDaysCount = activeDaysInLast14.size || 1; // Avoid division by zero
		const totalLast14DaysEarnings = last14DaysIncomes.reduce((sum, inc) => sum + (inc.amount || 0), 0);
		const avgDailyIncome = activeDaysCount > 0 ? totalLast14DaysEarnings / activeDaysCount : 0;

		// Calculate projected salary (avgDaily × 26 working days)
		const projectedSalary = Math.round(avgDailyIncome * 26);

		// Emergency achieved logic: emergencyJar >= emergencyGoal
		const emergencyAchieved = emergencySaved >= emergencyGoal;

		// Determine salary status
		let salaryStatus = "BUILDING HISTORY";
		if (eligibilityDays >= 90 && emergencyAchieved) {
			salaryStatus = "ELIGIBLE FOR PAYOUT";
		}

		// Calculate next payout date (1st of next month only if eligible)
		let nextPayoutDate = null;
		if (salaryStatus === "ELIGIBLE FOR PAYOUT") {
			const nextMonth = new Date(today);
			nextMonth.setMonth(today.getMonth() + 1);
			nextMonth.setDate(1);
			nextPayoutDate = nextMonth.toISOString();
		}

		// Build last14DaysEarnings array (daily earnings for chart)
		const last14DaysEarnings = [];
		for (let i = 13; i >= 0; i--) {
			const date = new Date(today);
			date.setDate(today.getDate() - i);
			date.setHours(0, 0, 0, 0);
			
			const dayEarnings = last14DaysIncomes
				.filter(inc => {
					const incDate = new Date(inc.receivedAt);
					incDate.setHours(0, 0, 0, 0);
					return incDate.getTime() === date.getTime();
				})
				.reduce((sum, inc) => sum + (inc.amount || 0), 0);
			
			last14DaysEarnings.push({
				date: date.toISOString().split('T')[0], // Format as YYYY-MM-DD
				total: dayEarnings
			});
		}

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
			avgDailyIncome: Math.round(avgDailyIncome),
			projectedSalary,
			eligibilityDays,
			remainingDays,
			salaryStatus,
			nextPayoutDate,
			last14DaysEarnings
		});

	} catch (err) {
		console.error("Finance summary error:", err);
		return res.status(500).json({ error: err.message });
	}
}

module.exports = {
	getFinanceSummary
};
