const mongoose = require('mongoose');
const Income = require('./src/models/Income');
const User = require('./src/models/User');

// Connect to MongoDB (you'll need to update this with your actual connection string)
mongoose.connect('mongodb+srv://<username>:<password>@<cluster>.mongodb.net/smartjar')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function addTestIncome() {
  try {
    // Find a test user (you'll need to update this with an actual user ID)
    const user = await User.findOne();
    if (!user) {
      console.log('No users found. Please create a user first.');
      return;
    }

    console.log('Using user:', user._id);

    // Add test income for today and recent days
    const today = new Date();
    const testIncomes = [];

    // Add income for today
    testIncomes.push({
      userId: user._id,
      amount: 1500,
      source: 'test',
      receivedAt: today,
      allocations: {
        salary: 900,
        emergency: 375,
        future: 225
      }
    });

    // Add income for past few days
    for (let i = 1; i <= 5; i++) {
      const pastDate = new Date(today);
      pastDate.setDate(today.getDate() - i);
      
      testIncomes.push({
        userId: user._id,
        amount: Math.floor(Math.random() * 1000) + 500,
        source: 'test',
        receivedAt: pastDate,
        allocations: {
          salary: 600,
          emergency: 250,
          future: 150
        }
      });
    }

    // Insert test data
    const result = await Income.insertMany(testIncomes);
    console.log(`Added ${result.length} test income records`);
    
    // Close connection
    mongoose.connection.close();
    
  } catch (error) {
    console.error('Error adding test income:', error);
    mongoose.connection.close();
  }
}

addTestIncome();
