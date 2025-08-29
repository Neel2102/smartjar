const User = require("../models/User");

async function createUser(req, res) {
	try {
		const { name, email } = req.body;
		if (!name || !email) {
			return res.status(400).json({ error: "name and email required" });
		}

		const user = await User.create({ name, email });
		res.status(201).json(user);
	} catch (err) {
		if (err.code === 11000) {
			return res.status(400).json({ error: "Email already exists" });
		}
		res.status(500).json({ error: err.message });
	}
}

async function getUsers(req, res) {
	try {
		const users = await User.find().sort({ createdAt: -1 });
		res.json(users);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
}

async function updateRatios(req, res) {
	try {
		const { userId } = req.params;
		const { salary, emergency, future } = req.body;
		
		if (!salary || !emergency || !future) {
			return res.status(400).json({ error: "All ratios required" });
		}

		if (salary + emergency + future !== 100) {
			return res.status(400).json({ error: "Ratios must sum to 100" });
		}

		const user = await User.findByIdAndUpdate(
			userId,
			{ jarRatios: { salary, emergency, future } },
			{ new: true }
		);

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		res.json(user);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
}

module.exports = { createUser, getUsers, updateRatios };
