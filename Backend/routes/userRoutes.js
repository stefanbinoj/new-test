const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const {
  registerUser,
  loginUser,
  currUser,
  verifyUser,
} = require("../controller/userController");
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

// Routes
router.get("/ping", (req, res) => res.status(200).json({ message: "pong" }));
router.post("/register", registerUser);
router.post("/verify-otp", verifyUser);
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
    failureRedirect: "http://localhost:3000/auth/sign-in?error=true",
  }),
  (req, res) => {
    const user = req.user;
    console.log(req.query);
    if (req.query.error) {
      return res.redirect(
        `/auth/sign-in?error=true&message=${req.query.message}`
      );
    }
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
    if (user.companyName) {
      res.redirect(
        `http://localhost:3000/admin/default?accessToken=${accessToken}`
      );
    }
    res.redirect(
      `http://localhost:3000/admin/default?accessToken=${accessToken}&showCompanyModel=true`
    );
  }
);

module.exports = router;
