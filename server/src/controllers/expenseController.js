const Expense = require("../models/Expense");

async function addExpense(req, res) {
	try {
		const { userId, amount, category, description, date, type, jarSource } = req.body;
		
		if (!userId || !amount || !category || !description) {
			return res.status(400).json({ error: "userId, amount, category, and description are required" });
		}

		const expense = await Expense.create({
			userId,
			amount,
			category,
			description,
			date: date || new Date(),
			type: type || 'personal',
			jarSource: jarSource || 'salary'
		});

		res.status(201).json(expense);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
}

async function getExpenses(req, res) {
	try {
		const { userId, category, type, limit = 50 } = req.query;
		
		if (!userId) {
			return res.status(400).json({ error: "userId required" });
		}

		const query = { userId };
		if (category) query.category = category;
		if (type) query.type = type;

		const expenses = await Expense.find(query)
			.sort({ date: -1 })
			.limit(parseInt(limit));

		res.json(expenses);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
}

async function getExpenseAnalytics(req, res) {
	try {
		const { userId } = req.query;
		
		if (!userId) {
			return res.status(400).json({ error: "userId required" });
		}

		const now = new Date();
		const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

		const expenses = await Expense.find({
			userId,
			date: { $gte: startOfMonth }
		});

		const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
		const businessExpenses = expenses.filter(exp => exp.type === 'business')
			.reduce((sum, exp) => sum + exp.amount, 0);
		const personalExpenses = expenses.filter(exp => exp.type === 'personal')
			.reduce((sum, exp) => sum + exp.amount, 0);

		const categoryBreakdown = {};
		expenses.forEach(exp => {
			categoryBreakdown[exp.category] = (categoryBreakdown[exp.category] || 0) + exp.amount;
		});

		res.json({
			totalExpenses,
			businessExpenses,
			personalExpenses,
			categoryBreakdown,
			expenseCount: expenses.length
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
}

module.exports = {
	addExpense,
	getExpenses,
	getExpenseAnalytics
};
