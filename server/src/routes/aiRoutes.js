const express = require("express");
const { getCoachReply } = require("../controllers/aiController");

const router = express.Router();

router.post("/coach", getCoachReply);

module.exports = router;
