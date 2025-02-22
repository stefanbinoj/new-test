const asyncHandler = require("express-async-handler");

const checkSession = asyncHandler(async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "Authorization token is missing",
      isValid: false,
    });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
    if (err) {
      return res.status(401).json({
        status: "error",
        message: "Wrong JWT. Please login again",
        isValid: false,
      });
    }
    req.user = decode.user;
    return res
      .status(200)
      .json({
        status: "success",
        message: "User present",
        isValid: false,
        isAdmin: true,
      });
  });
});

module.exports = { checkSession };
