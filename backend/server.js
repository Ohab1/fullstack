const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes"); // ✅ Import user routes

const PORT = 2000;
const app = express();
connectDB();
app.use(express.json());
app.use(cors());

// ✅ Use Routes
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);

// 🔹 Start Server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
