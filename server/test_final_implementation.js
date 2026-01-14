const { calculateSalaryProjection } = require('./src/utils/salaryProjectionEngine');

console.log('=== TESTING FINAL IMPLEMENTATION ===\n');

// Test with realistic data
const transactions = [
    { date: '2025-01-14', amount: 1500 }, // Today - strong
    { date: '2025-01-13', amount: 800 },  // Yesterday - stable  
    { date: '2025-01-12', amount: 400 },  // Weak
    { date: '2025-01-11', amount: 0 },    // Inactive
    { date: '2025-01-10', amount: 1200 }, // Strong
    { date: '2025-01-09', amount: 700 },  // Stable
    { date: '2025-01-08', amount: 300 },  // Weak
    { date: '2025-01-07', amount: 1600 }, // Strong
];

const result = calculateSalaryProjection(transactions, 8000, '2025-01-14');

console.log('Input transactions:', transactions);
console.log('\n=== RESULTS ===');
console.log('Average daily:', result.average_daily);
console.log('Monthly salary:', result.monthly_salary);
console.log('Emergency target:', result.emergency_target);
console.log('Emergency progress:', result.emergency_progress);
console.log('Salary streak:', result.salary_streak);
console.log('Remaining days:', result.remaining_days);
console.log('Eligible:', result.eligible);

console.log('\n=== RECENT TREND WITH ZONES ===');
result.recent_trend.forEach((item, index) => {
    console.log(`${index + 1}. Date: ${item.date}, Income: ${item.income}, Zone: ${item.zone}`);
});

// Verify zone classification
console.log('\n=== ZONE CLASSIFICATION VERIFICATION ===');
const avgDaily = result.average_daily;
result.recent_trend.forEach(item => {
    const income = item.income;
    let expectedZone;
    
    if (income === 0) {
        expectedZone = "inactive";
    } else if (income >= avgDaily) {
        expectedZone = "strong";
    } else if (income >= 0.6 * avgDaily) {
        expectedZone = "stable";
    } else {
        expectedZone = "weak";
    }
    
    const match = item.zone === expectedZone ? '✓' : '✗';
    console.log(`${item.date}: ${item.income} -> ${item.zone} ${match}`);
});

console.log('\n=== COLOR MAPPING FOR FRONTEND ===');
console.log('strong   → #3B82F6 (Blue)');
console.log('stable   → #8B5CF6 (Purple)');
console.log('weak     → #F59E0B (Amber)');
console.log('inactive → #E5E7EB (Grey)');

console.log('\n=== TEST COMPLETED ===');
