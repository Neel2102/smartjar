/**
 * SmartJar Contribution Heatmap Engine
 * GitHub-style flowing timeline grouped by ISO weeks
 */

function generateHeatmapLayout(daily_data, today = null) {
	// Use provided today or current date
	const today_date = today ? new Date(today) : new Date();
	const today_str = today_date.toISOString().slice(0, 10);

	// 1. DATE STREAM - Generate flat list of all real dates from (today - 364 days) to today
	const days = [];
	for (let i = 364; i >= 0; i--) {
		const date = new Date(today_date);
		date.setDate(today_date.getDate() - i);
		const date_str = date.toISOString().slice(0, 10);
		
		// lookupZone from input data
		const zone = daily_data.find(d => d.date === date_str)?.zone || 'none';
		
		days.push({ date: date_str, zone });
	}

	// 2. START ANCHOR - Find Monday of week that contains first date in list
	const start_anchor = new Date(days[0].date);
	const day_of_week = start_anchor.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
	const monday_offset = day_of_week === 0 ? 6 : day_of_week - 1; // Monday = 1
	const start_monday = new Date(start_anchor);
	start_monday.setDate(start_anchor.getDate() - monday_offset);

	// 3. POSITIONING (CRITICAL) - For every real date
	const grid = [];
	for (const day of days) {
		const col = Math.floor((new Date(day.date) - start_monday) / (7 * 24 * 60 * 60 * 1000));
		const row = (new Date(day.date).getDay() + 6) % 7; // Monday=0 … Sunday=6
		grid.push({ date: day.date, col, row, zone: day.zone });
	}

	// 4. RENDER RULE - Render ONLY days from date stream (no full week columns)
	// Grid already contains only real days, no extra processing needed

	// 5. MONTH LABELS - When a date is 1st of a month
	const month_labels = [];
	for (const day of days) {
		const date = new Date(day.date);
		if (date.getDate() === 1) {
			const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
			month_labels.push({ 
				month: months[date.getMonth()], 
				col: Math.floor((date - start_monday) / (7 * 24 * 60 * 60 * 1000))
			});
		}
	}

	// 6. STREAK METRICS
	const active_days = grid.filter(cell => cell.zone !== 'none').length;
	
	// current_streak = number of consecutive days from today backward where zone != "none"
	let current_streak = 0;
	const sorted_grid = [...grid].sort((a, b) => new Date(b.date) - new Date(a.date));
	for (const cell of sorted_grid) {
		if (cell.zone !== 'none') {
			current_streak++;
		} else {
			break;
		}
	}

	// max_streak = longest continuous sequence of days where zone != "none"
	let max_streak = 0;
	let temp_streak = 0;
	const chronological_grid = [...grid].sort((a, b) => new Date(a.date) - new Date(b.date));
	for (const cell of chronological_grid) {
		if (cell.zone !== 'none') {
			temp_streak++;
			max_streak = Math.max(max_streak, temp_streak);
		} else {
			temp_streak = 0;
		}
	}

	// 7. OUTPUT JSON ONLY
	return {
		grid: grid,
		month_labels: month_labels,
		stats: { active_days, current_streak, max_streak }
	};
}

module.exports = {
	generateHeatmapLayout
};
