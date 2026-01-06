const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    // 👇 OPTIONAL PROFILE FIELDS (fill later)
    gender: {
      type: String,
      enum: ["male", "female"],
      default: null,
    },

    age: {
      type: Number,
      default: null,
    },

    weight: {
      type: Number,
      default: null,
    },

    address: {
      type: String,
      default: "",
    },
      is_admin: { type: Boolean, default: false },

    profileImage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports =  mongoose.model("User", userSchema);