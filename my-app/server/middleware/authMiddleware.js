import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * --- VERIFY TOKEN PROTOCOL ---
 * Checks if the Bearer token is valid and the user exists in the Hub.
 */
export const verifyToken = async (req, res, next) => {
  // 1. Extract Token (Handles both "Bearer <token>" and raw token)
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

  if (!token) {
    return res.status(401).json({ message: "Access Denied: No Hub Token Provided" });
  }

  try {
    // 2. Decode the Token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Optional but Recommended: Database Double-Check
    // This prevents "Ghost Users" (deleted users with active tokens) from accessing routes.
    const userExists = await User.findById(verified.id).select("-password");
    if (!userExists) {
      return res.status(401).json({ message: "User no longer exists in Hub" });
    }

    req.user = verified; // Attach payload { id, isAdmin } to req
    next();
  } catch (error) {
    // Distinguish between expired and malformed tokens for better frontend debugging
    const errorMessage = error.name === "TokenExpiredError" 
      ? "Session Expired. Please Login Again." 
      : "Invalid Security Token";
      
    res.status(403).json({ message: errorMessage });
  }
};

/**
 * --- ADMIN PRIVILEGE CHECK ---
 */
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Access Denied: Admin Clearance Required" });
  }
};