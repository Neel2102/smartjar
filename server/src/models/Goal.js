const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
	{
		userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		title: { type: String, required: true },
		description: { type: String },
		targetAmount: { type: Number, required: true },
		currentAmount: { type: Number, default: 0 },
		jarType: { 
			type: String, 
			required: true,
			enum: ['salary', 'emergency', 'future', 'custom'],
			default: 'custom'
		},
		deadline: { type: Date },
		status: { 
			type: String, 
			enum: ['active', 'completed', 'paused'],
			default: 'active'
		},
		priority: { 
			type: String, 
			enum: ['low', 'medium', 'high', 'critical'],
			default: 'medium'
		},
		icon: { type: String, default: '🎯' },
		color: { type: String, default: '#667eea' },
		createdAt: { type: Date, default: Date.now }
	},
	{ timestamps: true }
);

// Virtual for progress percentage
goalSchema.virtual('progressPercentage').get(function() {
	if (this.targetAmount === 0) return 0;
	return Math.min((this.currentAmount / this.targetAmount) * 100, 100);
});

// Virtual for days remaining
goalSchema.virtual('daysRemaining').get(function() {
	if (!this.deadline) return null;
	const now = new Date();
	const diffTime = this.deadline - now;
	return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for estimated completion date
goalSchema.virtual('estimatedCompletionDate').get(function() {
	if (this.currentAmount >= this.targetAmount) return null;
	
	const avgDailySaving = this.currentAmount / Math.max((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24), 1);
	const remainingAmount = this.targetAmount - this.currentAmount;
	const daysToComplete = remainingAmount / avgDailySaving;
	
	const completionDate = new Date();
	completionDate.setDate(completionDate.getDate() + daysToComplete);
	return completionDate;
});

goalSchema.set('toJSON', { virtuals: true });
goalSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model("Goal", goalSchema);
