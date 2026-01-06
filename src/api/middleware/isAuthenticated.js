import jwt from "jsonwebtoken";

// Middleware to check if user is authenticated
export const isAuthenticated = async (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (!decoded) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }

    // Attach user info to req.user
    req.user = {
      id: decoded.userId,
      isAdmin: decoded.is_admin,
    };

    next();
  } catch (error) {
    console.error("AUTH ERROR 👉", error);
    return res.status(401).json({
      message: "Authentication error",
      success: false,
    });
  }
};

// Middleware to verify admin
export const verifyAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }

  next();
};

// Optional protect middleware (for React API calls)
export const protect = async (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : req.cookies.token;

    if (!token) return res.status(401).json({ message: "User not authenticated" });

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Save user info in req.user
    req.user = {
      id: decoded.userId,
      isAdmin: decoded.is_admin,
    };

    next();
  } catch (err) {
    console.error("PROTECT ERROR 👉", err);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default isAuthenticated;
