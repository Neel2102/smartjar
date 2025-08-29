const express = require("express");
const { addIncome, getIncomes, getJarBalances } = require("../controllers/incomeController");
const router = express.Router();

router.post("/", addIncome);
router.get("/", getIncomes);
router.get("/jars", getJarBalances);

module.exports = router;
