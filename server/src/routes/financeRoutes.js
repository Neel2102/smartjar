const express = require("express");
const { getFinanceSummary } = require("../controllers/financeController");
const router = express.Router();

router.get("/summary", getFinanceSummary);

module.exports = router;
