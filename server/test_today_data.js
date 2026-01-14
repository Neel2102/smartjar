const { calculateSalaryProjection } = require('./src/utils/salaryProjectionEngine');

// Test with today's data
const today = new Date().toISOString().slice(0, 10);
console.log('Testing with today:', today);

// Create test transactions including today
const transactions = [
    { date: today, amount: 1500 }, // Today's entry
    { date: "2025-01-13", amount: 1200 },
    { date: "2025-01-12", amount: 800 },
    { date: "2025-01-11", amount: 1000 },
    { date: "2025-01-10", amount: 900 }
];

console.log('Test transactions:', transactions);

const result = calculateSalaryProjection(transactions, 5000, today);

console.log('\n=== RESULT ===');
console.log('Average daily:', result.average_daily);
console.log('Monthly salary:', result.monthly_salary);
console.log('Recent trend length:', result.recent_trend.length);
console.log('Recent trend:', result.recent_trend);

// Check if today's data is included
const todayData = result.recent_trend.find(item => item.date === today);
console.log('\nToday\'s data in trend:', todayData);
