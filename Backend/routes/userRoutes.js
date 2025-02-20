const express = require("express");

const {
  registerUser,
  loginUser,
  currUser,
} = require("../controller/userController");
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

// Routes
router.get("/ping", (req, res) => res.status(200).json({ message: "pong" }));
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/current", validateToken, currUser);

module.exports = router;
