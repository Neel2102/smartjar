/**
 * SmartJar Salary Projection Engine
 * Converts volatile daily income into a conservative, reliable monthly salary estimate
 */

function calculateSalaryProjection(transactions, emergency_fund_current, today = null) {
	// Use provided today or current date
	const today_date = today ? new Date(today) : new Date();
	const today_str = today_date.toISOString().slice(0, 10);

	// 1. DAILY TOTALS
	// Group transactions by date
	const daily_income = {};
	
	transactions.forEach(transaction => {
		const date = transaction.date; // Expected format: "YYYY-MM-DD"
		if (!daily_income[date]) {
			daily_income[date] = 0;
		}
		daily_income[date] += transaction.amount || 0;
	});

	// 2. LAST 30 DAYS WINDOW
	// Generate array of all dates from today-29 to today
	const last30 = [];
	for (let i = 29; i >= 0; i--) {
		const date = new Date(today_date);
		date.setDate(today_date.getDate() - i);
		const date_str = date.toISOString().slice(0, 10);
		last30.push({
			date: date_str,
			income: daily_income[date_str] || 0
		});
	}

	// 3. ACTIVE DAYS
	const active_days = last30.filter(day => day.income > 0).length;
	const working_probability = active_days / 30;

	// 4. STABLE AVERAGE (Trimmed Mean)
	// Take last 14 days from last30 where income > 0
	const active_days_values = last30
		.filter(day => day.income > 0)
		.map(day => day.income);

	let average_daily = 0;
	
	if (active_days_values.length > 0) {
		// Sort values
		const sorted_values = [...active_days_values].sort((a, b) => a - b);
		const n = sorted_values.length;
		const trim = Math.floor(0.15 * n);
		
		// Extract stable values (remove 15% from each end)
		const stable_values = sorted_values.slice(trim, n - trim);
		
		// Calculate mean of stable values
		if (stable_values.length > 0) {
			average_daily = stable_values.reduce((sum, val) => sum + val, 0) / stable_values.length;
		}
	}

	// Round average_daily
	average_daily = Math.round(average_daily);

	// 5. MONTHLY SALARY
	const monthly_salary = Math.round(average_daily * working_probability * 30);

	// 6. EMERGENCY FUND
	const emergency_target = monthly_salary * 3;
	const emergency_progress = Math.min(100, Math.round((emergency_fund_current / emergency_target) * 100));

	// 7. SALARY STREAK
	// Count consecutive valid days from today backward
	let salary_streak = 0;
	const threshold = 0.6 * average_daily;

	// Check consecutive calendar days from today backward
	for (let i = 0; i < 90; i++) {
		const check_date = new Date(today_date);
		check_date.setDate(today_date.getDate() - i);
		const date_str = check_date.toISOString().slice(0, 10);
		
		const income = daily_income[date_str] || 0;
		if (income >= threshold) {
			salary_streak++;
		} else {
			break; // Stop at first invalid day
		}
	}

	const remaining_days = Math.max(0, 90 - salary_streak);

	// 8. ELIGIBILITY
	const eligible = (salary_streak >= 90 && emergency_fund_current >= emergency_target);

	// 9. RECENT TREND (14 DAYS)
	// Last 14 entries from last30 in ascending date order
	// Ensure we always have exactly 14 days
	const recent_trend = [];
	for (let i = 13; i >= 0; i--) {
		const date = new Date(today_date);
		date.setDate(today_date.getDate() - i);
		const date_str = date.toISOString().slice(0, 10);
		
		const income = daily_income[date_str] || 0;
		
		// Zone classification
		let zone;
		if (income === 0) {
			zone = "inactive";
		} else if (income >= average_daily) {
			zone = "strong";
		} else if (income >= 0.6 * average_daily) {
			zone = "stable";
		} else {
			zone = "weak";
		}
		
		recent_trend.push({
			date: date_str,
			income: income,
			zone: zone
		});
	}

	// OUTPUT JSON ONLY
	return {
		average_daily,
		monthly_salary,
		emergency_target,
		emergency_progress,
		salary_streak,
		remaining_days,
		eligible,
		recent_trend
	};
}

module.exports = {
	calculateSalaryProjection
};
