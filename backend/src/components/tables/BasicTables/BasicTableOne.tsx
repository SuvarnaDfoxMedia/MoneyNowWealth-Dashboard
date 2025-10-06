import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FiMoreVertical, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";

interface Blog {
  _id: string;
  name: string;
  image: string;
  publish_date: string;
  is_active: number;
}

export default function BlogDataTable() {
  const [data, setData] = useState<Blog[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const entriesPerPage = 10;
  const navigate = useNavigate();
  const API_BASE = "http://localhost:5000/api";

  const indexOfLast = currentPage * entriesPerPage;
  const indexOfFirst = indexOfLast - entriesPerPage;

  // Fetch blogs securely with cookies
  const fetchData = async () => {
    try {
      const res = await fetch(`${API_BASE}/blogs?query=${encodeURIComponent(search)}`, {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // SEND COOKIES with request
      });

      if (res.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const result = await res.json();
      const allBlogs = Array.isArray(result) ? result : result.blogs || [];
      setData(allBlogs);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch blogs");
    }
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  const currentData = data.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(data.length / entriesPerPage);

  // Toggle blog status securely with cookie auth
  const toggleStatus = async (id: string, currentStatus: number) => {
    try {
      const res = await fetch(`${API_BASE}/blog/status/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // SEND COOKIES
        body: JSON.stringify({ status: currentStatus === 1 ? 0 : 1 }),
      });

      if (res.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      if (!res.ok) throw new Error("Failed to update status");

      const updated = await res.json();
      setData((prev) =>
        prev.map((blog) => (blog._id === id ? { ...blog, is_active: updated.blog.is_active } : blog))
      );
      toast.success("Status updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  // Delete blog securely with cookie auth
  const handleDelete = async () => {
    if (!deleteModalId) return;
    try {
      const res = await fetch(`${API_BASE}/blog/${deleteModalId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // SEND COOKIES
      });

      if (res.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      if (!res.ok) throw new Error("Failed to delete blog");

      setData((prev) => prev.filter((blog) => blog._id !== deleteModalId));
      toast.success("Blog deleted successfully");
      setDeleteModalId(null);
      setOpenDropdownId(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete blog");
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".dropdown-trigger") && !target.closest(".dropdown-menu")) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Dropdown portal for Edit/Delete buttons
  const Dropdown = ({ blogId, top, left }: { blogId: string; top: number; left: number }) => {
    return createPortal(
      <div
        className="absolute bg-white border rounded-xl shadow-lg z-50 animate-scaleIn dropdown-menu"
        style={{ top, left, width: "9rem" }}
      >
        {/* <button
          onClick={() => {
            navigate(`/blog/edit/${blogId}`); 
            setOpenDropdownId(null);
          }}
          className="flex items-center gap-2 px-4 py-2 hover:bg-indigo-50 w-full text-left transition"
        >
          <FiEdit /> Edit
        </button> */}


        <button
  onClick={() => {
    navigate(`/blogs/edit/${blogId}`);
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
  };

  const handleDropdownClick = (e: React.MouseEvent<HTMLButtonElement>, blogId: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPos({ top: rect.bottom + window.scrollY, left: rect.right - 144 });
    setOpenDropdownId(openDropdownId === blogId ? null : blogId);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Blog Listing</h2>
        <button
          onClick={() => navigate("/addblog")}
          className="bg-gradient-to-r from-[#043f79] to-[#0a68c1] text-white px-5 py-2 rounded-lg shadow-lg hover:scale-105 transition transform flex items-center gap-2"
        >
          <FiPlus /> Add Blog
        </button>
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full md:w-1/3 shadow-md focus:ring-2 focus:ring-indigo-500 outline-none transition"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-gradient-to-r from-[#043f79] to-[#0a68c1] text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium first:rounded-tl-xl last:rounded-tr-xl">#</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Title</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Image</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Publish Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentData.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-400">
                  No blogs found
                </td>
              </tr>
            )}
            {currentData.map((blog, idx) => (
              <tr key={blog._id} className="hover:bg-indigo-50 transition-all duration-200 relative">
                <td className="px-6 py-4">{indexOfFirst + idx + 1}</td>
                <td className="px-6 py-4 font-semibold text-gray-700">{blog.name}</td>
                <td className="px-6 py-4">
                  <img
                    src={`http://localhost:5000/uploads/blog/${blog.image}`}
                    alt={blog.name}
                    className="w-12 h-12 rounded-full object-cover shadow-md hover:scale-110 transition-transform"
                  />
                </td>
                <td className="px-6 py-4">{new Date(blog.publish_date).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => toggleStatus(blog._id, blog.is_active)}
                    className={`px-4 py-1 rounded-sm text-white text-sm transition transform hover:scale-105 ${
                      blog.is_active === 1 ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 hover:bg-gray-500"
                    }`}
                  >
                    {blog.is_active === 1 ? "Active" : "Deactive"}
                  </button>
                </td>
                <td className="px-6 py-4 text-center relative z-10">
                  <button
                    onClick={(e) => handleDropdownClick(e, blog._id)}
                    className="p-2 rounded-full hover:bg-gray-100 transition dropdown-trigger"
                  >
                    <FiMoreVertical size={18} />
                  </button>
                  {openDropdownId === blog._id && (
                    <Dropdown blogId={blog._id} top={dropdownPos.top} left={dropdownPos.left} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 flex-col md:flex-row gap-2 md:gap-0">
        <p className="text-gray-600 text-sm">
          Showing {currentData.length ? indexOfFirst + 1 : 0} to {indexOfFirst + currentData.length} of {data.length} entries
        </p>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-lg disabled:opacity-50 bg-gradient-to-r from-[#043f79] to-[#0a68c1] text-white hover:opacity-90 transition"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded-lg border transition ${
                currentPage === i + 1
                  ? "bg-gradient-to-r from-[#043f79] to-[#0a68c1] text-white border-transparent"
                  : "border-gray-300 hover:bg-gradient-to-r hover:from-[#043f79] hover:to-[#0a68c1] hover:text-white"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1 rounded-lg disabled:opacity-50 bg-gradient-to-r from-[#043f79] to-[#0a68c1] text-white hover:opacity-90 transition"
          >
            Next
          </button>
        </div>
      </div>

      {/* Delete Modal */}
      {deleteModalId && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
          onClick={() => setDeleteModalId(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-96 p-6 scale-95 animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Are you sure you want to delete this blog?</h3>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteModalId(null)}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
              >
                No
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scaleIn {
          0% { transform: scale(0.95); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
