const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "Authorization token is missing",
    });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
    if (err) {
      return res
        .status(401)
        .json({ status: "error", message: "Wrong JWT. Please login again" });
    }
    req.user = decode.user;
    next();
  });
});

module.exports = validateToken;
