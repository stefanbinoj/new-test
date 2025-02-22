const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/userModel");

const registerUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validation check
  if (!email || !password) {
    return res
      .status(400)
      .json({ status: "error", message: "All fields are mandatory" });
  }

  // Check if user already exists
  const userAvailable = await User.findOne({ email });
  if (userAvailable && userAvailable.isVerified) {
    return res.status(400).json({
      status: "error",
      message: "Verified User already exists. Login instead",
    });
  }
  if (userAvailable && userAvailable.isGoogleVerified) {
    return res.status(400).json({
      status: "error",
      message: "Please sign in with Google",
    });
  }

  if (userAvailable) {
    const isPasswordMatch = await bcrypt.compare(
      password,
      userAvailable.password
    );
    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ status: "error", message: "Password Incorrect" });
    }

    const verificationCode = crypto.randomInt(100000, 999999);
    const verificationCodeExpiry = Date.now() + 600000; // 10 minutes
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.findOneAndUpdate(
      { email },
      {
        password: hashedPassword,
        verificationCode,
        verificationCodeExpiry,
      },
      { new: true }
    );

    // Send verification email
    await sendEmail(email, verificationCode);

    if (user) {
      return res.status(200).json({
        status: "success",
        email: user.email,
        message: "Verify using otp",
      });
    }
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Generate verification code and expiry time
  const verificationCode = crypto.randomInt(100000, 999999);
  const verificationCodeExpiry = Date.now() + 600000; // 10 minutes

  // Create user
  const user = await User.create({
    email,
    password: hashedPassword,
    verificationCode,
    verificationCodeExpiry,
  });

  // Send verification email
  await sendEmail(email, verificationCode);

  // Check if user created successfully and send response
  if (user) {
    return res.status(201).json({
      status: "success",
      email: user.email,
      message: "Email has been sent successfully",
    });
  } else {
    return res
      .status(500)
      .json({ status: "error", message: "Error occurred while registering" });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validation check
  if (!email || !password) {
    return res
      .status(400)
      .json({ status: "error", message: "All fields are mandatory" });
  }

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ status: "error", message: "User not found" });
  }

  // Check if user is verified
  if (!user.isVerified) {
    return res.status(400).json({
      status: "error",
      message: "User not verified. Plese Verify the user ",
    });
  }

  // Compare password
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (user && isPasswordMatch) {
    const accessToken = jwt.sign(
      { user: { email: user.email, id: user.id } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
    return res
      .status(200)
      .json({ status: "success", accessToken, message: "JWT created" });
  }

  // If password is incorrect
  return res.status(401).json({ status: "error", message: "Wrong Password" });
});

const currUser = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.email) {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  // Send current user information
  const user = await User.findOne({ email: req.user.email });
  if (!user) {
    return res.status(404).json({ status: "error", message: "User not found" });
  }
  return res.json({ status: "success", user });
});

const verifyUser = asyncHandler(async (req, res) => {
  const { email, verificationCode } = req.body;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ status: "error", message: "User not found" });
  }

  // Check if user is already verified
  if (user.isVerified) {
    return res.status(400).json({
      status: "error",
      message: "User already verified. Login instead",
    });
  }

  // Check if the code has expired
  if (Date.now() > user.verificationCodeExpiry) {
    return res
      .status(400)
      .json({ status: "error", message: "Verification code expired" });
  }

  // Verify the code
  if (verificationCode === user.verificationCode) {
    user.isVerified = true;
    await user.save();
    return res
      .status(200)
      .json({ status: "success", message: "User verified" });
  }

  // Incorrect code
  return res
    .status(400)
    .json({ status: "error", message: "Incorrect verification code" });
});

module.exports = { registerUser, loginUser, currUser, verifyUser };
