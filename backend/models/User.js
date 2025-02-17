const mongoose = require("mongoose");

// 🔹 User Schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" }, // ✅ Role-based access
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

