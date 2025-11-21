
import type { Request, Response } from "express";
import * as clusterService from "../services/clusterService.ts";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

/* -----------------------------
   GET: All Clusters
------------------------------ */
// export const getClusters = async (req: Request, res: Response) => {
//   try {
//     const result = await clusterService.getClusters(req.query);
//     return res.status(200).json({ success: true, ...result });
//   } catch (error: any) {
//     console.error("Error in getClusters:", error);
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Failed to fetch clusters",
//     });
//   }
// };


export const getClusters = async (req: Request, res: Response) => {
  try {
    // 1️⃣ Parse query params with defaults
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 100, 1);
    const { status, includeDeleted, search } = req.query;

    // 2️⃣ Fetch all clusters from service
    let clustersData = await clusterService.getClusters({ status, includeDeleted, search });

    // 3️⃣ Normalize clusters array
    let clusters: any[] = [];
    if (Array.isArray(clustersData)) {
      clusters = clustersData;
    } else if (clustersData?.items && Array.isArray(clustersData.items)) {
      clusters = clustersData.items;
    } else if (clustersData?.clusters && Array.isArray(clustersData.clusters)) {
      clusters = clustersData.clusters;
    } else {
      console.warn("getClusters returned unexpected structure", clustersData);
    }

    if (status) {
      clusters = clusters.filter((c: any) => c.status === status);
    }

    const total = clusters.length;
    const totalPages = Math.max(Math.ceil(total / limit), 1);

    // Ensure page is within bounds
    const safePage = Math.min(page, totalPages);

    const startIndex = (safePage - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedClusters = clusters.slice(startIndex, endIndex);

    return res.status(200).json({
      success: true,
      clusters: paginatedClusters,
      total,
      currentPage: safePage,
      totalPages,
    });
  } catch (error: any) {
    console.error("Error in getClusters:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch clusters",
    });
  }
};

/* -----------------------------
   GET: Cluster by ID
------------------------------ */
export const getClusterById = async (req: Request, res: Response) => {
  try {
    const cluster = await clusterService.getClusterById(req.params.id);
    return res.status(200).json({ success: true, cluster });
  } catch (error: any) {
    console.error("Error in getClusterById:", error);
    return res.status(404).json({
      success: false,
      message: error.message || "Cluster not found",
    });
  }
};

/* -----------------------------
   POST: Create Cluster
------------------------------ */
export const addCluster = async (req: MulterRequest, res: Response) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body is missing",
      });
    }

    let thumbnail = "";
    if (req.file) {
      thumbnail = req.file.filename; //  store only filename
    }

    const cluster_code =
      req.body.cluster_code || `CL-${Date.now().toString().slice(-6)}`;

    const clusterData = {
      ...req.body,
      title: req.body.title?.trim(),
      cluster_code,
      thumbnail, //  correct field name
    };

    const cluster = await clusterService.createCluster(clusterData);

    return res.status(201).json({
      success: true,
      message: "Cluster created successfully",
      cluster,
    });
  } catch (error: any) {
    console.error("Error in addCluster:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create cluster",
    });
  }
};

/* -----------------------------
   PUT: Update Cluster
------------------------------ */
// export const updateCluster = async (req: MulterRequest, res: Response) => {
//   try {
//     const updatedData: any = { ...req.body };

//     if (req.file) {
//       updatedData.thumbnail = req.file.filename; //  use thumbnail, not image
//     }

//     const cluster = await clusterService.updateCluster(
//       req.params.id,
//       updatedData
//     );

//     return res.status(200).json({
//       success: true,
//       message: "Cluster updated successfully",
//       cluster,
//     });
//   } catch (error: any) {
//     console.error("Error in updateCluster:", error);
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Failed to update cluster",
//     });
//   }
// };


export const updateCluster = async (req: MulterRequest, res: Response) => {
  try {
    const updatedData: any = { ...req.body };

    if (req.file) {
      updatedData.thumbnail = req.file.filename;
    }

    const cluster = await clusterService.updateCluster(
      req.params.id,
      updatedData
    );

    return res.status(200).json({
      success: true,
      message: "Cluster updated successfully",
      cluster,
    });
  } catch (error: any) {
    console.error("Error in updateCluster:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update cluster",
    });
  }
};


/* -----------------------------
   PATCH: Toggle Active/Inactive
------------------------------ */
export const toggleClusterStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cluster = await clusterService.toggleClusterStatus(id);

    return res.status(200).json({
      success: true,
      message: `Cluster is now ${
        cluster.is_active ? "active" : "inactive"
      }`,
      cluster,
    });
  } catch (error: any) {
    console.error("Error in toggleClusterStatus:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to toggle cluster status",
    });
  }
};

/* -----------------------------
   DELETE: Soft Delete Cluster
------------------------------ */
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
    console.error("Error in deleteCluster:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete cluster",
    });
  }
};
