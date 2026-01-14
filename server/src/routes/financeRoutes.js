const express = require("express");
const { getFinanceSummary, calculateSalaryProjectionAPI, getEarningsTrendUI, getHeatmapLayout } = require("../controllers/financeController");
const router = express.Router();

router.get("/summary", getFinanceSummary);
router.post("/salary-projection", calculateSalaryProjectionAPI);
router.post("/earnings-trend-ui", getEarningsTrendUI);
router.get("/heatmap-layout", getHeatmapLayout);

module.exports = router;
