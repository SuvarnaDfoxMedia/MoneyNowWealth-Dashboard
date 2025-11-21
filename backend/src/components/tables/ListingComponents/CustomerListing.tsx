import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiTrash2, FiMoreVertical } from "react-icons/fi";
import { createPortal } from "react-dom";
import { DataTable, TableColumn } from "../../PagesComponent/DataTable";
import { axiosApi } from "../../../api/axios";

interface User {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  created_at: string;
}

export default function CustomerListing() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const pageFromUrl = Number(searchParams.get("page")) || 1;
  const limitFromUrl = Number(searchParams.get("limit")) || 10;

  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [recordsPerPage, setRecordsPerPage] = useState(limitFromUrl);
  const [sortField, setSortField] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [users, setUsers] = useState<User[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const totalPages = Math.max(Math.ceil(totalRecords / recordsPerPage), 1);

  const [isLoading, setIsLoading] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);

  const role = "admin"; // change this if dynamic roles are needed

  // ----------------------------
  // FETCH USERS
  // ----------------------------
  const fetchUsers = async () => {
    try {
      setIsLoading(true);

      const params: any = {
        page: currentPage,
        limit: recordsPerPage,
        search: searchValue,
        sortField,
        sortOrder,
        includeInactive: true,
      };

      const res = await axiosApi.getList(`/auth/users`, params);

      if (res.success) {
        setUsers(res?.users || []);
        setTotalRecords(res?.total || 0);
      } else {
        toast.error(res.message || "Failed to load users");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, recordsPerPage, searchValue, sortField, sortOrder]);

  useEffect(() => {
    setSearchParams({
      page: String(currentPage),
      limit: String(recordsPerPage),
    });
  }, [currentPage, recordsPerPage]);

  // ----------------------------
  // SORT HANDLER
  // ----------------------------
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // ----------------------------
  // OPEN DROPDOWN
  // ----------------------------
  const handleDropdownClick = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + window.scrollY,
      left: rect.right - 144,
    });
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  // ----------------------------
  // DELETE USER
  // ----------------------------
  const handleDelete = async () => {
    if (!deleteModalId) return;

    try {
      // ✅ Include role in delete URL to match backend route
      const res = await axiosApi.remove(`/auth/${role}/users/delete/${deleteModalId}`);

      if (res.success) {
        setUsers((prev) => prev.filter((u) => u._id !== deleteModalId));
        toast.success("User deleted successfully");
      } else {
        toast.error(res.message || "Failed to delete user");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDeleteModalId(null);
      setOpenDropdownId(null);
      fetchUsers();
    }
  };

  const Dropdown = ({ id, top, left }: { id: string; top: number; left: number }) =>
    createPortal(
      <div className="absolute bg-white border rounded-xl shadow-lg z-50" style={{ top, left, width: "8rem" }}>
        <button
          onClick={() => {
            setDeleteModalId(id);
            setOpenDropdownId(null);
          }}
          className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 w-full text-left text-red-600 transition"
        >
          <FiTrash2 /> Delete
        </button>
      </div>,
      document.body
    );

  // ----------------------------
  // TABLE COLUMNS
  // ----------------------------
  const columns: TableColumn<User>[] = [
    {
      key: "index",
      label: "#",
      render: (_row, idx) => (currentPage - 1) * recordsPerPage + idx + 1,
    },
    {
      key: "firstname",
      label: "Name",
      sortable: true,
      render: (r) => `${r.firstname} ${r.lastname}`,
    },
    { key: "email", label: "Email", sortable: true, render: (r) => r.email },
    { key: "mobile", label: "Mobile", render: (r) => r.mobile },
    {
      key: "created_at",
      label: "Register Date",
      sortable: true,
      render: (r) => new Date(r.created_at).toLocaleString(),
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

          {openDropdownId === row._id && <Dropdown id={row._id} top={dropdownPos.top} left={dropdownPos.left} />}
        </>
      ),
    },
  ];

  // ----------------------------
  // RENDER UI
  // ----------------------------
  return (
    <div className="bg-gray-50 min-h-screen p-4 relative">
      <h2 className="text-xl font-medium text-gray-800 mb-6">Customer List</h2>

      <DataTable
        columns={columns}
        data={users}
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

      {/* Delete Modal */}
      {deleteModalId &&
        createPortal(
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[99999]">
            <div className="bg-white p-6 rounded-xl shadow-xl w-96">
              <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
              <p className="mb-6 text-gray-600">Are you sure you want to delete this user?</p>

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
