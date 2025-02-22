const express = require("express");
const { checkSession } = require("../controller/sessionController");
const router = express.Router();

router.get("/session-check", checkSession);

module.exports = router;
