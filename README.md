# 🏦 SmartJar - Financial Stability App for Gig Workers

A comprehensive web-based financial planning app built specifically for gig workers to help them manage income volatility, build financial discipline, and plan for emergencies and the future.

## 🚀 Features

### 💰 Core Financial Management

- **Income Tracking**: Manual entry and CSV import for gig earnings
- **Expense Management**: Categorize and track business/personal expenses
- **Jar-Based Budgeting**: Automatic 60/25/15 split (Salary/Emergency/Future)
- **Customizable Ratios**: Adjust jar allocation percentages as needed

### 📊 Dashboard & Analytics

- **Financial Health Score**: 100-point scoring system with recommendations
- **Real-time Balances**: Live jar balances with visual indicators
- **Income vs Expense Charts**: Track spending patterns and trends
- **Category Breakdown**: Analyze spending by fuel, maintenance, food, etc.

### 🔧 Advanced Features

- **CSV Import**: Bulk upload income data from external sources
- **Jar Transfers**: Move money between jars when needed
- **Financial Education**: Comprehensive learning modules and tips
- **Goal Setting**: Track emergency fund and savings goals

### 🎯 Smart Insights

- **Spending Alerts**: Notifications for unusual spending patterns
- **Savings Forecasting**: Predict when you'll reach financial goals
- **Business Expense Tracking**: Separate personal and business expenses
- **Tax-Ready Reports**: Export data for tax filing

## 🛠️ Tech Stack

### Backend

- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **RESTful API** architecture
- **JWT Authentication** (planned)

### Frontend

- **React 18** with Hooks
- **Custom CSS** (no Tailwind)
- **Responsive Design** (mobile-first)
- **Real-time Updates**

### Database Models

- **User**: Profile, preferences, financial health
- **Income**: Earnings with automatic jar allocation
- **Expense**: Categorized spending tracking
- **Goal**: Financial targets and progress

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd smartjar
   ```

2. **Backend Setup**

   ```bash
   cd server
   npm install
   # Create .env file with MongoDB Atlas connection
   npm run dev
   ```

3. **Frontend Setup**

   ```bash
   cd client
   npm install
   npm run dev
   ```

4. **Environment Variables**
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/smartjar
   ```

## 📱 Usage Guide

### 1. User Onboarding

- Create account with name and email
- Set monthly income targets
- Configure emergency fund goals

### 2. Income Management

- Add daily/weekly gig earnings
- Import CSV files for bulk data
- Automatic jar allocation based on ratios

### 3. Expense Tracking

- Log business expenses (fuel, maintenance)
- Track personal spending
- Categorize by type and source

### 4. Financial Planning

- Monitor jar balances
- Track progress toward goals
- Get personalized recommendations

## 🎯 Target Users

- **Food Delivery Riders**: Swiggy, Zomato, etc.
- **Ride-Sharing Drivers**: Uber, Rapido, Ola
- **Freelancers**: Designers, developers, writers
- **Self-Employed**: Any variable income workers

## 🔮 Future Enhancements

### AI Integration

- **Gemini AI Coach**: Personalized financial advice
- **Voice Interface**: Speech-to-text for hands-free use
- **Smart Notifications**: AI-powered spending insights

### Advanced Analytics

- **Predictive Modeling**: Income forecasting
- **Market Integration**: Investment recommendations
- **Tax Optimization**: Deduction suggestions

### Mobile App

- **React Native**: Cross-platform mobile app
- **Offline Support**: Work without internet
- **Push Notifications**: Real-time alerts

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for gig workers by gig workers
- Inspired by the need for financial stability in variable income scenarios
- Special thanks to the React and Node.js communities

## 📞 Support

- **Issues**: GitHub Issues
- **Documentation**: [Wiki](link-to-wiki)
- **Community**: [Discord](link-to-discord)

---

**SmartJar** - Making financial stability accessible to every gig worker! 🏦✨
