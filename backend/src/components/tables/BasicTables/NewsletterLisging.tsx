import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { FiMoreVertical, FiTrash2, FiPlus } from "react-icons/fi";

interface Newsletter {
  _id: string;
  name: string;
  email: string;
  createdAt: string; // use createdAt instead of publish_date
  is_deleted?: boolean;
}

export default function NewsletterListing() {
  const { role } = useParams<{ role: string }>();
  const [data, setData] = useState<Newsletter[]>([]);
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

  // Fetch newsletters
  const fetchData = async () => {
    if (!role) {
      toast.error("Role missing in URL");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/${role}/newsletters?search=${search}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const result = await res.json();
      const allData = result.newsletters?.filter((n: Newsletter) => !n.is_deleted) || [];
      setData(allData);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch newsletters");
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, role]);

  const currentData = data.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(data.length / entriesPerPage);

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

  // Delete newsletter
  const handleDelete = async () => {
    if (!deleteModalId || !role) return;
    try {
      const res = await fetch(`${API_BASE}/${role}/newsletter/${deleteModalId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Newsletter deleted successfully");
        fetchData();
        setDeleteModalId(null);
        setOpenDropdownId(null);
      } else {
        toast.error(data.message || "Failed to delete newsletter");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete newsletter");
    }
  };

  const handleDropdownClick = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPos({ top: rect.bottom + window.scrollY, left: rect.right - 144 });
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const Dropdown = ({ newsletterId }: { newsletterId: string }) =>
    createPortal(
      <div
        className="absolute bg-white border rounded-xl shadow-lg z-50 w-36 dropdown-menu animate-scaleIn"
        style={{ top: dropdownPos.top, left: dropdownPos.left }}
      >
        <button
          onClick={() => {
            setDeleteModalId(newsletterId);
            setOpenDropdownId(null);
          }}
          className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 w-full text-left text-red-600 transition"
        >
          <FiTrash2 /> Delete
        </button>
      </div>,
      document.body
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Newsletter Listing</h2>
        <button
          onClick={() => navigate(`/${role}/addnewsletter`)}
          className="bg-gradient-to-r from-[#043f79] to-[#0a68c1] text-white px-5 py-2 rounded-lg shadow-lg hover:scale-105 transition transform flex items-center gap-2"
        >
          <FiPlus /> Add Newsletter
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-gradient-to-r from-[#043f79] to-[#0a68c1] text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium first:rounded-tl-xl last:rounded-tr-xl">#</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Title</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Email</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Publish Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentData.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-400">
                  No newsletters found
                </td>
              </tr>
            )}
            {currentData.map((item, idx) => (
              <tr key={item._id} className="hover:bg-indigo-50 transition-all duration-200 relative">
                <td className="px-6 py-4">{indexOfFirst + idx + 1}</td>
                <td className="px-6 py-4 font-semibold text-gray-700">{item.name}</td>
                <td className="px-6 py-4 text-gray-600">{item.email}</td>
                <td className="px-6 py-4">{new Date(item.createdAt).toLocaleString()}</td>
                <td className="px-6 py-4 text-center relative">
                  <button
                    onClick={(e) => handleDropdownClick(e, item._id)}
                    className="p-2 rounded-full hover:bg-gray-100 transition dropdown-trigger"
                  >
                    <FiMoreVertical size={18} />
                  </button>
                  {openDropdownId === item._id && <Dropdown newsletterId={item._id} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
