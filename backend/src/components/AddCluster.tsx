

import React, { useEffect, useState, ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiSave, FiRefreshCw, FiArrowLeft, FiUpload, FiX } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useCommonCrud } from "../hooks/useCommonCrud";

interface ClusterForm {
  title: string;
  description: string;
  sort_order: number;
  status: string;
  is_active: number;
  thumbnail?: string;
}

export default function AddCluster() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOne, createRecord, updateRecord } = useCommonCrud({
    role: "admin",
    module: "cluster",
  });

  const [values, setValues] = useState<ClusterForm>({
    title: "",
    description: "",
    sort_order: 0,
    status: "draft",
    is_active: 1,
    thumbnail: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await getOne(id);
        const cluster = res?.data?.cluster || res?.cluster || res;

        if (!cluster) {
          toast.error("Cluster not found");
          return;
        }

        const thumb = cluster.thumbnail || "";
        const fullUrl = thumb
          ? `${import.meta.env.VITE_API_BASE.replace("/api", "")}/uploads/thumbnail/${thumb}`
          : null;

        setValues({
          title: cluster.title || "",
          description: cluster.description || "",
          sort_order: cluster.sort_order || 0,
          status: cluster.status || "draft",
          is_active: cluster.is_active ?? 1,
          thumbnail: thumb,
        });

        if (fullUrl) setPreview(fullUrl);
      } catch (error) {
        console.error("Error fetching cluster:", error);
        toast.error("Failed to fetch cluster details");
      }
    })();
  }, [id]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key !== "thumbnail") formData.append(key, String(value));
      });
      if (file) formData.append("thumbnail", file);

      if (id) {
        await updateRecord(id, formData);
        toast.success("Cluster updated successfully");
      } else {
        await createRecord(formData);
        toast.success("Cluster created successfully");
      }

      navigate("/admin/cluster");
    } catch (error: any) {
      toast.error(error?.message || "Failed to save cluster");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setValues({
      title: "",
      description: "",
      sort_order: 0,
      status: "draft",
      is_active: 1,
      thumbnail: "",
    });
    setFile(null);
    setPreview(null);
  };

  return (
    <div className="p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">
          {id ? "Edit Cluster" : "Add Cluster"}
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
        >
          <FiArrowLeft /> Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block mb-2 text-gray-700 font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={values.title}
              onChange={handleChange}
              placeholder="Enter cluster title"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-medium">Thumbnail</label>
            <label className="flex border border-gray-300 rounded-md px-4 py-2 text-gray-600 cursor-pointer items-center justify-center gap-2 hover:bg-gray-50 transition">
              <FiUpload className="text-gray-500" />
              <span>Upload Image</span>
              <input
                type="file"
                name="thumbnail"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <div className="relative w-24 h-24 border border-gray-300 rounded-lg overflow-hidden flex items-center justify-center bg-gray-50 shadow-sm">
            {preview ? (
              <>
                <img src={preview} alt="Preview" className="object-cover w-full h-full" />
                <button
                  type="button"
                  onClick={() => {
                    setPreview(null);
                    setFile(null);
                    setValues((prev) => ({ ...prev, thumbnail: "" }));
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <FiX size={14} />
                </button>
              </>
            ) : (
              <span className="text-sm text-gray-400">No Image</span>
            )}
          </div>
        </div>

        <div>
          <label className="block mb-2 text-gray-700 font-medium">Description</label>
          <textarea
            name="description"
            value={values.description}
            onChange={handleChange}
            placeholder="Enter cluster description"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block mb-2 text-gray-700 font-medium">Status</label>
            <select
              name="status"
              value={values.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-medium">Sort Order</label>
            <input
              type="number"
              name="sort_order"
              value={values.sort_order}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="is_active"
            checked={!!values.is_active}
            onChange={handleChange}
            className="w-5 h-5 accent-blue-600"
          />
          <label className="text-gray-700 font-medium">Active</label>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 bg-gray-200 text-gray-700 px-5 py-2.5 rounded-md hover:bg-gray-300 transition"
          >
            <FiRefreshCw /> Reset
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-[#043f79] text-white px-6 py-2.5 rounded-md hover:bg-[#0654a4] transition"
          >
            <FiSave />
            {isSubmitting ? "Saving..." : id ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}


