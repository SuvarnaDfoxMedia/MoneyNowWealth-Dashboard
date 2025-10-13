import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import JoditEditor from "jodit-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import { FiSave, FiRefreshCw, FiArrowLeft } from "react-icons/fi";

interface Category {
  _id: string;
  name: string;
}

interface BlogFormData {
  title: string;
  slug: string;
  image: File | null;
  existingImage: string;
  titleTag: string;
  altTag: string;
  seoTitle: string;
  metaDescription: string;
  keywords: string;
  pageSchema: string;
  ogTag: string;
  forHome: boolean;
  date: Date;
  categoryId: string;
}

export default function AddBlog() {
  const { id, role } = useParams<{ id?: string; role: string }>();
  const navigate = useNavigate();
  const editor = useRef<JoditEditor>(null);

  const API_BASE = "http://localhost:5000/api";
  const BACKEND_URL = "http://localhost:5000";

  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    slug: "",
    image: null,
    existingImage: "",
    titleTag: "",
    altTag: "",
    seoTitle: "",
    metaDescription: "",
    keywords: "",
    pageSchema: "",
    ogTag: "",
    forHome: false,
    date: new Date(),
    categoryId: "",
  });

  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<any>({
    category: "",
    title: "",
    slug: "",
    image: "",
    description: "",
    date: "",
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoriesLoaded, setIsCategoriesLoaded] = useState(false);
  const [isBlogLoaded, setIsBlogLoaded] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/categories`, { credentials: "include" });
        const data = await res.json();
        setCategories(data.categories || []);
        setIsCategoriesLoaded(true);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

  // Fetch blog data if editing
  useEffect(() => {
    if (!id) {
      setIsBlogLoaded(true);
      return;
    }
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${API_BASE}/blog/${id}`, { credentials: "include" });
        const data = await res.json();
        const blog = data.blog;

        setFormData({
          title: blog.name || "",
          slug: blog.slug || "",
          image: null,
          existingImage: blog.image || "",
          titleTag: blog.title_tag || "",
          altTag: blog.alt_tag || "",
          seoTitle: blog.seo_title || "",
          metaDescription: blog.seo_meta_description || "",
          keywords: blog.seo_keywords || "",
          pageSchema: blog.page_schema || "",
          ogTag: blog.og_tags || "",
          forHome: blog.for_home === "Yes",
          date: blog.publish_date ? new Date(blog.publish_date) : new Date(),
          categoryId: blog.categoryId._id || "",
        });

        setDescription(blog.description || "");
        if (blog.image) setImagePreview(`${BACKEND_URL}/uploads/blog/${blog.image}`);
        setIsBlogLoaded(true);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch blog data");
      }
    };
    fetchBlog();
  }, [id]);

  // Handle title change and auto-slug
  const handleTitleChange = (title: string) => {
    const slug = title.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
    setFormData((prev) => ({ ...prev, title, slug }));
    setErrors((prev: any) => ({ ...prev, title: "", slug: "" }));
  };

  // Input / file / checkbox handler
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked, files } = event.target as HTMLInputElement;

    if (type === "file" && files && files[0]) {
      const img = files[0];
      const imgObj = new Image();
      imgObj.src = URL.createObjectURL(img);
      imgObj.onload = () => {
        if (imgObj.width !== 1140 || imgObj.height !== 590) {
          setErrors((prev: any) => ({ ...prev, image: "Image must be 1140x590 pixels" }));
          setFormData((prev) => ({ ...prev, image: null }));
          setImagePreview(formData.existingImage ? `${BACKEND_URL}/uploads/blog/${formData.existingImage}` : null);
        } else {
          setErrors((prev: any) => ({ ...prev, image: "" }));
          setFormData((prev) => ({ ...prev, image: img, existingImage: "" }));
          setImagePreview(URL.createObjectURL(img));
        }
      };
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev: any) => ({ ...prev, [name]: "" }));
    }
  };

  const handleDateChange = (date: Date | null) => {
    setFormData((prev) => ({ ...prev, date: date || new Date() }));
    setErrors((prev: any) => ({ ...prev, date: !date ? "Publish Date is required" : "" }));
  };

  // Validate fields
  const validate = () => {
    const newErrors: any = {};
    if (!formData.categoryId) newErrors.category = "Category is required";
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.slug.trim()) newErrors.slug = "Slug is required";
    if (!description.trim() || description === "<p><br></p>") newErrors.description = "Description is required";
    if (!formData.date) newErrors.date = "Publish Date is required";
    if (!formData.image && !id && !formData.existingImage) newErrors.image = "Image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    try {
      const payload = new FormData();
      payload.append("name", formData.title.trim());
      payload.append("slug", formData.slug.trim());
      payload.append("title_tag", formData.titleTag);
      payload.append("alt_tag", formData.altTag);
      payload.append("description", description);
      payload.append("seo_title", formData.seoTitle);
      payload.append("seo_meta_description", formData.metaDescription);
      payload.append("seo_keywords", formData.keywords);
      payload.append("page_schema", formData.pageSchema);
      payload.append("og_tags", formData.ogTag);
      payload.append("for_home", formData.forHome ? "Yes" : "No");
      payload.append("date", formData.date.toISOString());
      payload.append("categoryId", formData.categoryId);
     
      if (formData.image) payload.append("image", formData.image);

      const url = id
        ? `${API_BASE}/${role}/blog/${id}`
        : `${API_BASE}/${role}/blog/create`;
      const method = id ? "PUT" : "POST";

      const res = await fetch(url, { method, body: payload, credentials: "include" });
      const data = await res.json();

      if (res.ok) {
        toast.success(id ? "Blog updated successfully!" : "Blog added successfully!");
        navigate(`/${role}/blogs`);
      } else {
        toast.error(data.message || "Failed to submit blog");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  const inputClass = (field: string) =>
    `w-full p-2 border rounded ${errors[field] ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`;

  return (
    <main className="w-full px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{id ? "Edit Blog" : "Add Blog"}</h2>
        <button
          type="button"
          onClick={() => navigate(`/${role}/blogs`)}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#043f79] to-[#0a68c1] text-white flex items-center gap-2 hover:opacity-90 transition transform hover:scale-105"
        >
          <FiArrowLeft /> Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
        {/* Category */}
        <div>
          <label className="block font-medium mb-1">Category</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className={`w-full p-2 border rounded border-gray-300 ${errors.category ? "border-red-500" : ""}`}
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category}</p>}
        </div>

        {/* Title & Slug */}
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input type="text" name="title" value={formData.title} onChange={(e) => handleTitleChange(e.target.value)} className={inputClass("title")} />
          {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
        </div>
        <div>
          <label className="block font-medium mb-1">Slug</label>
          <input type="text" name="slug" value={formData.slug} onChange={handleChange} className={inputClass("slug")} />
          {errors.slug && <p className="text-red-600 text-sm mt-1">{errors.slug}</p>}
        </div>

        {/* Image */}
        <div>
          <label className="block font-medium mb-1">Blog Image (1140x590)</label>
          <input type="file" name="image" accept="image/*" onChange={handleChange} className={inputClass("image")} />
          {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 w-64 border border-gray-300 rounded" />}
          {errors.image && <p className="text-red-600 text-sm mt-1">{errors.image}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">Description</label>
          <JoditEditor
            ref={editor}
            value={description}
            config={{ readonly: false, height: 300, toolbarSticky: true, placeholder: "Type here..." }}
            onBlur={(newContent) => {
              setDescription(newContent);
              if (newContent.trim() && newContent !== "<p><br></p>") setErrors((prev: any) => ({ ...prev, description: "" }));
            }}
          />
          {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
        </div>

        {/* Publish Date */}
        <div>
          <label className="block font-medium mb-1">Publish Date</label>
          <DatePicker
            selected={formData.date}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            className={`w-full p-2 border rounded ${errors.date ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.date && <p className="text-red-600 text-sm mt-1">{errors.date}</p>}
        </div>

        {/* SEO Fields */}
        {["titleTag", "altTag", "seoTitle", "metaDescription", "keywords", "pageSchema", "ogTag"].map((field) => (
          <div key={field}>
            <label className="block font-medium mb-1">{field.replace(/([A-Z])/g, " $1")}</label>
            {["metaDescription", "keywords", "pageSchema", "ogTag"].includes(field) ? (
              <textarea name={field} value={(formData as any)[field]} onChange={handleChange} className="w-full p-2 border rounded border-gray-300" />
            ) : (
              <input type="text" name={field} value={(formData as any)[field]} onChange={handleChange} className="w-full p-2 border rounded border-gray-300" />
            )}
          </div>
        ))}

        <label className="flex items-center gap-2">
          <input type="checkbox" name="forHome" checked={formData.forHome} onChange={handleChange} />
          For Home
        </label>

        {/* Buttons */}
        <div className="flex gap-4 mt-4">
          <button type="submit" className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#043f79] to-[#0a68c1] text-white flex items-center gap-2 hover:opacity-90 transition transform hover:scale-105">
            <FiSave /> {id ? "Update" : "Save"}
          </button>

          <button
            type="button"
            onClick={() => {
              setFormData({
                title: "",
                slug: "",
                image: null,
                existingImage: id ? formData.existingImage : "",
                titleTag: "",
                altTag: "",
                seoTitle: "",
                metaDescription: "",
                keywords: "",
                pageSchema: "",
                ogTag: "",
                forHome: false,
                date: new Date(),
                categoryId: "",
              });
              setDescription("");
              setImagePreview(id && formData.existingImage ? `${BACKEND_URL}/uploads/blog/${formData.existingImage}` : null);
              setErrors({ category: "", title: "", slug: "", image: "", description: "", date: "" });
            }}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#043f79] to-[#0a68c1] text-white flex items-center gap-2 hover:opacity-90 transition transform hover:scale-105"
          >
            <FiRefreshCw /> Reset
          </button>
        </div>
      </form>
    </main>
  );
}
