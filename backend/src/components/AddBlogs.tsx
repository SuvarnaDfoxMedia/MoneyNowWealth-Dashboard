import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import JoditEditor from "jodit-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import { FiSave, FiRefreshCw, FiArrowLeft } from "react-icons/fi";

export default function AddBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editor = useRef(null);

  const API_BASE = "http://localhost:5000/api";

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    image: null as File | null,
    existingImage: "",
    titleTag: "",
    altTag: "",
    description: "",
    seoTitle: "",
    metaDescription: "",
    keywords: "",
    pageSchema: "",
    ogTag: "",
    forHome: false,
    date: new Date(),
  });

  const [errors, setErrors] = useState({
    title: "",
    slug: "",
    image: "",
  });

  // Fetch blog data for edit
  useEffect(() => {
    if (id) {
      const fetchBlog = async () => {
        try {
          const res = await fetch(`${API_BASE}/blog/${id}`, {
            credentials: "include",
          });

          if (!res.ok) throw new Error("Failed to fetch blog");
          const data = await res.json();
          const blog = data.blog;

          setFormData({
            title: blog.name || "",
            slug: blog.slug || "",
            image: null,
            existingImage: blog.image || "",
            titleTag: blog.title_tag || "",
            altTag: blog.alt_tag || "",
            description: blog.description || "",
            seoTitle: blog.seo_title || "",
            metaDescription: blog.seo_meta_description || "",
            keywords: blog.seo_keywords || "",
            pageSchema: blog.page_schema || "",
            ogTag: blog.og_tags || "",
            forHome: blog.for_home === "Yes",
            date: blog.publish_date ? new Date(blog.publish_date) : new Date(),
          });
        } catch (err) {
          console.error(err);
          toast.error("Failed to fetch blog data");
        }
      };
      fetchBlog();
    }
  }, [id]);

  // Generate slug from title
  useEffect(() => {
    if (formData.title) {
      const slug = formData.title
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9\-]/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.title]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked, files } = event.target as HTMLInputElement;

    if (type === "file") {
      if (files && files[0]) {
        const img = files[0];
        const imgObj = new Image();
        imgObj.src = URL.createObjectURL(img);
        imgObj.onload = () => {
          if (imgObj.width !== 1140 || imgObj.height !== 590) {
            setErrors((prev) => ({
              ...prev,
              image: "Image must be 1140x590 pixels",
            }));
            setFormData((prev) => ({ ...prev, image: null }));
          } else {
            setErrors((prev) => ({ ...prev, image: "" }));
            setFormData((prev) => ({ ...prev, image: img, existingImage: "" }));
          }
        };
      }
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDateChange = (date: Date | null) => {
    setFormData((prev) => ({ ...prev, date: date || new Date() }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.title || !formData.slug) {
      toast.error("Please fill required fields");
      return;
    }

    try {
      const payload = new FormData();
      payload.append("name", formData.title.trim());
      payload.append("slug", formData.slug.trim());
      payload.append("title_tag", formData.titleTag);
      payload.append("alt_tag", formData.altTag);
      payload.append("description", formData.description);
      payload.append("seo_title", formData.seoTitle);
      payload.append("seo_meta_description", formData.metaDescription);
      payload.append("seo_keywords", formData.keywords);
      payload.append("page_schema", formData.pageSchema);
      payload.append("og_tags", formData.ogTag);
      payload.append("for_home", formData.forHome ? "Yes" : "No");
      payload.append("date", formData.date.toISOString());

      if (formData.image) {
        payload.append("image", formData.image);
      }

      const url = id ? `${API_BASE}/blog/${id}` : `${API_BASE}/blog`;
      const method = id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: payload,
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(id ? "Blog updated successfully!" : "Blog added successfully!");
        navigate("/blogs");
      } else {
        toast.error(data.message || "Failed to submit blog");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  const editorStyle: React.CSSProperties = {
    border: "1px solid #ccc",
    borderRadius: "6px",
    minHeight: "200px",
  };

  return (
    <main className="w-full px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{id ? "Edit Blog" : "Add Blog"}</h2>
        <button
          type="button"
          onClick={() => navigate("/blogs")}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#043f79] to-[#0a68c1] text-white flex items-center gap-2 hover:opacity-90 transition transform hover:scale-105"
        >
          <FiArrowLeft /> Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
        {/* Title */}
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter blog title"
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block font-medium mb-1">Slug</label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="Slug"
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Image */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block font-medium mb-1">Blog Image (1140x590)</label>
            <input type="file" name="image" accept="image/*" onChange={handleChange} />
            {errors.image && <p className="text-red-600 text-sm">{errors.image}</p>}
            {formData.image && (
              <p className="text-sm text-gray-600 mt-1">Selected: {formData.image.name}</p>
            )}
          </div>

          <div className="w-32 h-20 border rounded overflow-hidden flex items-center justify-center bg-gray-50">
            {formData.image ? (
              <img
                src={URL.createObjectURL(formData.image)}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : formData.existingImage ? (
              <img
                src={`http://localhost:5000/uploads/blog/${formData.existingImage}`}
                alt="Existing"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400 text-sm">Preview</span>
            )}
          </div>
        </div>

        {/* Title Tag */}
        <div>
          <label className="block font-medium mb-1">Title Tag</label>
          <input
            type="text"
            name="titleTag"
            value={formData.titleTag}
            onChange={handleChange}
            placeholder="Enter title tag"
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Alt Tag */}
        <div>
          <label className="block font-medium mb-1">Alt Tag</label>
          <input
            type="text"
            name="altTag"
            value={formData.altTag}
            onChange={handleChange}
            placeholder="Enter alt tag"
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">Description</label>
          <div style={editorStyle}>
            <JoditEditor
              ref={editor}
              value={formData.description}
              config={{ readonly: false, height: 300 }}
              onBlur={(newContent) =>
                setFormData((prev) => ({ ...prev, description: newContent }))
              }
            />
          </div>
        </div>

        {/* Publish Date */}
        <div>
          <label className="block font-medium mb-1">Publish Date</label>
          <DatePicker
            selected={formData.date}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            className="border p-2 rounded"
          />
        </div>

        {/* SEO Title */}
        <div>
          <label className="block font-medium mb-1">SEO Title</label>
          <input
            type="text"
            name="seoTitle"
            value={formData.seoTitle}
            onChange={handleChange}
            placeholder="Enter SEO title"
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Meta Description */}
        <div>
          <label className="block font-medium mb-1">Meta Description</label>
          <textarea
            name="metaDescription"
            value={formData.metaDescription}
            onChange={handleChange}
            placeholder="Enter meta description"
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Keywords */}
        <div>
          <label className="block font-medium mb-1">SEO Keywords</label>
          <textarea
            name="keywords"
            value={formData.keywords}
            onChange={handleChange}
            placeholder="Enter SEO keywords"
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Page Schema */}
        <div>
          <label className="block font-medium mb-1">Page Schema</label>
          <textarea
            name="pageSchema"
            value={formData.pageSchema}
            onChange={handleChange}
            placeholder="Enter page schema"
            className="w-full border p-2 rounded"
          />
        </div>

        {/* OG Tag */}
        <div>
          <label className="block font-medium mb-1">OG Tag</label>
          <textarea
            name="ogTag"
            value={formData.ogTag}
            onChange={handleChange}
            placeholder="Enter OG tag"
            className="w-full border p-2 rounded"
          />
        </div>

        {/* For Home */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="forHome"
            checked={formData.forHome}
            onChange={handleChange}
          />
          For Home
        </label>

        {/* Buttons */}
        <div className="flex gap-4 mt-4">
          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#043f79] to-[#0a68c1] text-white flex items-center gap-2 hover:opacity-90 transition transform hover:scale-105"
          >
            <FiSave /> {id ? "Update Blog" : "Save Blog"}
          </button>

          <button
            type="button"
            onClick={() => {
              setFormData({
                title: "",
                slug: "",
                image: null,
                existingImage: "",
                titleTag: "",
                altTag: "",
                description: "",
                seoTitle: "",
                metaDescription: "",
                keywords: "",
                pageSchema: "",
                ogTag: "",
                forHome: false,
                date: new Date(),
              });
              setErrors({ title: "", slug: "", image: "" });
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
