import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiEdit, FiTrash2, FiMoreVertical, FiEye } from "react-icons/fi";
import { createPortal } from "react-dom";
import { DataTable, TableColumn } from "../../PagesComponent/DataTable";
import { useCommonCrud } from "../../../hooks/useCommonCrud";

interface UserSubscription {
  _id: string;
  user_id: { _id: string; firstname: string; lastname: string };
  plan_id: { _id: string; name: string };
  start_date: string;
  end_date: string;
  status: string;
  is_deleted?: boolean;
  created_at: string;
}

export default function UserSubscriptionListing() {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const pageFromUrl = Number(searchParams.get("page")) || 1;
  const limitFromUrl = Number(searchParams.get("limit")) || 10;

  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [recordsPerPage, setRecordsPerPage] = useState(limitFromUrl);
  const [sortField, setSortField] = useState("start_date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);

  const { data, refetch, deleteRecord, isLoading } = useCommonCrud({
    role,
    module: "subscriptions",
    currentPage,
    recordsPerPage,
    searchValue,
    sortField,
    sortOrder,
    endpoints: {
      list: `/api/admin/subscriptions`,
      getById: (id: string) => `/api/admin/subscriptions/${id}`,
      create: `/api/admin/subscriptions/create`,
      update: (id: string) => `/api/admin/subscriptions/${id}`,
      delete: (id: string) => `/api/admin/subscriptions/delete/${id}`,
    },
  });

  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const totalRecords = data?.total || 0;
  const totalPages = Math.max(Math.ceil(totalRecords / recordsPerPage), 1);

  // ------------------- Normalize Data -------------------
  useEffect(() => {
    if (data?.subscriptions) {
      const normalized = data.subscriptions
        .map((item: any) => {
          const user = item.user;
          const sub = item.subscription;

          return {
            _id: sub?._id || "N/A",
            user_id: {
              _id: user?._id || "N/A",
              firstname: user?.firstname || "N/A",
              lastname: user?.lastname || "",
            },
            plan_id: {
              _id: sub?.plan_id?._id || "N/A",
              name: sub?.plan_id?.name || "N/A",
            },
            start_date: sub?.start_date || null,
            end_date: sub?.end_date || null,
            status: sub?.status || item.status || "new",
            is_deleted: sub?.is_deleted || false,
            created_at: sub?.created_at || "",
          };
        })
        .filter((item: any) => !item.is_deleted);

      setSubscriptions(normalized);
    }
  }, [data]);

  // URL SYNC
  useEffect(() => {
    setSearchParams({
      page: String(currentPage),
      limit: String(recordsPerPage),
    });
  }, [currentPage, recordsPerPage]);

  useEffect(() => {
    const delay = setTimeout(() => refetch(), 400);
    return () => clearTimeout(delay);
  }, [searchValue, sortField, sortOrder, currentPage, recordsPerPage]);

  // ------------------- Sorting -------------------
  const handleSort = (field: string) => {
    if (sortField === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // ------------------- Dropdown -------------------
  const handleDropdownClick = (e: any, id: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPos({ top: rect.bottom + window.scrollY, left: rect.right - 144 });
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const handleDelete = async () => {
    if (!deleteModalId) return;
    try {
      await deleteRecord(deleteModalId);
      setSubscriptions((prev) =>
        prev.map((s) => (s._id === deleteModalId ? { ...s, is_deleted: true } : s))
      );
      toast.success("Subscription deleted");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDeleteModalId(null);
      refetch();
    }
  };

  const Dropdown = ({ id, top, left }: any) =>
    createPortal(
      <div className="absolute bg-white border rounded-xl shadow-lg z-50" style={{ top, left, width: "12rem" }}>
        <button
          onClick={() => {
            navigate(`/${role}/user-subscription/edit/${id}`);
            setOpenDropdownId(null);
          }}
          className="flex items-center gap-2 px-4 py-2 hover:bg-indigo-50 w-full"
        >
          <FiEdit /> Edit
        </button>

        <button
          onClick={() => {
            navigate(`/user/invoice/${id}`);
            setOpenDropdownId(null);
          }}
          className="flex items-center gap-2 px-4 py-2 hover:bg-indigo-50 w-full"
        >
          <FiEye /> View Invoice
        </button>

        <button
  onClick={() => {
    navigate(`/${role}/user/customer-history/${id}`);
    setOpenDropdownId(null);
  }}
  className="flex items-center gap-2 px-4 py-2 hover:bg-indigo-50 w-full"
>
  <FiEye />Payment History
</button>


        <button
          onClick={() => {
            setDeleteModalId(id);
            setOpenDropdownId(null);
          }}
          className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-red-600 w-full"
        >
          <FiTrash2 /> Delete
        </button>
      </div>,
      document.body
    );

  // ------------------- Status Badge -------------------
  const getStatusBadge = (status: string) => {
    const map: any = {
      new: "bg-blue-100 text-blue-700",
      upgrade: "bg-green-100 text-green-700",
      downgrade: "bg-red-100 text-red-700",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${map[status] || map.new}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  // ------------------- Compute Duration -------------------
  const getDuration = (start: string, end: string) => {
    if (!start || !end) return "N/A";
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= 365) return `${Math.floor(diffDays / 365)} year`;
    if (diffDays >= 30) return `${Math.floor(diffDays / 30)} month`;
    return `${diffDays} day`;
  };

  // ------------------- Table Columns -------------------
  const columns: TableColumn<UserSubscription>[] = [
    {
      key: "index",
      label: "#",
      render: (_, idx) => (currentPage - 1) * recordsPerPage + idx + 1,
    },
    {
      key: "user",
      label: "User",
      render: (row) =>
        `${row.user_id.firstname} ${row.user_id.lastname}`.trim() || "N/A",
    },
    {
      key: "plan",
      label: "Plan",
      render: (row) => row.plan_id.name || "N/A",
    },
    {
      key: "duration",
      label: "Duration",
      render: (row) => getDuration(row.start_date, row.end_date),
    },
    {
      key: "start_date",
      label: "Start Date",
      sortable: true,
      render: (row) =>
        row.start_date ? new Date(row.start_date).toLocaleDateString() : "N/A",
    },
    {
      key: "end_date",
      label: "End Date",
      sortable: true,
      render: (row) =>
        row.end_date ? new Date(row.end_date).toLocaleDateString() : "N/A",
    },
    {
      key: "status",
      label: "Status",
      render: (row) => getStatusBadge(row.status),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <>
          <button
            onClick={(e) => handleDropdownClick(e, row._id)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <FiMoreVertical size={18} />
          </button>

          {openDropdownId === row._id && (
            <Dropdown id={row._id} top={dropdownPos.top} left={dropdownPos.left} />
          )}
        </>
      ),
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-4 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-gray-800">User Subscriptions</h2>
      </div>

      <DataTable
        columns={columns}
        data={subscriptions.filter((s) => !s.is_deleted)}
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
              <p className="mb-6 text-gray-600">Are you sure you want to delete this subscription?</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setDeleteModalId(null)}
                  className="px-4 py-2 rounded-lg border hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
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
