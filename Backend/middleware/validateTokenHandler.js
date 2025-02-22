const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  let authHeader = req.headers.authorization || req.headers.Authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
      if (err) {
        return res
          .status(401)
          .json({ status: "error", message: "Wrong JWT. Please login" });
      }
      req.user = decode.user;
      next();
    });
  }

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "Authorization token is missing",
    });
  }
});

module.exports = validateToken;
