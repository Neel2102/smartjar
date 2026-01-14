const express = require("express");
const { addExpense, getExpenses, getExpenseAnalytics, exportExpense } = require("../controllers/expenseController");
const router = express.Router();

router.post("/", addExpense);
router.get("/", getExpenses);
router.get("/analytics", getExpenseAnalytics);
router.get("/export", exportExpense);

module.exports = router;
