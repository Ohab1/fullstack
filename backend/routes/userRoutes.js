const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { signupValidation, loginValidation } = require("../middlewares/authValidation");
const { authenticateUser, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();
const JWT_SECRET = "2250190Ohab"; // Make sure to store secrets securely

// ✅ Signup Route
router.post("/signup", signupValidation, async (req, res) => {
    try {
        const { name, email, mobile, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists", success: false });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, mobile, password: hashedPassword });

        await newUser.save();

        res.status(201).json({ message: "Signup successful", success: true });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
});

// ✅ Login Route
router.post("/login", loginValidation, async (req, res) => {
    try {
        const { mobile, password } = req.body;
        const user = await User.findOne({ mobile });

        if (!user) {
            return res.status(403).json({ message: "Authentication failed: Mobile or password is incorrect.", success: false });
        }

        // Compare hashed password
        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403).json({ message: "Authentication failed: Mobile or password is incorrect.", success: false });
        }

        // Generate JWT Token
        const jwtToken = jwt.sign({ _id: user._id, mobile: user.mobile, role: user.role }, JWT_SECRET, { expiresIn: "24h" });

        res.status(200).json({ message: "Login Successful", success: true, jwtToken, email: user.email, mobile, name: user.name, role: user.role });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Login failed", success: false });
    }
});

// ✅ Admin - Get All Users
router.get("/all-users", authenticateUser, isAdmin, async (req, res) => {
    try {
        console.log("🔹 Admin Fetching All Users...");
        const users = await User.find({}, "name email _id");
        console.log("✅ Users Fetched:", users);
        res.json(users);
    } catch (error) {
        console.error("❌ Error Fetching Users:", error);
        res.status(500).json({ message: "Error fetching users", error });
    }
});

module.exports = router;
