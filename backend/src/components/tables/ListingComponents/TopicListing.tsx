// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams, useSearchParams } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import { FiEdit, FiTrash2, FiMoreVertical, FiPlus } from "react-icons/fi";
// import { DataTable, TableColumn } from "../../PagesComponent/DataTable";
// import { useCommonCrud } from "../../../hooks/useCommonCrud";
// import { useDataTableStore } from "../../../store/dataTableStore";

// interface Topic {
//   _id: string;
//   cluster_id?: { _id: string; cluster_code?: string; title?: string } | string;
//   title: string;
//   slug: string;
//   status: "draft" | "published" | "archived";
//   is_active: number;
//   access_type?: "free" | "premium";
//   publish_date?: string;
// }

// export default function TopicListing() {
//   const { role } = useParams<{ role: string }>();
//   const navigate = useNavigate();
//   const [searchParams, setSearchParams] = useSearchParams();

//   // Zustand store for table state
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

//   const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
//   const [deleteModalId, setDeleteModalId] = useState<string | null>(null);

//   const { data, refetch, toggleStatus, deleteRecord, isLoading } = useCommonCrud({
//     role,
//     module: "topic",
//     currentPage: page,
//     recordsPerPage,
//     searchValue,
//     sortField,
//     sortOrder,
//   });

//   const [topics, setTopics] = useState<Topic[]>([]);
//   const totalRecords = data?.total || 0;
//   const totalPages = Math.max(Math.ceil(totalRecords / recordsPerPage), 1);

//   // Sync page from URL on mount
//   useEffect(() => {
//     const urlPage = Number(searchParams.get("page")) || 1;
//     if (urlPage !== page) setPage(urlPage);
//   }, [searchParams]);

//   // Update topics whenever data changes
//   useEffect(() => {
//     if (data?.topics) {
//       const normalized: Topic[] = data.topics.map((t: Topic) => ({
//         ...t,
//         status: t.status === "live" ? "published" : t.status,
//       }));
//       setTopics(normalized);
//     }
//   }, [data]);

//   // Refetch whenever table state changes
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       refetch();
//       setSearchParams({ page: page.toString(), limit: recordsPerPage.toString() }, { replace: true });
//     }, 300);
//     return () => clearTimeout(timer);
//   }, [page, recordsPerPage, searchValue, sortField, sortOrder]);

//   // Close dropdowns on outside click
//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (!(e.target as HTMLElement).closest(".dropdown")) {
//         setOpenDropdownId(null);
//       }
//     };
//     window.addEventListener("click", handleClickOutside);
//     return () => window.removeEventListener("click", handleClickOutside);
//   }, []);

//   // Handle sorting
//   const handleSort = (field: string) => {
//     if (sortField === field) {
//       setSort(field, sortOrder === "asc" ? "desc" : "asc");
//     } else {
//       setSort(field, "asc");
//     }
//   };

//   // Toggle status
//   const handleToggleStatus = async (id: string) => {
//     setTopics((prev) =>
//       prev.map((t) => (t._id === id ? { ...t, is_active: t.is_active === 1 ? 0 : 1 } : t))
//     );

//     try {
//       const response = await toggleStatus(id);
//       if (response?.success && response.data?.is_active !== undefined) {
//         setTopics((prev) =>
//           prev.map((t) => (t._id === id ? { ...t, is_active: response.data.is_active } : t))
//         );
//         toast.success("Visibility updated successfully");
//       }
//     } catch {
//       toast.error("Error updating visibility");
//     }
//   };

//   // Delete topic
//   const handleDelete = async () => {
//     if (!deleteModalId) return;

//     try {
//       const response = await deleteRecord(deleteModalId);
//       if (response.success) {
//         toast.success("Topic deleted successfully");

//         const remaining = totalRecords - 1;
//         const newTotalPages = Math.max(Math.ceil(remaining / recordsPerPage), 1);

//         if (page > newTotalPages) setPage(newTotalPages);
//         else refetch();
//       } else {
//         toast.error(response.message || "Failed to delete topic");
//       }
//     } catch {
//       toast.error("Error deleting topic");
//     } finally {
//       setDeleteModalId(null);
//     }
//   };

//   // Render status badge
//   const renderStatusBadge = (status: Topic["status"]) => {
//     const colors = {
//       published: "text-green-600",
//       draft: "text-yellow-600",
//       archived: "text-gray-600",
//     };
//     return (
//       <span className={`text-sm font-semibold ${colors[status] ?? "text-gray-600"}`}>
//         {status.charAt(0).toUpperCase() + status.slice(1)}
//       </span>
//     );
//   };

//   // Table columns
//   const columns: TableColumn<Topic>[] = [
//     {
//       key: "index",
//       label: "#",
//       render: (_row, idx) => (page - 1) * recordsPerPage + idx + 1,
//     },
//     {
//       key: "title",
//       label: "Title",
//       sortable: true,
//       render: (row) => {
//         const title = row.title || "";
//         const truncatedTitle = title.length > 35 ? title.substring(0, 35) + "..." : title;
//         return <span title={row.title}>{truncatedTitle}</span>;
//       },
//     },
//     {
//       key: "cluster_id",
//       label: "Cluster",
//       sortable: true,
//       render: (row) =>
//         typeof row.cluster_id === "string" || !row.cluster_id
//           ? "-"
//           : row.cluster_id?.title || "-",
//     },
//     {
//       key: "status",
//       label: "Publish Status",
//       sortable: true,
//       render: (row) => renderStatusBadge(row.status),
//     },
//     {
//       key: "publish_date",
//       label: "Publish Date",
//       sortable: true,
//       render: (row) =>
//         row.publish_date
//           ? new Date(row.publish_date).toLocaleDateString("en-IN", {
//               year: "numeric",
//               month: "short",
//               day: "numeric",
//             })
//           : "-",
//     },
//     {
//       key: "access_type",
//       label: "Topic Type",
//       sortable: true,
//       render: (row) => (
//         <span
//           className={`text-sm font-medium ${
//             row.access_type === "premium"
//               ? "text-purple-600"
//               : row.access_type === "free"
//               ? "text-gray-700"
//               : "text-gray-400"
//           }`}
//         >
//           {row.access_type?.charAt(0).toUpperCase() + row.access_type?.slice(1) || "-"}
//         </span>
//       ),
//     },
//     {
//       key: "is_active",
//       label: "Visibility Status",
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
//         <div className="relative">
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               setOpenDropdownId(openDropdownId === row._id ? null : row._id);
//             }}
//             className="p-2 rounded-full hover:bg-gray-100 transition"
//           >
//             <FiMoreVertical size={18} />
//           </button>

//           {openDropdownId === row._id && (
//             <div className="absolute top-full right-0 mt-2 bg-white border rounded-xl shadow-lg w-36 dropdown z-50">
//               <button
//                 onClick={() => {
//                   navigate(`/${role}/topic/edit/${row._id}?page=${page}`);
//                   setOpenDropdownId(null);
//                 }}
//                 className="flex items-center gap-2 px-4 py-2 hover:bg-indigo-50 w-full text-left transition text-base"
//               >
//                 <FiEdit /> Edit
//               </button>
//               <button
//                 onClick={() => {
//                   setDeleteModalId(row._id);
//                   setOpenDropdownId(null);
//                 }}
//                 className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 w-full text-left text-red-600 transition text-base"
//               >
//                 <FiTrash2 /> Delete
//               </button>
//             </div>
//           )}
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="bg-gray-50 min-h-screen p-4 relative">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-xl font-medium text-gray-800">Topics</h2>
//         {(role === "admin" || role === "editor") && (
//           <button
//             onClick={() => navigate(`/${role}/topic/create?page=${page}`)}
//             className="bg-[#043f79] text-white px-3 py-2 rounded-md shadow-md hover:scale-105 transition flex items-center gap-2"
//           >
//             <FiPlus /> Add
//           </button>
//         )}
//       </div>

//       <DataTable
//         columns={columns}
//         data={topics}
//         loading={isLoading}
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
//         onSortChange={handleSort}
//         saveState={true}
//       />

//       {/* Delete Modal */}
//       {deleteModalId && (
//         <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[99999]">
//           <div className="bg-white p-6 rounded-xl shadow-xl w-96">
//             <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
//             <p className="mb-6 text-gray-600">Are you sure you want to delete this topic?</p>
//             <div className="flex justify-end gap-4">
//               <button
//                 onClick={() => setDeleteModalId(null)}
//                 className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDelete}
//                 className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



// import  { useEffect, useState } from "react";
// import { useNavigate, useParams, useSearchParams } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import { FiEdit, FiTrash2, FiMoreVertical, FiPlus } from "react-icons/fi";
// import { DataTable, TableColumn } from "../../PagesComponent/DataTable";
// import { useCommonCrud } from "../../../hooks/useCommonCrud";
// import { useDataTableStore } from "../../../store/dataTableStore";

// interface Topic {
//   _id: string;
//   cluster_id?: { _id: string; cluster_code?: string; title?: string } | string;
//   title: string;
//   slug: string;
//   status: "draft" | "published" | "archived";
//   is_active: number;
//   access_type?: "free" | "premium";
//   publish_date?: string;
// }

// export default function TopicListing() {
//   const { role } = useParams<{ role: string }>();
//   const navigate = useNavigate();
//   const [searchParams, setSearchParams] = useSearchParams();

//   // Zustand table state
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

//   const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
//   const [deleteModalId, setDeleteModalId] = useState<string | null>(null);

//   // Fetching API
//   const { data, refetch, toggleStatus, deleteRecord, isLoading } =
//     useCommonCrud({
//       role,
//       module: "topic",
//       page,
//       limit: recordsPerPage,
//       searchValue,
//       sortField,
//       sortOrder,
//     });

//   const [topics, setTopics] = useState<Topic[]>([]);
//   const totalRecords = data?.total || 0;
//   const totalPages = Math.max(Math.ceil(totalRecords / recordsPerPage), 1);

//   // ⭐ Load page from URL ONLY once (Prevents loops)
//   useEffect(() => {
//     const urlPage = Number(searchParams.get("page"));
//     if (urlPage && urlPage !== page) {
//       setPage(urlPage);
//     }
//   }, []);

//   // ⭐ Update topics when data changes
//   useEffect(() => {
//     if (data?.topics) {
//       const normalized = data.topics.map((t: Topic) => ({
//         ...t,
//         status: t.status === "live" ? "published" : t.status,
//       }));
//       setTopics(normalized);
//     }
//   }, [data]);

//   // ⭐ Auto refetch on ANY table change
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       refetch();
//     }, 300);
//     return () => clearTimeout(timer);
//   }, [page, recordsPerPage, searchValue, sortField, sortOrder]);

//   // ⭐ Sync URL ONLY when page or limit changes
//   useEffect(() => {
//     setSearchParams(
//       {
//         page: page.toString(),
//         limit: recordsPerPage.toString(),
//       },
//       { replace: true }
//     );
//   }, [page, recordsPerPage]);

//   // ⭐ Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (!(e.target as HTMLElement).closest(".dropdown")) {
//         setOpenDropdownId(null);
//       }
//     };
//     window.addEventListener("click", handleClickOutside);
//     return () => window.removeEventListener("click", handleClickOutside);
//   }, []);

//   // Sorting handler
//   const handleSort = (field: string) => {
//     if (sortField === field) {
//       setSort(field, sortOrder === "asc" ? "desc" : "asc");
//     } else {
//       setSort(field, "asc");
//     }
//   };

//   // Toggle Active/Inactive
//   const handleToggleStatus = async (id: string) => {
//     setTopics((prev) =>
//       prev.map((t) =>
//         t._id === id ? { ...t, is_active: t.is_active ? 0 : 1 } : t
//       )
//     );

//     try {
//       const response = await toggleStatus(id);
//       if (response?.success && response.data) {
//         toast.success("Visibility updated");
//       }
//     } catch {
//       toast.error("Error updating visibility");
//     }
//   };

//   // Delete Topic
//   const handleDelete = async () => {
//     if (!deleteModalId) return;

//     try {
//       const response = await deleteRecord(deleteModalId);
//       if (response.success) {
//         toast.success("Topic deleted");
//         const remaining = totalRecords - 1;
//         const newTotalPages = Math.max(
//           Math.ceil(remaining / recordsPerPage),
//           1
//         );
//         if (page > newTotalPages) setPage(newTotalPages);
//         else refetch();
//       }
//     } catch {
//       toast.error("Error deleting");
//     } finally {
//       setDeleteModalId(null);
//     }
//   };

//   // Status badge
//   const renderStatusBadge = (status: Topic["status"]) => {
//     const map = {
//       published: "text-green-600",
//       draft: "text-yellow-600",
//       archived: "text-gray-600",
//     };
//     return (
//       <span className={`text-sm font-semibold ${map[status]}`}>
//         {status[0].toUpperCase() + status.slice(1)}
//       </span>
//     );
//   };

//   // ⭐ Table Columns
//   const columns: TableColumn<Topic>[] = [
//     {
//       key: "index",
//       label: "#",
//       render: (_row, idx) => (page - 1) * recordsPerPage + idx + 1,
//     },
//     {
//       key: "title",
//       label: "Title",
//       sortable: true,
//       render: (row) => {
//         const title = row.title;
//         const truncated =
//           title.length > 35 ? title.substring(0, 35) + "..." : title;
//         return <span title={title}>{truncated}</span>;
//       },
//     },
//     {
//       key: "cluster_id",
//       label: "Cluster",
//       sortable: true,
//       render: (row) =>
//         typeof row.cluster_id === "string"
//           ? "-"
//           : row.cluster_id?.title || "-",
//     },
//     {
//       key: "status",
//       label: "Publish Status",
//       sortable: true,
//       render: (row) => renderStatusBadge(row.status),
//     },
//     {
//       key: "publish_date",
//       label: "Publish Date",
//       sortable: true,
//       render: (row) =>
//         row.publish_date
//           ? new Date(row.publish_date).toLocaleDateString("en-IN", {
//               year: "numeric",
//               month: "short",
//               day: "numeric",
//             })
//           : "-",
//     },
//     {
//       key: "access_type",
//       label: "Topic Type",
//       sortable: true,
//       render: (row) =>
//         row.access_type ? (
//           <span
//             className={`text-sm font-medium ${
//               row.access_type === "premium"
//                 ? "text-purple-600"
//                 : "text-gray-700"
//             }`}
//           >
//             {row.access_type[0].toUpperCase() +
//               row.access_type.slice(1)}
//           </span>
//         ) : (
//           "-"
//         ),
//     },
//     {
//       key: "is_active",
//       label: "Visibility",
//       render: (row) => (
//         <button
//           onClick={() => handleToggleStatus(row._id)}
//           className={`px-4 py-1 min-w-[90px] rounded-sm text-white text-sm font-medium transition-all ${
//             row.is_active
//               ? "bg-green-600"
//               : "bg-gray-500"
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
//         <div className="relative dropdown">
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               setOpenDropdownId(
//                 openDropdownId === row._id ? null : row._id
//               );
//             }}
//             className="p-2 rounded-full hover:bg-gray-100"
//           >
//             <FiMoreVertical size={18} />
//           </button>

//           {openDropdownId === row._id && (
//             <div className="absolute top-full right-0 mt-2 bg-white border rounded-xl shadow-lg w-36 z-50">
//               <button
//                 onClick={() =>
//                   navigate(`/${role}/topic/edit/${row._id}?page=${page}`)
//                 }
//                 className="flex gap-2 px-4 py-2 hover:bg-indigo-50"
//               >
//                 <FiEdit /> Edit
//               </button>

//               <button
//                 onClick={() => setDeleteModalId(row._id)}
//                 className="flex gap-2 px-4 py-2 text-red-600 hover:bg-red-50"
//               >
//                 <FiTrash2 /> Delete
//               </button>
//             </div>
//           )}
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="bg-gray-50 min-h-screen p-4">

//       <div className="flex justify-between mb-6">
//         <h2 className="text-xl font-medium">Topics</h2>

//         {(role === "admin" || role === "editor") && (
//           <button
//             onClick={() =>
//               navigate(`/${role}/topic/create?page=${page}`)
//             }
//             className="bg-[#043f79] text-white px-3 py-2 rounded-md shadow-md"
//           >
//             <FiPlus /> Add
//           </button>
//         )}
//       </div>

//       <DataTable
//         columns={columns}
//         data={topics}
//         loading={isLoading}
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
//         onSortChange={handleSort}
//       />

//       {/* Delete Modal */}
//       {deleteModalId && (
//         <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[99999]">
//           <div className="bg-white p-6 rounded-xl w-96">
//             <h3 className="text-lg font-semibold mb-4">
//               Confirm Delete
//             </h3>
//             <p className="mb-6 text-gray-600">
//               Are you sure you want to delete this topic?
//             </p>

//             <div className="flex justify-end gap-4">
//               <button
//                 onClick={() => setDeleteModalId(null)}
//                 className="px-4 py-2 border rounded"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={handleDelete}
//                 className="px-4 py-2 bg-red-600 text-white rounded"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



// import { useEffect, useState } from "react";
// import { useNavigate, useParams, useSearchParams } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import { FiEdit, FiTrash2, FiMoreVertical, FiPlus } from "react-icons/fi";
// import { DataTable, TableColumn } from "../../PagesComponent/DataTable";
// import { useCommonCrud } from "../../../hooks/useCommonCrud";
// import { useDataTableStore } from "../../../store/dataTableStore";

// interface Topic {
//   _id: string;
//   cluster_id?: { _id: string; cluster_code?: string; title?: string } | string;
//   title: string;
//   slug: string;
//   status: "draft" | "published" | "archived" | "live";
//   is_active: number;
//   access_type?: "free" | "premium";
//   publish_date?: string;
// }

// export default function TopicListing() {
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

//   const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
//   const [deleteModalId, setDeleteModalId] = useState<string | null>(null);

//   // Fetch data using useCommonCrud
//   const { data, refetch, deleteRecord, isLoading } = useCommonCrud({
//     role,
//     module: "topic",
//     page,
//     limit: recordsPerPage,
//     searchValue,
//     sortField,
//     sortOrder,
//   });

//   const [topics, setTopics] = useState<Topic[]>([]);

//   const totalRecords = data?.topics?.length || 0;
//   const totalPages = Math.max(Math.ceil(totalRecords / recordsPerPage), 1);

//   // Load page from URL
//   useEffect(() => {
//     const urlPage = Number(searchParams.get("page"));
//     if (urlPage && urlPage !== page) setPage(urlPage);
//   }, []);

//   // Sync API data → local state
//   useEffect(() => {
//     if (data?.topics && Array.isArray(data.topics)) {
//       setTopics(data.topics);
//     }
//   }, [data]);

//   // Auto refetch on table changes
//   useEffect(() => {
//     const timer = setTimeout(() => refetch(), 300);
//     return () => clearTimeout(timer);
//   }, [page, recordsPerPage, searchValue, sortField, sortOrder]);

//   // Sync URL
//   useEffect(() => {
//     setSearchParams(
//       { page: page.toString(), limit: recordsPerPage.toString() },
//       { replace: true }
//     );
//   }, [page, recordsPerPage]);

//   // Close dropdown on outside click
//   useEffect(() => {
//     const handler = (e: MouseEvent) => {
//       if (!(e.target as HTMLElement).closest(".dropdown")) {
//         setOpenDropdownId(null);
//       }
//     };
//     window.addEventListener("click", handler);
//     return () => window.removeEventListener("click", handler);
//   }, []);

//   const handleSort = (field: string) => {
//     setSort(field, sortField === field && sortOrder === "asc" ? "desc" : "asc");
//   };

//   // Toggle Active/Inactive locally
//   const handleToggleStatus = (id: string) => {
//     setTopics((prev) =>
//       prev.map((t) =>
//         t._id === id ? { ...t, is_active: t.is_active ? 0 : 1 } : t
//       )
//     );
//     toast.success("Visibility updated locally");
//   };

//   // Delete Topic
//   const handleDelete = async () => {
//     if (!deleteModalId) return;

//     try {
//       const response = await deleteRecord(deleteModalId);
//       if (response?.success) {
//         toast.success("Topic deleted");
//         setTopics((prev) => prev.filter((t) => t._id !== deleteModalId));

//         const remaining = totalRecords - 1;
//         const newTotalPages = Math.max(Math.ceil(remaining / recordsPerPage), 1);

//         if (page > newTotalPages) setPage(newTotalPages);
//         else refetch();
//       }
//     } catch {
//       toast.error("Error deleting");
//     } finally {
//       setDeleteModalId(null);
//     }
//   };

//   const renderStatusBadge = (status: Topic["status"]) => {
//     const map = {
//       published: "text-green-600",
//       draft: "text-yellow-600",
//       archived: "text-gray-600",
//       live: "text-blue-600",
//     };
//     return (
//       <span className={`text-sm font-semibold ${map[status]}`}>
//         {status[0].toUpperCase() + status.slice(1)}
//       </span>
//     );
//   };

//   const columns: TableColumn<Topic>[] = [
//     {
//       key: "index",
//       label: "#",
//       render: (_row, idx) => (page - 1) * recordsPerPage + idx + 1,
//     },
//     {
//       key: "title",
//       label: "Title",
//       sortable: true,
//       render: (row) =>
//         row.title.length > 35 ? row.title.substring(0, 35) + "..." : row.title,
//     },
//     {
//       key: "cluster_id",
//       label: "Cluster",
//       sortable: true,
//       render: (row) =>
//         typeof row.cluster_id === "string" ? "-" : row.cluster_id?.title || "-",
//     },
//     {
//       key: "status",
//       label: "Publish Status",
//       sortable: true,
//       render: (row) => renderStatusBadge(row.status),
//     },
//     {
//       key: "publish_date",
//       label: "Publish Date",
//       sortable: true,
//       render: (row) =>
//         row.publish_date
//           ? new Date(row.publish_date).toLocaleDateString("en-IN", {
//               year: "numeric",
//               month: "short",
//               day: "numeric",
//             })
//           : "-",
//     },
//     {
//       key: "access_type",
//       label: "Topic Type",
//       sortable: true,
//       render: (row) =>
//         row.access_type ? (
//           <span
//             className={`text-sm font-medium ${
//               row.access_type === "premium" ? "text-purple-600" : "text-gray-700"
//             }`}
//           >
//             {row.access_type[0].toUpperCase() + row.access_type.slice(1)}
//           </span>
//         ) : (
//           "-"
//         ),
//     },
//     {
//       key: "is_active",
//       label: "Visibility",
//       render: (row) => (
//         <button
//           onClick={() => handleToggleStatus(row._id)}
//           className={`px-4 py-1 min-w-[90px] rounded-sm text-white text-sm font-medium transition-all ${
//             row.is_active ? "bg-green-600" : "bg-gray-500"
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
//         <div className="relative dropdown">
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               setOpenDropdownId(openDropdownId === row._id ? null : row._id);
//             }}
//             className="p-2 rounded-full hover:bg-gray-100"
//           >
//             <FiMoreVertical size={18} />
//           </button>

//           {openDropdownId === row._id && (
//             <div className="absolute top-full right-0 mt-2 bg-white border rounded-xl shadow-lg w-36 z-50">
//               <button
//                 onClick={() => navigate(`/${role}/topic/edit/${row._id}?page=${page}`)}
//                 className="flex gap-2 px-4 py-2 hover:bg-indigo-50"
//               >
//                 <FiEdit /> Edit
//               </button>

//               <button
//                 onClick={() => setDeleteModalId(row._id)}
//                 className="flex gap-2 px-4 py-2 text-red-600 hover:bg-red-50"
//               >
//                 <FiTrash2 /> Delete
//               </button>
//             </div>
//           )}
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="bg-gray-50 min-h-screen p-4">
//       <div className="flex justify-between mb-6">
//         <h2 className="text-xl font-medium">Topics</h2>

//         {(role === "admin" || role === "editor") && (
//           <button
//             onClick={() => navigate(`/${role}/topic/create?page=${page}`)}
//             className="bg-[#043f79] text-white px-3 py-2 rounded-md shadow-md"
//           >
//             <FiPlus /> Add
//           </button>
//         )}
//       </div>

//       <DataTable
//         columns={columns}
//         data={topics}
//         loading={isLoading}
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
//         onSortChange={handleSort}
//       />

//       {/* Delete Modal */}
//       {deleteModalId && (
//         <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[99999]">
//           <div className="bg-white p-6 rounded-xl w-96">
//             <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
//             <p className="mb-6 text-gray-600">Are you sure you want to delete this topic?</p>

//             <div className="flex justify-end gap-4">
//               <button
//                 onClick={() => setDeleteModalId(null)}
//                 className="px-4 py-2 border rounded"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={handleDelete}
//                 className="px-4 py-2 bg-red-600 text-white rounded"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiEdit, FiTrash2, FiMoreVertical, FiPlus } from "react-icons/fi";
import { DataTable, TableColumn } from "../../PagesComponent/DataTable";
import { useCommonCrud } from "../../../hooks/useCommonCrud";
import { useDataTableStore } from "../../../store/dataTableStore";

interface Topic {
  _id: string;
  cluster_id?: { _id: string; cluster_code?: string; title?: string } | string;
  title: string;
  slug: string;
  status: "draft" | "published" | "archived" | "live";
  is_active: number;
  access_type?: "free" | "premium";
  publish_date?: string;
}

export default function TopicListing() {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    page,
    recordsPerPage,
    searchValue,
    sortField,
    sortOrder,
    setPage,
    setRecordsPerPage,
    setSearchValue,
    setSort,
  } = useDataTableStore();

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);

  // Use latest useCommonCrud
  const { data, extractList, refetch, deleteRecord, toggleStatus, isLoading } = useCommonCrud<Topic>({
    role,
    module: "topic",
    page,
    limit: recordsPerPage,
    searchValue,
    sortField,
    sortOrder,
    listKey: "topics", // optional but explicit
  });

  const [topics, setTopics] = useState<Topic[]>([]);

  // Sync API data → local state
  useEffect(() => {
    setTopics(extractList);
  }, [extractList]);

  const totalRecords = data?.total || 0;
  const totalPages = Math.max(Math.ceil(totalRecords / recordsPerPage), 1);

  // Restore page/limit from URL
  useEffect(() => {
    const urlPage = Number(searchParams.get("page")) || 1;
    const urlLimit = Number(searchParams.get("limit")) || 10;
    setPage(urlPage);
    setRecordsPerPage(urlLimit);
  }, []);

  // Auto refetch on table changes
  useEffect(() => {
    const timer = setTimeout(() => refetch(), 300);
    return () => clearTimeout(timer);
  }, [page, recordsPerPage, searchValue, sortField, sortOrder]);

  // Sync URL
  useEffect(() => {
    setSearchParams({ page: String(page), limit: String(recordsPerPage) });
  }, [page, recordsPerPage]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".dropdown")) setOpenDropdownId(null);
    };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  const handleSort = (field: string) => {
    setSort(field, sortField === field && sortOrder === "asc" ? "desc" : "asc");
  };

  const handleToggle = async (id: string, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    setTopics((prev) => prev.map((t) => (t._id === id ? { ...t, is_active: newStatus } : t)));
    try {
      await toggleStatus(id, newStatus === 1);
    } catch {
      toast.error("Failed to update status");
      setTopics((prev) => prev.map((t) => (t._id === id ? { ...t, is_active: currentStatus } : t)));
    }
  };

  const handleDelete = async () => {
    if (!deleteModalId) return;
    const result = await deleteRecord(deleteModalId);
    if (result.success) {
      toast.success("Topic deleted");
      refetch();
    } else {
      toast.error(result.message || "Delete failed");
    }
    setDeleteModalId(null);
  };

  const renderStatusBadge = (status: Topic["status"]) => {
    const map = {
      published: "text-green-600",
      draft: "text-yellow-600",
      archived: "text-gray-600",
      live: "text-blue-600",
    };
    return <span className={`text-sm font-semibold ${map[status]}`}>{status[0].toUpperCase() + status.slice(1)}</span>;
  };

  const columns: TableColumn<Topic>[] = [
    { key: "index", label: "#", render: (_row, idx) => (page - 1) * recordsPerPage + idx + 1 },
    {
      key: "title",
      label: "Title",
      sortable: true,
      render: (row) => (row.title.length > 35 ? row.title.substring(0, 35) + "..." : row.title),
    },
    {
      key: "cluster_id",
      label: "Cluster",
      sortable: true,
      render: (row) => (typeof row.cluster_id === "string" ? "-" : row.cluster_id?.title || "-"),
    },
    { key: "status", label: "Publish Status", sortable: true, render: (row) => renderStatusBadge(row.status) },
    {
      key: "publish_date",
      label: "Publish Date",
      sortable: true,
      render: (row) =>
        row.publish_date
          ? new Date(row.publish_date).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })
          : "-",
    },
    {
      key: "access_type",
      label: "Topic Type",
      sortable: true,
      render: (row) =>
        row.access_type ? (
          <span className={`text-sm font-medium ${row.access_type === "premium" ? "text-purple-600" : "text-gray-700"}`}>
            {row.access_type[0].toUpperCase() + row.access_type.slice(1)}
          </span>
        ) : (
          "-"
        ),
    },
    {
      key: "is_active",
      label: "Visibility",
      render: (row) => (
        <button
          onClick={() => handleToggle(row._id, row.is_active)}
          className={`px-4 py-1 min-w-[90px] rounded-sm text-white text-sm font-medium transition-all ${
            row.is_active ? "bg-green-600" : "bg-gray-500"
          }`}
        >
          {row.is_active ? "Active" : "Inactive"}
        </button>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="relative dropdown">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenDropdownId(openDropdownId === row._id ? null : row._id);
            }}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <FiMoreVertical size={18} />
          </button>

          {openDropdownId === row._id && (
            <div className="absolute top-full right-0 mt-2 bg-white border rounded-xl shadow-lg w-36 z-50">
              <button
                onClick={() => navigate(`/${role}/topic/edit/${row._id}?page=${page}`)}
                className="flex gap-2 px-4 py-2 hover:bg-indigo-50"
              >
                <FiEdit /> Edit
              </button>
              <button
                onClick={() => setDeleteModalId(row._id)}
                className="flex gap-2 px-4 py-2 text-red-600 hover:bg-red-50"
              >
                <FiTrash2 /> Delete
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-medium">Topics</h2>

        {(role === "admin" || role === "editor") && (
          <button
            onClick={() => navigate(`/${role}/topic/create?page=${page}`)}
            className="bg-[#043f79] text-white px-3 py-2 rounded-md shadow-md flex items-center gap-2"
          >
            <FiPlus /> Add
          </button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={topics}
        loading={isLoading}
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
        onSortChange={handleSort}
      />

      {/* Delete Modal */}
      {deleteModalId && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[99999]">
          <div className="bg-white p-6 rounded-xl w-96">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6 text-gray-600">Are you sure you want to delete this topic?</p>
            <div className="flex justify-end gap-4">
              <button onClick={() => setDeleteModalId(null)} className="px-4 py-2 border rounded">
                Cancel
              </button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
