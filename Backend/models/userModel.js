const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    email: {
      type: String,
      required: [true, "Pleasse add a email"],
    },
    password: {
      type: String,
      //required: [true, "Please add an password"],
    },
    verificationCode: String,
    verificationCodeExpiry: Date,
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
