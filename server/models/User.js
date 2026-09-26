const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },

    resumeUploaded: {
  type: Boolean,
  default: false
},

lastLoginAt: {
  type: Date,
  default: null
}

  },
  {
    timestamps: true
  }
)

const User = mongoose.model("User", userSchema)

module.exports = User