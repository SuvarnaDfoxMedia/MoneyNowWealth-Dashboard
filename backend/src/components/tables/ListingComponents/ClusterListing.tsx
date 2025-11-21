

// import React, { useState, useEffect } from "react";
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

// interface Cluster {
//   _id: string;
//   title: string;
//   description?: string;
//   thumbnail?: string;
//   is_active: number;
//   status?: string;
// }

// export default function ClusterListing() {
//   const { role } = useParams<{ role: string }>();
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

//   const { data, refetch, toggleStatus, deleteRecord } = useCommonCrud({
//     role,
//     module: "cluster",
//     currentPage,
//     recordsPerPage,
//     searchValue,
//     sortField,
//     sortOrder,
//   });

//   const [clusters, setClusters] = useState<Cluster[]>([]);
//   const totalRecords = data?.total || 0;
//   const totalPages = Math.max(Math.ceil(totalRecords / recordsPerPage), 1);

//   useEffect(() => {
//     if (data?.items || data?.clusters) {
//       const filtered = (data.items || data.clusters).filter(
//         (item: Cluster) => item.status !== "archived"
//       );
//       setClusters(filtered);
//     }
//   }, [data]);

//   useEffect(() => {
//     setSearchParams({
//       page: String(currentPage),
//       limit: String(recordsPerPage),
//     });
//   }, [currentPage, recordsPerPage]);

//   useEffect(() => {
//     const timer = setTimeout(() => refetch(), 400);
//     return () => clearTimeout(timer);
//   }, [searchValue]);

//   const handleSort = (field: string) => {
//     if (sortField === field)
//       setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
//     else setSortField(field);
//   };

//   const handleDropdownClick = (
//     e: React.MouseEvent<HTMLButtonElement>,
//     clusterId: string
//   ) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     setDropdownPos({
//       top: rect.bottom + window.scrollY,
//       left: rect.right - 144,
//     });
//     setOpenDropdownId(openDropdownId === clusterId ? null : clusterId);
//   };

//   const handleToggleStatus = async (id: string) => {
//     try {
//       const response = await toggleStatus(id);
//       if (response?.success) {
//         setClusters((prev) =>
//           prev.map((item) =>
//             item._id === id
//               ? { ...item, is_active: item.is_active === 1 ? 0 : 1 }
//               : item
//           )
//         );
//         toast.success("Status updated successfully");
//       } else {
//         toast.error(response?.message || "Failed to update status");
//       }
//     } catch (err: any) {
//       toast.error(err?.message || "Error while updating status");
//     }
//   };

//   const handleDelete = async () => {
//     if (!deleteModalId) return;
//     try {
//       const response = await deleteRecord(deleteModalId);
//       if (response?.success) {
//         toast.success("Cluster deleted successfully");
//         setClusters((prev) =>
//           prev.filter((item) => item._id !== deleteModalId)
//         );
//       } else {
//         toast.error(response?.message || "Failed to delete cluster");
//       }
//     } catch (err: any) {
//       toast.error(err?.message || "Error while deleting cluster");
//     } finally {
//       setDeleteModalId(null);
//       refetch();
//     }
//   };

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
//           className="flex items-center gap-2 px-4 py-2 hover:bg-indigo-50 w-full text-left transition"
//         >
//           <FiEdit /> Edit
//         </button>
//         <button
//           onClick={() => {
//             setDeleteModalId(clusterId);
//             setOpenDropdownId(null);
//           }}
//           className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 w-full text-left text-red-600 transition"
//         >
//           <FiTrash2 /> Delete
//         </button>
//       </div>,
//       document.body
//     );

//   const API_BASE = import.meta.env.VITE_API_BASE;

//   const truncateText = (text: string, maxLength: number) => {
//     if (!text) return "-";
//     return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
//   };

//   const columns: TableColumn<Cluster>[] = [
//     {
//       key: "index",
//       label: "#",
//       render: (_row, idx) => (currentPage - 1) * recordsPerPage + idx + 1,
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
//             src={imageUrl}
//             alt={row.title || "Cluster Thumbnail"}
//             className="w-14 h-14 rounded-lg object-cover border"
//             onError={(e) => {
//               e.currentTarget.style.display = "none";
//             }}
//           />
//         ) : (
//           <div className="w-14 h-14 rounded-lg bg-gray-100 border flex items-center justify-center text-gray-400">
//             <FiImage size={20} />
//           </div>
//         );
//       },
//     },
//     {
//       key: "title",
//       label: "Title",
//       sortable: true,
//       render: (row) => row.title,
//     },
//     {
//       key: "description",
//       label: "Description",
//       render: (row) => truncateText(row.description || "", 50),
//     },
//     {
//       key: "is_active",
//       label: "Status",
//       render: (row) => (
//         <button
//           onClick={() => handleToggleStatus(row._id)}
//           className={`px-4 py-1 min-w-[90px] rounded-sm text-white text-sm font-medium transition-all duration-200 transform ${
//             row.is_active === 1
//               ? "bg-green-600 hover:bg-green-700"
//               : "bg-gray-500 hover:bg-gray-600"
//           } hover:scale-105`}
//         >
//           {row.is_active === 1 ? "Active" : "Inactive"}
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
//             className="p-2 rounded-full hover:bg-gray-100 transition"
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
//     <div className="bg-gray-50 min-h-screen p-4 relative">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-xl font-medium text-gray-800">Clusters</h2>
//         {(role === "admin" || role === "editor") && (
//           <button
//             onClick={() => navigate(`/${role}/cluster/create`)}
//             className="bg-[#043f79] text-white px-3 py-2 rounded-md shadow-md hover:scale-105 transition flex items-center gap-2"
//           >
//             <FiPlus /> Add
//           </button>
//         )}
//       </div>

//       <DataTable
//         columns={columns}
//         data={clusters}
//         loading={false}
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
//               <p className="mb-6 text-gray-600">
//                 Are you sure you want to delete this cluster?
//               </p>
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
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiEdit, FiTrash2, FiMoreVertical, FiPlus, FiImage } from "react-icons/fi";
import { createPortal } from "react-dom";
import { DataTable, TableColumn } from "../../PagesComponent/DataTable";
import { useCommonCrud } from "../../../hooks/useCommonCrud";

interface Cluster {
  _id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  is_active: number;
  status?: string;
}

export default function ClusterListing() {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Pagination & search state
  const pageFromUrl = Number(searchParams.get("page")) || 1;
  const limitFromUrl = Number(searchParams.get("limit")) || 10;
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [recordsPerPage, setRecordsPerPage] = useState(limitFromUrl);
  const [sortField, setSortField] = useState("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // UI states
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

  // Fetch clusters via custom hook
  const { data, refetch, toggleStatus, deleteRecord } = useCommonCrud({
    role,
    module: "cluster",
    currentPage,
    recordsPerPage,
    searchValue,
    sortField,
    sortOrder,
  });

  const [clusters, setClusters] = useState<Cluster[]>([]);
  const totalRecords = data?.total || 0;
  const totalPages = Math.max(Math.ceil(totalRecords / recordsPerPage), 1);

  // Update clusters when data changes
  useEffect(() => {
    if (data?.items || data?.clusters) {
      const filtered = (data.items || data.clusters).filter(
        (item: Cluster) => item.status !== "archived"
      );
      setClusters(filtered);
    }
  }, [data]);

  // Sync URL params
  useEffect(() => {
    setSearchParams({
      page: String(currentPage),
      limit: String(recordsPerPage),
    });
  }, [currentPage, recordsPerPage]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => refetch(), 400);
    return () => clearTimeout(timer);
  }, [searchValue]);

  // Handle sort change
  const handleSort = (field: string, order: "asc" | "desc") => {
    setSortField(field);
    setSortOrder(order);
  };

  // Handle records per page change
  const handleRecordsPerPageChange = (value: number) => {
    setRecordsPerPage(value);
    setCurrentPage(1); // reset page to 1 whenever recordsPerPage changes
  };

  // Dropdown menu position
  const handleDropdownClick = (e: React.MouseEvent<HTMLButtonElement>, clusterId: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPos({ top: rect.bottom + window.scrollY, left: rect.right - 144 });
    setOpenDropdownId(openDropdownId === clusterId ? null : clusterId);
  };

  // Toggle cluster status
  const handleToggleStatus = async (id: string) => {
    try {
      const response = await toggleStatus(id);
      if (response?.success) {
        setClusters((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, is_active: item.is_active === 1 ? 0 : 1 } : item
          )
        );
        toast.success("Status updated successfully");
      } else {
        toast.error(response?.message || "Failed to update status");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error while updating status");
    }
  };

  // Delete cluster
  const handleDelete = async () => {
    if (!deleteModalId) return;
    try {
      const response = await deleteRecord(deleteModalId);
      if (response?.success) {
        toast.success("Cluster deleted successfully");
        setClusters((prev) => prev.filter((item) => item._id !== deleteModalId));
      } else {
        toast.error(response?.message || "Failed to delete cluster");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error while deleting cluster");
    } finally {
      setDeleteModalId(null);
      refetch();
    }
  };

  // Dropdown component
  const Dropdown = ({ clusterId, top, left }: { clusterId: string; top: number; left: number }) =>
    createPortal(
      <div
        className="absolute bg-white border rounded-xl shadow-lg z-50"
        style={{ top, left, width: "9rem" }}
      >
        <button
          onClick={() => {
            navigate(`/${role}/cluster/edit/${clusterId}`);
            setOpenDropdownId(null);
          }}
          className="flex items-center gap-2 px-4 py-2 hover:bg-indigo-50 w-full text-left transition"
        >
          <FiEdit /> Edit
        </button>
        <button
          onClick={() => {
            setDeleteModalId(clusterId);
            setOpenDropdownId(null);
          }}
          className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 w-full text-left text-red-600 transition"
        >
          <FiTrash2 /> Delete
        </button>
      </div>,
      document.body
    );

  const API_BASE = import.meta.env.VITE_API_BASE;

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "-";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  // Table columns
  const columns: TableColumn<Cluster>[] = [
    {
      key: "index",
      label: "#",
      render: (_row, idx) => (currentPage - 1) * recordsPerPage + idx + 1,
    },
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
          <img
            src={imageUrl}
            alt={row.title || "Cluster Thumbnail"}
            className="w-14 h-14 rounded-lg object-cover border"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="w-14 h-14 rounded-lg bg-gray-100 border flex items-center justify-center text-gray-400">
            <FiImage size={20} />
          </div>
        );
      },
    },
    { key: "title", label: "Title", sortable: true, render: (row) => row.title },
    { key: "description", label: "Description", render: (row) => truncateText(row.description || "", 50) },
    {
      key: "is_active",
      label: "Status",
      render: (row) => (
        <button
          onClick={() => handleToggleStatus(row._id)}
          className={`px-4 py-1 min-w-[90px] rounded-sm text-white text-sm font-medium transition-all duration-200 transform ${
            row.is_active === 1 ? "bg-green-600 hover:bg-green-700" : "bg-gray-500 hover:bg-gray-600"
          } hover:scale-105`}
        >
          {row.is_active === 1 ? "Active" : "Inactive"}
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
          {openDropdownId === row._id && <Dropdown clusterId={row._id} top={dropdownPos.top} left={dropdownPos.left} />}
        </>
      ),
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-4 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-gray-800">Clusters</h2>
        {(role === "admin" || role === "editor") && (
          <button
            onClick={() => navigate(`/${role}/cluster/create`)}
            className="bg-[#043f79] text-white px-3 py-2 rounded-md shadow-md hover:scale-105 transition flex items-center gap-2"
          >
            <FiPlus /> Add
          </button>
        )}
      </div>

      {/* Server-side DataTable */}
      <DataTable
        columns={columns}
        data={clusters}
        loading={false}
        page={currentPage}
        totalPages={totalPages}
        totalRecords={totalRecords}
        recordsPerPage={recordsPerPage}
        onPageChange={setCurrentPage}
        onRecordsPerPageChange={handleRecordsPerPageChange} // updated here
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        sortField={sortField}
        sortOrder={sortOrder}
        onSortChange={handleSort}
      />

      {/* Delete Confirmation Modal */}
      {deleteModalId &&
        createPortal(
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[99999]">
            <div className="bg-white p-6 rounded-xl shadow-xl w-96">
              <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
              <p className="mb-6 text-gray-600">Are you sure you want to delete this cluster?</p>
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
