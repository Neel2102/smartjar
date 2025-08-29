const Income = require("../models/Income");
const User = require("../models/User");
const { allocate } = require("../utils/allocation");

async function addIncome(req, res) {
	try {
		const { userId, amount, source, receivedAt } = req.body;
		if (!userId || !amount) {
			return res.status(400).json({ error: "userId and amount required" });
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
			receivedAt,
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

		const incomes = await Income.find({ userId });
		const totals = incomes.reduce((acc, income) => {
			acc.salary += income.allocations.salary;
			acc.emergency += income.allocations.emergency;
			acc.future += income.allocations.future;
			return acc;
		}, { salary: 0, emergency: 0, future: 0 });

		res.json(totals);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
}

module.exports = { addIncome, getIncomes, getJarBalances };
