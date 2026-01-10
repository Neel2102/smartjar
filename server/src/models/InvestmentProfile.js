const mongoose = require("mongoose");

const InvestmentProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  experienceLevel: { type: String, default: "Beginner" },
  riskAppetite: { type: String, default: "Medium" },
  timeHorizon: { type: String, default: "Medium" },

  monthlyAvailable: Number,
  emergencyCoveragePercent: Number,
  lastCalculated: Date
});

module.exports = mongoose.model("InvestmentProfile", InvestmentProfileSchema);
