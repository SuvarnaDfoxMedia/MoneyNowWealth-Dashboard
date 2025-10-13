import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { FiMoreVertical, FiTrash2, FiPlus } from "react-icons/fi";

interface Contact {
  _id: string;
  fullName: string;
  email: string;
  mobile?: string;
  subject: string;
  message: string;
  createdAt: string;
  is_deleted?: boolean;
}

export default function ContactEnquiryListing() {
  const [data, setData] = useState<Contact[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const entriesPerPage = 10;
  const navigate = useNavigate();
  const { role } = useParams<{ role: string }>(); // get role from URL
  const API_BASE = "http://localhost:5000/api";

  const indexOfLast = currentPage * entriesPerPage;
  const indexOfFirst = indexOfLast - entriesPerPage;

  const fetchData = async () => {
    if (!role) return;
    try {
      const res = await fetch(`${API_BASE}/${role}/contacts?search=${search}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (res.status === 401) {
        toast.error("Unauthorized. Please login as admin.");
        navigate("/login");
        return;
      }

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const result = await res.json();
      setData(result.contacts?.filter((c: Contact) => !c.is_deleted) || []);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch contacts");
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, role]);

  const currentData = data.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(data.length / entriesPerPage);

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

  const handleDelete = async () => {
    if (!deleteModalId || !role) return;
    try {
      const res = await fetch(`${API_BASE}/${role}/contact/${deleteModalId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const result = await res.json();

      if (res.status === 401) {
        toast.error("Unauthorized action. Please login.");
        navigate("/login");
        return;
      }

      if (res.ok) {
        toast.success(result.message || "Contact deleted successfully");
        setData((prev) => prev.filter((contact) => contact._id !== deleteModalId));
        setDeleteModalId(null);
        setOpenDropdownId(null);
      } else {
        toast.error(result.message || "Failed to delete contact");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete contact");
    }
  };

  const handleDropdownClick = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPos({ top: rect.bottom + window.scrollY, left: rect.right - 144 });
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const Dropdown = ({ contactId }: { contactId: string }) => {
    return createPortal(
      <div
        className="absolute bg-white border rounded-xl shadow-lg z-50 w-36 dropdown-menu animate-scaleIn"
        style={{ top: dropdownPos.top, left: dropdownPos.left }}
      >
        <button
          onClick={() => {
            setDeleteModalId(contactId);
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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Contact Enquiries</h2>
        <button
          onClick={() => navigate(`/${role}/addcontactenquiry`)} // navigate to add page with role
          className="bg-gradient-to-r from-[#043f79] to-[#0a68c1] text-white px-5 py-2 rounded-lg shadow-lg hover:scale-105 transition transform flex items-center gap-2"
        >
          <FiPlus /> Add Contact Enquiry
        </button>
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
        <input
          type="text"
          placeholder="Search by name, email, or subject..."
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
              <th className="px-6 py-3 text-left text-sm font-medium">#</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Full Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Email</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Mobile</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Subject</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Message</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentData.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-6 text-gray-400">
                  No contacts found
                </td>
              </tr>
            ) : (
              currentData.map((item, idx) => (
                <tr key={item._id} className="hover:bg-indigo-50 transition-all duration-200 relative">
                  <td className="px-6 py-4">{indexOfFirst + idx + 1}</td>
                  <td className="px-6 py-4 font-semibold text-gray-700">{item.fullName}</td>
                  <td className="px-6 py-4 text-gray-600">{item.email}</td>
                  <td className="px-6 py-4 text-gray-600">{item.mobile || "-"}</td>
                  <td className="px-6 py-4 text-gray-600">{item.subject}</td>
                  <td className="px-6 py-4 text-gray-600">{item.message}</td>
                  <td className="px-6 py-4">{new Date(item.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-4 text-center relative">
                    <button
                      onClick={(e) => handleDropdownClick(e, item._id)}
                      className="p-2 rounded-full hover:bg-gray-100 transition dropdown-trigger"
                    >
                      <FiMoreVertical size={18} />
                    </button>
                    {openDropdownId === item._id && <Dropdown contactId={item._id} />}
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
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50" onClick={() => setDeleteModalId(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-96 p-6 scale-95 animate-scaleIn" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">Are you sure you want to delete this contact?</h3>
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
