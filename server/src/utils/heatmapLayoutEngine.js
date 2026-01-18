/**
 * SmartJar Contribution Heatmap Layout Engine
 * GitHub-style 52-week contribution heatmap - TIME-DRIVEN VERSION
 */

function generateHeatmapLayout(daily_data, today = null) {
	// Use provided today or current date
	const today_date = today ? new Date(today) : new Date();
	const today_str = today_date.toISOString().slice(0, 10);

	// Create income lookup map
	const income_map = {};
	daily_data.forEach(day => {
		income_map[day.date] = day.income || 0;
	});

	// Calculate average daily income for level classification
	const total_income = daily_data.reduce((sum, day) => sum + (day.income || 0), 0);
	const average_daily = daily_data.length > 0 ? total_income / daily_data.length : 0;

	// TIME-DRIVEN: Generate ALL dates from today-364 to today (oldest → newest)
	const days = [];
	for (let i = 364; i >= 0; i--) {
		const date = new Date(today_date);
		date.setDate(today_date.getDate() - i);
		const date_str = date.toISOString().slice(0, 10);
		
		// ALWAYS add every day, even if no data
		const income = income_map[date_str] || 0;
		days.push({ date: date_str, income });
	}

	// Find START_DATE (Monday of week containing first date)
	const start_date = new Date(days[0].date);
	const day_of_week = start_date.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
	const monday_offset = day_of_week === 0 ? 6 : day_of_week - 1;
	const start_monday = new Date(start_date);
	start_monday.setDate(start_date.getDate() - monday_offset);

	// Generate COMPLETE grid with weekIndex and dayIndex for EVERY day
	const grid = [];
	const month_labels = [];
	const month_set = new Set();

	for (const day of days) {
		const date = new Date(day.date);
		
		// Calculate position (CRITICAL: week-based positioning)
		const weekIndex = Math.floor((date - start_monday) / (7 * 24 * 60 * 60 * 1000));
		const dayIndex = (date.getDay() + 6) % 7; // Monday=0 … Sunday=6

		// Determine contribution level (0-4) - ALWAYS calculate, even for empty days
		let level = 0;
		if (day.income > 0) {
			if (day.income < 0.25 * average_daily) {
				level = 1;
			} else if (day.income < 0.5 * average_daily) {
				level = 2;
			} else if (day.income < average_daily) {
				level = 3;
			} else {
				level = 4;
			}
		}

		// ALWAYS add to grid - NEVER skip days
		grid.push({
			date: day.date,
			count: day.income > 0 ? 1 : 0,
			level: level,
			weekIndex: weekIndex,
			dayIndex: dayIndex
		});

		// Track month labels (CRITICAL: week-based anchoring)
		if (date.getDate() === 1) {
			const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
			const month_name = months[date.getMonth()];
			if (!month_set.has(month_name)) {
				month_set.add(month_name);
				month_labels.push({
					month: month_name,
					weekIndex: weekIndex
				});
			}
		}
	}

	// Calculate streaks (backend logic)
	const active_days = grid.filter(cell => cell.count > 0).length;
	
	// Current streak: consecutive days including today
	let current_streak = 0;
	const today_grid = grid.find(cell => cell.date === today_str);
	if (today_grid && today_grid.count > 0) {
		current_streak = 1;
		// Check backward from today
		for (let i = 1; i < 365; i++) {
			const check_date = new Date(today_date);
			check_date.setDate(today_date.getDate() - i);
			const check_str = check_date.toISOString().slice(0, 10);
			
			const check_cell = grid.find(cell => cell.date === check_str);
			if (check_cell && check_cell.count > 0) {
				current_streak++;
			} else {
				break;
			}
		}
	}

	// Max streak: longest consecutive sequence
	let max_streak = 0;
	let temp_streak = 0;
	const sorted_grid = [...grid].sort((a, b) => new Date(a.date) - new Date(b.date));
	for (const cell of sorted_grid) {
		if (cell.count > 0) {
			temp_streak++;
			max_streak = Math.max(max_streak, temp_streak);
		} else {
			temp_streak = 0;
		}
	}

	// Return COMPLETE 365-day grid with exact format
	return {
		grid: grid,
		month_labels: month_labels,
		stats: {
			current_streak: current_streak,
			max_streak: max_streak,
			active_days: active_days
		}
	};
}

module.exports = {
	generateHeatmapLayout
};
