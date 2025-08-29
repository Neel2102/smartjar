const express = require("express");
const { createUser, getUsers, updateRatios } = require("../controllers/userController");
const router = express.Router();

router.post("/", createUser);
router.get("/", getUsers);
router.put("/:userId/ratios", updateRatios);

module.exports = router;
