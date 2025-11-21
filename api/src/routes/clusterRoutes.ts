import express from "express";
import {
  addCluster,
  getClusters,
  getClusterById,
  updateCluster,
  deleteCluster,
  toggleClusterStatus,
} from "../controllers/clusterController.ts";
import { roleFromUrl } from "../middleware/roleUrlMiddleware.ts";
// import { uploadClusterThumbnail } from "../middleware/articleUpload.ts";

import { uploadClusterThumbnail } from "../middleware/uploadMiddleware.ts";


const router = express.Router();

/* -------------------- PUBLIC ROUTES -------------------- */
router.get("/cluster", getClusters);
router.get("/cluster/:id", getClusterById);

/* -------------------- ADMIN / EDITOR ROUTES -------------------- */
const adminEditorMiddleware = roleFromUrl(["admin", "editor"]);

router.post(
  "/:role/cluster/create",
  adminEditorMiddleware,
  uploadClusterThumbnail,
  addCluster
);

router.put(
  "/:role/cluster/edit/:id",
  adminEditorMiddleware,
  uploadClusterThumbnail,
  updateCluster
);

/* -------------------- TOGGLE STATUS -------------------- */
router.patch(
  "/:role/cluster/change/:id/status",
  adminEditorMiddleware,
  toggleClusterStatus
);

/* -------------------- DELETE (Soft Delete) -------------------- */
router.delete(
  "/:role/cluster/delete/:id",
  adminEditorMiddleware,
  deleteCluster
);

export default router;
