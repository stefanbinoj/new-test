const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: [true, "Please add a name"],
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
    },
    companyName: {
      type: String,
    },
    companyCode: {
      type: String,
      unique: true,
      sparse: true
    },
    isGoogleVerified: {
      type: Boolean,
    },
    google_id: {
      type: String,
    },
    profilePhoto: String,
    role: {
      type: String,
      enum: ['client', 'superAdmin'],
      default: 'client',
      required: true
    },
  },
  {
    timestamps: true,
  }
);

// Generate unique 5 digit company code when company name is set
userSchema.pre('save', async function(next) {
  if (this.isModified('companyName') && this.companyName && !this.companyCode) {
    let isUnique = false;
    let code;
    
    while (!isUnique) {
      // Generate random 5 digit number
      code = Math.floor(10000 + Math.random() * 90000).toString();
      
      // Check if code already exists
      const existingUser = await this.constructor.findOne({ companyCode: code });
      if (!existingUser) {
        isUnique = true;
      }
    }
    
    this.companyCode = code;
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
