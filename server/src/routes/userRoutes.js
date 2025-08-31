const express = require("express");
const { createUser, getUsers, updateRatios, updateUser } = require("../controllers/userController");
const router = express.Router();

router.post("/", createUser);
router.get("/", getUsers);
router.put("/:userId/ratios", updateRatios);
router.put("/:userId", updateUser);

module.exports = router;
