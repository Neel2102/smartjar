const express = require("express");
const { addIncome, getIncomes, getJarBalances, exportIncome } = require("../controllers/incomeController");
const router = express.Router();

router.post("/", addIncome);
router.get("/", getIncomes);
router.get("/jars", getJarBalances);
router.get("/export", exportIncome);

module.exports = router;
