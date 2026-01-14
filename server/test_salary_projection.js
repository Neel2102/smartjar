const { calculateSalaryProjection } = require('./src/utils/salaryProjectionEngine');

// Test case 1: Basic functionality
console.log('=== Test Case 1: Basic Income Data ===');
const transactions1 = [
    { date: "2025-01-14", amount: 1000 },
    { date: "2025-01-13", amount: 1200 },
    { date: "2025-01-12", amount: 800 },
    { date: "2025-01-11", amount: 1500 },
    { date: "2025-01-10", amount: 900 },
    { date: "2025-01-09", amount: 1100 },
    { date: "2025-01-08", amount: 1300 },
    { date: "2025-01-07", amount: 700 },
    { date: "2025-01-06", amount: 1400 },
    { date: "2025-01-05", amount: 1000 },
    { date: "2025-01-04", amount: 1200 },
    { date: "2025-01-03", amount: 800 },
    { date: "2025-01-02", amount: 1600 },
    { date: "2025-01-01", amount: 1100 }
];

const result1 = calculateSalaryProjection(transactions1, 15000, "2025-01-14");
console.log(JSON.stringify(result1, null, 2));

// Test case 2: No income data
console.log('\n=== Test Case 2: No Income Data ===');
const transactions2 = [];
const result2 = calculateSalaryProjection(transactions2, 0, "2025-01-14");
console.log(JSON.stringify(result2, null, 2));

// Test case 3: Sparse income data
console.log('\n=== Test Case 3: Sparse Income Data ===');
const transactions3 = [
    { date: "2025-01-14", amount: 2000 },
    { date: "2025-01-10", amount: 1500 },
    { date: "2025-01-05", amount: 1800 }
];

const result3 = calculateSalaryProjection(transactions3, 5000, "2025-01-14");
console.log(JSON.stringify(result3, null, 2));

// Test case 4: High volatility income
console.log('\n=== Test Case 4: High Volatility Income ===');
const transactions4 = [
    { date: "2025-01-14", amount: 500 },
    { date: "2025-01-13", amount: 3000 },
    { date: "2025-01-12", amount: 200 },
    { date: "2025-01-11", amount: 2800 },
    { date: "2025-01-10", amount: 600 },
    { date: "2025-01-09", amount: 2500 },
    { date: "2025-01-08", amount: 400 },
    { date: "2025-01-07", amount: 2200 },
    { date: "2025-01-06", amount: 700 },
    { date: "2025-01-05", amount: 2000 },
    { date: "2025-01-04", amount: 800 },
    { date: "2025-01-03", amount: 1800 },
    { date: "2025-01-02", amount: 900 },
    { date: "2025-01-01", amount: 1600 }
];

const result4 = calculateSalaryProjection(transactions4, 8000, "2025-01-14");
console.log(JSON.stringify(result4, null, 2));

console.log('\n=== All Tests Completed ===');
