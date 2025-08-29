const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		jarRatios: {
			salary: { type: Number, default: 60 },
			emergency: { type: Number, default: 25 },
			future: { type: Number, default: 15 },
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
