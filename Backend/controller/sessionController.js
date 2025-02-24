const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const checkSession = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  console.log("cookies : ", token);

  if (!token) {
    return res.status(200).json({
      status: "error",
      message: "Authorization token is missing",
      isValid: false,
    });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
    if (err) {
      return res.status(200).json({
        status: "error",
        message: "Wrong JWT. Please login again",
        isValid: false,
      });
    }
    req.user = decode.user;
    return res.status(200).json({
      status: "success",
      message: "User present",
      isValid: true,
      isAdmin: decode.user.role == "superAdmin" ? true : false,
    });
  });
});

const logoutSession = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
    secure: process.env.NODE_ENV === "production",
    sameSite: "None", // set to 'None' if cookies are used cross-site
  });

  return res
    .status(200)
    .json({ status: "success", message: "Logged out successfully" });
});
module.exports = { checkSession, logoutSession };
