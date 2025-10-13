import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { FiMoreVertical, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";

interface Blog {
  _id: string;
  name: string;
  image: string;
  publish_date: string;
  is_active: number;
  categoryId?: string;
  categoryName?: string;
}

interface Category {
  _id: string;
  name: string;
}

export default function BlogDataTable() {
  const [data, setData] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const API_BASE = "http://localhost:5000/api";
  const entriesPerPage = 10;

  const indexOfLast = currentPage * entriesPerPage;
  const indexOfFirst = indexOfLast - entriesPerPage;

  // ===== Fetch categories & blogs =====
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        // Fetch categories
        const catRes = await fetch(`${API_BASE}/categories`, { credentials: "include" });
        if (!catRes.ok) throw new Error("Failed to fetch categories");
        const catResult = await catRes.json();
        const cats: Category[] = Array.isArray(catResult) ? catResult : catResult.categories || [];
        setCategories(cats);

        // Map category _id to name (convert to string to avoid mismatch)
        const categoryMap = new Map<string, string>();
        cats.forEach(cat => categoryMap.set(cat._id.toString(), cat.name));

        // Fetch blogs
        const blogRes = await fetch(`${API_BASE}/blogs?query=${encodeURIComponent(search)}`, { credentials: "include" });
        if (blogRes.status === 401) {
          toast.error("Session expired. Please login again.");
          navigate("/signin");
          return;
        }
        if (!blogRes.ok) throw new Error("Failed to fetch blogs");
        const blogResult = await blogRes.json();

        const blogs: Blog[] = (Array.isArray(blogResult) ? blogResult : blogResult.blogs || []).map(blog => {
          const catId = blog.categoryId ? blog.categoryId.toString() : "";
          return {
            ...blog,
            categoryName: catId ? categoryMap.get(catId) || "-" : "-",
          };
        });

        setData(blogs);
        setCurrentPage(1);
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [search]);

  const currentData = data.slice(indexOfFirst, indexOfLast);

  // ===== Toggle Status =====
  const toggleStatus = async (id: string, currentStatus: number) => {
    try {
      const res = await fetch(`${API_BASE}/${role}/blog/status/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: currentStatus === 1 ? 0 : 1 }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      const updated = await res.json();
      setData(prev => prev.map(blog => (blog._id === id ? { ...blog, is_active: updated.blog.is_active } : blog)));
      toast.success("Status updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  // ===== Delete Blog =====
  const handleDelete = async () => {
    if (!deleteModalId) return;
    try {
      const res = await fetch(`${API_BASE}/${role}/blog/${deleteModalId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete blog");
      setData(prev => prev.filter(blog => blog._id !== deleteModalId));
      toast.success("Blog deleted successfully");
      setDeleteModalId(null);
      setOpenDropdownId(null);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to delete blog");
    }
  };

  // ===== Dropdown =====
  const Dropdown = ({ blogId, top, left }: { blogId: string; top: number; left: number }) =>
    createPortal(
      <div className="absolute bg-white border rounded-xl shadow-lg z-50 animate-scaleIn dropdown-menu" style={{ top, left, width: "9rem" }}>
        <button
          onClick={() => {
            navigate(`/${role}/blog/edit/${blogId}`);
            setOpenDropdownId(null);
          }}
          className="flex items-center gap-2 px-4 py-2 hover:bg-indigo-50 w-full text-left transition"
        >
          <FiEdit /> Edit
        </button>
        <button
          onClick={() => {
            setDeleteModalId(blogId);
            setOpenDropdownId(null);
          }}
          className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 w-full text-left text-red-600 transition"
        >
          <FiTrash2 /> Delete
        </button>
      </div>,
      document.body
    );

  const handleDropdownClick = (e: React.MouseEvent<HTMLButtonElement>, blogId: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPos({ top: rect.bottom + window.scrollY, left: rect.right - 144 });
    setOpenDropdownId(openDropdownId === blogId ? null : blogId);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Blog Listing</h2>
        <button
          onClick={() => navigate(`/${role}/blogs/create`)}
          className="bg-gradient-to-r from-[#043f79] to-[#0a68c1] text-white px-5 py-2 rounded-lg shadow-lg hover:scale-105 transition flex items-center gap-2"
        >
          <FiPlus /> Add
        </button>
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full md:w-1/3 shadow-md focus:ring-2 focus:ring-indigo-500 outline-none transition"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-gradient-to-r from-[#043f79] to-[#0a68c1] text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium">#</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Title</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Category</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Image</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Publish Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Preview</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-6 text-gray-400">Loading...</td>
              </tr>
            ) : currentData.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-6 text-gray-400">No blogs found</td>
              </tr>
            ) : (
              currentData.map((blog, idx) => (
                <tr key={blog._id} className="hover:bg-indigo-50 transition-all duration-200 relative">
                  <td className="px-6 py-4">{indexOfFirst + idx + 1}</td>
                  <td className="px-6 py-4 font-semibold text-gray-700">{blog.name}</td>
                  <td className="px-6 py-4 text-gray-600">{blog.categoryName}</td>
                  <td className="px-6 py-4">
                    <img src={`http://localhost:5000/uploads/blog/${blog.image}`} alt={blog.name} className="w-12 h-12 rounded-full object-cover shadow-md hover:scale-110 transition-transform" />
                  </td>
                  <td className="px-6 py-4">{new Date(blog.publish_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => toggleStatus(blog._id, blog.is_active)}
                      className={`px-4 py-1 rounded-sm text-white text-sm transition transform hover:scale-105 ${blog.is_active === 1 ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 hover:bg-gray-500"}`}
                    >
                      {blog.is_active === 1 ? "Active" : "Deactive"}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => navigate(`/${role}/blogs/preview/${blog._id}`)}
                      className="px-4 py-1 rounded-sm text-white text-sm bg-blue-600 hover:bg-blue-700 transition transform hover:scale-105"
                    >
                      Preview
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center relative z-10">
                    <button onClick={e => handleDropdownClick(e, blog._id)} className="p-2 rounded-full hover:bg-gray-100 transition dropdown-trigger">
                      <FiMoreVertical size={18} />
                    </button>
                    {openDropdownId === blog._id && <Dropdown blogId={blog._id} top={dropdownPos.top} left={dropdownPos.left} />}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Modal */}
      {deleteModalId &&
        createPortal(
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Are you sure?</h3>
              <p className="mb-6 text-gray-600">You want to delete this blog?</p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setDeleteModalId(null)} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
                <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
