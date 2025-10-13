import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FiSave, FiRefreshCw, FiArrowLeft } from "react-icons/fi";

interface FormData {
  name: string;
  image: File | null;
  existingImage: string;
}

export default function AddBlogCategory() {
  const { id, role } = useParams<{ id?: string; role: string }>();
  const navigate = useNavigate();

  const API_BASE = "http://localhost:5000/api";
  const BACKEND_URL = "http://localhost:5000"; // Corrected

  const [formData, setFormData] = useState<FormData>({
    name: "",
    image: null,
    existingImage: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState({ name: "", image: "" });

  // Fetch category if editing
  useEffect(() => {
    if (!id) return;

    const fetchCategory = async () => {
      try {
        const res = await fetch(`${API_BASE}/${role}/blogcategory/${id}`, { credentials: "include" });
        if (!res.ok) throw new Error(`Failed to fetch category. Status: ${res.status}`);
        const data = await res.json();
        if (!data.success) throw new Error(data.message || "Failed to fetch category");

        setFormData({
          name: data.category.name,
          image: null,
          existingImage: data.category.image || "",
        });

        if (data.category.image) {
          setImagePreview(`${BACKEND_URL}/uploads/category/${data.category.image}`);
        }
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || "Failed to fetch category data");
      }
    };

    fetchCategory();
  }, [id, role]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, files, value } = e.target;

    if (type === "file" && files && files[0]) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file, existingImage: "" }));
      setImagePreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, image: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate
  const validate = () => {
    const newErrors: any = {};
    if (!formData.name.trim()) newErrors.name = "Category name is required";
    if (!formData.image && !formData.existingImage) newErrors.image = "Image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const payload = new FormData();
      payload.append("name", formData.name.trim());
      if (formData.image) payload.append("image", formData.image);

      const url = id
        ? `${API_BASE}/${role}/blogcategory/${id}` // edit
        : `${API_BASE}/${role}/blogcategory/create`; // create
      const method = id ? "PUT" : "POST";

      const res = await fetch(url, { method, body: payload, credentials: "include" });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(id ? "Category updated successfully!" : "Category added successfully!");
        navigate(`/${role}/blogcategories`);
      } else {
        const msg = data.message || "Something went wrong";
        if (data.code === 11000 || msg.includes("already exists")) {
          setErrors({ name: `Category "${formData.name}" already exists`, image: "" });
        } else {
          toast.error(msg);
        }
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to submit category");
    }
  };

  // Reset
  const handleReset = () => {
    setFormData((prev) => ({
      name: "",
      image: null,
      existingImage: id ? prev.existingImage : "",
    }));
    setImagePreview(id && formData.existingImage ? `${BACKEND_URL}/uploads/category/${formData.existingImage}` : null);
    setErrors({ name: "", image: "" });
  };

  return (
    <main className="w-full px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{id ? "Edit Category" : "Add Category"}</h2>
        <button
          type="button"
          onClick={() => navigate(`/${role}/blogcategories`)}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#043f79] to-[#0a68c1] text-white flex items-center gap-2 hover:opacity-90"
        >
          <FiArrowLeft /> Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
        {/* Name */}
        <div>
          <label className="block font-medium mb-1">Category Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.name ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Image */}
        <div>
          <label className="block font-medium mb-1">Category Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full p-2 border rounded border-gray-300"
          />
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="mt-2 w-48 border border-gray-300 rounded" />
          )}
          {errors.image && <p className="text-red-600 text-sm mt-1">{errors.image}</p>}
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-4">
          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#043f79] to-[#0a68c1] text-white flex items-center gap-2"
          >
            <FiSave /> {id ? "Update" : "Save"}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#043f79] to-[#0a68c1] text-white flex items-center gap-2"
          >
            <FiRefreshCw /> Reset
          </button>
        </div>
      </form>
    </main>
  );
}
