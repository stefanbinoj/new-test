const mongoose = require("mongoose");

const coachSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"]
    },
    description: {
      type: String,
      required: [true, "Please add a description"]
    },
    prompt: {
      type: String,
      required: [true, "Please add a prompt"]
    },
    profileImage: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Coach", coachSchema);
