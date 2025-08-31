const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String },
        location: { type: String },
        
        // SmartJar 2.0: Enhanced Profile
        gigProfile: {
            type: { type: String, enum: ['driver', 'delivery', 'freelancer', 'other'], default: 'driver' },
            platforms: [{ type: String }], // ['swiggy', 'uber', 'zomato', 'rapido']
            weeklyWorkDays: { type: Number, default: 6 },
            weeklyWorkHours: { type: Number, default: 48 },
            avgGoodWeekEarnings: { type: Number, default: 0 },
            avgBadWeekEarnings: { type: Number, default: 0 },
            cashVsDigitalSplit: { type: Number, default: 70 }, // percentage of digital payments
        },
        
        // Financial Profile
        debtProfile: {
            hasLoans: { type: Boolean, default: false },
            totalDebt: { type: Number, default: 0 },
            monthlyEMI: { type: Number, default: 0 },
            informalBorrowings: { type: Number, default: 0 },
        },
        
        investmentProfile: {
            experience: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
            riskAppetite: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
            timeHorizon: { type: String, enum: ['short', 'medium', 'long'], default: 'medium' },
            preferredInstruments: [{ type: String }], // ['sip', 'fd', 'mutual_funds', 'stocks']
        },
        
        // Salary System
        salarySystem: {
            isActive: { type: Boolean, default: false },
            startDate: { type: Date },
            monthlySalary: { type: Number, default: 0 },
            nextPayoutDate: { type: Date },
            daysInSystem: { type: Number, default: 0 },
            avgDailyEarnings: { type: Number, default: 0 },
        },
        
        // Existing fields
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
        onboardingStep: { type: String, default: 'basic' }, // basic, gig_profile, financial_profile, ai_recommendations
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

// Virtual for salary eligibility
userSchema.virtual('salaryEligibility').get(function() {
    if (this.salarySystem.daysInSystem < 90) return 'Building History';
    if (this.jarBalances.emergency < (this.salarySystem.monthlySalary * 0.5)) return 'Need Emergency Fund';
    return 'Eligible';
});

// Virtual for projected monthly salary
userSchema.virtual('projectedSalary').get(function() {
    if (this.salarySystem.daysInSystem < 90) {
        return Math.round(this.salarySystem.avgDailyEarnings * 26); // 26 working days
    }
    return this.salarySystem.monthlySalary;
});

userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model("User", userSchema);
