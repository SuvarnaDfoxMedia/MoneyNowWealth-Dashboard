import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { FiMoreVertical, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";

interface Category {
  _id: string;
  name: string;
  image: string;
  is_active: number;
}

export default function BlogCategoryListing() {
  const [data, setData] = useState<Category[]>([]);
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

  // Fetch categories
  const fetchData = async () => {
    try {
      const res = await fetch(`${API_BASE}/categories?query=${encodeURIComponent(search)}`, {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const result = await res.json();
      setData(result.categories || []);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  const currentData = data.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(data.length / entriesPerPage);

  // Toggle status (using update endpoint)
  const toggleStatus = async (id: string, currentStatus: number) => {
    try {
      const res = await fetch(`${API_BASE}/${role}/blogcategory/${id}`, {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify({ is_active: currentStatus === 1 ? 0 : 1 }),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to update status");
      const updated = await res.json();
      setData(prev =>
        prev.map(cat => (cat._id === id ? { ...cat, is_active: updated.category.is_active } : cat))
      );
      toast.success("Status updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  // Delete category
  const handleDelete = async () => {
    if (!deleteModalId) return;
    try {
      const res = await fetch(`${API_BASE}/${role}/blogcategory/${deleteModalId}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to delete category");
      setData(prev => prev.filter(cat => cat._id !== deleteModalId));
      toast.success("Category deleted successfully");
      setDeleteModalId(null);
      setOpenDropdownId(null);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to delete category");
    }
  };

  // Close dropdown on click outside
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

  const Dropdown = ({ categoryId, top, left }: { categoryId: string; top: number; left: number }) => {
    return createPortal(
      <div
        className="absolute bg-white border rounded-xl shadow-lg z-50 animate-scaleIn dropdown-menu"
        style={{ top, left, width: "9rem" }}
      >
        <button
          onClick={() => {
            navigate(`/${role}/blogcategories/edit/${categoryId}`);
            setOpenDropdownId(null);
          }}
          className="flex items-center gap-2 px-4 py-2 hover:bg-indigo-50 w-full text-left transition"
        >
          <FiEdit /> Edit
        </button>
        <button
          onClick={() => {
            setDeleteModalId(categoryId);
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

  const handleDropdownClick = (e: React.MouseEvent<HTMLButtonElement>, categoryId: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPos({ top: rect.bottom + window.scrollY, left: rect.right - 144 });
    setOpenDropdownId(openDropdownId === categoryId ? null : categoryId);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Blog Categories</h2>
        <button
          onClick={() => navigate(`/${role}/blogcategories/create`)}
          className="bg-gradient-to-r from-[#043f79] to-[#0a68c1] text-white px-5 py-2 rounded-lg shadow-lg hover:scale-105 transition transform flex items-center gap-2"
        >
          <FiPlus /> Add
        </button>
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
        <input
          type="text"
          placeholder="Search by name..."
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
              <th className="px-6 py-3 text-left text-sm font-medium first:rounded-tl-xl last:rounded-tr-xl">#</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Image</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentData.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-400">
                  No categories found
                </td>
              </tr>
            ) : (
              currentData.map((cat, idx) => (
                <tr key={cat._id} className="hover:bg-indigo-50 transition-all duration-200 relative">
                  <td className="px-6 py-4">{indexOfFirst + idx + 1}</td>
                  <td className="px-6 py-4 font-semibold text-gray-700">{cat.name}</td>
                  <td className="px-6 py-4">
                    {cat.image && (
                      <img
                        src={`http://localhost:5000/uploads/category/${cat.image}`}
                        alt={cat.name}
                        className="w-12 h-12 rounded-full object-cover shadow-md hover:scale-110 transition-transform"
                      />
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => toggleStatus(cat._id, cat.is_active)}
                      className={`px-4 py-1 rounded-sm text-white text-sm transition transform hover:scale-105 ${
                        cat.is_active === 1 ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 hover:bg-gray-500"
                      }`}
                    >
                      {cat.is_active === 1 ? "Active" : "Deactive"}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center relative z-10">
                    <button
                      onClick={e => handleDropdownClick(e, cat._id)}
                      className="p-2 rounded-full hover:bg-gray-100 transition dropdown-trigger"
                    >
                      <FiMoreVertical size={18} />
                    </button>
                    {openDropdownId === cat._id && (
                      <Dropdown categoryId={cat._id} top={dropdownPos.top} left={dropdownPos.left} />
                    )}
                  </td>
                </tr>
              ))
            )}
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
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
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
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
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
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Are you sure you want to delete this category?</h3>
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
