const Expense = require("../models/Expense");
const User = require("../models/User");
const XLSX = require('xlsx');

// Calculate current jar balances (incomes - expenses)
// Deducts expenses in order: Salary → Emergency → Future
function calculateCurrentJarBalances(incomes, expenses) {
	// Start with income allocations
	const balances = incomes.reduce((acc, income) => {
		acc.salary += income.allocations.salary || 0;
		acc.emergency += income.allocations.emergency || 0;
		acc.future += income.allocations.future || 0;
		return acc;
	}, { salary: 0, emergency: 0, future: 0 });

	// Deduct expenses in strict order: Salary → Emergency → Future
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

async function addExpense(req, res) {
	try {
		const { userId, amount, category, description, date, type, jarSource } = req.body;
		
		if (!userId || !amount || !category || !description) {
			return res.status(400).json({ error: "userId, amount, category, and description are required" });
		}

		// Date validation - reject future dates
		const entryDate = date ? new Date(date) : new Date();
		const today = new Date();
		today.setHours(23, 59, 59, 999); // End of today
		
		if (entryDate > today) {
			return res.status(400).json({ error: "Future entries not allowed" });
		}

		// Calculate current jar balances before adding new expense
		const existingIncomes = await Income.find({ userId });
		const existingExpenses = await Expense.find({ userId });
		
		const currentBalances = calculateCurrentJarBalances(existingIncomes, existingExpenses);
		const totalAvailable = currentBalances.salary + currentBalances.emergency + currentBalances.future;

		// Validate sufficient balance
		if (amount > totalAvailable) {
			return res.status(400).json({ error: "Insufficient balance across jars" });
		}

		// Create expense (deduction order is handled in balance calculation)
		const expense = await Expense.create({
			userId,
			amount,
			category,
			description,
			date: entryDate,
			type: type || 'personal',
			jarSource: jarSource || 'salary'
		});

		res.status(201).json(expense);
	} catch (err) {
		if (err.code === 11000) {
			return res.status(400).json({ error: "Duplicate expense entry" });
		}
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

async function exportExpense(req, res) {
	try {
		const { userId } = req.query;
		
		if (!userId) {
			return res.status(400).json({ error: "userId required" });
		}

		// Get all user expense records
		const expenses = await Expense.find({ userId }).sort({ date: -1 });
		
		// Prepare data for Excel
		const excelData = expenses.map(expense => ({
			amount: expense.amount || 0,
			category: expense.category || 'other',
			description: expense.description || '',
			spentAt: new Date(expense.date).toISOString().slice(0, 10)
		}));

		// Create workbook and worksheet
		const ws = XLSX.utils.json_to_sheet(excelData);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "Expense History");

		// Generate buffer
		const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

		// Set headers for download
		res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		res.setHeader('Content-Disposition', 'attachment; filename=expense_history.xlsx');
		res.send(excelBuffer);

	} catch (err) {
		console.error("Expense export error:", err);
		res.status(500).json({ error: err.message });
	}
}

module.exports = {
	addExpense,
	getExpenses,
	getExpenseAnalytics,
	exportExpense
};
