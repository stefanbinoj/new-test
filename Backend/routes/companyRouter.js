const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const {
  getCompany,
  updateCompany,
} = require("../controller/companyController");

const router = express.Router();

router.post("/add-company", validateToken, updateCompany);

router.get("/company", validateToken, getCompany);

module.exports = router;
