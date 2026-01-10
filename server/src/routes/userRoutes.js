const express = require("express");
const { createUser, getUsers, updateRatios, updateUser, updateEmergencyGoal } = require("../controllers/userController");
const router = express.Router();

router.post("/", createUser);
router.get("/", getUsers);
router.put("/:userId/ratios", updateRatios);
router.put("/:userId/emergency-goal", updateEmergencyGoal);
router.put("/:userId", updateUser);

module.exports = router;
