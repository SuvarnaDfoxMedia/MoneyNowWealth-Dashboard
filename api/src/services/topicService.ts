


import mongoose from "mongoose";
import Topic from "../models/topicModel.ts";
import Article from "../models/articleModel.ts";
import Cluster from "../models/clusterModel.ts";

export const topicService = {
  // ---------------- PUBLIC ----------------
  getPublishedClustersTopicsArticles: async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Compare date only

    const clusters = await Cluster.aggregate([
      { $match: { status: "published" } },
      { $sort: { sort_order: 1 } },
      {
        $lookup: {
          from: "topics",
          let: { clusterId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$cluster_id", "$$clusterId"] },
                    { $eq: ["$is_deleted", false] },
                    { $eq: ["$status", "published"] },
                    { $lte: ["$publish_date", today] },
                    { $eq: ["$access_type", "free"] },
                  ],
                },
              },
            },
            { $sort: { publish_date: -1, created_at: -1 } },
            {
              $lookup: {
                from: "articles",
                let: { topicId: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$topic_id", "$$topicId"] },
                          { $eq: ["$is_deleted", false] },
                          { $eq: ["$status", "published"] },
                          { $lte: ["$publish_date", today] },
                        ],
                      },
                    },
                  },
                  { $sort: { publish_date: -1, created_at: -1 } },
                ],
                as: "articles",
              },
            },
          ],
          as: "topics",
        },
      },
      {
        $project: {
          _id: 1,
          cluster_code: 1,
          title: 1,
          description: 1,
          thumbnail: 1,
          sort_order: 1,
          topics: 1,
        },
      },
    ]);

    return clusters;
  },

  getPublishedTopicWithArticlesById: async (topicId: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = await Topic.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(topicId),
          is_deleted: false,
          status: "published",
          publish_date: { $lte: today },
          access_type: "free",
        },
      },
      {
        $lookup: {
          from: "clusters",
          localField: "cluster_id",
          foreignField: "_id",
          as: "cluster",
        },
      },
      { $unwind: "$cluster" },
      { $match: { "cluster.status": "published" } },
      {
        $lookup: {
          from: "articles",
          let: { topicId: "$_id" },
          pipeline: [
            // {
            //   $match: {
            //     $expr: {
            //       $and: [
            //         { $eq: ["$topic_id", "$$topicId"] },
            //         { $eq: ["$is_deleted", false] },
            //         { $eq: ["$status", "published"] },
            //         { $lte: ["$publish_date", today] },
            //       ],
            //     },
            //   },
            // },

            {
  $match: {
    $expr: {
      $and: [
        { $eq: ["$cluster_id", "$$clusterId"] },
        { $eq: ["$is_deleted", false] },
        { $eq: ["$status", "published"] },
        { $lte: ["$publish_date", today] },
        { $in: ["$access_type", ["free", "premium"]] },
      ],
    },
  },
},

//          {
//   $match: {
//     $expr: {
//       $and: [
//         { $eq: ["$cluster_id", "$$clusterId"] },
//         { $eq: ["$is_deleted", false] },
//         { $eq: ["$status", "published"] },
//         { $lte: ["$publish_date", today] },
//         {
//           $or: [
//             { $eq: ["$access_type", "free"] },
//             {
//               $and: [
//                 { $eq: ["$access_type", "premium"] },
//                 { $eq: ["$$userHasActiveSubscription", true] }   // Base on the Subscription
//               ]
//             }
//           ]
//         }
//       ]
//     }
//   }
// },     
            { $sort: { publish_date: -1, created_at: -1 } },
          ],
          as: "articles",
        },
      },
      {
        $project: {
          _id: 1,
          topic_code: 1,
          title: 1,
          slug: 1,
          summary: 1,
          keywords: 1,
          author: 1,
          publish_date: 1,
          read_time_minutes: 1,
          tags: 1,
          access_type: 1,
          created_at: 1,
          updated_at: 1,
          cluster: {
            _id: "$cluster._id",
            cluster_code: "$cluster.cluster_code",
            title: "$cluster.title",
            description: "$cluster.description",
          },
          articles: 1,
        },
      },
    ]);

    return result?.[0] || null;
  },

  // ---------------- ADMIN ----------------
  getAll: async (filter: Record<string, any>, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;

    const [topics, total] = await Promise.all([
      Topic.find(filter)
        .populate("cluster_id", "cluster_code title")
        .sort({ publish_date: -1, created_at: -1 })
        .skip(skip)
        .limit(limit),
      Topic.countDocuments(filter),
    ]);

    return { topics, total };
  },

  getById: async (id: string) => {
    return await Topic.findOne({ _id: id, is_deleted: false }).populate(
      "cluster_id",
      "cluster_code title"
    );
  },

  create: async (data: any) => {
    const now = new Date();
    data.access_type = data.access_type || "free";

    // Do NOT auto-set is_active
    data.status = ["draft", "published", "archived"].includes(data.status)
      ? data.status
      : "draft";
    data.is_active = typeof data.is_active === "number" ? data.is_active : 0;

    data.created_at = now;
    data.updated_at = now;

    const topic = new Topic(data);
    return await topic.save();
  },

  update: async (id: string, updateData: any) => {
    const now = new Date();

    // Do NOT auto-update is_active
    if (updateData.status) {
      updateData.status = ["draft", "published", "archived"].includes(updateData.status)
        ? updateData.status
        : "draft";
    }

    if (updateData.is_active !== undefined && typeof updateData.is_active !== "number") {
      updateData.is_active = 0;
    }

    updateData.updated_at = now;

    return await Topic.findByIdAndUpdate(id, updateData, { new: true });
  },

  // Toggle is_active manually
  toggleStatus: async (id: string) => {
    const topic = await Topic.findById(id);
    if (!topic) return null;

    topic.is_active = topic.is_active === 1 ? 0 : 1;
    topic.updated_at = new Date();

    return await topic.save();
  },

  softDelete: async (id: string) => {
    const topic = await Topic.findById(id);
    if (!topic) return null;

    topic.is_deleted = true;
    topic.is_active = 0;
    topic.deleted_at = new Date();
    topic.updated_at = new Date();

    return await topic.save();
  },

  restore: async (id: string) => {
    const topic = await Topic.findById(id);
    if (!topic) return null;

    topic.is_deleted = false;
    topic.deleted_at = undefined;
    topic.updated_at = new Date();

    return await topic.save();
  },
};
