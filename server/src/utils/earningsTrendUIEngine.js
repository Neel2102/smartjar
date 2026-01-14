/**
 * SmartJar Earnings Trend UI Engine
 * Processes salary projection data for frontend chart rendering
 */

function processEarningsTrend(recent_trend) {
	// 1. SCALE HEIGHT
	const max_income = Math.max(...recent_trend.map(item => item.income), 1);
	
	// 2. PROCESS EACH ITEM
	const bars = recent_trend.map(item => {
		const income = item.income || 0;
		const height_percent = Math.round((income / max_income) * 100);
		
		// 2. COLOR MAP
		let color;
		switch (item.zone) {
			case 'strong':
				color = '#3B82F6';
				break;
			case 'stable':
				color = '#8B5CF6';
				break;
			case 'weak':
				color = '#F59E0B';
				break;
			case 'inactive':
			default:
				color = '#E5E7EB';
				break;
		}
		
		// 3. BAR FORMAT
		return {
			date: item.date,
			income: income,
			height_percent: height_percent,
			color: color
		};
	});
	
	// 4. LEGEND DATA
	const legend = [
		{ label: "Strong Day", color: "#3B82F6", note: "Income ≥ average" },
		{ label: "Stable Day", color: "#8B5CF6", note: "Income ≥ 60% of average" },
		{ label: "Weak Day", color: "#F59E0B", note: "Income < 60% of average" },
		{ label: "Inactive Day", color: "#E5E7EB", note: "No earnings" }
	];
	
	// OUTPUT JSON ONLY
	return {
		bars: bars,
		legend: legend
	};
}

module.exports = {
	processEarningsTrend
};
