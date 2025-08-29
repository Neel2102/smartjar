const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const { connectToDatabase } = require("./config/db");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Health check
app.get("/health", (_req, res) => res.json({ ok: true }));

// Routes
app.use("/api/income", require("./routes/incomeRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

// Error handling
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ error: "Something broke!" });
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
connectToDatabase(process.env.MONGODB_URI)
	.then(() => {
		app.listen(PORT, () => {
			console.log(`🚀 SmartJar Server running on port ${PORT}`);
			console.log(`📊 Health check: http://localhost:${PORT}/health`);
		});
	})
	.catch((err) => {
		console.error("❌ MongoDB connection failed:", err.message);
		process.exit(1);
	});
