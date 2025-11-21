// import React, { useState, useEffect } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import { FiEdit, FiTrash2, FiMoreVertical, FiPlus,  FiEye, } from "react-icons/fi";
// import { createPortal } from "react-dom";
// import { DataTable, TableColumn } from "../../PagesComponent/DataTable";
// import { useCommonCrud } from "../../../hooks/useCommonCrud";

// interface CmsPage {
//   _id: string;
//   page_code: string;
//   title: string;
//   status: "draft" | "published" | "archived";
//   is_active: number;
// }

// export default function CmsPageListing() {
//   const navigate = useNavigate();
//   const [searchParams, setSearchParams] = useSearchParams();

//   const pageFromUrl = Number(searchParams.get("page")) || 1;
//   const limitFromUrl = Number(searchParams.get("limit")) || 10;

//   const [searchValue, setSearchValue] = useState("");
//   const [currentPage, setCurrentPage] = useState(pageFromUrl);
//   const [recordsPerPage, setRecordsPerPage] = useState(limitFromUrl);
//   const [sortField, setSortField] = useState("title");
//   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
//   const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
//   const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
//   const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
//   const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

//   const { data, isLoading, refetch, toggleStatus, deleteRecord } = useCommonCrud({
//     module: "cmspages",
//     role: "admin",
//     currentPage,
//     recordsPerPage,
//     searchValue,
//     sortField,
//     sortOrder,
//     includeInactive: true,
//   });

//   const [pages, setPages] = useState<CmsPage[]>([]);
//   const totalRecords = data?.total || 0;
//   const totalPages = Math.max(Math.ceil(totalRecords / recordsPerPage), 1);

//   useEffect(() => {
//     if (data?.pages) {
//       const filtered = data.pages
//         .filter((page: CmsPage) => page.status !== "archived")
//         .filter((page) =>
//           statusFilter === "all"
//             ? true
//             : statusFilter === "active"
//             ? page.is_active === 1
//             : page.is_active === 0
//         );
//       setPages(filtered);
//     }
//   }, [data, statusFilter]);

//   useEffect(() => {
//     setSearchParams({ page: String(currentPage), limit: String(recordsPerPage) });
//   }, [currentPage, recordsPerPage]);

//   useEffect(() => {
//     const timer = setTimeout(() => refetch(), 400);
//     return () => clearTimeout(timer);
//   }, [searchValue]);

//   const handleSort = (field: string) => {
//     if (sortField === field) setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
//     else setSortField(field);
//   };

//   const handleDropdownClick = (e: React.MouseEvent<HTMLButtonElement>, pageId: string) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     setDropdownPos({ top: rect.bottom + window.scrollY, left: rect.right - 144 });
//     setOpenDropdownId(openDropdownId === pageId ? null : pageId);
//   };

//   const handleToggleStatus = async (id: string) => {
//     try {
//       const res = await toggleStatus(id);
//       if (res?.success) {
//         setPages((prev) =>
//           prev.map((p) => (p._id === id ? { ...p, is_active: p.is_active === 1 ? 0 : 1 } : p))
//         );
//         toast.success("Status updated successfully");
//       } else {
//         toast.error(res?.message || "Failed to update status");
//       }
//     } catch {
//       toast.error("Error updating status");
//     }
//   };

//   const handleDelete = async () => {
//     if (!deleteModalId) return;
//     try {
//       const res = await deleteRecord(deleteModalId);
//       if (res?.success) {
//         setPages((prev) => prev.filter((p) => p._id !== deleteModalId));
//         toast.success("Page deleted successfully");
//       } else {
//         toast.error(res?.message || "Failed to delete page");
//       }
//     } catch {
//       toast.error("Error deleting page");
//     } finally {
//       setDeleteModalId(null);
//       refetch();
//     }
//   };

//   const Dropdown = ({ pageId, top, left }: { pageId: string; top: number; left: number }) =>
//     createPortal(
//       <div
//         className="absolute bg-white border rounded-xl shadow-lg z-50"
//         style={{ top, left, width: "9rem" }}
//       >

//          <button
//                   onClick={() => {
//                     navigate(`/admin/cmspages/view/${pageId}`);
//                     setOpenDropdownId(null);
//                   }}
//                   className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 w-full text-left transition"
//                 >
//                   <FiEye /> View
//                 </button>

//         {/* Edit */}
//         <button
//           onClick={() => {
//             navigate(`/admin/cmspages/edit/${pageId}`);
//             setOpenDropdownId(null);
//           }}
//           className="flex items-center gap-2 px-4 py-2 hover:bg-indigo-50 w-full text-left transition"
//         >
//           <FiEdit /> Edit
//         </button>

//         {/* Delete */}
//         <button
//           onClick={() => {
//             setDeleteModalId(pageId);
//             setOpenDropdownId(null);
//           }}
//           className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 w-full text-left text-red-600 transition"
//         >
//           <FiTrash2 /> Delete
//         </button>
//       </div>,
//       document.body
//     );

//   const columns: TableColumn<CmsPage>[] = [
//     {
//       key: "index",
//       label: "#",
//       render: (_row, idx) => (currentPage - 1) * recordsPerPage + idx + 1,
//     },
//     { key: "title", label: "Title", sortable: true, render: (row) => row.title },
//     {
//       key: "is_active",
//       label: "Status",
//       render: (row) => (
//         <span
//           onClick={() => handleToggleStatus(row._id)}
//           className={`cursor-pointer px-4 py-1 rounded-sm text-white text-sm ${
//             row.is_active === 1 ? "bg-green-600" : "bg-gray-500"
//           }`}
//         >
//           {row.is_active === 1 ? "Active" : "Inactive"}
//         </span>
//       ),
//     },
//     {
//       key: "actions",
//       label: "Actions",
//       render: (row) => (
//         <>
//           <button
//             onClick={(e) => handleDropdownClick(e, row._id)}
//             className="p-2 rounded-full hover:bg-gray-100 transition"
//           >
//             <FiMoreVertical size={18} />
//           </button>
//           {openDropdownId === row._id && (
//             <Dropdown pageId={row._id} top={dropdownPos.top} left={dropdownPos.left} />
//           )}
//         </>
//       ),
//     },
//   ];

//   return (
//     <div className="bg-gray-50 min-h-screen p-4 relative">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-xl font-medium text-gray-800">CMS Pages</h2>
//         <div className="flex items-center gap-4">
//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value as any)}
//             className="border px-2 py-1 rounded-md"
//           >
//             <option value="all">All</option>
//             <option value="active">Active</option>
//             <option value="inactive">Inactive</option>
//           </select>
//           <button
//             onClick={() => navigate(`/admin/cmspages/create`)}
//             className="bg-[#043f79] text-white px-3 py-2 rounded-md shadow-md hover:scale-105 transition flex items-center gap-2"
//           >
//             <FiPlus /> Add
//           </button>
//         </div>
//       </div>

//       <DataTable
//         columns={columns}
//         data={pages}
//         loading={isLoading}
//         page={currentPage}
//         totalPages={totalPages}
//         totalRecords={totalRecords}
//         recordsPerPage={recordsPerPage}
//         onPageChange={setCurrentPage}
//         onRecordsPerPageChange={setRecordsPerPage}
//         searchValue={searchValue}
//         onSearchChange={setSearchValue}
//         sortField={sortField}
//         sortOrder={sortOrder}
//         onSort={handleSort}
//       />

//       {deleteModalId &&
//         createPortal(
//           <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[99999]">
//             <div className="bg-white p-6 rounded-xl shadow-xl w-96">
//               <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
//               <p className="mb-6 text-gray-600">Are you sure you want to delete this page?</p>
//               <div className="flex justify-end gap-4">
//                 <button
//                   onClick={() => setDeleteModalId(null)}
//                   className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleDelete}
//                   className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </div>,
//           document.body
//         )}
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiEdit, FiTrash2, FiMoreVertical, FiPlus, FiEye } from "react-icons/fi";
import { createPortal } from "react-dom";
import { DataTable, TableColumn } from "../../PagesComponent/DataTable";
import { useCommonCrud } from "../../../hooks/useCommonCrud";

interface CmsPage {
  _id: string;
  page_code: string;
  title: string;
  status: "draft" | "published" | "archived";
  is_active: number;
}

export default function CmsPageListing() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const pageFromUrl = Number(searchParams.get("page")) || 1;
  const limitFromUrl = Number(searchParams.get("limit")) || 10;

  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [recordsPerPage, setRecordsPerPage] = useState(limitFromUrl);
  const [sortField, setSortField] = useState("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

  const { data, isLoading, refetch, toggleStatus, deleteRecord } = useCommonCrud({
    module: "cmspages",
    role: "admin",
    currentPage,
    recordsPerPage,
    searchValue,
    sortField,
    sortOrder,
    includeInactive: true,
  });

  const [pages, setPages] = useState<CmsPage[]>([]);
  const totalRecords = data?.total || 0;
  const totalPages = Math.max(Math.ceil(totalRecords / recordsPerPage), 1);

  useEffect(() => {
    if (data?.pages) {
      const filtered = data.pages.filter((page: CmsPage) => page.status !== "archived");
      setPages(filtered);
    }
  }, [data]);

  useEffect(() => {
    setSearchParams({ page: String(currentPage), limit: String(recordsPerPage) });
  }, [currentPage, recordsPerPage]);

  useEffect(() => {
    const timer = setTimeout(() => refetch(), 400);
    return () => clearTimeout(timer);
  }, [searchValue]);

  const handleSort = (field: string) => {
    if (sortField === field) setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    else setSortField(field);
  };

  const handleDropdownClick = (e: React.MouseEvent<HTMLButtonElement>, pageId: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPos({ top: rect.bottom + window.scrollY, left: rect.right - 144 });
    setOpenDropdownId(openDropdownId === pageId ? null : pageId);
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const res = await toggleStatus(id);
      if (res?.success) {
        setPages((prev) =>
          prev.map((p) => (p._id === id ? { ...p, is_active: p.is_active === 1 ? 0 : 1 } : p))
        );
        toast.success("Status updated successfully");
      } else {
        toast.error(res?.message || "Failed to update status");
      }
    } catch {
      toast.error("Error updating status");
    }
  };

  const handleDelete = async () => {
    if (!deleteModalId) return;
    try {
      const res = await deleteRecord(deleteModalId);
      if (res?.success) {
        setPages((prev) => prev.filter((p) => p._id !== deleteModalId));
        toast.success("Page deleted successfully");
      } else {
        toast.error(res?.message || "Failed to delete page");
      }
    } catch {
      toast.error("Error deleting page");
    } finally {
      setDeleteModalId(null);
      refetch();
    }
  };

  const Dropdown = ({ pageId, top, left }: { pageId: string; top: number; left: number }) =>
    createPortal(
      <div
        className="absolute bg-white border rounded-xl shadow-lg z-50"
        style={{ top, left, width: "9rem" }}
      >
        <button
          onClick={() => {
            navigate(`/admin/cmspages/view/${pageId}`);
            setOpenDropdownId(null);
          }}
          className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 w-full text-left transition"
        >
          <FiEye /> View
        </button>

        <button
          onClick={() => {
            navigate(`/admin/cmspages/edit/${pageId}`);
            setOpenDropdownId(null);
          }}
          className="flex items-center gap-2 px-4 py-2 hover:bg-indigo-50 w-full text-left transition"
        >
          <FiEdit /> Edit
        </button>

        <button
          onClick={() => {
            setDeleteModalId(pageId);
            setOpenDropdownId(null);
          }}
          className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 w-full text-left text-red-600 transition"
        >
          <FiTrash2 /> Delete
        </button>
      </div>,
      document.body
    );

  const columns: TableColumn<CmsPage>[] = [
    {
      key: "index",
      label: "#",
      render: (_row, idx) => (currentPage - 1) * recordsPerPage + idx + 1,
    },
    { key: "title", label: "Title", sortable: true, render: (row) => row.title },
    {
      key: "is_active",
      label: "Status",
      render: (row) => (
        <span
          onClick={() => handleToggleStatus(row._id)}
          className={`cursor-pointer px-4 py-1 rounded-sm text-white text-sm ${
            row.is_active === 1 ? "bg-green-600" : "bg-gray-500"
          }`}
        >
          {row.is_active === 1 ? "Active" : "Inactive"}
        </span>
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
          {openDropdownId === row._id && (
            <Dropdown pageId={row._id} top={dropdownPos.top} left={dropdownPos.left} />
          )}
        </>
      ),
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-4 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-gray-800">CMS Pages</h2>

        <button
          onClick={() => navigate(`/admin/cmspages/create`)}
          className="bg-[#043f79] text-white px-3 py-2 rounded-md shadow-md hover:scale-105 transition flex items-center gap-2"
        >
          <FiPlus /> Add
        </button>
      </div>

      <DataTable
        columns={columns}
        data={pages}
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
              <p className="mb-6 text-gray-600">Are you sure you want to delete this page?</p>
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

