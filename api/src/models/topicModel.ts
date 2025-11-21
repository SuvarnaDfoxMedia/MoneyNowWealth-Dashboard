// import mongoose, { Document, Schema, Model } from "mongoose";
// import AutoIncrementFactory from "mongoose-sequence";


// export interface ITopic extends Document {
//   _id: mongoose.Types.ObjectId;
//   topic_code: string;
//   topic_number: number;
//   cluster_id: mongoose.Types.ObjectId;
//   title: string;
//   slug: string;
//   keywords?: string[];
//   summary?: string;
//   status: "draft" | "published" | "archived" | "scheduled";
//   author?: string;
//   publish_date?: Date;
//   read_time_minutes?: number;
//   tags?: string[];
//   is_active: number;
//   is_deleted: boolean;
//   created_at: Date;
//   updated_at: Date;
//   deleted_at?: Date;
// }

// const topicSchema = new Schema<ITopic>(
//   {
//     topic_code: { type: String, unique: true, index: true },
//     cluster_id: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Cluster",
//       required: true,
//     },
//     title: { type: String, required: true, trim: true },
//     slug: { type: String, required: true, trim: true, lowercase: true },
//     keywords: [{ type: String, trim: true }],
//     summary: { type: String, trim: true },

//     status: {
//       type: String,
//       enum: ["draft", "published", "archived", "scheduled"],
//       default: "draft",
//       index: true,
//     },
//     author: { type: String, trim: true },

//     // for scheduling
//     publish_date: { type: Date, default: null },

//     read_time_minutes: { type: Number, default: 0 },
//     tags: [{ type: String, trim: true }],

//     is_active: { type: Number, default: 1 },
//     is_deleted: { type: Boolean, default: false },
//     deleted_at: { type: Date, default: null },
//   },
//   {
//     versionKey: false,
//     timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
//   }
// );

// const AutoIncrement = AutoIncrementFactory(mongoose);

// topicSchema.plugin(AutoIncrement, {
//   id: "topic_seq",
//   inc_field: "topic_number",
//   start_seq: 1,
// });

// // auto-generate topic_code
// topicSchema.post("save", async function (doc, next) {
//   if (!doc.topic_code && doc.topic_number) {
//     const number = String(doc.topic_number).padStart(3, "0");
//     doc.topic_code = `TP${number}`;
//     await doc.updateOne({ topic_code: doc.topic_code });
//   }
//   next();
// });

// // soft delete functionality
// topicSchema.statics.softDelete = async function (id: string) {
//   const topic = await this.findById(id);
//   if (!topic) throw new Error("Topic not found");
//   topic.is_deleted = true;
//   topic.is_active = 0;
//   topic.deleted_at = new Date();
//   await topic.save();
//   return topic;
// };

// topicSchema.pre(/^find/, function (next) {
//   this.where({ is_deleted: false });
//   next();
// });

// topicSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
//   // @ts-ignore
//   this.is_deleted = true;
//   // @ts-ignore
//   this.is_active = 0;
//   // @ts-ignore
//   this.deleted_at = new Date();
//   await this.save();
//   next(new Error("Soft delete: document not actually removed"));
// });

// topicSchema.index({ is_active: 1, is_deleted: 1, status: 1, cluster_id: 1 });

// const Topic: Model<ITopic> & { softDelete(id: string): Promise<ITopic> } =
//   mongoose.model<ITopic>("Topic", topicSchema) as any;

// export default Topic;



import mongoose, { Document, Schema, Model } from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

export interface ITopic extends Document {
  _id: mongoose.Types.ObjectId;
  topic_code: string;
  topic_number: number;
  cluster_id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  keywords?: string[];
  summary?: string;
  status: "draft" | "published" | "archived";
  access_type: "free" | "premium";
  is_active: number; // 1 = active, 0 = inactive, independent
  author?: string;
  publish_date?: Date;
  read_time_minutes?: number;
  tags?: string[];
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

const topicSchema = new Schema<ITopic>(
  {
    topic_code: { type: String, unique: true, index: true },
    cluster_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cluster",
      required: true,
    },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    keywords: [{ type: String, trim: true }],
    summary: { type: String, trim: true },

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true,
    },

    access_type: {
      type: String,
      enum: ["free", "premium"],
      default: "free",
      index: true,
    },

    // ✅ independent toggle field
    is_active: { type: Number, default: 1 },

    author: { type: String, trim: true },

    publish_date: { type: Date, default: null },

    read_time_minutes: { type: Number, default: 0 },
    tags: [{ type: String, trim: true }],

    is_deleted: { type: Boolean, default: false },
    deleted_at: { type: Date, default: null },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Auto-increment topic_number
const AutoIncrement = AutoIncrementFactory(mongoose);
topicSchema.plugin(AutoIncrement, {
  id: "topic_seq",
  inc_field: "topic_number",
  start_seq: 1,
});

// Auto-generate topic_code
topicSchema.post("save", async function (doc, next) {
  if (!doc.topic_code && doc.topic_number) {
    const number = String(doc.topic_number).padStart(3, "0");
    doc.topic_code = `TP${number}`;
    await doc.updateOne({ topic_code: doc.topic_code });
  }
  next();
});

// Soft delete
topicSchema.statics.softDelete = async function (id: string) {
  const topic = await this.findById(id);
  if (!topic) throw new Error("Topic not found");
  topic.is_deleted = true;
  topic.deleted_at = new Date();
  await topic.save();
  return topic;
};

// Toggle active/inactive manually
topicSchema.statics.toggleActive = async function (id: string) {
  const topic = await this.findById(id);
  if (!topic) throw new Error("Topic not found");
  topic.is_active = topic.is_active === 1 ? 0 : 1;
  await topic.save();
  return topic;
};

// Always exclude deleted records
topicSchema.pre(/^find/, function (next) {
  this.where({ is_deleted: false });
  next();
});

// Prevent physical delete
topicSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  // @ts-ignore
  this.is_deleted = true;
  // @ts-ignore
  this.deleted_at = new Date();
  await this.save();
  next(new Error("Soft delete: document not actually removed"));
});

// Indexes
topicSchema.index({ is_deleted: 1, status: 1, access_type: 1, cluster_id: 1, is_active: 1 });

const Topic: Model<ITopic> & {
  softDelete(id: string): Promise<ITopic>;
  toggleActive(id: string): Promise<ITopic>;
} = mongoose.model<ITopic>("Topic", topicSchema) as any;

export default Topic;
