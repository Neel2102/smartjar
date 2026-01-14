const { calculateSalaryProjection } = require('./src/utils/salaryProjectionEngine');

// Test the complete salary projection flow
console.log('=== TESTING COMPLETE SALARY PROJECTION FLOW ===\n');

// Test 1: Empty transactions
console.log('Test 1: Empty transactions');
const result1 = calculateSalaryProjection([], 0, '2025-01-14');
console.log('Result:', result1);
console.log('Recent trend length:', result1.recent_trend.length);
console.log('Recent trend data:', result1.recent_trend);
console.log('\n');

// Test 2: Single transaction today
console.log('Test 2: Single transaction today');
const transactions2 = [
    { date: '2025-01-14', amount: 1500 }
];
const result2 = calculateSalaryProjection(transactions2, 1000, '2025-01-14');
console.log('Result:', result2);
console.log('Recent trend length:', result2.recent_trend.length);
console.log('Recent trend data:', result2.recent_trend);
console.log('\n');

// Test 3: Multiple transactions over 14 days
console.log('Test 3: Multiple transactions');
const transactions3 = [];
for (let i = 0; i < 14; i++) {
    const date = new Date('2025-01-14');
    date.setDate(date.getDate() - i);
    
    if (i % 2 === 0) { // Every other day has income
        transactions3.push({
            date: date.toISOString().slice(0, 10),
            amount: Math.floor(Math.random() * 1000) + 500
        });
    }
}

const result3 = calculateSalaryProjection(transactions3, 5000, '2025-01-14');
console.log('Transactions:', transactions3);
console.log('Average daily:', result3.average_daily);
console.log('Monthly salary:', result3.monthly_salary);
console.log('Recent trend length:', result3.recent_trend.length);
console.log('Recent trend data:', result3.recent_trend);

// Check if today's data is included
const todayData = result3.recent_trend.find(item => item.date === '2025-01-14');
console.log('Today\'s data:', todayData);

console.log('\n=== TEST COMPLETED ===');
