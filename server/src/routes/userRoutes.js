const express = require("express");
<<<<<<< HEAD
const { createUser, getUsers, updateRatios } = require("../controllers/userController");
=======
const { createUser, getUsers, updateRatios, updateUser } = require("../controllers/userController");
>>>>>>> origin/main
const router = express.Router();

router.post("/", createUser);
router.get("/", getUsers);
router.put("/:userId/ratios", updateRatios);
<<<<<<< HEAD
=======
router.put("/:userId", updateUser);
>>>>>>> origin/main

module.exports = router;
