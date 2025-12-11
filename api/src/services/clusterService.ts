import Cluster, { type ICluster } from "../models/clusterModel";

/* ---------------------------------------------------
   Get paginated clusters with optional filters
--------------------------------------------------- */
export const getClusters = async (query: any) => {
  const { search, status, includeDeleted, page, limit, sort } = query;

  const filter: any = {};

  // Dynamic filters
  if (status) filter.status = status;
  if (!includeDeleted || includeDeleted === "false") filter.is_deleted = false;

  if (search) {
    const s = String(search).trim();
    filter.$or = [
      { title: { $regex: s, $options: "i" } },
      { description: { $regex: s, $options: "i" } },
      { cluster_code: { $regex: s, $options: "i" } },
    ];
  }

  const pageNum = Math.max(Number(page) || 1, 1);
  const perPage = Math.max(Number(limit) || 10, 1);
  const skip = (pageNum - 1) * perPage;

  // Dynamic sorting
  const finalSort = sort || { created_at: -1 };

  const [clusters, total] = await Promise.all([
    Cluster.find(filter)
      .sort(finalSort)
      .skip(skip)
      .limit(perPage),
    Cluster.countDocuments(filter),
  ]);

  return {
    success: true,
    clusters,
    total,
    currentPage: pageNum,
    limit: perPage,
    totalPages: Math.ceil(total / perPage),
  };
};

/* ---------------------------------------------------
   Get single cluster by ID
--------------------------------------------------- */
export const getClusterById = async (id: string) => {
  const cluster = await Cluster.findOne({ _id: id, is_deleted: false });
  if (!cluster) throw new Error("Cluster not found");
  return cluster;
};

/* ---------------------------------------------------
   Create new cluster
--------------------------------------------------- */
export const createCluster = async (data: Partial<ICluster>) => {
  let cluster_code = data.cluster_code;

  if (!cluster_code) {
    const lastCluster = await Cluster.findOne().sort({ created_at: -1 }).select("cluster_code");
    const lastCodeNum = lastCluster ? parseInt(lastCluster.cluster_code?.replace("CL", "") || "0", 10) : 0;
    cluster_code = `CL${String(lastCodeNum + 1).padStart(4, "0")}`;
  }

  const thumbnailName = typeof data.thumbnail === "string" ? data.thumbnail : (data as any)?.file?.filename || "";

  const cluster = new Cluster({
    ...data,
    cluster_code,
    is_active: 1,
    is_deleted: false,
    thumbnail: thumbnailName,
  });

  await cluster.save();
  return cluster;
};

/* ---------------------------------------------------
   Update existing cluster
--------------------------------------------------- */
export const updateCluster = async (id: string, data: Partial<ICluster>) => {
  const updateData: any = { ...data };

  if ((data as any)?.file) {
    updateData.thumbnail = (data as any).file.filename;
  }

  const cluster = await Cluster.findByIdAndUpdate(id, updateData, { new: true });
  if (!cluster) throw new Error("Cluster not found");
  return cluster;
};

/* ---------------------------------------------------
   Toggle cluster active/inactive
--------------------------------------------------- */
export const toggleClusterStatus = async (id: string) => {
  const cluster = await Cluster.findById(id);
  if (!cluster) throw new Error("Cluster not found");

  cluster.is_active = cluster.is_active === 1 ? 0 : 1;
  await cluster.save();
  return cluster;
};

/* ---------------------------------------------------
   Soft delete cluster
--------------------------------------------------- */
export const deleteCluster = async (id: string) => {
  const cluster = await Cluster.findById(id);
  if (!cluster) throw new Error("Cluster not found");

  cluster.is_deleted = true;
  cluster.is_active = 0;
  (cluster as any).deleted_at = new Date();

  await cluster.save();
  return cluster;
};
