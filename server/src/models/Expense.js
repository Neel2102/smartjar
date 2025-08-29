const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
	{
		userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		amount: { type: Number, required: true },
		category: { 
			type: String, 
			required: true,
			enum: ['fuel', 'maintenance', 'food', 'rent', 'utilities', 'entertainment', 'health', 'transport', 'other']
		},
		description: { type: String, required: true },
		date: { type: Date, default: Date.now },
		type: { 
			type: String, 
			required: true,
			enum: ['business', 'personal'],
			default: 'personal'
		},
		jarSource: { 
			type: String, 
			required: true,
			enum: ['salary', 'emergency', 'future'],
			default: 'salary'
		},
		recurring: { type: Boolean, default: false },
		recurringFrequency: { 
			type: String, 
			enum: ['daily', 'weekly', 'monthly', 'yearly'],
			default: 'monthly'
		}
	},
	{ timestamps: true }
);

// Index for efficient queries
expenseSchema.index({ userId: 1, date: -1 });
expenseSchema.index({ userId: 1, category: 1 });
expenseSchema.index({ userId: 1, type: 1 });

module.exports = mongoose.model("Expense", expenseSchema);
