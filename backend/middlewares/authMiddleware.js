const jwt = require("jsonwebtoken");
const JWT_SECRET = "2250190Ohab";

const authenticateUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded._id || !decoded.role) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = { userId: decoded._id, role: decoded.role };
    console.log("✅ Authenticated User:", req.user);
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ✅ Middleware: Restrict to Admins Only
const isAdmin = (req, res, next) => {
  console.log("isAdmin middleware callerd");
  
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

module.exports = { authenticateUser, isAdmin };
