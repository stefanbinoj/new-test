const express = require("express");
const {
  checkSession,
  logoutSession,
} = require("../controller/sessionController");
const router = express.Router();

router.get("/session-check", checkSession);
router.get("/session-logout", logoutSession);

module.exports = router;
