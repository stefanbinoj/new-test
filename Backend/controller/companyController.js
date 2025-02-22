const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const getCompany = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.user.email });
  if (!user) {
    return res.status(404).json({ status: "error", message: "User not found" });
  }
  if (user.companyName) {
    return res.status(200).json({
      status: "success",
      companyName: user.companyName,
      message: "Company Name present",
    });
  }
  return res.status(404).json({
    status: "error",
    companyName: "No Company Name",
    message: "Company Name not present",
  });
});

const updateCompany = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.user.email });
  if (!user) {
    return res.status(404).json({ status: "error", message: "User not found" });
  }

  console.log("User found for updating company: ", user);
  const { companyName } = req.body;
  if (!companyName) {
    return res
      .status(400)
      .json({ status: "error", message: "Company name is required" });
  }

  user.companyName = companyName;
  await user.save();
  return res.status(200).json({
    status: "success",
    companyName: user.companyName,
    message: "Company name updated successfully",
  });
});

module.exports = { getCompany, updateCompany };
