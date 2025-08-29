const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		phone: { type: String },
		location: { type: String },
		occupation: { type: String, default: 'gig_worker' },
		monthlyIncomeTarget: { type: Number, default: 0 },
		emergencyFundTarget: { type: Number, default: 0 },
		jarRatios: {
			salary: { type: Number, default: 60 },
			emergency: { type: Number, default: 25 },
			future: { type: Number, default: 15 },
		},
		preferences: {
			currency: { type: String, default: 'INR' },
			language: { type: String, default: 'en' },
			theme: { type: String, default: 'light' },
			notifications: { type: Boolean, default: true },
			weeklyReports: { type: Boolean, default: true }
		},
		financialHealth: {
			score: { type: Number, default: 0 },
			lastCalculated: { type: Date, default: Date.now },
			streakDays: { type: Number, default: 0 },
			badges: [{ type: String }]
		},
		onboardingCompleted: { type: Boolean, default: false },
		lastActive: { type: Date, default: Date.now }
	},
	{ timestamps: true }
);

// Virtual for financial health level
userSchema.virtual('healthLevel').get(function() {
	const score = this.financialHealth.score;
	if (score >= 80) return 'Excellent';
	if (score >= 60) return 'Good';
	if (score >= 40) return 'Fair';
	if (score >= 20) return 'Poor';
	return 'Critical';
});

// Virtual for emergency fund status
userSchema.virtual('emergencyFundStatus').get(function() {
	if (!this.emergencyFundTarget) return 'Not Set';
	const percentage = (this.emergencyFundTarget / this.monthlyIncomeTarget) * 100;
	if (percentage >= 6) return 'Excellent (6+ months)';
	if (percentage >= 3) return 'Good (3-6 months)';
	if (percentage >= 1) return 'Fair (1-3 months)';
	return 'Poor (<1 month)';
});

userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model("User", userSchema);
