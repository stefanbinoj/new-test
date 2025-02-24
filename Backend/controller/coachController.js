const Coach = require("../models/coachModel");

const createCoach = async (req, res) => {
  try {
    const { title, description, prompt, profileImage } = req.body;
    console.log(req.body);

    if (!title || !description || !prompt) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const coach = await Coach.create({
      title,
      description, 
      prompt,
      profileImage
    });

    res.status(201).json(coach);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getCoaches = async (req, res) => {
  try {
    const coaches = await Coach.find();
    res.status(200).json(coaches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getCoach = async (req, res) => {
  try {
    const coach = await Coach.findById(req.params.id);
    
    if (!coach) {
      return res.status(404).json({ message: "Coach not found" });
    }

    res.status(200).json(coach);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateCoach = async (req, res) => {
  try {
    const coach = await Coach.findById(req.params.id);

    if (!coach) {
      return res.status(404).json({ message: "Coach not found" });
    }

    const updatedCoach = await Coach.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedCoach);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteCoach = async (req, res) => {
  try {
    const coach = await Coach.findById(req.params.id);

    if (!coach) {
      return res.status(404).json({ message: "Coach not found" });
    }

    await coach.deleteOne();
    res.status(200).json({ message: "Coach deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCoach,
  getCoaches,
  getCoach,
  updateCoach,
  deleteCoach
};
