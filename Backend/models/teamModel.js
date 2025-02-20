const mongoose = require("mongoose");

const teamSchema = mongoose.Schema(
  {
    team_name: {
      type: String,
      required: [true, "Please add a team name"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Team", teamSchema);
