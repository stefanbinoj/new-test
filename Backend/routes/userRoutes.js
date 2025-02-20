const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oidc");
const User = require("../models/userModel");

const {
  registerUser,
  loginUser,
  currUser,
} = require("../controller/userController");
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

// Define the Google OAuth2 Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/oauth2/redirect/google",
      scope: ["email"], // Ensure you're requesting the "email" scope
      session: false,
    },
    async function verify(issuer, profile, cb) {
      try {
        // Check if profile.emails exists and retrieve the first email
        const userEmail =
          profile.emails && profile.emails[0] && profile.emails[0].value;

        if (!userEmail) {
          return cb(new Error("No email found in Google profile"), false);
        }

        // Check if the user exists in the database based on the email
        let user = await User.findOne({ email: userEmail });

        // If user doesn't exist, create a new user
        if (!user) {
          const newUser = new User({
            email: userEmail,
            // You can add more fields if necessary, such as name, profile picture, etc.
          });

          await newUser.save(); // Save the new user in the database

          return cb(null, newUser); // Return the newly created user
        }

        // If user already exists, return the found user
        return cb(null, user); // Return the existing user
      } catch (err) {
        console.error("Error in Google Strategy verify:", err);
        return cb(err, false); // Return an error if anything fails
      }
    }
  )
);

// Routes
router.get("/ping", (req, res) => res.status(200).json({ message: "pong" }));
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/current", validateToken, currUser);

// Google Federated Login Route
router.get("/login/federated/google", passport.authenticate("google"));

// Callback route for Google OAuth2
router.get(
  "/oauth2/redirect/google",
  passport.authenticate("google"),
  (req, res) => {
    res.redirect("/dashboard"); // Redirect to a protected route after login
  }
);

module.exports = router;
