
import express from "express";
import {
  getPages,
  getPageById,
  addPage,
  updatePage,
  togglePageStatus,
  deletePage,
} from "../controllers/cmsPageController.ts";
import { roleFromUrl } from "../middleware/roleUrlMiddleware.ts";

const router = express.Router();

// Public routes
router.get("/cmspages", getPages); // list all pages
router.get("/cmspages/:id", getPageById); // get single page

// Admin-only middleware
const adminMiddleware = roleFromUrl(["admin"]);

// Admin routes
router.get("/:role/cmspages", adminMiddleware, getPages); // admin list
router.get("/:role/cmspages/:id", adminMiddleware, getPageById); // admin get by id
router.post("/:role/cmspages/create", adminMiddleware, addPage);
router.put("/:role/cmspages/edit/:id", adminMiddleware, updatePage);
router.patch("/:role/cmspages/change/:id/status", adminMiddleware, togglePageStatus);
router.delete("/:role/cmspages/delete/:id", adminMiddleware, deletePage);

export default router;
