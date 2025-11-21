import mongoose, { Document, Schema, Model } from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

/* ---------------------------------------------------
   Cluster Interface
--------------------------------------------------- */
export interface ICluster extends Document {
  _id: mongoose.Types.ObjectId;
  cluster_code: string;
  title: string;
  description?: string;
  thumbnail?: string; //  store only filename instead of object
  sort_order?: number;
  status: "draft" | "published" | "archived";
  is_active: number;
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

/* ---------------------------------------------------
   Schema Definition
--------------------------------------------------- */
const clusterSchema = new Schema<ICluster>(
  {
    cluster_code: { type: String, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    thumbnail: { type: String, trim: true, default: "" }, // ✅ filename only
    sort_order: { type: Number, default: 0, index: true },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true,
    },
    is_active: { type: Number, default: 1 },
    is_deleted: { type: Boolean, default: false },
    deleted_at: { type: Date, default: null },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

/* ---------------------------------------------------
   Auto Increment Cluster Number
--------------------------------------------------- */
const AutoIncrement = AutoIncrementFactory(mongoose);

clusterSchema.plugin(AutoIncrement, {
  id: "cluster_seq",
  inc_field: "cluster_number",
  start_seq: 1,
});

clusterSchema.pre("save", function (next) {
  if (this.isNew && (this as any).cluster_number !== undefined) {
    const number = String((this as any).cluster_number).padStart(3, "0");
    (this as any).cluster_code = `CL${number}`;
  }
  next();
});

/* ---------------------------------------------------
   Soft Delete Method
--------------------------------------------------- */
clusterSchema.statics.softDelete = async function (id: string) {
  const cluster = await this.findById(id);
  if (!cluster) throw new Error("Cluster not found");
  cluster.is_deleted = true;
  cluster.is_active = 0;
  cluster.deleted_at = new Date();
  await cluster.save();
  return cluster;
};

/* ---------------------------------------------------
   Middleware: Filter Deleted Records Automatically
--------------------------------------------------- */
clusterSchema.pre(/^find/, function (next) {
  this.where({ is_deleted: false });
  next();
});

/* ---------------------------------------------------
   Middleware: Prevent Physical Delete
--------------------------------------------------- */
clusterSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    // @ts-ignore
    this.is_deleted = true;
    // @ts-ignore
    this.is_active = 0;
    // @ts-ignore
    this.deleted_at = new Date();
    await this.save();
    next(new Error("Soft delete: document not actually removed"));
  }
);

/* ---------------------------------------------------
   Indexes
--------------------------------------------------- */
clusterSchema.index({ is_active: 1, is_deleted: 1, status: 1, sort_order: 1 });

/* ---------------------------------------------------
   Model Export
--------------------------------------------------- */
const Cluster: Model<ICluster> & {
  softDelete(id: string): Promise<ICluster>;
} = mongoose.model<ICluster>("Cluster", clusterSchema) as any;

export default Cluster;
