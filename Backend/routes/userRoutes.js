const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

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
    const user = req.user;
    console.log("google user : ", user);
    const accessToken = jwt.sign(
      {
        user: {
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.redirect(`http://localhost:3000/?accessToken=${accessToken}`);
  }
);

module.exports = router;
