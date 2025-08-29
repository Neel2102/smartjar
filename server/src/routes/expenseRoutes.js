const express = require("express");
const { addExpense, getExpenses, getExpenseAnalytics } = require("../controllers/expenseController");
const router = express.Router();

router.post("/", addExpense);
router.get("/", getExpenses);
router.get("/analytics", getExpenseAnalytics);

module.exports = router;
