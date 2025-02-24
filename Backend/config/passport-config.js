const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");

require("dotenv").config();
const User = require("../models/userModel");

const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET;

const tokenExtractor = (req) => {
  let token = null;
  let authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && authHeader.startsWith("Bearer"))
    token = authHeader.split(" ")[1];
  return token;
};

const opts = {
  jwtFromRequest: ExtractJwt.fromExtractors([tokenExtractor]),
  secretOrKey: SECRET_KEY,
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findOne({ email: jwt_payload.user.email });
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4002/api/users/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          if (user.isGoogleVerified) {
            console.log("Google User already exists");
            return done(null, user);
          } else if (user.isVerified) {
            console.log("User already exists with email and isVerified");
            return done(null, false, {
              message: "User exists but not verified by Google.",
            });
          }
          console.log("User already exists with email and is not isVerified");
          return done(null, false, {
            message: "User exists but not fully verified.",
          });
        }

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            isGoogleVerified: true,
            google_id: profile.id,
            profilePhoto: profile.photos[0].value,
          });
        }
        return done(null, user);
      } catch (error) {
        console.error("Error in Google strategy: ", error);
        return done(error, null);
      }
    }
  )
);

module.exports = passport;
