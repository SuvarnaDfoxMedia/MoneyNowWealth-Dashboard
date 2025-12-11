import { protect } from "./authMiddleware.js";

export const roleFromUrl = (allowedRoles) => {
  return [
    protect, 
    (req, res, next) => {
      const roleInUrl = req.params.role; 
      
      if (!allowedRoles.includes(roleInUrl)) {
        return res.status(403).json({ message: "Invalid role in URL" });
      }

      if (!req.user || req.user.role !== roleInUrl) {
        return res.status(403).json({ message: "Access denied: role mismatch" });
      }

      next();
    },
  ];
};
