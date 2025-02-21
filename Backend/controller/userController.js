const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../config/emailSender");
const User = require("../models/userModel");

const registerUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("Email exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed Pass", hashedPassword);

  const verificationCode = crypto.randomInt(100000, 999999);
  const verificationCodeExpiry = Date.now() + 600000;

  const user = await User.create({
    email,
    password: hashedPassword,
    verificationCode,
    verificationCodeExpiry,
  });
  console.log("usr created : ", user);
  sendEmail(email, verificationCode);
  if (user) {
    res.status(201).json({ id: user.id, email: user.email });
  } else {
    res.status(400);
    throw new Error("Couldn't create a user ");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Validation Error ");
  }
  const user = await User.findOne({ email });

  console.log("User found : ", user);
  if (user && (await bcrypt.compare(password, user.password))) {
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
    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("Validation unsuccessfull");
  }
});

const currUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

const verifyUser = asyncHandler(async (req, res) => {
  const { email, verificationCode } = req.body;

  // Find the user by email
  const user = await User.findOne({ email });

  // If user is not found, return 404
  if (!user) {
    return res.status(404).json({ message: "User Not found" });
  }

  // Check if the verification code has expired
  if (Date.now() > user.verificationCodeExpiry) {
    return res.status(400).json({ message: "Code Expired" });
  }

  // Check if the provided verification code matches the stored one
  if (verificationCode === user.verificationCode) {
    // Update the user's verification status
    user.isVerified = true;
    await user.save(); // Save the updated user document

    // Return success response
    return res.status(200).json({ message: "User Verified" });
  }

  // If the code is wrong
  return res.status(400).json({ message: "Code Wrong" });
});

module.exports = { registerUser, loginUser, currUser, verifyUser };
