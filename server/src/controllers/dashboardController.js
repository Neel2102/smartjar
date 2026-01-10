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
		
		// Deduct from Salary Jar first
		if (remaining > 0 && balances.salary > 0) {
			const deductFromSalary = Math.min(remaining, balances.salary);
			balances.salary -= deductFromSalary;
			remaining -= deductFromSalary;
		}
		
		// Then Emergency Jar
		if (remaining > 0 && balances.emergency > 0) {
			const deductFromEmergency = Math.min(remaining, balances.emergency);
			balances.emergency -= deductFromEmergency;
			remaining -= deductFromEmergency;
		}
		
		// Finally Future Jar
		if (remaining > 0 && balances.future > 0) {
			const deductFromFuture = Math.min(remaining, balances.future);
			balances.future -= deductFromFuture;
			remaining -= deductFromFuture;
		}
	});

	return balances;
}

// Calculate financial health score
function calculateFinancialHealthScore(user, jarBalances, incomes, expenses) {
	let score = 0;
	
	const emergencyGoal = user.emergencyGoal || user.emergencyFundTarget || 0;
	const emergencySaved = jarBalances.emergency || 0;
	
	// Emergency fund (25 points) - using emergencyGoal
	if (emergencyGoal > 0) {
		const emergencyPercentage = (emergencySaved / emergencyGoal) * 100;
		if (emergencyPercentage >= 100) score += 25;
		else if (emergencyPercentage >= 50) score += 15;
		else if (emergencyPercentage >= 25) score += 10;
	}
	
	// Savings rate (25 points)
	if (incomes.length > 0) {
		const totalIncome = incomes.reduce((sum, inc) => sum + (inc.amount || 0), 0);
		const totalSaved = jarBalances.emergency + jarBalances.future;
		if (totalIncome > 0) {
			const savingsRate = (totalSaved / totalIncome) * 100;
			if (savingsRate >= 30) score += 25;
			else if (savingsRate >= 20) score += 20;
			else if (savingsRate >= 10) score += 15;
			else if (savingsRate >= 5) score += 10;
		}
	}
	
	// Activity (20 points)
	if (incomes.length > 0) {
		const latestIncome = incomes.sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt))[0];
		if (latestIncome && latestIncome.receivedAt) {
			const daysSinceLastActivity = Math.floor((Date.now() - new Date(latestIncome.receivedAt)) / (1000 * 60 * 60 * 24));
			if (daysSinceLastActivity <= 1) score += 20;
			else if (daysSinceLastActivity <= 3) score += 15;
			else if (daysSinceLastActivity <= 7) score += 10;
		}
	}
	
	// Basic factors (30 points)
	if (incomes.length > 0) score += 15;
	if (jarBalances.emergency > 0) score += 15;

	return Math.min(100, Math.max(0, score));
}

async function getDashboardSummary(req, res) {
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
		const totalSaved = jarBalances.emergency + jarBalances.future;
		const netIncome = totalIncome - totalExpenses;

		// Calculate emergency coverage (using emergencyGoal consistently)
		const emergencyGoal = user.emergencyGoal || user.emergencyFundTarget || 0;
		const emergencySaved = jarBalances.emergency || 0;
		const emergencyCoverage = emergencyGoal > 0 ? Math.round((emergencySaved / emergencyGoal) * 100 * 10) / 10 : 0;

		// Calculate financial health score
		const financialHealthScore = calculateFinancialHealthScore(user, jarBalances, incomes, expenses);

		// Update user's financial health score in database
		await User.findByIdAndUpdate(
			userId,
			{
				'financialHealth.score': financialHealthScore,
				'financialHealth.lastCalculated': new Date()
			},
			{ new: true }
		);

		// Return complete dashboard summary
		res.json({
			jarBalances: {
				salary: jarBalances.salary,
				emergency: jarBalances.emergency,
				future: jarBalances.future
			},
			summary: {
				totalIncome,
				totalExpenses,
				totalSaved,
				netIncome
			},
			emergency: {
				goal: emergencyGoal,
				saved: emergencySaved,
				coverage: emergencyCoverage
			},
			financialHealth: {
				score: financialHealthScore,
				level: financialHealthScore >= 80 ? 'Excellent' : 
				       financialHealthScore >= 60 ? 'Good' : 
				       financialHealthScore >= 40 ? 'Fair' : 
				       financialHealthScore >= 20 ? 'Poor' : 'Critical'
			},
			counts: {
				incomes: incomes.length,
				expenses: expenses.length
			}
		});

	} catch (err) {
		console.error("Dashboard summary error:", err);
		return res.status(500).json({ error: err.message });
	}
}

module.exports = {
	getDashboardSummary
};
