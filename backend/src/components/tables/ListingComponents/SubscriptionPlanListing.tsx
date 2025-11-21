// SubscriptionListing.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiEdit, FiTrash2, FiMoreVertical, FiPlus } from "react-icons/fi";
import { createPortal } from "react-dom";
import { DataTable, TableColumn } from "../../PagesComponent/DataTable";
import { useCommonCrud } from "../../../hooks/useCommonCrud";

interface SubscriptionPlan {
  _id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: { value: number; unit: string };
  features: string[];
  is_active: boolean;
  is_deleted?: boolean;
  deleted_at?: string | null;
  created_at: string;
}

export default function SubscriptionListing() {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const pageFromUrl = Number(searchParams.get("page")) || 1;
  const limitFromUrl = Number(searchParams.get("limit")) || 10;

  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [recordsPerPage, setRecordsPerPage] = useState(limitFromUrl);
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);

  const { data, refetch, toggleStatus, deleteRecord, isLoading } = useCommonCrud({
    role,
    module: "subscription-plan",
    currentPage,
    recordsPerPage,
    searchValue,
    sortField,
    sortOrder,
  });

  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const totalRecords = data?.total || 0;
  const totalPages = Math.max(Math.ceil(totalRecords / recordsPerPage), 1);

  // Load active plans
  useEffect(() => {
    if (data?.plans || data?.items) {
      const activePlans = (data.plans || data.items).filter((p: any) => !p.is_deleted);
      setPlans(activePlans);
    }
  }, [data]);

  useEffect(() => {
    setSearchParams({
      page: String(currentPage),
      limit: String(recordsPerPage),
    });
  }, [currentPage, recordsPerPage]);

  // Refetch on search, sorting, pagination change
  useEffect(() => {
    const delay = setTimeout(() => refetch(), 400);
    return () => clearTimeout(delay);
  }, [searchValue, sortField, sortOrder, currentPage, recordsPerPage]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleDropdownClick = (e: React.MouseEvent<HTMLButtonElement>, planId: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPos({ top: rect.bottom + window.scrollY, left: rect.right - 144 });
    setOpenDropdownId((prev) => (prev === planId ? null : planId));
  };

  const handleToggleStatus = async (id: string) => {
    if (!role) return;
    try {
      const response = await toggleStatus(id);
      if (response?.success) {
        setPlans((prev) =>
          prev.map((p) => (p._id === id ? { ...p, is_active: !p.is_active } : p))
        );
        toast.success("Plan status updated");
      } else {
        toast.error(response?.message || "Failed to update status");
      }
    } catch (error: any) {
      toast.error(error?.message || "Error updating status");
    }
  };

  const handleDelete = async () => {
    if (!deleteModalId || !role) return;
    try {
      const response = await deleteRecord(deleteModalId);
      if (response?.success) {
        setPlans((prev) =>
          prev.map((p) =>
            p._id === deleteModalId
              ? { ...p, is_deleted: true, deleted_at: new Date().toISOString() }
              : p
          )
        );
        toast.success("Plan deleted successfully");
      } else {
        toast.error(response?.message || "Failed to delete plan");
      }
    } catch (error: any) {
      toast.error(error?.message || "Error deleting plan");
    } finally {
      setDeleteModalId(null);
      refetch();
    }
  };

  const Dropdown = ({ planId, top, left }: { planId: string; top: number; left: number }) =>
    createPortal(
      <div
        className="absolute bg-white border rounded-xl shadow-lg z-50"
        style={{ top, left, width: "9rem" }}
      >
        <button
          onClick={() => {
            navigate(`/${role}/subscriptionplan/edit/${planId}`);
            setOpenDropdownId(null);
          }}
          className="flex items-center gap-2 px-4 py-2 hover:bg-indigo-50 w-full text-left transition"
        >
          <FiEdit /> Edit
        </button>

        <button
          onClick={() => {
            setDeleteModalId(planId);
            setOpenDropdownId(null);
          }}
          className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 w-full text-left text-red-600 transition"
        >
          <FiTrash2 /> Delete
        </button>
      </div>,
      document.body
    );

  const columns: TableColumn<SubscriptionPlan>[] = [
    { key: "index", label: "#", render: (_row, idx) => (currentPage - 1) * recordsPerPage + idx + 1 },
    { key: "name", label: "Name", sortable: true },
    { key: "price", label: "Price", sortable: true, render: (row) => `${row.currency} ${row.price}` },
    {
      key: "duration",
      label: "Duration",
      sortable: true,
      render: (row) => {
        const { value, unit } = row.duration;
        const capitalizedUnit = unit.charAt(0).toUpperCase() + unit.slice(1).toLowerCase();
        const displayUnit = value === 1 ? capitalizedUnit.replace(/s$/i, "") : capitalizedUnit.endsWith("s") ? capitalizedUnit : capitalizedUnit + "s";
        return `${value} ${displayUnit}`;
      },
    },
    {
      key: "is_active",
      label: "Activation",
      render: (row) => (
        <button
          onClick={() => handleToggleStatus(row._id)}
          className={`px-4 py-1 min-w-[110px] rounded-md text-white text-sm font-medium transition-all duration-200 transform ${
            row.is_active ? "bg-green-600 hover:bg-green-700" : "bg-gray-500 hover:bg-gray-600"
          } hover:scale-105`}
        >
          {row.is_active ? "Deactivate" : "Activate"}
        </button>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <>
          <button
            onClick={(e) => handleDropdownClick(e, row._id)}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <FiMoreVertical size={18} />
          </button>
          {openDropdownId === row._id && <Dropdown planId={row._id} top={dropdownPos.top} left={dropdownPos.left} />}
        </>
      ),
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-4 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-gray-800">Subscription Plans</h2>
        <button
          onClick={() => navigate(`/${role}/subscriptionplan/create`)}
          className="bg-[#043f79] text-white px-3 py-2 rounded-md shadow-md hover:scale-105 transition flex items-center gap-2"
        >
          <FiPlus /> Add
        </button>
      </div>

      <DataTable
        columns={columns}
        data={plans}
        loading={isLoading}
        page={currentPage}
        totalPages={totalPages}
        totalRecords={totalRecords}
        recordsPerPage={recordsPerPage}
        onPageChange={setCurrentPage}
        onRecordsPerPageChange={setRecordsPerPage}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={handleSort}
      />

      {deleteModalId &&
        createPortal(
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[99999]">
            <div className="bg-white p-6 rounded-xl shadow-xl w-96">
              <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
              <p className="mb-6 text-gray-600">Are you sure you want to delete this plan?</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setDeleteModalId(null)}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
