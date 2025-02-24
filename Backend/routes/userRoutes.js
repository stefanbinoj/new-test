const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const {
  registerUser,
  loginUser,
  currUser,
  verifyUser,
  getClients,
  deleteClient,
} = require("../controller/userController");

const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

// Routes
router.get("/ping", (req, res) => res.status(200).json({ message: "pong" }));
router.post("/register", registerUser);
router.post("/verify-otp", verifyUser);
router.post("/login", loginUser);
router.get("/current", validateToken, currUser);
router.get("/clients",  getClients);
router.delete("/delete/:id", validateToken, deleteClient);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_BASE_URL}/auth/sign-in?error=true`,
  }),
  (req, res) => {
    const user = req.user;
    if (req.query.error) {
      return res.redirect(
        `/auth/sign-in?error=true&message=${req.query.message}`
      );
    }
    const token = jwt.sign(
      {
        user: {
          name: user.name,
          email: user.email,
          id: user.id,
          role: user.role || "client", // Added role to the JWT payload
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true, // This prevents JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === "production", // set to true if you're using HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    if (user.companyName) {
      return res.redirect(`${process.env.FRONTEND_BASE_URL}/admin/default`);
    }
    return res.redirect(
      `${process.env.FRONTEND_BASE_URL}/admin/default?showCompanyModel=true`
    );
  }
);

module.exports = router;
