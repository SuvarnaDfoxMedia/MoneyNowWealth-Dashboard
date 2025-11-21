import Cluster, { type ICluster } from "../models/clusterModel.ts";

/* ---------------------------------------------------
   GET: All Clusters
--------------------------------------------------- */
export const getClusters = async (query: any) => {
  const { status, includeDeleted, page, limit, search } = query;

  const filter: Record<string, any> = { is_deleted: false };

  if (status) filter.is_active = Number(status);
  if (includeDeleted === "true") delete filter.is_deleted;

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { cluster_code: { $regex: search, $options: "i" } },
    ];
  }

  const pageNum = parseInt(page as string) || 1;
  const perPage = parseInt(limit as string) || 10;
  const skip = (pageNum - 1) * perPage;

  const [clusters, total] = await Promise.all([
    Cluster.find(filter)
      .sort({ sort_order: 1, created_at: -1 })
      .skip(skip)
      .limit(perPage),
    Cluster.countDocuments(filter),
  ]);

  return {
    clusters,
    total,
    currentPage: pageNum,
    totalPages: Math.ceil(total / perPage),
  };
};

/* ---------------------------------------------------
   GET: Cluster by ID
--------------------------------------------------- */
export const getClusterById = async (id: string) => {
  const cluster = await Cluster.findOne({ _id: id, is_deleted: false });
  if (!cluster) throw new Error("Cluster not found");
  return cluster;
};

/* ---------------------------------------------------
   POST: Create Cluster
--------------------------------------------------- */
export const createCluster = async (data: Partial<ICluster>) => {
  let cluster_code = data.cluster_code;

  if (!cluster_code) {
    const lastCluster = await Cluster.findOne()
      .sort({ created_at: -1 })
      .select("cluster_code");
    const lastCodeNum = lastCluster
      ? parseInt(lastCluster.cluster_code?.replace("CL-", "") || "0", 10)
      : 0;
    cluster_code = `CL-${String(lastCodeNum + 1).padStart(4, "0")}`;
  }

  // ✅ thumbnail filename properly extracted
  const thumbnailName =
    typeof data.thumbnail === "string"
      ? data.thumbnail
      : (data as any)?.file?.filename || "";

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
   PUT: Update Cluster
--------------------------------------------------- */
export const updateCluster = async (id: string, data: Partial<ICluster>) => {
  const updateData: any = { ...data };

  // ✅ if new file uploaded, update thumbnail name
  if ((data as any).file) {
    updateData.thumbnail = (data as any).file.filename;
  }

  const cluster = await Cluster.findByIdAndUpdate(id, updateData, { new: true });
  if (!cluster) throw new Error("Cluster not found");
  return cluster;
};

/* ---------------------------------------------------
   PATCH: Toggle Active / Inactive
--------------------------------------------------- */
export const toggleClusterStatus = async (id: string) => {
  const cluster = await Cluster.findById(id);
  if (!cluster) throw new Error("Cluster not found");

  cluster.is_active = cluster.is_active === 1 ? 0 : 1;
  await cluster.save();
  return cluster;
};

/* ---------------------------------------------------
   DELETE: Soft Delete Cluster
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
