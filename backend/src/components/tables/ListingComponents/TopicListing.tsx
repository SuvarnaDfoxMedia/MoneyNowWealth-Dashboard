
// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams, useSearchParams } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import { FiEdit, FiTrash2, FiMoreVertical, FiPlus } from "react-icons/fi";
// import { createPortal } from "react-dom";
// import { DataTable, TableColumn } from "../../PagesComponent/DataTable";
// import { useCommonCrud } from "../../../hooks/useCommonCrud";

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

//   const [currentPage, setCurrentPage] = useState(
//     () => Number(searchParams.get("page")) || 1
//   );
//   const [recordsPerPage, setRecordsPerPage] = useState(
//     () => Number(searchParams.get("limit")) || 10
//   );

//   const [searchValue, setSearchValue] = useState("");
//   const [sortField, setSortField] = useState("title");
//   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
//   const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
//   const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
//   const [deleteModalId, setDeleteModalId] = useState<string | null>(null);

//   const { data, refetch, toggleStatus, deleteRecord, isLoading } = useCommonCrud({
//     role,
//     module: "topic",
//     currentPage,
//     recordsPerPage,
//     searchValue,
//     sortField,
//     sortOrder,
//   });

//   const [topics, setTopics] = useState<Topic[]>([]);
//   const totalRecords = data?.total || 0;
//   const totalPages = Math.max(Math.ceil(totalRecords / recordsPerPage), 1);

//   useEffect(() => {
//     if (data?.items || data?.topics) {
//       const normalized: Topic[] = (data.items || data.topics).map((t: Topic) => ({
//         ...t,
//         status: t.status === "live" ? "published" : t.status,
//       }));
//       setTopics(normalized);
//     }
//   }, [data]);

//   useEffect(() => {
//     setSearchParams({
//       page: String(currentPage),
//       limit: String(recordsPerPage),
//     });
//   }, [currentPage, recordsPerPage]);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       refetch();
//     }, 300);
//     return () => clearTimeout(timer);
//   }, [searchValue, sortField, sortOrder, currentPage, recordsPerPage]);

//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (!(e.target as HTMLElement).closest(".dropdown")) {
//         setOpenDropdownId(null);
//       }
//     };
//     window.addEventListener("click", handleClickOutside);
//     return () => window.removeEventListener("click", handleClickOutside);
//   }, []);

//   const handleSort = (field: string) => {
//     if (sortField === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
//     else {
//       setSortField(field);
//       setSortOrder("asc");
//     }
//   };

//   const handleDropdownClick = (
//     e: React.MouseEvent<HTMLButtonElement>,
//     topicId: string
//   ) => {
//     e.stopPropagation();
//     const rect = e.currentTarget.getBoundingClientRect();
//     setDropdownPos({ top: rect.bottom + window.scrollY, left: rect.right - 144 });
//     setOpenDropdownId(openDropdownId === topicId ? null : topicId);
//   };

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
//     } catch (error: any) {
//       toast.error("Error updating visibility");
//     }
//   };

//   const handleDelete = async () => {
//     if (!deleteModalId) return;

//     try {
//       const response = await deleteRecord(deleteModalId);
//       if (response?.success) {
//         toast.success("Topic deleted successfully");

//         const remaining = totalRecords - 1;
//         const newTotalPages = Math.max(Math.ceil(remaining / recordsPerPage), 1);

//         // If deleting last item of last page → move to previous page
//         if (currentPage > newTotalPages) {
//           setCurrentPage(newTotalPages);
//           setTimeout(() => refetch(), 100);
//         } else {
//           refetch();
//         }
//       } else {
//         toast.error(response?.message || "Failed to delete topic");
//       }
//     } catch (error: any) {
//       toast.error("Error deleting topic");
//     } finally {
//       setDeleteModalId(null);
//     }
//   };

//   const Dropdown = ({
//     topicId,
//     top,
//     left,
//   }: {
//     topicId: string;
//     top: number;
//     left: number;
//   }) =>
//     createPortal(
//       <div
//         className="absolute dropdown bg-white border rounded-xl shadow-lg z-50 w-36"
//         style={{ top, left }}
//       >
//         <button
//           onClick={() => {
//             navigate(`/${role}/topic/edit/${topicId}?page=${currentPage}`);
//             setOpenDropdownId(null);
//           }}
//           className="flex items-center gap-2 px-4 py-2 hover:bg-indigo-50 w-full text-left transition"
//         >
//           <FiEdit /> Edit
//         </button>
//         <button
//           onClick={() => {
//             setDeleteModalId(topicId);
//             setOpenDropdownId(null);
//           }}
//           className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 w-full text-left text-red-600 transition"
//         >
//           <FiTrash2 /> Delete
//         </button>
//       </div>,
//       document.body
//     );

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

//   const columns: TableColumn<Topic>[] = [
//     {
//       key: "index",
//       label: "#",
//       render: (_row, idx) => (currentPage - 1) * recordsPerPage + idx + 1,
//     },
//     {
//       key: "title",
//       label: "Title",
//       sortable: true,
//       render: (row) => {
//         const title = row.title || "";
//         const truncatedTitle =
//           title.length > 35 ? title.substring(0, 35) + "..." : title;
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
//           {row.access_type?.charAt(0).toUpperCase() +
//             row.access_type?.slice(1) ||
//             "-"}
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
//         <>
//           <button
//             onClick={(e) => handleDropdownClick(e, row._id)}
//             className="p-2 rounded-full hover:bg-gray-100 transition"
//           >
//             <FiMoreVertical size={18} />
//           </button>
//           {openDropdownId === row._id && (
//             <Dropdown
//               topicId={row._id}
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
//         <h2 className="text-xl font-medium text-gray-800">Topics</h2>
//         {(role === "admin" || role === "editor") && (
//           <button
//             onClick={() => navigate(`/${role}/topic/create?page=${currentPage}`)}
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
//                 Are you sure you want to delete this topic?
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
import { FiEdit, FiTrash2, FiMoreVertical, FiPlus } from "react-icons/fi";
import { DataTable, TableColumn } from "../../PagesComponent/DataTable";
import { useCommonCrud } from "../../../hooks/useCommonCrud";

interface Topic {
  _id: string;
  cluster_id?: { _id: string; cluster_code?: string; title?: string } | string;
  title: string;
  slug: string;
  status: "draft" | "published" | "archived";
  is_active: number;
  access_type?: "free" | "premium";
  publish_date?: string;
}

export default function TopicListing() {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [currentPage, setCurrentPage] = useState(
    () => Number(searchParams.get("page")) || 1
  );
  const [recordsPerPage, setRecordsPerPage] = useState(
    () => Number(searchParams.get("limit")) || 10
  );

  const [searchValue, setSearchValue] = useState("");
  const [sortField, setSortField] = useState("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);

  const { data, refetch, toggleStatus, deleteRecord, isLoading } = useCommonCrud({
    role,
    module: "topic",
    currentPage,
    recordsPerPage,
    searchValue,
    sortField,
    sortOrder,
  });

  const [topics, setTopics] = useState<Topic[]>([]);
  const totalRecords = data?.total || 0;
  const totalPages = Math.max(Math.ceil(totalRecords / recordsPerPage), 1);

  useEffect(() => {
    if (data?.items || data?.topics) {
      const normalized: Topic[] = (data.items || data.topics).map((t: Topic) => ({
        ...t,
        status: t.status === "live" ? "published" : t.status,
      }));
      setTopics(normalized);
    }
  }, [data]);

  useEffect(() => {
    setSearchParams({
      page: String(currentPage),
      limit: String(recordsPerPage),
    });
  }, [currentPage, recordsPerPage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      refetch();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue, sortField, sortOrder, currentPage, recordsPerPage]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".dropdown")) {
        setOpenDropdownId(null);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSort = (field: string) => {
    if (sortField === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleToggleStatus = async (id: string) => {
    setTopics((prev) =>
      prev.map((t) => (t._id === id ? { ...t, is_active: t.is_active === 1 ? 0 : 1 } : t))
    );

    try {
      const response = await toggleStatus(id);
      if (response?.success && response.data?.is_active !== undefined) {
        setTopics((prev) =>
          prev.map((t) => (t._id === id ? { ...t, is_active: response.data.is_active } : t))
        );
        toast.success("Visibility updated successfully");
      }
    } catch (error: any) {
      toast.error("Error updating visibility");
    }
  };

  const handleDelete = async () => {
    if (!deleteModalId) return;

    try {
      const response = await deleteRecord(deleteModalId);
      if (response?.success) {
        toast.success("Topic deleted successfully");

        const remaining = totalRecords - 1;
        const newTotalPages = Math.max(Math.ceil(remaining / recordsPerPage), 1);

        if (currentPage > newTotalPages) {
          setCurrentPage(newTotalPages);
          setTimeout(() => refetch(), 100);
        } else {
          refetch();
        }
      } else {
        toast.error(response?.message || "Failed to delete topic");
      }
    } catch (error: any) {
      toast.error("Error deleting topic");
    } finally {
      setDeleteModalId(null);
    }
  };

  const renderStatusBadge = (status: Topic["status"]) => {
    const colors = {
      published: "text-green-600",
      draft: "text-yellow-600",
      archived: "text-gray-600",
    };
    return (
      <span className={`text-sm font-semibold ${colors[status] ?? "text-gray-600"}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const columns: TableColumn<Topic>[] = [
    {
      key: "index",
      label: "#",
      render: (_row, idx) => (currentPage - 1) * recordsPerPage + idx + 1,
    },
    {
      key: "title",
      label: "Title",
      sortable: true,
      render: (row) => {
        const title = row.title || "";
        const truncatedTitle =
          title.length > 35 ? title.substring(0, 35) + "..." : title;
        return <span title={row.title}>{truncatedTitle}</span>;
      },
    },
    {
      key: "cluster_id",
      label: "Cluster",
      sortable: true,
      render: (row) =>
        typeof row.cluster_id === "string" || !row.cluster_id
          ? "-"
          : row.cluster_id?.title || "-",
    },
    {
      key: "status",
      label: "Publish Status",
      sortable: true,
      render: (row) => renderStatusBadge(row.status),
    },
    {
      key: "publish_date",
      label: "Publish Date",
      sortable: true,
      render: (row) =>
        row.publish_date
          ? new Date(row.publish_date).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "-",
    },
    {
      key: "access_type",
      label: "Topic Type",
      sortable: true,
      render: (row) => (
        <span
          className={`text-sm font-medium ${
            row.access_type === "premium"
              ? "text-purple-600"
              : row.access_type === "free"
              ? "text-gray-700"
              : "text-gray-400"
          }`}
        >
          {row.access_type?.charAt(0).toUpperCase() +
            row.access_type?.slice(1) ||
            "-"}
        </span>
      ),
    },
    {
      key: "is_active",
      label: "Visibility Status",
      render: (row) => (
        <button
          onClick={() => handleToggleStatus(row._id)}
          className={`px-4 py-1 min-w-[90px] rounded-sm text-white text-sm font-medium transition-all duration-200 transform ${
            row.is_active === 1
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-500 hover:bg-gray-600"
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
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenDropdownId(openDropdownId === row._id ? null : row._id);
            }}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <FiMoreVertical size={18} />
          </button>

          {openDropdownId === row._id && (
            // <div className="absolute top-full right-0 mt-2 bg-white border rounded-xl shadow-lg w-36 dropdown z-50">
            //   <button
            //     onClick={() => {
            //       navigate(`/${role}/topic/edit/${row._id}?page=${currentPage}`);
            //       setOpenDropdownId(null);
            //     }}
            //     className="flex items-center gap-2 px-4 py-2 hover:bg-indigo-50 w-full text-left transition"
            //   >
            //     <FiEdit /> Edit
            //   </button>
            //   <button
            //     onClick={() => {
            //       setDeleteModalId(row._id);
            //       setOpenDropdownId(null);
            //     }}
            //     className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 w-full text-left text-red-600 transition"
            //   >
            //     <FiTrash2 /> Delete
            //   </button>
            // </div>

            <div className="absolute top-full right-0 mt-2 bg-white border rounded-xl shadow-lg w-36 dropdown z-50">
  <button
    onClick={() => {
      navigate(`/${role}/topic/edit/${row._id}?page=${currentPage}`);
      setOpenDropdownId(null);
    }}
    className="flex items-center gap-2 px-4 py-2 hover:bg-indigo-50 w-full text-left transition text-base"
  >
    <FiEdit /> Edit
  </button>
  <button
    onClick={() => {
      setDeleteModalId(row._id);
      setOpenDropdownId(null);
    }}
    className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 w-full text-left text-red-600 transition text-base"
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
    <div className="bg-gray-50 min-h-screen p-4 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-gray-800">Topics</h2>
        {(role === "admin" || role === "editor") && (
          <button
            onClick={() => navigate(`/${role}/topic/create?page=${currentPage}`)}
            className="bg-[#043f79] text-white px-3 py-2 rounded-md shadow-md hover:scale-105 transition flex items-center gap-2"
          >
            <FiPlus /> Add
          </button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={topics}
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

      {deleteModalId && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[99999]">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete this topic?
            </p>
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
        </div>
      )}
    </div>
  );
}
