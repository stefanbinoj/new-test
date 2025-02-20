const express = require("express");
const passport = require("passport");

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

// Google Federated Login Route
router.get(
  "/login/federated/google",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    next();
  }
);

module.exports = router;
