const express = require("express");
const mongoose = require("mongoose");
const Team = require("../models/teamModel");
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

router.post("/add-team", validateToken, async (req, res) => {
  console.log(req.body);
  const { team_name } = req.body;
  const { id } = req.user;

  try {
    const newTeam = new Team({
      team_name,
      user: id,
    });

    const savedTeam = await newTeam.save();
    res.status(201).json({
      message: "Team created successfully",
      team: savedTeam,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating team", error: error.message });
  }
});

router.get("/team", validateToken, async (req, res) => {
  try {
    const teams = await Team.find({ user: req.user.id });

    if (!teams || teams.length === 0) {
      return res.status(404).json({ message: "No teams found for this user" });
    }

    // Return the list of teams
    res.status(200).json({ teams });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching teams", error: error.message });
  }
});

module.exports = router;
