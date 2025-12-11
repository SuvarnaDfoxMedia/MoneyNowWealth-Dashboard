// // SubscriptionListing.tsx
// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams, useSearchParams } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import { FiEdit, FiTrash2, FiMoreVertical, FiPlus } from "react-icons/fi";
// import { createPortal } from "react-dom";
// import { DataTable, TableColumn } from "../../PagesComponent/DataTable";
// import { useCommonCrud } from "../../../hooks/useCommonCrud";

// interface SubscriptionPlan {
//   _id: string;
//   name: string;
//   description: string;
//   price: number;
//   currency: string;
//   duration: { value: number; unit: string };
//   features: string[];
//   is_active: boolean;
//   is_deleted?: boolean;
//   deleted_at?: string | null;
//   created_at: string;
// }

// export default function SubscriptionListing() {
//   const { role } = useParams<{ role: string }>();
//   const navigate = useNavigate();
//   const [searchParams, setSearchParams] = useSearchParams();

//   const pageFromUrl = Number(searchParams.get("page")) || 1;
//   const limitFromUrl = Number(searchParams.get("limit")) || 10;

//   const [searchValue, setSearchValue] = useState("");
//   const [currentPage, setCurrentPage] = useState(pageFromUrl);
//   const [recordsPerPage, setRecordsPerPage] = useState(limitFromUrl);
//   const [sortField, setSortField] = useState("name");
//   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

//   const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
//   const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
//   const [deleteModalId, setDeleteModalId] = useState<string | null>(null);

//   const { data, refetch, toggleStatus, deleteRecord, isLoading } = useCommonCrud({
//     role,
//     module: "subscription-plan",
//     currentPage,
//     recordsPerPage,
//     searchValue,
//     sortField,
//     sortOrder,
//   });

//   const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
//   const totalRecords = data?.total || 0;
//   const totalPages = Math.max(Math.ceil(totalRecords / recordsPerPage), 1);

//   // Load active plans
//   useEffect(() => {
//     if (data?.plans || data?.items) {
//       const activePlans = (data.plans || data.items).filter((p: any) => !p.is_deleted);
//       setPlans(activePlans);
//     }
//   }, [data]);

//   useEffect(() => {
//     setSearchParams({
//       page: String(currentPage),
//       limit: String(recordsPerPage),
//     });
//   }, [currentPage, recordsPerPage]);

//   // Refetch on search, sorting, pagination change
//   useEffect(() => {
//     const delay = setTimeout(() => refetch(), 400);
//     return () => clearTimeout(delay);
//   }, [searchValue, sortField, sortOrder, currentPage, recordsPerPage]);

//   const handleSort = (field: string) => {
//     if (sortField === field) {
//       setSortOrder(sortOrder === "asc" ? "desc" : "asc");
//     } else {
//       setSortField(field);
//       setSortOrder("asc");
//     }
//   };

//   const handleDropdownClick = (e: React.MouseEvent<HTMLButtonElement>, planId: string) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     setDropdownPos({ top: rect.bottom + window.scrollY, left: rect.right - 144 });
//     setOpenDropdownId((prev) => (prev === planId ? null : planId));
//   };

//   const handleToggleStatus = async (id: string) => {
//     if (!role) return;
//     try {
//       const response = await toggleStatus(id);
//       if (response?.success) {
//         setPlans((prev) =>
//           prev.map((p) => (p._id === id ? { ...p, is_active: !p.is_active } : p))
//         );
//         toast.success("Plan status updated");
//       } else {
//         toast.error(response?.message || "Failed to update status");
//       }
//     } catch (error: any) {
//       toast.error(error?.message || "Error updating status");
//     }
//   };

//   const handleDelete = async () => {
//     if (!deleteModalId || !role) return;
//     try {
//       const response = await deleteRecord(deleteModalId);
//       if (response?.success) {
//         setPlans((prev) =>
//           prev.map((p) =>
//             p._id === deleteModalId
//               ? { ...p, is_deleted: true, deleted_at: new Date().toISOString() }
//               : p
//           )
//         );
//         toast.success("Plan deleted successfully");
//       } else {
//         toast.error(response?.message || "Failed to delete plan");
//       }
//     } catch (error: any) {
//       toast.error(error?.message || "Error deleting plan");
//     } finally {
//       setDeleteModalId(null);
//       refetch();
//     }
//   };

//   const Dropdown = ({ planId, top, left }: { planId: string; top: number; left: number }) =>
//     createPortal(
//       <div
//         className="absolute bg-white border rounded-xl shadow-lg z-50"
//         style={{ top, left, width: "9rem" }}
//       >
//         <button
//           onClick={() => {
//             navigate(`/${role}/subscriptionplan/edit/${planId}`);
//             setOpenDropdownId(null);
//           }}
//           className="flex items-center gap-2 px-4 py-2 hover:bg-indigo-50 w-full text-left transition"
//         >
//           <FiEdit /> Edit
//         </button>

//         <button
//           onClick={() => {
//             setDeleteModalId(planId);
//             setOpenDropdownId(null);
//           }}
//           className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 w-full text-left text-red-600 transition"
//         >
//           <FiTrash2 /> Delete
//         </button>
//       </div>,
//       document.body
//     );

//   const columns: TableColumn<SubscriptionPlan>[] = [
//     { key: "index", label: "#", render: (_row, idx) => (currentPage - 1) * recordsPerPage + idx + 1 },
//     { key: "name", label: "Name", sortable: true },
//     { key: "price", label: "Price", sortable: true, render: (row) => `${row.currency} ${row.price}` },
//     {
//       key: "duration",
//       label: "Duration",
//       sortable: true,
//       render: (row) => {
//         const { value, unit } = row.duration;
//         const capitalizedUnit = unit.charAt(0).toUpperCase() + unit.slice(1).toLowerCase();
//         const displayUnit = value === 1 ? capitalizedUnit.replace(/s$/i, "") : capitalizedUnit.endsWith("s") ? capitalizedUnit : capitalizedUnit + "s";
//         return `${value} ${displayUnit}`;
//       },
//     },
//     {
//       key: "is_active",
//       label: "Activation",
//       render: (row) => (
//         <button
//           onClick={() => handleToggleStatus(row._id)}
//           className={`px-4 py-1 min-w-[110px] rounded-md text-white text-sm font-medium transition-all duration-200 transform ${
//             row.is_active ? "bg-green-600 hover:bg-green-700" : "bg-gray-500 hover:bg-gray-600"
//           } hover:scale-105`}
//         >
//           {row.is_active ? "Deactivate" : "Activate"}
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
//           {openDropdownId === row._id && <Dropdown planId={row._id} top={dropdownPos.top} left={dropdownPos.left} />}
//         </>
//       ),
//     },
//   ];

//   return (
//     <div className="bg-gray-50 min-h-screen p-4 relative">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-xl font-medium text-gray-800">Subscription Plans</h2>
//         <button
//           onClick={() => navigate(`/${role}/subscriptionplan/create`)}
//           className="bg-[#043f79] text-white px-3 py-2 rounded-md shadow-md hover:scale-105 transition flex items-center gap-2"
//         >
//           <FiPlus /> Add
//         </button>
//       </div>

//       <DataTable
//         columns={columns}
//         data={plans}
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
//               <p className="mb-6 text-gray-600">Are you sure you want to delete this plan?</p>
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


// // SubscriptionListing.tsx
// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams, useSearchParams } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import { FiEdit, FiTrash2, FiMoreVertical, FiPlus } from "react-icons/fi";
// import { createPortal } from "react-dom";
// import { DataTable, TableColumn } from "../../PagesComponent/DataTable";
// import { useCommonCrud } from "../../../hooks/useCommonCrud";
// import { useDataTableStore } from "../../../store/dataTableStore";

// interface SubscriptionPlan {
//   _id: string;
//   name: string;
//   description: string;
//   price: number;
//   currency: string;
//   duration: { value: number; unit: string };
//   features: string[];
//   is_active: boolean;
//   is_deleted?: boolean;
//   created_at: string;
// }

// export default function SubscriptionListing() {
//   const { role } = useParams<{ role: string }>();
//   const navigate = useNavigate();
//   const [searchParams, setSearchParams] = useSearchParams();

//   /** ------------------------------------------
//    *   Zustand Store (Same as CMS & Cluster)
//    *  ------------------------------------------
//    */
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

//   /** Restore URL → Zustand store */
//   useEffect(() => {
//     const urlPage = Number(searchParams.get("page")) || 1;
//     const urlLimit = Number(searchParams.get("limit")) || 10;

//     setPage(urlPage);
//     setRecordsPerPage(urlLimit);
//   }, []);

//   /** Fetch Data */
//   const { data, refetch, toggleStatus, deleteRecord, isLoading } = useCommonCrud({
//     role,
//     module: "subscription-plan",
//     currentPage: page,
//     recordsPerPage,
//     searchValue,
//     sortField,
//     sortOrder,
//   });

//   const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
//   const totalRecords = data?.total || 0;
//   const totalPages = Math.max(Math.ceil(totalRecords / recordsPerPage), 1);

//   /** Sync API Data → plans */
//   useEffect(() => {
//     if (data?.plans || data?.items) {
//       setPlans((data.plans || data.items).filter((p: any) => !p.is_deleted));
//     }
//   }, [data]);

//   /** Sync Zustand → URL */
//   useEffect(() => {
//     setSearchParams({
//       page: String(page),
//       limit: String(recordsPerPage),
//     });
//   }, [page, recordsPerPage]);

//   /** Debounced Search + Pagination + Sort */
//   useEffect(() => {
//     const timer = setTimeout(() => refetch(), 350);
//     return () => clearTimeout(timer);
//   }, [searchValue, sortField, sortOrder, page, recordsPerPage]);

//   /** Dropdown + Delete Modal */
//   const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
//   const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
//   const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

//   const handleDropdownClick = (e: React.MouseEvent, id: string) => {
//     const rect = (e.target as HTMLElement).getBoundingClientRect();
//     setDropdownPos({ top: rect.bottom + window.scrollY, left: rect.right - 140 });
//     setOpenDropdownId(openDropdownId === id ? null : id);
//   };

//   const handleToggleStatus = async (id: string) => {
//     const res = await toggleStatus(id);
//     if (res?.success) {
//       setPlans((prev) =>
//         prev.map((p) => (p._id === id ? { ...p, is_active: !p.is_active } : p))
//       );
//       toast.success("Status updated");
//     }
//   };

//   const handleDelete = async () => {
//     if (!deleteModalId) return;

//     const res = await deleteRecord(deleteModalId);
//     if (res?.success) {
//       toast.success("Plan deleted");

//       setPlans((prev) => prev.filter((p) => p._id !== deleteModalId));

//       refetch();
//     }
//     setDeleteModalId(null);
//   };

//   const Dropdown = ({ planId }: { planId: string }) =>
//     createPortal(
//       <div
//         className="absolute bg-white border rounded-xl shadow-lg z-50"
//         style={{ top: dropdownPos.top, left: dropdownPos.left, width: "9rem" }}
//       >
//         <button
//           onClick={() => {
//             navigate(`/${role}/subscriptionplan/edit/${planId}`);
//             setOpenDropdownId(null);
//           }}
//           className="flex items-center gap-2 px-4 py-2 hover:bg-indigo-50 w-full"
//         >
//           <FiEdit /> Edit
//         </button>

//         <button
//           onClick={() => {
//             setDeleteModalId(planId);
//             setOpenDropdownId(null);
//           }}
//           className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-red-600 w-full"
//         >
//           <FiTrash2 /> Delete
//         </button>
//       </div>,
//       document.body
//     );

//   /** Table Columns (Same pattern as Cluster) */
//   const columns: TableColumn<SubscriptionPlan>[] = [
//     {
//       key: "index",
//       label: "#",
//       render: (_row, idx) => (page - 1) * recordsPerPage + idx + 1,
//     },
//     {
//       key: "name",
//       label: "Name",
//       sortable: true,
//     },
//     {
//       key: "price",
//       label: "Price",
//       sortable: true,
//       render: (row) => `${row.currency} ${row.price}`,
//     },
//     {
//       key: "duration",
//       label: "Duration",
//       sortable: true,
//       render: (row) => {
//         const { value, unit } = row.duration;
//         const u = unit.charAt(0).toUpperCase() + unit.slice(1);
//         return `${value} ${value === 1 ? u.replace(/s$/i, "") : u}`;
//       },
//     },
//     {
//       key: "is_active",
//       label: "Activation",
//       render: (row) => (
//         <button
//           onClick={() => handleToggleStatus(row._id)}
//           className={`px-4 py-1 rounded-md text-white ${
//             row.is_active ? "bg-green-600" : "bg-gray-600"
//           }`}
//         >
//           {row.is_active ? "Deactivate" : "Activate"}
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
//             className="p-2 rounded-full hover:bg-gray-100"
//           >
//             <FiMoreVertical size={18} />
//           </button>

//           {openDropdownId === row._id && <Dropdown planId={row._id} />}
//         </>
//       ),
//     },
//   ];

//   return (
//     <div className="bg-gray-50 min-h-screen p-4 relative">
//       <div className="flex justify-between mb-6">
//         <h2 className="text-xl font-medium text-gray-800">Subscription Plans</h2>
//         <button
//           onClick={() => navigate(`/${role}/subscriptionplan/create`)}
//           className="bg-[#043f79] text-white px-3 py-2 rounded-md shadow-md flex items-center gap-2"
//         >
//           <FiPlus /> Add
//         </button>
//       </div>

//       <DataTable
//         columns={columns}
//         data={plans}
//         loading={isLoading}
//         page={page}
//         totalPages={totalPages}
//         totalRecords={totalRecords}
//         recordsPerPage={recordsPerPage}
//         onPageChange={(p) => setPage(p)}
//         onRecordsPerPageChange={(limit) => setRecordsPerPage(limit)}
//         searchValue={searchValue}
//         onSearchChange={(v) => setSearchValue(v)}
//         sortField={sortField}
//         sortOrder={sortOrder}
//         onSortChange={(field, order) => setSort(field, order)}
//       />

//       {/* Delete Modal */}
//       {deleteModalId &&
//         createPortal(
//           <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-[99999]">
//             <div className="bg-white p-6 rounded-xl w-96">
//               <h3 className="text-lg font-semibold">Confirm Delete</h3>
//               <p className="my-4 text-gray-600">
//                 Are you sure you want to delete this plan?
//               </p>

//               <div className="flex justify-end gap-3">
//                 <button
//                   onClick={() => setDeleteModalId(null)}
//                   className="border px-4 py-2 rounded-lg"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   onClick={handleDelete}
//                   className="bg-red-600 text-white px-4 py-2 rounded-lg"
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


// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams, useSearchParams } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import { FiEdit, FiTrash2, FiMoreVertical, FiPlus } from "react-icons/fi";
// import { createPortal } from "react-dom";
// import { DataTable, TableColumn } from "../../PagesComponent/DataTable";
// import { useCommonCrud } from "../../../hooks/useCommonCrud";
// import { useDataTableStore } from "../../../store/dataTableStore";

// interface SubscriptionPlan {
//   _id: string;
//   name: string;
//   description: string;
//   price: number;
//   currency: string;
//   duration: { value: number; unit: string };
//   features: string[];
//   is_active: boolean;
//   is_deleted?: boolean;
//   created_at: string;
// }

// export default function SubscriptionListing() {
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

//   /** Restore URL → Zustand store */
//   useEffect(() => {
//     const urlPage = Number(searchParams.get("page")) || 1;
//     const urlLimit = Number(searchParams.get("limit")) || 10;
//     setPage(urlPage);
//     setRecordsPerPage(urlLimit);
//   }, []);

//   /** Fetch Data */
//   const { data, refetch, deleteRecord, isLoading } = useCommonCrud({
//     role,
//     module: "subscription-plan",
//     page,                     // correct prop
//     limit: recordsPerPage,    // correct prop
//     searchValue,
//     sortField,
//     sortOrder,
//   });

//   const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
//   const totalRecords = data?.total || 0;
//   const totalPages = Math.max(Math.ceil(totalRecords / recordsPerPage), 1);

//   /** Sync API Data → plans */
//   useEffect(() => {
//     if (data?.plans || data?.items) {
//       setPlans((data.plans || data.items).filter((p: any) => !p.is_deleted));
//     }
//   }, [data]);

//   /** Sync Zustand → URL */
//   useEffect(() => {
//     setSearchParams({
//       page: String(page),
//       limit: String(recordsPerPage),
//     });
//   }, [page, recordsPerPage]);

//   /** Debounced Search + Pagination + Sort */
//   useEffect(() => {
//     const timer = setTimeout(() => refetch(), 350);
//     return () => clearTimeout(timer);
//   }, [searchValue, sortField, sortOrder, page, recordsPerPage]);

//   /** Dropdown + Delete Modal */
//   const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
//   const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
//   const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

//   const handleDropdownClick = (e: React.MouseEvent, id: string) => {
//     const rect = (e.target as HTMLElement).getBoundingClientRect();
//     setDropdownPos({ top: rect.bottom + window.scrollY, left: rect.right - 140 });
//     setOpenDropdownId(openDropdownId === id ? null : id);
//   };

//   /** Delete handler */
//   const handleDelete = async () => {
//     if (!deleteModalId) return;
//     const res = await deleteRecord(deleteModalId);
//     if (res?.success) {
//       toast.success("Plan deleted");
//       setPlans((prev) => prev.filter((p) => p._id !== deleteModalId));
//       refetch();
//     }
//     setDeleteModalId(null);
//   };

//   /** Table Columns */
//   const columns: TableColumn<SubscriptionPlan>[] = [
//     { key: "index", label: "#", render: (_row, idx) => (page - 1) * recordsPerPage + idx + 1 },
//     { key: "name", label: "Name", sortable: true },
//     { key: "price", label: "Price", sortable: true, render: (row) => `${row.currency} ${row.price}` },
//     {
//       key: "duration",
//       label: "Duration",
//       sortable: true,
//       render: (row) => {
//         const { value, unit } = row.duration;
//         const u = unit.charAt(0).toUpperCase() + unit.slice(1);
//         return `${value} ${value === 1 ? u.replace(/s$/i, "") : u}`;
//       },
//     },
//     {
//       key: "is_active",
//       label: "Activation",
//       render: (row) => (
//         <span className={`px-4 py-1 rounded-md text-white ${row.is_active ? "bg-green-600" : "bg-gray-600"}`}>
//           {row.is_active ? "Active" : "Inactive"}
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
//             className="p-2 rounded-full hover:bg-gray-100"
//           >
//             <FiMoreVertical size={18} />
//           </button>
//           {openDropdownId === row._id && (
//             <div
//               className="absolute bg-white border rounded-xl shadow-lg z-50"
//               style={{ top: dropdownPos.top, left: dropdownPos.left, width: "9rem" }}
//             >
//               <button
//                 onClick={() => {
//                   navigate(`/${role}/subscriptionplan/edit/${row._id}`);
//                   setOpenDropdownId(null);
//                 }}
//                 className="flex items-center gap-2 px-4 py-2 hover:bg-indigo-50 w-full"
//               >
//                 <FiEdit /> Edit
//               </button>
//               <button
//                 onClick={() => {
//                   setDeleteModalId(row._id);
//                   setOpenDropdownId(null);
//                 }}
//                 className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-red-600 w-full"
//               >
//                 <FiTrash2 /> Delete
//               </button>
//             </div>
//           )}
//         </>
//       ),
//     },
//   ];

//   return (
//     <div className="bg-gray-50 min-h-screen p-4 relative">
//       <div className="flex justify-between mb-6">
//         <h2 className="text-xl font-medium text-gray-800">Subscription Plans</h2>
//         <button
//           onClick={() => navigate(`/${role}/subscriptionplan/create`)}
//           className="bg-[#043f79] text-white px-3 py-2 rounded-md shadow-md flex items-center gap-2"
//         >
//           <FiPlus /> Add
//         </button>
//       </div>

//       <DataTable
//         columns={columns}
//         data={plans}
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
//         onSortChange={(field, order) => setSort(field, order)}
//       />

//       {deleteModalId &&
//         createPortal(
//           <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-[99999]">
//             <div className="bg-white p-6 rounded-xl w-96">
//               <h3 className="text-lg font-semibold">Confirm Delete</h3>
//               <p className="my-4 text-gray-600">Are you sure you want to delete this plan?</p>
//               <div className="flex justify-end gap-3">
//                 <button onClick={() => setDeleteModalId(null)} className="border px-4 py-2 rounded-lg">Cancel</button>
//                 <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded-lg">Delete</button>
//               </div>
//             </div>
//           </div>,
//           document.body
//         )}
//     </div>
//   );
// }




// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate, useParams, useSearchParams } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import { FiEdit, FiTrash2, FiMoreVertical, FiPlus } from "react-icons/fi";
// import { createPortal } from "react-dom";
// import { DataTable, TableColumn } from "../../PagesComponent/DataTable";
// import { useCommonCrud } from "../../../hooks/useCommonCrud";
// import { useDataTableStore } from "../../../store/dataTableStore";

// interface SubscriptionPlan {
//   _id: string;
//   name: string;
//   description: string;
//   price: number;
//   currency: string;
//   duration: { value: number; unit: string };
//   features: string[];
//   is_active: boolean;
//   is_deleted?: boolean;
//   created_at: string;
// }



// export default function SubscriptionListing() {
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

//   /** Restore URL → Zustand */
//   useEffect(() => {
//     setPage(Number(searchParams.get("page")) || 1);
//     setRecordsPerPage(Number(searchParams.get("limit")) || 10);
//   }, []);

//   /** Fetch Data */
//   const { data, refetch, deleteRecord, isLoading } = useCommonCrud({
//     role,
//     module: "subscription-plan",
//     page,
//     limit: recordsPerPage,
//     searchValue,
//     sortField,
//     sortOrder,
//   });

//   const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
//   const totalRecords = data?.total || 0;
//   const totalPages = Math.max(Math.ceil(totalRecords / recordsPerPage), 1);

//   useEffect(() => {
//     if (data?.plans || data?.items) {
//       setPlans((data.plans || data.items).filter((p: any) => !p.is_deleted));
//     }
//   }, [data]);

//   /** Sync Zustand → URL */
//   useEffect(() => {
//     setSearchParams({
//       page: String(page),
//       limit: String(recordsPerPage),
//     });
//   }, [page, recordsPerPage]);

//   /** Debounced API calls */
//   useEffect(() => {
//     const t = setTimeout(() => refetch(), 300);
//     return () => clearTimeout(t);
//   }, [searchValue, sortField, sortOrder, page, recordsPerPage]);

//   /** Dropdown Logic */
//   const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
//   const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
//   const dropdownRef = useRef<HTMLDivElement | null>(null);

//   /** OPEN dropdown */
//   const handleDropdownClick = (e: React.MouseEvent, id: string) => {
//     e.stopPropagation();

//     const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
//     setDropdownPos({
//       top: rect.bottom + window.scrollY + 6,
//       left: rect.left + window.scrollX - 80,
//     });

//     setOpenDropdownId((prev) => (prev === id ? null : id));
//   };

//   /** CLOSE dropdown (mousedown fix) */
//   useEffect(() => {
//     function handleOutsideClick(e: MouseEvent) {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
//         setOpenDropdownId(null);
//       }
//     }
//     window.addEventListener("mousedown", handleOutsideClick);
//     return () => window.removeEventListener("mousedown", handleOutsideClick);
//   }, []);

//   /** Delete Modal */
//   const [deleteModalId, setDeleteModalId] = useState<string | null>(null);

//   const handleDelete = async () => {
//     if (!deleteModalId) return;

//     const res = await deleteRecord(deleteModalId);
//     if (res?.success) {
//       toast.success("Plan deleted");
//       setPlans((prev) => prev.filter((p) => p._id !== deleteModalId));
//       refetch();
//     }
//     setDeleteModalId(null);
//   };

//   /** Table Columns */
//   const columns: TableColumn<SubscriptionPlan>[] = [
//     {
//       key: "index",
//       label: "#",
//       render: (_row, idx) => (page - 1) * recordsPerPage + idx + 1,
//     },
//     { key: "name", label: "Name", sortable: true },
//     {
//       key: "price",
//       label: "Price",
//       sortable: true,
//       render: (row) => `${row.currency} ${row.price}`,
//     },
//     {
//       key: "duration",
//       label: "Duration",
//       sortable: true,
//       render: (row) => {
//         const u = row.duration.unit;
//         const formatted = `${row.duration.value} ${u}`;
//         return formatted.charAt(0).toUpperCase() + formatted.slice(1);
//       },
//     },
//     {
//       key: "is_active",
//       label: "Activation",
//       render: (row) => (
//         <span
//           className={`px-4 py-1 rounded-md text-white ${
//             row.is_active ? "bg-green-600" : "bg-gray-600"
//           }`}
//         >
//           {row.is_active ? "Active" : "Inactive"}
//         </span>
//       ),
//     },

//     /** ACTIONS COLUMN */
//     {
//       key: "actions",
//       label: "Actions",
//       render: (row) => (
//         <>
//           <button
//             onMouseDown={(e) => e.stopPropagation()}
//             onClick={(e) => handleDropdownClick(e, row._id)}
//             className="p-2 rounded-full hover:bg-gray-100"
//           >
//             <FiMoreVertical size={18} />
//           </button>

//           {openDropdownId === row._id &&
//             createPortal(
//               <div
//                 ref={dropdownRef}
//                 className="fixed bg-white border rounded-xl shadow-lg z-[99999]"
//                 style={{
//                   top: dropdownPos.top,
//                   left: dropdownPos.left,
//                   width: "9rem",
//                 }}
//               >
//                 <button
//                   onClick={() => {
//                     navigate(`/${role}/subscriptionplan/edit/${row._id}`);
//                     setOpenDropdownId(null);
//                   }}
//                   className="flex items-center gap-2 px-4 py-2 hover:bg-indigo-50 w-full"
//                 >
//                   <FiEdit /> Edit
//                 </button>

//                 <button
//                   onClick={() => {
//                     setDeleteModalId(row._id);
//                     setOpenDropdownId(null);
//                   }}
//                   className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-red-600 w-full"
//                 >
//                   <FiTrash2 /> Delete
//                 </button>
//               </div>,
//               document.body
//             )}
//         </>
//       ),
//     },
//   ];

//   return (
//     <div className="bg-gray-50 min-h-screen p-4 relative">
//       <div className="flex justify-between mb-6">
//         <h2 className="text-xl font-medium text-gray-800">Subscription Plans</h2>
//         <button
//           onClick={() => navigate(`/${role}/subscriptionplan/create`)}
//           className="bg-[#043f79] text-white px-3 py-2 rounded-md shadow-md flex items-center gap-2"
//         >
//           <FiPlus /> Add
//         </button>
//       </div>

//       <DataTable
//         columns={columns}
//         data={plans}
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
//         onSortChange={(field, order) => setSort(field, order)}
//       />

//       {deleteModalId &&
//         createPortal(
//           <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-[99999]">
//             <div className="bg-white p-6 rounded-xl w-96">
//               <h3 className="text-lg font-semibold">Confirm Delete</h3>
//               <p className="my-4 text-gray-600">
//                 Are you sure you want to delete this plan?
//               </p>
//               <div className="flex justify-end gap-3">
//                 <button
//                   onClick={() => setDeleteModalId(null)}
//                   className="border px-4 py-2 rounded-lg"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleDelete}
//                   className="bg-red-600 text-white px-4 py-2 rounded-lg"
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



// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate, useParams, useSearchParams } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import { FiEdit, FiTrash2, FiMoreVertical, FiPlus } from "react-icons/fi";
// import { createPortal } from "react-dom";
// import { DataTable, TableColumn } from "../../PagesComponent/DataTable";
// import { useCommonCrud } from "../../../hooks/useCommonCrud";
// import { useDataTableStore } from "../../../store/dataTableStore";

// interface SubscriptionPlan {
//   _id: string;
//   name: string;
//   description: string;
//   price: number;
//   currency: string;
//   duration: { value: number; unit: string };
//   features: string[];
//   is_active: boolean;
//   is_deleted?: boolean;
//   created_at: string;
// }

// export default function SubscriptionListing() {
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

//   /** Restore URL → Zustand */
//   useEffect(() => {
//     setPage(Number(searchParams.get("page")) || 1);
//     setRecordsPerPage(Number(searchParams.get("limit")) || 10);
//   }, []);

//   /** Fetch Data */
//   const { data, refetch, deleteRecord, toggleStatus, isLoading } = useCommonCrud<SubscriptionPlan>({
//     role,
//     module: "subscription-plan",
//     page,
//     limit: recordsPerPage,
//     searchValue,
//     sortField,
//     sortOrder,
//   });

//   const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
//   const totalRecords = data?.total || 0;
//   const totalPages = Math.max(Math.ceil(totalRecords / recordsPerPage), 1);

//   useEffect(() => {
//     if (data?.plans || data?.items) {
//       setPlans((data.plans || data.items).filter((p: any) => !p.is_deleted));
//     }
//   }, [data]);

//   /** Sync Zustand → URL */
//   useEffect(() => {
//     setSearchParams({
//       page: String(page),
//       limit: String(recordsPerPage),
//     });
//   }, [page, recordsPerPage]);

//   /** Debounced API calls */
//   useEffect(() => {
//     const t = setTimeout(() => refetch(), 300);
//     return () => clearTimeout(t);
//   }, [searchValue, sortField, sortOrder, page, recordsPerPage]);

//   /** Dropdown Logic */
//   const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
//   const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
//   const dropdownRef = useRef<HTMLDivElement | null>(null);

//   /** OPEN dropdown */
//   const handleDropdownClick = (e: React.MouseEvent, id: string) => {
//     e.stopPropagation();
//     const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
//     setDropdownPos({
//       top: rect.bottom + window.scrollY + 6,
//       left: rect.left + window.scrollX - 80,
//     });
//     setOpenDropdownId((prev) => (prev === id ? null : id));
//   };

//   /** CLOSE dropdown (mousedown fix) */
//   useEffect(() => {
//     function handleOutsideClick(e: MouseEvent) {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
//         setOpenDropdownId(null);
//       }
//     }
//     window.addEventListener("mousedown", handleOutsideClick);
//     return () => window.removeEventListener("mousedown", handleOutsideClick);
//   }, []);

//   /** Delete Modal */
//   const [deleteModalId, setDeleteModalId] = useState<string | null>(null);

//   const handleDelete = async () => {
//     if (!deleteModalId) return;

//     const res = await deleteRecord(deleteModalId);
//     if (res?.success) {
//       toast.success("Plan deleted");
//       setPlans((prev) => prev.filter((p) => p._id !== deleteModalId));
//       refetch();
//     }
//     setDeleteModalId(null);
//   };

//   /** Table Columns */
//   const columns: TableColumn<SubscriptionPlan>[] = [
//     {
//       key: "index",
//       label: "#",
//       render: (_row, idx) => (page - 1) * recordsPerPage + idx + 1,
//     },
//     { key: "name", label: "Name", sortable: true },
//     {
//       key: "price",
//       label: "Price",
//       sortable: true,
//       render: (row) => `${row.currency} ${row.price}`,
//     },
//     {
//       key: "duration",
//       label: "Duration",
//       sortable: true,
//       render: (row) => {
//         const u = row.duration.unit;
//         const formatted = `${row.duration.value} ${u}`;
//         return formatted.charAt(0).toUpperCase() + formatted.slice(1);
//       },
//     },
//     {
//       key: "is_active",
//       label: "Activation",
//       render: (row) => (
//         <button
//           onClick={async () => {
//             const newStatus = !row.is_active;
//             setPlans((prev) =>
//               prev.map((p) => (p._id === row._id ? { ...p, is_active: newStatus } : p))
//             );
//             try {
//               await toggleStatus(row._id, newStatus);
//             } catch (err: any) {
//               toast.error(err?.message || "Failed to update status");
//               // revert back
//               setPlans((prev) =>
//                 prev.map((p) => (p._id === row._id ? { ...p, is_active: row.is_active } : p))
//               );
//             }
//           }}
//           className={`px-4 py-1 rounded-md text-white ${
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
//             onMouseDown={(e) => e.stopPropagation()}
//             onClick={(e) => handleDropdownClick(e, row._id)}
//             className="p-2 rounded-full hover:bg-gray-100"
//           >
//             <FiMoreVertical size={18} />
//           </button>

//           {openDropdownId === row._id &&
//             createPortal(
//               <div
//                 ref={dropdownRef}
//                 className="fixed bg-white border rounded-xl shadow-lg z-[99999]"
//                 style={{
//                   top: dropdownPos.top,
//                   left: dropdownPos.left,
//                   width: "9rem",
//                 }}
//               >
//                 <button
//                   onClick={() => {
//                     navigate(`/${role}/subscriptionplan/edit/${row._id}`);
//                     setOpenDropdownId(null);
//                   }}
//                   className="flex items-center gap-2 px-4 py-2 hover:bg-indigo-50 w-full"
//                 >
//                   <FiEdit /> Edit
//                 </button>

//                 <button
//                   onClick={() => {
//                     setDeleteModalId(row._id);
//                     setOpenDropdownId(null);
//                   }}
//                   className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-red-600 w-full"
//                 >
//                   <FiTrash2 /> Delete
//                 </button>
//               </div>,
//               document.body
//             )}
//         </>
//       ),
//     },
//   ];

//   return (
//     <div className="bg-gray-50 min-h-screen p-4 relative">
//       <div className="flex justify-between mb-6">
//         <h2 className="text-xl font-medium text-gray-800">Subscription Plans</h2>
//         <button
//           onClick={() => navigate(`/${role}/subscriptionplan/create`)}
//           className="bg-[#043f79] text-white px-3 py-2 rounded-md shadow-md flex items-center gap-2"
//         >
//           <FiPlus /> Add
//         </button>
//       </div>

//       <DataTable
//         columns={columns}
//         data={plans}
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
//         onSortChange={(field, order) => setSort(field, order)}
//       />

//       {deleteModalId &&
//         createPortal(
//           <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-[99999]">
//             <div className="bg-white p-6 rounded-xl w-96">
//               <h3 className="text-lg font-semibold">Confirm Delete</h3>
//               <p className="my-4 text-gray-600">
//                 Are you sure you want to delete this plan?
//               </p>
//               <div className="flex justify-end gap-3">
//                 <button
//                   onClick={() => setDeleteModalId(null)}
//                   className="border px-4 py-2 rounded-lg"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleDelete}
//                   className="bg-red-600 text-white px-4 py-2 rounded-lg"
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

import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiEdit, FiTrash2, FiMoreVertical, FiPlus } from "react-icons/fi";
import { createPortal } from "react-dom";
import { DataTable, TableColumn } from "../../PagesComponent/DataTable";
import { useCommonCrud } from "../../../hooks/useCommonCrud";
import { useDataTableStore } from "../../../store/dataTableStore";

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
  created_at: string;
}

export default function SubscriptionListing() {
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

  // ------------------ URL → Zustand ------------------
  useEffect(() => {
    setPage(Number(searchParams.get("page")) || 1);
    setRecordsPerPage(Number(searchParams.get("limit")) || 10);
  }, []);

  // ------------------ Fetch Data ------------------
  const { data, refetch, deleteRecord, toggleStatus, isLoading } =
    useCommonCrud<SubscriptionPlan>({
      role,
      module: "subscription-plan",
      page,
      limit: recordsPerPage,
      searchValue,
      sortField,
      sortOrder,
      listKey: "plans",
    });

  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const totalRecords = data?.total || 0;
  const totalPages = Math.max(Math.ceil(totalRecords / recordsPerPage), 1);

  // ------------------ Sync data → local state ------------------
  useEffect(() => {
    if (data?.plans) {
      const validPlans: SubscriptionPlan[] = (data.plans as SubscriptionPlan[]).filter(
        (p) => !p.is_deleted
      );
      setPlans(validPlans);
    }
  }, [data]);

  // ------------------ Zustand → URL ------------------
  useEffect(() => {
    setSearchParams({
      page: String(page),
      limit: String(recordsPerPage),
    });
  }, [page, recordsPerPage]);

  // ------------------ Debounced refetch ------------------
  useEffect(() => {
    const timer = setTimeout(() => refetch(), 300);
    return () => clearTimeout(timer);
  }, [searchValue, sortField, sortOrder, page, recordsPerPage]);

  // ------------------ Dropdown ------------------
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleDropdownClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + window.scrollY + 6,
      left: rect.left + window.scrollX - 80,
    });
    setOpenDropdownId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdownId(null);
      }
    }
    window.addEventListener("mousedown", handleOutsideClick);
    return () => window.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // ------------------ Delete ------------------
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteModalId) return;

    const res = await deleteRecord(deleteModalId);
    if (res?.success) {
      toast.success("Plan deleted");
      setPlans((prev) => prev.filter((p) => p._id !== deleteModalId));
      refetch();
    } else {
      toast.error(res?.message || "Failed to delete plan");
    }
    setDeleteModalId(null);
  };

  // ------------------ Columns ------------------
  const columns: TableColumn<SubscriptionPlan>[] = [
    { key: "index", label: "#", render: (_row, idx) => (page - 1) * recordsPerPage + idx + 1 },
    { key: "name", label: "Name", sortable: true },
    {
      key: "price",
      label: "Price",
      sortable: true,
      render: (row) => `${row.currency} ${row.price}`,
    },
    {
      key: "duration",
      label: "Duration",
      sortable: true,
      render: (row) => {
        const u = row.duration.unit;
        const formatted = `${row.duration.value} ${u}`;
        return formatted.charAt(0).toUpperCase() + formatted.slice(1);
      },
    },
    {
      key: "is_active",
      label: "Activation",
      render: (row) => (
        <button
          onClick={async () => {
            try {
              const newStatus = !row.is_active;
              const res = await toggleStatus(row._id, newStatus);
              setPlans((prev) =>
                prev.map((p) => (p._id === row._id ? { ...p, is_active: newStatus } : p))
              );
              toast.success(res?.message || "Status updated");
            } catch (err: any) {
              toast.error(err?.message || "Failed to update status");
            }
          }}
          className={`px-4 py-1 rounded-md text-white ${row.is_active ? "bg-green-600" : "bg-gray-600"}`}
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
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => handleDropdownClick(e, row._id)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <FiMoreVertical size={18} />
          </button>

          {openDropdownId === row._id &&
            createPortal(
              <div
                ref={dropdownRef}
                className="fixed bg-white border rounded-xl shadow-lg z-[99999]"
                style={{ top: dropdownPos.top, left: dropdownPos.left, width: "9rem" }}
              >
                <button
                  onClick={() => {
                    navigate(`/${role}/subscriptionplan/edit/${row._id}`);
                    setOpenDropdownId(null);
                  }}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-indigo-50 w-full"
                >
                  <FiEdit /> Edit
                </button>

                <button
                  onClick={() => {
                    setDeleteModalId(row._id);
                    setOpenDropdownId(null);
                  }}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-red-600 w-full"
                >
                  <FiTrash2 /> Delete
                </button>
              </div>,
              document.body
            )}
        </>
      ),
    },
  ];

  // ------------------ Render ------------------
  return (
    <div className="bg-gray-50 min-h-screen p-4 relative">
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-medium text-gray-800">Subscription Plans</h2>
        <button
          onClick={() => navigate(`/${role}/subscriptionplan/create`)}
          className="bg-[#043f79] text-white px-3 py-2 rounded-md shadow-md flex items-center gap-2"
        >
          <FiPlus /> Add
        </button>
      </div>

      <DataTable
        columns={columns}
        data={plans}
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
        onSortChange={(field, order) => setSort(field, order)}
      />

      {deleteModalId &&
        createPortal(
          <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-[99999]">
            <div className="bg-white p-6 rounded-xl w-96">
              <h3 className="text-lg font-semibold">Confirm Delete</h3>
              <p className="my-4 text-gray-600">Are you sure you want to delete this plan?</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteModalId(null)}
                  className="border px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg"
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
