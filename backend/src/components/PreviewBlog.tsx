import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiArrowLeft } from "react-icons/fi";

interface Blog {
  _id: string;
  name: string;
  slug: string;
  image: string;
  title_tag: string;
  alt_tag: string;
  seo_title: string;
  seo_meta_description: string;
  seo_keywords: string;
  page_schema: string;
  og_tags: string;
  for_home: "Yes" | "No";
  description: string;
  publish_date: string;
  is_active: number;
}

export default function PreviewBlog() {
  const { id, role } = useParams<{ id: string; role: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const navigate = useNavigate();
  const API_BASE = "http://localhost:5000/api";
  const BACKEND_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${API_BASE}/blog/${id}`, { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch blog");
        const data = await res.json();
        setBlog(data.blog);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load blog");
      }
    };
    fetchBlog();
  }, [id]);

  if (!blog) return <p className="text-center mt-10">Loading...</p>;

  return (
    <main className="w-full px-4 py-6">
      {/* Back Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Preview Blog</h2>
        <button
          type="button"
          onClick={() => navigate(`/${role}/blogs`)}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#043f79] to-[#0a68c1] text-white flex items-center gap-2 hover:opacity-90 transition transform hover:scale-105"
        >
          <FiArrowLeft /> Back
        </button>
      </div>

      {/* Blog Details */}
      <div className="p-6 max-w-full mx-auto bg-white rounded-xl shadow space-y-6">
        <h1 className="text-3xl font-bold mb-4">{blog.name}</h1>

        {blog.image && (
          <img
            src={`${BACKEND_URL}/uploads/blog/${blog.image}`}
            alt={blog.name}
            className="w-full h-64 object-cover rounded mb-6"
          />
        )}

        <div className="space-y-2">
          <p className="mb-2"><strong>Slug:</strong> {blog.slug}</p>
          <p className="mb-2"><strong>Title Tag:</strong> {blog.title_tag}</p>
          <p className="mb-2"><strong>Alt Tag:</strong> {blog.alt_tag}</p>
          <p className="mb-2"><strong>SEO Title:</strong> {blog.seo_title}</p>
          <p className="mb-2"><strong>Meta Description:</strong> {blog.seo_meta_description}</p>
          <p className="mb-2"><strong>Keywords:</strong> {blog.seo_keywords}</p>
          <p className="mb-2"><strong>Page Schema:</strong> {blog.page_schema}</p>
          <p className="mb-2"><strong>OG Tags:</strong> {blog.og_tags}</p>
          <p className="mb-2"><strong>For Home:</strong> {blog.for_home}</p>
          <p className="mb-2"><strong>Publish Date:</strong> {new Date(blog.publish_date).toLocaleDateString()}</p>
          <p className="mb-2"><strong>Status:</strong> {blog.is_active === 1 ? "Active" : "Deactive"}</p>
        </div>

       
      </div>
    </main>
  );
}
