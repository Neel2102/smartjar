const Income = require("../models/Income");
const User = require("../models/User");
const { allocate } = require("../utils/allocation");

async function addIncome(req, res) {
	try {
		const { userId, amount, source, receivedAt } = req.body;
		if (!userId || !amount) {
			return res.status(400).json({ error: "userId and amount required" });
		}

		// Date validation - reject future dates
		const entryDate = receivedAt ? new Date(receivedAt) : new Date();
		const today = new Date();
		today.setHours(23, 59, 59, 999); // End of today
		
		if (entryDate > today) {
			return res.status(400).json({ error: "Future entries not allowed" });
		}

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const allocations = allocate(amount, user.jarRatios);
		const income = await Income.create({
			userId,
			amount,
			source,
			receivedAt: entryDate,
			allocations
		});

		res.status(201).json(income);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
}

async function getIncomes(req, res) {
	try {
		const { userId } = req.query;
		const query = userId ? { userId } : {};
		const incomes = await Income.find(query).sort({ receivedAt: -1 });
		res.json(incomes);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
}

async function getJarBalances(req, res) {
	try {
		const { userId } = req.query;
		if (!userId) {
			return res.status(400).json({ error: "userId required" });
		}

		const Income = require("../models/Income");
		const Expense = require("../models/Expense");
		
		const incomes = await Income.find({ userId });
		const expenses = await Expense.find({ userId });

		// Calculate balances from incomes
		const totals = incomes.reduce((acc, income) => {
			acc.salary += income.allocations.salary || 0;
			acc.emergency += income.allocations.emergency || 0;
			acc.future += income.allocations.future || 0;
			return acc;
		}, { salary: 0, emergency: 0, future: 0 });

		// Deduct expenses in order: Salary → Emergency → Future
		expenses.forEach(expense => {
			let remaining = expense.amount || 0;
			
			// Deduct from Salary Jar first
			if (remaining > 0 && totals.salary > 0) {
				const deductFromSalary = Math.min(remaining, totals.salary);
				totals.salary -= deductFromSalary;
				remaining -= deductFromSalary;
			}
			
			// Then Emergency Jar
			if (remaining > 0 && totals.emergency > 0) {
				const deductFromEmergency = Math.min(remaining, totals.emergency);
				totals.emergency -= deductFromEmergency;
				remaining -= deductFromEmergency;
			}
			
			// Finally Future Jar
			if (remaining > 0 && totals.future > 0) {
				const deductFromFuture = Math.min(remaining, totals.future);
				totals.future -= deductFromFuture;
				remaining -= deductFromFuture;
			}
		});

		res.json(totals);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
}

module.exports = { addIncome, getIncomes, getJarBalances };
