import type { Request, Response } from "express";
import * as clusterService from "../services/clusterService";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

/* ---------------------------------------------------
   Get paginated clusters
--------------------------------------------------- */
export const getClusters = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const search = String(req.query.search || "");
    const status = req.query.status;
    const includeDeleted = req.query.includeDeleted === "true";

    const sortBy = String(req.query.sortBy || "created_at");
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    const response = await clusterService.getClusters({
      page,
      limit,
      search,
      status,
      includeDeleted,
      sort: { [sortBy]: sortOrder },
    });

    return res.status(200).json(response);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch clusters",
    });
  }
};

/* ---------------------------------------------------
   Get single cluster by ID
--------------------------------------------------- */
export const getClusterById = async (req: Request, res: Response) => {
  try {
    const cluster = await clusterService.getClusterById(req.params.id);
    return res.status(200).json({ success: true, cluster });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message || "Cluster not found",
    });
  }
};

/* ---------------------------------------------------
   Create new cluster
--------------------------------------------------- */
export const addCluster = async (req: MulterRequest, res: Response) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body is missing",
      });
    }

    // Use file if uploaded; otherwise empty string
    const thumbnail = req.file ? req.file.filename : "";

    // Auto-generate cluster_code if not provided
    const cluster_code =
      req.body.cluster_code ||
      `CL${Date.now().toString().slice(-6)}`;

    // Merge request body and extra fields
    const clusterData = {
      ...req.body,
      title: req.body.title?.trim(),
      cluster_code,
      thumbnail,
    };

    // Create cluster
    const cluster = await clusterService.createCluster(clusterData);

    return res.status(201).json({
      success: true,
      message: "Cluster created successfully",
      cluster,
    });
  } catch (error: any) {
    console.error("Add cluster failed:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create cluster",
    });
  }
};
/* ---------------------------------------------------
   Update existing cluster
--------------------------------------------------- */
export const updateCluster = async (req: MulterRequest, res: Response) => {
  try {
    const { id } = req.params;

    const updatedData: any = {
      ...req.body,
      title: req.body.title?.trim(),
    };

    // 🚫 IMPORTANT: remove thumbnail from req.body
    delete updatedData.thumbnail;

    // ✅ Only update thumbnail if a new file is uploaded
    if (req.file) {
      updatedData.thumbnail = req.file.filename;
    }

    const cluster = await clusterService.updateCluster(id, updatedData);

    if (!cluster) {
      return res.status(404).json({
        success: false,
        message: "Cluster not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cluster updated successfully",
      cluster,
    });
  } catch (error: any) {
    console.error("Update cluster failed:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update cluster",
    });
  }
};

/* ---------------------------------------------------
   Toggle cluster active/inactive
--------------------------------------------------- */
export const toggleClusterStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cluster = await clusterService.toggleClusterStatus(id);

    return res.status(200).json({
      success: true,
      message: `Cluster is now ${cluster.is_active ? "active" : "inactive"}`,
      cluster,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to toggle cluster status",
    });
  }
};

/* ---------------------------------------------------
   Soft delete cluster
--------------------------------------------------- */
export const deleteCluster = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cluster = await clusterService.deleteCluster(id);

    return res.status(200).json({
      success: true,
      message: "Cluster deleted successfully (soft delete)",
      cluster,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete cluster",
    });
  }
};
