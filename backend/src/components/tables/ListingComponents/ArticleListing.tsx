

import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FiEdit,
  FiTrash2,
  FiMoreVertical,
  FiPlus,
  FiEye,
  FiX,
} from "react-icons/fi";
import { createPortal } from "react-dom";
import { DataTable, TableColumn } from "../../PagesComponent/DataTable";
import { useCommonCrud } from "../../../hooks/useCommonCrud";

interface Article {
  _id: string;
  title: string;
  topic_id?: { _id: string; title: string };
  hero_image?: string;
  is_active: number;
}

export default function ArticleListing() {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = Number(searchParams.get("page")) || 1;
  const limitFromUrl = Number(searchParams.get("limit")) || 10;
  const [searchValue, setSearchValue] = useState("");
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const [sortField, setSortField] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [recordsPerPage, setRecordsPerPage] = useState(limitFromUrl);

  const { data, isLoading, toggleStatus, deleteRecord, refetch } = useCommonCrud({
    role,
    module: "article",
    currentPage,
    recordsPerPage,
    searchValue,
    sortField,
    sortOrder,
  });

  useEffect(() => {
    setSearchParams({
      page: String(currentPage),
      limit: String(recordsPerPage),
    });
  }, [currentPage, recordsPerPage, setSearchParams]);

  const articles: Article[] = data?.articles || [];
  const totalRecords = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  useEffect(() => {
    const timer = setTimeout(() => refetch(), 400);
    return () => clearTimeout(timer);
  }, [searchValue, sortField, sortOrder, refetch]);

  const handleSort = (field: string) => {
    if (sortField === field)
      setSortOrder((p) => (p === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleDropdownClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    articleId: string
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + window.scrollY,
      left: rect.right - 144,
    });
    setOpenDropdownId(openDropdownId === articleId ? null : articleId);
  };

  const SERVER_URL = import.meta.env.VITE_API_BASE;

  const resolveImageUrl = (path?: string | File) => {
    if (!path) return "/no-image.png";
    if (typeof path === "object") return URL.createObjectURL(path);
    if (path.startsWith("blob:") || path.startsWith("http")) return path;
    const normalized = path.replace(/^\/+/, "");
    const finalPath = normalized.includes("uploads/")
      ? normalized
      : `uploads/article/${normalized}`;
    return `${SERVER_URL.replace("/api", "")}/${finalPath}`;
  };

  // 🟢 Truncate to 40 characters
  const truncateText = (text: string, maxLength: number) =>
    text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;

  const handleDelete = async () => {
    if (!deleteModalId) return;
    const result = await deleteRecord(deleteModalId);
    if (result.success) {
      toast.success("Article archived successfully!");
      refetch();
    } else {
      toast.error(result.message || "Delete failed");
    }
    setDeleteModalId(null);
  };

  const columns: TableColumn<Article>[] = [
    {
      key: "index",
      label: "#",
      render: (_row, idx) => (currentPage - 1) * recordsPerPage + idx + 1,
    },
    {
      key: "hero_image",
      label: "Image",
      render: (row) => (
        <div
          className="w-20 h-14 border border-gray-200 rounded-md overflow-hidden bg-gray-50 flex items-center justify-center cursor-pointer group"
          onClick={() =>
            row.hero_image && setPreviewImage(resolveImageUrl(row.hero_image))
          }
        >
          {row.hero_image ? (
            <img
              src={resolveImageUrl(row.hero_image)}
              alt={row.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              onError={(e) =>
                ((e.target as HTMLImageElement).src = "/no-image.png")
              }
            />
          ) : (
            <span className="text-gray-400 text-sm">No Image</span>
          )}
        </div>
      ),
    },
    {
      key: "title",
      label: "Title",
      sortable: true,
      render: (row) => truncateText(row.title, 40),
    },
    {
      key: "topic_id",
      label: "Topic",
      sortable: true,
      render: (row) => truncateText(row.topic_id?.title || "-", 40),
    },
    {
      key: "is_active",
      label: "Active",
      render: (row) => (
        <button
          onClick={() => toggleStatus(row._id)}
          className={`px-4 py-1 rounded-sm text-white text-sm transition transform hover:scale-105 ${
            row.is_active === 1
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-500 hover:bg-gray-600"
          }`}
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
          {openDropdownId === row._id && (
            <Dropdown
              articleId={row._id}
              top={dropdownPos.top}
              left={dropdownPos.left}
            />
          )}
        </>
      ),
    },
  ];

  const Dropdown = ({
    articleId,
    top,
    left,
  }: {
    articleId: string;
    top: number;
    left: number;
  }) =>
    createPortal(
      <div
        className="absolute bg-white border rounded-xl shadow-lg z-50"
        style={{ top, left, width: "9rem" }}
      >
        <button
          onClick={() => {
            navigate(`/${role}/article/view/${articleId}`);
            setOpenDropdownId(null);
          }}
          className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 w-full text-left transition"
        >
          <FiEye /> View
        </button>
        <button
          onClick={() => {
            navigate(`/${role}/article/edit/${articleId}`);
            setOpenDropdownId(null);
          }}
          className="flex items-center gap-2 px-4 py-2 hover:bg-indigo-50 w-full text-left transition"
        >
          <FiEdit /> Edit
        </button>
        <button
          onClick={() => {
            setDeleteModalId(articleId);
            setOpenDropdownId(null);
          }}
          className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 w-full text-left text-red-600 transition"
        >
          <FiTrash2 /> Delete
        </button>
      </div>,
      document.body
    );

  return (
    <div className="bg-gray-50 min-h-screen p-4 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-gray-800">Articles</h2>
        {role === "admin" && (
          <button
            onClick={() => navigate(`/${role}/article/create`)}
            className="bg-[#043f79] text-white px-3 py-1 rounded-md shadow-lg hover:scale-105 transition flex items-center gap-2"
          >
            <FiPlus /> Add
          </button>
        )}
      </div>
      <DataTable
        columns={columns}
        data={articles}
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
              <p className="mb-6">Are you sure you want to delete this article?</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setDeleteModalId(null)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
      {previewImage &&
        createPortal(
          <div
            onClick={() => setPreviewImage(null)}
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[99999]"
          >
            <div className="relative max-w-4xl w-full flex justify-center">
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute top-3 right-3 text-white text-2xl hover:text-red-400"
              >
                <FiX />
              </button>
              <img
                src={previewImage}
                alt="Preview"
                className="max-h-[90vh] rounded-lg shadow-2xl object-contain"
              />
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
