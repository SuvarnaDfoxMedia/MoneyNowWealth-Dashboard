// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
// dotenv.config();

// export const protect = (req, res, next) => {
//   try {
//     const token = req.cookies?.token;
//     if (!token) {
//       return res.status(401).json({ message: "Not authorized, token missing" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_KEY);
//     req.user = decoded; 
//     next();
//   } catch (error) {
//     console.error("Auth error:", error);
//     res.status(401).json({ message: "Not authorized, token invalid" });
//   }
// };

// export const authorizeRoles = (...roles) => {
//   return (req, res, next) => {
//     if (!req.user) {
//       return res.status(401).json({ message: "Not authorized" });
//     }

//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({ message: "Access denied: insufficient role" });
//     }

//     next();
//   };
// };



import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Protect middleware: verifies JWT from cookie or Authorization header
export const protect = (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = decoded; // { id, role }
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    res.status(401).json({ message: "Not authorized, token invalid" });
  }
};

// Role-based authorization
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied: insufficient role" });
    }

    next();
  };
};
