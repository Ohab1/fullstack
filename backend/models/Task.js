const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ["pending", "completed", "inProgress"], default: "pending" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ✅ Link task with user
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
