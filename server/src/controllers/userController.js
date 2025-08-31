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
		const { jarRatios } = req.body;

		if (!jarRatios || !jarRatios.salary || !jarRatios.emergency || !jarRatios.future) {
			return res.status(400).json({ error: "All jar ratios are required" });
		}

		const total = jarRatios.salary + jarRatios.emergency + jarRatios.future;
		if (total !== 100) {
			return res.status(400).json({ error: "Ratios must sum to 100" });
		}

		const user = await User.findByIdAndUpdate(
			userId,
			{ jarRatios },
			{ new: true, runValidators: true }
		);

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		res.json(user);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
}

async function updateUser(req, res) {
	try {
		const { userId } = req.params;
		const updateData = req.body;

		// Remove fields that shouldn't be updated directly
		delete updateData._id;
		delete updateData.email; // Email should not be changed via this endpoint

		const user = await User.findByIdAndUpdate(
			userId,
			updateData,
			{ new: true, runValidators: true }
		);

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		res.json(user);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
}

module.exports = {
	createUser,
	getUsers,
	updateRatios,
	updateUser
};
