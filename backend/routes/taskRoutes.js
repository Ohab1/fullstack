const express = require("express");
const Task = require("../models/Task");
const { authenticateUser, isAdmin } = require("../middlewares/authMiddleware");
const userSchema = require("./../models/User");
const router = express.Router();

// ✅ Create a Task (Users create only their tasks)
// router.post("/createTask", authenticateUser, async (req, res) => {
//   try {
//     const { title, description, status } = req.body;

//     const task = new Task({
//       title,
//       description,
//       status,
//       userId: req.user.userId, // ✅ Only assign the logged-in user
//     });

//     await task.save();
//     res.status(201).json({ message: "Task created successfully", task });
//   } catch (error) {
//     res.status(500).json({ message: "Error creating task", error });
//   }
// });

// ✅ Update Task Creation Route (Only Admins Can Assign Tasks to Users)
router.post("/createTask", authenticateUser, async (req, res) => {
  try {
    const { title, description, status, assignedUserId } = req.body;

    // If admin assigns a task, use assignedUserId; otherwise, assign to logged-in user
    const userId = req.user.role === "admin" ? assignedUserId : req.user.userId;

    if (!userId) {
      return res.status(400).json({ message: "User assignment is required" });
    }

    const task = new Task({ title, description, status, userId });

    await task.save();
    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    console.error("Task creation error:", error);
    res.status(500).json({ message: "Error creating task", error });
  }
});


// ✅ Get all tasks (User sees their own, Admin sees all)
router.get("/getTask", authenticateUser, async (req, res) => {
  try {
    let tasks;
    
    if (req.user.role === "admin") {
      tasks = await Task.find().populate("userId", "name email"); // ✅ Admin sees all tasks with user details
    } else {
      tasks = await Task.find({ userId: req.user.userId }); // ✅ Users see only their tasks
    }

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
});

// ✅ Get a single task (Users see their own, Admin sees all)
router.get("/getTask/:id", authenticateUser, async (req, res) => {
  try {
    let task;

    if (req.user.role === "admin") {
      task = await Task.findById(req.params.id).populate("userId", "name email");
    } else {
      task = await Task.findOne({ _id: req.params.id, userId: req.user.userId });
    }

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Error fetching task", error });
  }
});

// ✅ Update a Task (User updates own, Admin updates any)
router.put("/updateTask/:id", authenticateUser, async (req, res) => {
  try {
    const { title, description, status } = req.body;

    let task;
    if (req.user.role === "admin") {
      task = await Task.findByIdAndUpdate(req.params.id, { title, description, status }, { new: true });
    } else {
      task = await Task.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.userId }, // ✅ Users can only update their own tasks
        { title, description, status },
        { new: true }
      );
    }

    if (!task) return res.status(404).json({ message: "Task not found or unauthorized" });

    res.json({ message: "Task updated successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error });
  }
});

// ✅ Delete a Task (User deletes own, Admin deletes any)
router.delete("/deleteTask/:id", authenticateUser, async (req, res) => {
  try {
    let task;
    
    if (req.user.role === "admin") {
      task = await Task.findByIdAndDelete(req.params.id); // ✅ Admin deletes any task
    } else {
      task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.userId }); // ✅ Users delete only their own tasks
    }

    if (!task) return res.status(404).json({ message: "Task not found or unauthorized" });

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
});

// ✅ Admin: Get All Users and Their Tasks
router.get("/admin/allTasks", authenticateUser, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  try {
    const tasks = await Task.find().populate("userId", "name email"); // ✅ Show user details with tasks
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching all tasks", error });
  }
});






module.exports = router;
