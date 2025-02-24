const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");
const {
  createCoach,
  getCoaches,
  getCoach,
  updateCoach,
  deleteCoach
} = require("../controller/coachController");

// Public routes
router.get("/", getCoaches);
router.get("/:id", getCoach);

// Protected routes
router.use(validateToken);
router.post("/", createCoach);
router.put("/:id", updateCoach);
router.delete("/:id", deleteCoach);

module.exports = router;



