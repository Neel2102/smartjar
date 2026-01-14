/**
 * SmartJar Contribution Heatmap Engine
 * Generates yearly contribution heatmap with streak analysis
 */

function generateHeatmap(daily_income, average_daily, today = null) {
	// Use provided today or current date
	const today_date = today ? new Date(today) : new Date();
	const today_str = today_date.toISOString().slice(0, 10);

	// Create income lookup map
	const income_map = {};
	daily_income.forEach(day => {
		income_map[day.date] = day.income || 0;
	});

	// 1. YEAR RANGE
	// Generate all dates from today-364 to today
	const heatmap = [];
	for (let i = 364; i >= 0; i--) {
		const date = new Date(today_date);
		date.setDate(today_date.getDate() - i);
		const date_str = date.toISOString().slice(0, 10);
		
		const income = income_map[date_str] || 0;
		
		// 2. ZONE CLASSIFICATION
		let zone;
		if (income === 0) {
			zone = "none";
		} else if (income < 0.6 * average_daily) {
			zone = "weak";
		} else if (income < average_daily) {
			zone = "stable";
		} else {
			zone = "strong";
		}
		
		heatmap.push({
			date: date_str,
			zone: zone
		});
	}

	// 3. STREAKS
	// Current streak: consecutive days from today backward where income > 0
	let current_streak = 0;
	for (let i = 0; i < 365; i++) {
		const date = new Date(today_date);
		date.setDate(today_date.getDate() - i);
		const date_str = date.toISOString().slice(0, 10);
		
		const income = income_map[date_str] || 0;
		if (income > 0) {
			current_streak++;
		} else {
			break;
		}
	}

	// Max streak: longest continuous sequence of days with income > 0
	let max_streak = 0;
	let temp_streak = 0;
	for (let i = 364; i >= 0; i--) {
		const date = new Date(today_date);
		date.setDate(today_date.getDate() - i);
		const date_str = date.toISOString().slice(0, 10);
		
		const income = income_map[date_str] || 0;
		if (income > 0) {
			temp_streak++;
			max_streak = Math.max(max_streak, temp_streak);
		} else {
			temp_streak = 0;
		}
	}

	// 4. ACTIVE DAYS
	const active_days = heatmap.filter(day => {
		const income = income_map[day.date] || 0;
		return income > 0;
	}).length;

	// 5. OUTPUT JSON ONLY
	return {
		active_days: active_days,
		current_streak: current_streak,
		max_streak: max_streak,
		heatmap: heatmap
	};
}

module.exports = {
	generateHeatmap
};
