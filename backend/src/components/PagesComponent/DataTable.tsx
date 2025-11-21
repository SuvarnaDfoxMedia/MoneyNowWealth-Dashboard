import React, { useEffect } from "react";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";

export interface TableColumn<T> {
  key: string;
  label: string;
  render?: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  page: number;
  totalPages: number;
  totalRecords: number;
  recordsPerPage: number;
  onPageChange: (page: number) => void;
  onRecordsPerPageChange: (value: number) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  sortField: string;
  sortOrder: "asc" | "desc";
  onSortChange: (field: string, order: "asc" | "desc") => void;
  saveState?: boolean;
}

export function DataTable<T>({
  columns,
  data,
  loading,
  page,
  totalPages,
  totalRecords,
  recordsPerPage,
  onPageChange,
  onRecordsPerPageChange,
  searchValue,
  onSearchChange,
  sortField,
  sortOrder,
  onSortChange,
  saveState = false,
}: DataTableProps<T>) {
  
  // 🔹 Save state whenever it changes
  useEffect(() => {
    if (!saveState) return;
    const state = { page, recordsPerPage, searchValue, sortField, sortOrder };
    localStorage.setItem("dataTableState", JSON.stringify(state));
  }, [page, recordsPerPage, searchValue, sortField, sortOrder]);

  const handleSort = (col: TableColumn<T>) => {
    if (!col.sortable) return;
    const newOrder = sortField === col.key && sortOrder === "asc" ? "desc" : "asc";
    onSortChange(col.key, newOrder);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full">
      {/* Top Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-3 text-sm">
        <div className="flex items-center gap-2 mb-2 md:mb-0">
          <label htmlFor="records" className="text-gray-700">Show</label>
          <select
            id="records"
            value={recordsPerPage}
            onChange={(e) => onRecordsPerPageChange(Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400"
          >
            {[5, 10, 25, 50, 100].map((num) => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
          <span className="text-gray-700">entries per page</span>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="search" className="text-gray-700">Search:</label>
          <input
            id="search"
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-md">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="text-gray-700 text-base capitalize border-b bg-gray-100">
            <tr>
              {columns.map((col) => {
                const isSorted = sortField === col.key;
                return (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col)}
                    className={`px-4 py-3 font-medium whitespace-nowrap border-r last:border-r-0 select-none transition ${
                      col.sortable ? "cursor-pointer hover:bg-gray-200" : "cursor-default"
                    } ${isSorted ? "bg-gray-200" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{col.label}</span>
                      {col.sortable && (
                        <div className="flex items-center ml-2 text-gray-400">
                          <FiArrowUp className={`text-sm ${isSorted && sortOrder === "asc" ? "text-blue-500" : "opacity-40"}`} />
                          <FiArrowDown className={`text-sm ${isSorted && sortOrder === "desc" ? "text-blue-500" : "opacity-40"}`} />
                        </div>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-8 text-gray-500">Loading...</td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-8 text-gray-500">No records found</td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr key={idx} className={`border-b ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}>
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-2 whitespace-nowrap border-r last:border-r-0">
                      {col.render ? col.render(row, idx) : (row as any)[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row justify-between items-center m-4 text-sm text-gray-600">
          <p>
            Showing {(page - 1) * recordsPerPage + 1} to {Math.min(page * recordsPerPage, totalRecords)} of {totalRecords} entries
          </p>
          <div className="flex items-center gap-1 mt-2 md:mt-0">
            <button disabled={page === 1} onClick={() => onPageChange(page - 1)} className="px-2 py-1 border rounded disabled:opacity-50">Prev</button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => onPageChange(i + 1)}
                className={`px-3 py-1 border rounded ${page === i + 1 ? "bg-blue-500 text-white" : "hover:bg-gray-100"}`}
              >
                {i + 1}
              </button>
            ))}
            <button disabled={page === totalPages} onClick={() => onPageChange(page + 1)} className="px-2 py-1 border rounded disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
