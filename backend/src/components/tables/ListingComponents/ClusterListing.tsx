


// "use client";

// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams, useSearchParams } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import {
//   FiEdit,
//   FiTrash2,
//   FiMoreVertical,
//   FiPlus,
//   FiImage,
// } from "react-icons/fi";
// import { createPortal } from "react-dom";
// import { DataTable, TableColumn } from "../../PagesComponent/DataTable";
// import { useCommonCrud } from "../../../hooks/useCommonCrud";
// import { useDataTableStore } from "../../../store/dataTableStore";
// import { axiosApi } from "../../../api/axios"; // <- use axiosApi

// interface Cluster {
//   _id: string;
//   title: string;
//   description?: string;
//   thumbnail?: string;
//   is_active: number;
// }

// export default function ClusterListing() {
//   const { role } = useParams<{ role: string }>();
//   const navigate = useNavigate();
//   const [searchParams, setSearchParams] = useSearchParams();

//   const {
//     page,
//     recordsPerPage,
//     searchValue,
//     sortField,
//     sortOrder,
//     setPage,
//     setRecordsPerPage,
//     setSearchValue,
//     setSort,
//   } = useDataTableStore();

//   /* ------------------- Restore URL → Zustand ------------------- */
//   useEffect(() => {
//     const urlPage = Number(searchParams.get("page")) || 1;
//     const urlLimit = Number(searchParams.get("limit")) || 10;
//     setPage(urlPage);
//     setRecordsPerPage(urlLimit);
//   }, []);

//   /* ------------------- Fetch Data (CRUD Hook) ------------------- */
//   const { data, extractList, refetch, deleteRecord, isLoading } =
//     useCommonCrud<Cluster>({
//       role,
//       module: "cluster",
//       page,
//       limit: recordsPerPage,
//       searchValue,
//       sortField,
//       sortOrder,
//     });

//   const [clusters, setClusters] = useState<Cluster[]>([]);

//   useEffect(() => {
//     setClusters(extractList);
//   }, [extractList]);

//   const totalRecords = data.total ?? 0;
//   const totalPages = Math.max(Math.ceil(totalRecords / recordsPerPage), 1);

//   /* ------------------- Sync Zustand → URL ------------------- */
//   useEffect(() => {
//     setSearchParams({
//       page: String(page),
//       limit: String(recordsPerPage),
//     });
//   }, [page, recordsPerPage]);

//   /* ------------------- Debounced Refetch ------------------- */
//   useEffect(() => {
//     const timer = setTimeout(() => refetch(), 300);
//     return () => clearTimeout(timer);
//   }, [searchValue, sortField, sortOrder, page]);

//   /* ------------------- Dropdown & Delete Modal ------------------- */
//   const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
//   const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
//   const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

//   const handleDropdownClick = (
//     e: React.MouseEvent<HTMLButtonElement>,
//     id: string
//   ) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     setDropdownPos({
//       top: rect.bottom + window.scrollY,
//       left: rect.right - 144,
//     });
//     setOpenDropdownId((prev) => (prev === id ? null : id));
//   };

//   /* ------------------- Toggle Status ------------------- */
//   const handleToggleStatus = async (id: string, currentStatus: number) => {
//     const newStatus = currentStatus === 1 ? 0 : 1;

//     // optimistic UI update
//     setClusters((prev) =>
//       prev.map((c) => (c._id === id ? { ...c, is_active: newStatus } : c))
//     );

//     try {
//       const res = await axiosApi.patch<{ success: boolean; message: string }>(
//         `/admin/cluster/change/${id}/status`,
//         { is_active: newStatus } // send new status in request body
//       );

//       if (res.success) {
//         toast.success(res.message || "Status updated");
//       } else {
//         throw new Error(res.message || "Failed to update status");
//       }
//     } catch (err: any) {
//       toast.error(err.message || "Failed to update status");

//       // revert on error
//       setClusters((prev) =>
//         prev.map((c) =>
//           c._id === id ? { ...c, is_active: currentStatus } : c
//         )
//       );
//     }
//   };

//   /* ------------------- Delete Record ------------------- */
//   const handleDelete = async () => {
//     if (!deleteModalId) return;

//     const res = await deleteRecord(deleteModalId);

//     if (res?.success) {
//       toast.success("Cluster deleted");
//       refetch();
//     }

//     setDeleteModalId(null);
//   };

//   /* ------------------- Dropdown Component ------------------- */
//   const Dropdown = ({
//     clusterId,
//     top,
//     left,
//   }: {
//     clusterId: string;
//     top: number;
//     left: number;
//   }) =>
//     createPortal(
//       <div
//         className="absolute bg-white border rounded-xl shadow-lg z-50"
//         style={{ top, left, width: "9rem" }}
//       >
//         <button
//           onClick={() => {
//             navigate(`/${role}/cluster/edit/${clusterId}`);
//             setOpenDropdownId(null);
//           }}
//           className="flex px-4 py-2 gap-2 w-full hover:bg-indigo-50"
//         >
//           <FiEdit /> Edit
//         </button>

//         <button
//           onClick={() => {
//             setDeleteModalId(clusterId);
//             setOpenDropdownId(null);
//           }}
//           className="flex px-4 py-2 gap-2 w-full text-red-600 hover:bg-red-50"
//         >
//           <FiTrash2 /> Delete
//         </button>
//       </div>,
//       document.body
//     );

//   const API_BASE = import.meta.env.VITE_API_BASE;

//   /* ------------------- Table Columns ------------------- */
//   const columns: TableColumn<Cluster>[] = [
//     {
//       key: "index",
//       label: "#",
//       render: (_row, idx) => (page - 1) * recordsPerPage + idx + 1,
//     },
//     {
//       key: "thumbnail",
//       label: "Thumbnail",
//       render: (row) => {
//         const imageUrl = row.thumbnail
//           ? row.thumbnail.startsWith("http")
//             ? row.thumbnail
//             : `${API_BASE.replace("/api", "")}/uploads/thumbnail/${row.thumbnail}`
//           : null;

//         return imageUrl ? (
//           <img
//             className="w-14 h-14 object-cover rounded-lg border"
//             src={imageUrl}
//           />
//         ) : (
//           <div className="w-14 h-14 bg-gray-100 flex items-center justify-center text-gray-400 border rounded-lg">
//             <FiImage size={20} />
//           </div>
//         );
//       },
//     },
//     { key: "title", label: "Title", sortable: true },

//     {
//       key: "description",
//       label: "Description",
//       render: (row) =>
//         row.description ? row.description.slice(0, 60) + "..." : "-",
//     },

//     {
//       key: "is_active",
//       label: "Status",
//       render: (row) => (
//         <button
//           onClick={() => handleToggleStatus(row._id, row.is_active)}
//           className={`px-3 py-1 rounded-sm text-sm text-white ${
//             row.is_active ? "bg-green-600" : "bg-gray-600"
//           }`}
//         >
//           {row.is_active ? "Active" : "Inactive"}
//         </button>
//       ),
//     },

//     {
//       key: "actions",
//       label: "Actions",
//       render: (row) => (
//         <>
//           <button
//             onClick={(e) => handleDropdownClick(e, row._id)}
//             className="p-2 hover:bg-gray-100 rounded-full"
//           >
//             <FiMoreVertical size={18} />
//           </button>

//           {openDropdownId === row._id && (
//             <Dropdown
//               clusterId={row._id}
//               top={dropdownPos.top}
//               left={dropdownPos.left}
//             />
//           )}
//         </>
//       ),
//     },
//   ];

//   return (
//     <div className="p-4 bg-gray-50 min-h-screen">
//       <div className="flex justify-between mb-6">
//         <h2 className="text-xl font-medium">Clusters</h2>

//         {(role === "admin" || role === "editor") && (
//           <button
//             onClick={() => navigate(`/${role}/cluster/create`)}
//             className="bg-[#043f79] text-white px-3 py-2 rounded-md shadow-md flex items-center gap-2"
//           >
//             <FiPlus /> Add
//           </button>
//         )}
//       </div>

//       <DataTable
//         columns={columns}
//         data={clusters}
//         page={page}
//         totalPages={totalPages}
//         totalRecords={totalRecords}
//         recordsPerPage={recordsPerPage}
//         onPageChange={setPage}
//         onRecordsPerPageChange={setRecordsPerPage}
//         searchValue={searchValue}
//         onSearchChange={setSearchValue}
//         sortField={sortField}
//         sortOrder={sortOrder}
//         onSortChange={(field, order) => setSort(field, order)}
//         loading={isLoading}
//       />

//       {/* Delete Modal */}
//       {deleteModalId &&
//         createPortal(
//           <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-[9999]">
//             <div className="bg-white p-6 rounded-xl shadow-xl w-80">
//               <h2 className="text-lg font-medium mb-4">Delete Cluster?</h2>
//               <p className="text-sm text-gray-600 mb-6">
//                 Are you sure you want to delete this cluster?
//               </p>

//               <div className="flex justify-end gap-3">
//                 <button
//                   onClick={() => setDeleteModalId(null)}
//                   className="px-4 py-2 rounded bg-gray-200"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   onClick={handleDelete}
//                   className="px-4 py-2 rounded bg-red-600 text-white"
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



"use client";

import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiEdit, FiTrash2, FiMoreVertical, FiPlus, FiImage } from "react-icons/fi";
import { createPortal } from "react-dom";
import { DataTable, TableColumn } from "../../PagesComponent/DataTable";
import { useCommonCrud } from "../../../hooks/useCommonCrud";
import { useDataTableStore } from "../../../store/dataTableStore";

interface Cluster {
  _id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  is_active: number;
}

export default function ClusterListing() {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { page, recordsPerPage, searchValue, sortField, sortOrder, setPage, setRecordsPerPage, setSearchValue, setSort } =
    useDataTableStore();

  /* ------------------- Restore URL → Zustand ------------------- */
  useEffect(() => {
    const urlPage = Number(searchParams.get("page")) || 1;
    const urlLimit = Number(searchParams.get("limit")) || 10;
    setPage(urlPage);
    setRecordsPerPage(urlLimit);
  }, []);

  /* ------------------- Fetch Data (CRUD Hook) ------------------- */
  const { data, extractList, refetch, deleteRecord, isLoading, toggleStatus } =
    useCommonCrud<Cluster>({
      role,
      module: "cluster",
      page,
      limit: recordsPerPage,
      searchValue,
      sortField,
      sortOrder,
    });

  const [clusters, setClusters] = useState<Cluster[]>([]);

  useEffect(() => {
    setClusters(extractList);
  }, [extractList]);

  const totalRecords = data.total ?? 0;
  const totalPages = Math.max(Math.ceil(totalRecords / recordsPerPage), 1);

  /* ------------------- Sync Zustand → URL ------------------- */
  useEffect(() => {
    setSearchParams({
      page: String(page),
      limit: String(recordsPerPage),
    });
  }, [page, recordsPerPage]);

  /* ------------------- Debounced Refetch ------------------- */
  useEffect(() => {
    const timer = setTimeout(() => refetch(), 300);
    return () => clearTimeout(timer);
  }, [searchValue, sortField, sortOrder, page]);

  /* ------------------- Dropdown & Delete Modal ------------------- */
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

  const handleDropdownClick = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + window.scrollY,
      left: rect.right - 144,
    });
    setOpenDropdownId((prev) => (prev === id ? null : id));
  };

  /* ------------------- Toggle Status ------------------- */
  const handleToggleStatus = async (id: string, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1;

    // Optimistic UI update
    setClusters((prev) =>
      prev.map((c) => (c._id === id ? { ...c, is_active: newStatus } : c))
    );

    try {
      await toggleStatus(id, newStatus === 1);
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");

      // revert on error
      setClusters((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, is_active: currentStatus } : c
        )
      );
    }
  };

  /* ------------------- Delete Record ------------------- */
  const handleDelete = async () => {
    if (!deleteModalId) return;

    const res = await deleteRecord(deleteModalId);

    if (res?.success) {
      toast.success("Cluster deleted");
      refetch();
    } else {
      toast.error(res?.message || "Delete failed");
    }

    setDeleteModalId(null);
  };

  /* ------------------- Dropdown Component ------------------- */
  const Dropdown = ({ clusterId, top, left }: { clusterId: string; top: number; left: number }) =>
    createPortal(
      <div className="absolute bg-white border rounded-xl shadow-lg z-50" style={{ top, left, width: "9rem" }}>
        <button
          onClick={() => {
            navigate(`/${role}/cluster/edit/${clusterId}`);
            setOpenDropdownId(null);
          }}
          className="flex px-4 py-2 gap-2 w-full hover:bg-indigo-50"
        >
          <FiEdit /> Edit
        </button>

        <button
          onClick={() => {
            setDeleteModalId(clusterId);
            setOpenDropdownId(null);
          }}
          className="flex px-4 py-2 gap-2 w-full text-red-600 hover:bg-red-50"
        >
          <FiTrash2 /> Delete
        </button>
      </div>,
      document.body
    );

  const API_BASE = import.meta.env.VITE_API_BASE;

  /* ------------------- Table Columns ------------------- */
  const columns: TableColumn<Cluster>[] = [
    { key: "index", label: "#", render: (_row, idx) => (page - 1) * recordsPerPage + idx + 1 },
    {
      key: "thumbnail",
      label: "Thumbnail",
      render: (row) => {
        const imageUrl = row.thumbnail
          ? row.thumbnail.startsWith("http")
            ? row.thumbnail
            : `${API_BASE.replace("/api", "")}/uploads/thumbnail/${row.thumbnail}`
          : null;

        return imageUrl ? (
          <img className="w-14 h-14 object-cover rounded-lg border" src={imageUrl} />
        ) : (
          <div className="w-14 h-14 bg-gray-100 flex items-center justify-center text-gray-400 border rounded-lg">
            <FiImage size={20} />
          </div>
        );
      },
    },
    { key: "title", label: "Title", sortable: true },
    { key: "description", label: "Description", render: (row) => row.description ? row.description.slice(0, 60) + "..." : "-" },
    {
      key: "is_active",
      label: "Status",
      render: (row) => (
        <button
          onClick={() => handleToggleStatus(row._id, row.is_active)}
          className={`px-3 py-1 rounded-sm text-sm text-white ${row.is_active ? "bg-green-600" : "bg-gray-600"}`}
        >
          {row.is_active ? "Active" : "Inactive"}
        </button>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <>
          <button onClick={(e) => handleDropdownClick(e, row._id)} className="p-2 hover:bg-gray-100 rounded-full">
            <FiMoreVertical size={18} />
          </button>

          {openDropdownId === row._id && <Dropdown clusterId={row._id} top={dropdownPos.top} left={dropdownPos.left} />}
        </>
      ),
    },
  ];

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-medium">Clusters</h2>

        {(role === "admin" || role === "editor") && (
          <button
            onClick={() => navigate(`/${role}/cluster/create`)}
            className="bg-[#043f79] text-white px-3 py-2 rounded-md shadow-md flex items-center gap-2"
          >
            <FiPlus /> Add
          </button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={clusters}
        page={page}
        totalPages={totalPages}
        totalRecords={totalRecords}
        recordsPerPage={recordsPerPage}
        onPageChange={setPage}
        onRecordsPerPageChange={setRecordsPerPage}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        sortField={sortField}
        sortOrder={sortOrder}
        onSortChange={(field, order) => setSort(field, order)}
        loading={isLoading}
      />

      {/* Delete Modal */}
      {deleteModalId &&
        createPortal(
          <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-[9999]">
            <div className="bg-white p-6 rounded-xl shadow-xl w-80">
              <h2 className="text-lg font-medium mb-4">Delete Cluster?</h2>
              <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this cluster?</p>

              <div className="flex justify-end gap-3">
                <button onClick={() => setDeleteModalId(null)} className="px-4 py-2 rounded bg-gray-200">
                  Cancel
                </button>

                <button onClick={handleDelete} className="px-4 py-2 rounded bg-red-600 text-white">
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
