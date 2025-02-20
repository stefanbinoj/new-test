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

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    console.log(12);
    const user = req.user;

    const token = generateToken(
      { sub: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("jwt", token, { httpOnly: true, secure: false });
    res.redirect("/dashboard");
  }
);

module.exports = router;
