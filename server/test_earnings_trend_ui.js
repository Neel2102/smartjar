const { processEarningsTrend } = require('./src/utils/earningsTrendUIEngine');

console.log('=== TESTING EARNINGS TREND UI ENGINE ===\n');

// Test with sample recent_trend data
const sample_trend = [
    { date: '2025-01-14', income: 1500, zone: 'strong' },
    { date: '2025-01-13', income: 800, zone: 'stable' },
    { date: '2025-01-12', income: 400, zone: 'weak' },
    { date: '2025-01-11', income: 0, zone: 'inactive' },
    { date: '2025-01-10', income: 1200, zone: 'strong' },
    { date: '2025-01-09', income: 700, zone: 'stable' },
    { date: '2025-01-08', income: 300, zone: 'weak' },
    { date: '2025-01-07', income: 1600, zone: 'strong' },
    { date: '2025-01-06', income: 0, zone: 'inactive' },
    { date: '2025-01-05', income: 900, zone: 'stable' },
    { date: '2025-01-04', income: 500, zone: 'weak' },
    { date: '2025-01-03', income: 1100, zone: 'strong' },
    { date: '2025-01-02', income: 600, zone: 'stable' },
    { date: '2025-01-01', income: 200, zone: 'weak' }
];

console.log('Input recent_trend:', sample_trend);

const result = processEarningsTrend(sample_trend);

console.log('\n=== RESULTS ===');
console.log('Bars:', JSON.stringify(result.bars, null, 2));
console.log('Legend:', JSON.stringify(result.legend, null, 2));

console.log('\n=== BAR DETAILS ===');
result.bars.forEach((bar, index) => {
    console.log(`${index + 1}. Date: ${bar.date}, Income: ${bar.income}, Height: ${bar.height_percent}%, Color: ${bar.color}`);
});

console.log('\n=== LEGEND ===');
result.legend.forEach((item, index) => {
    console.log(`${index + 1}. ${item.label}: ${item.color} (${item.note})`);
});

console.log('\n=== COLOR VERIFICATION ===');
console.log('Strong Day Color:', result.bars.find(b => b.zone === 'strong')?.color === '#3B82F6' ? '✓' : '✗');
console.log('Stable Day Color:', result.bars.find(b => b.zone === 'stable')?.color === '#8B5CF6' ? '✓' : '✗');
console.log('Weak Day Color:', result.bars.find(b => b.zone === 'weak')?.color === '#F59E0B' ? '✓' : '✗');
console.log('Inactive Day Color:', result.bars.find(b => b.zone === 'inactive')?.color === '#E5E7EB' ? '✓' : '✗');

console.log('\n=== TEST COMPLETED ===');
