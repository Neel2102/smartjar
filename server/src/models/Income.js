const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema(
	{
		userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		amount: { type: Number, required: true },
		source: { type: String, default: "gig" },
		receivedAt: { type: Date, default: Date.now },
		allocations: {
			salary: { type: Number, default: 0 },
			emergency: { type: Number, default: 0 },
			future: { type: Number, default: 0 },
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Income", incomeSchema);
