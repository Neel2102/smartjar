const { calculateSalaryProjection } = require('./src/utils/salaryProjectionEngine');

// Simulate some test transactions for the last few days
const today = new Date();
const transactions = [];

// Add some transactions for recent days
for (let i = 0; i < 10; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Add random income for some days
    if (i % 2 === 0) {
        transactions.push({
            date: date.toISOString().slice(0, 10),
            amount: Math.floor(Math.random() * 2000) + 500
        });
    }
}

console.log('Transactions:', transactions);
console.log('Today:', today.toISOString().slice(0, 10));

const result = calculateSalaryProjection(transactions, 5000, today.toISOString().slice(0, 10));
console.log('Recent Trend:', result.recent_trend);
console.log('Recent Trend Length:', result.recent_trend.length);
