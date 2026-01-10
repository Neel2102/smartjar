const express = require("express");
const { getRecommendation, getExplanation, getInvestmentTips } = require("../controllers/investment.controller");
const router = express.Router();

router.get("/recommendation", getRecommendation);
router.get("/explanation", getExplanation);
router.get("/tips", getInvestmentTips);

module.exports = router;
