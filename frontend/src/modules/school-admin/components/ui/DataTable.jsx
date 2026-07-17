import React, { useState, useMemo } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  SlidersHorizontal, 
  Download, 
  Trash2, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { exportToCSV } from '../../utils/exportHelpers';

export const DataTable = ({
  columns,
  data: initialData = [],
  searchKey = '',
  searchPlaceholder = 'Search records...',
  filterOptions = [], // e.g. [{ key: 'status', label: 'Status', options: [...] }]
  bulkActions = [], // e.g. [{ label: 'Delete Selected', icon: Trash2, action: (keys) => {}, variant: 'danger' }]
  onRowClick,
  isLoading = false,
  emptyMessage = 'No records found',
  enableExport = true,
  exportFilename = 'table_export.csv'
}) => {
  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedFilters, setSelectedFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(columns.map(col => col.key || col.id))
  );
  const [showColVisibility, setShowColVisibility] = useState(false);

  // Filter, Sort, Search Logic
  const filteredData = useMemo(() => {
    let result = [...initialData];

    // 1. Text Search
    if (searchQuery.trim() !== '') {
      result = result.filter(row => {
        return Object.entries(row).some(([key, val]) => {
          if (val === null || val === undefined) return false;
          return String(val).toLowerCase().includes(searchQuery.toLowerCase());
        });
      });
    }

    // 2. Advanced Filters
    Object.entries(selectedFilters).forEach(([key, val]) => {
      if (val && val !== 'all') {
        result = result.filter(row => String(row[key]) === String(val));
      }
    });

    // 3. Sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        
        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;

        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
        }

        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();

        if (strA < strB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (strA > strB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [initialData, searchQuery, selectedFilters, sortConfig]);

  // Pagination Logic
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;

  // Toggle sorting
  const handleSort = (key) => {
    if (!key) return;
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Row selection
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = new Set(paginatedData.map(row => row.id));
      setSelectedRows(allIds);
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const isAllSelected = paginatedData.length > 0 && paginatedData.every(row => selectedRows.has(row.id));

  // Toggle Column Visibility
  const toggleColumn = (key) => {
    const newVisible = new Set(visibleColumns);
    if (newVisible.has(key)) {
      if (newVisible.size > 1) { // Don't hide the last column
        newVisible.delete(key);
      }
    } else {
      newVisible.add(key);
    }
    setVisibleColumns(newVisible);
  };

  return (
    <div className="space-y-4">
      {/* Search, Filters, Column Visibility & Export Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Advanced Filter Trigger */}
          {filterOptions.length > 0 && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center gap-2 text-xs font-semibold px-4 py-2 border rounded-xl transition-all",
                showFilters 
                  ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 border-indigo-200 dark:border-indigo-800" 
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              )}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
          )}

          {/* Column Visibility Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowColVisibility(!showColVisibility)}
              className="flex items-center gap-2 text-xs font-semibold px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Columns</span>
            </button>
            {showColVisibility && (
              <div className="absolute right-0 mt-2 z-20 w-48 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-2.5 space-y-1.5">
                <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">Toggle Columns</span>
                {columns.map(col => {
                  const key = col.key || col.id;
                  return (
                    <label key={key} className="flex items-center gap-2.5 px-1 py-1 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={visibleColumns.has(key)}
                        onChange={() => toggleColumn(key)}
                        className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                      />
                      <span>{col.header}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Export Action */}
          {enableExport && (
            <button
              onClick={() => exportToCSV(filteredData, exportFilename)}
              className="flex items-center gap-2 text-xs font-semibold px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filter Drawer (if active) */}
      {showFilters && filterOptions.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-slate-50 dark:bg-slate-900/40 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl">
          {filterOptions.map((opt) => (
            <div key={opt.key} className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {opt.label}
              </label>
              <select
                value={selectedFilters[opt.key] || 'all'}
                onChange={(e) => {
                  setSelectedFilters(prev => ({ ...prev, [opt.key]: e.target.value }));
                  setCurrentPage(1);
                }}
                className="w-full text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-2 focus:border-indigo-500 focus:outline-none"
              >
                <option value="all">All {opt.label}s</option>
                {opt.options.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
          {/* Reset Filters */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedFilters({});
                setSearchQuery('');
                setCurrentPage(1);
              }}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5 h-9"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>
      )}

      {/* Bulk Action Toolbar */}
      {selectedRows.size > 0 && bulkActions.length > 0 && (
        <div className="flex items-center justify-between bg-indigo-50 dark:bg-indigo-950/30 p-3.5 border border-indigo-200 dark:border-indigo-900 rounded-2xl">
          <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-400">
            {selectedRows.size} record{selectedRows.size > 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2">
            {bulkActions.map((action, idx) => {
              const ActionIcon = action.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    action.action(Array.from(selectedRows));
                    setSelectedRows(new Set());
                  }}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white focus:outline-none transition-colors shadow-sm",
                    action.variant === 'danger' ? "bg-rose-600 hover:bg-rose-700" : "bg-indigo-600 hover:bg-indigo-700"
                  )}
                >
                  {ActionIcon && <ActionIcon className="w-3.5 h-3.5" />}
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Table Container */}
      <div className="w-full overflow-x-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
              {/* Checkbox Header */}
              {bulkActions.length > 0 && (
                <th className="p-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                  />
                </th>
              )}
              {/* Render Columns */}
              {columns
                .filter(col => visibleColumns.has(col.key || col.id))
                .map((col) => (
                  <th
                    key={col.key || col.id}
                    onClick={() => handleSort(col.key)}
                    className={cn(
                      "p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider select-none",
                      col.key && "cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/20"
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.header}</span>
                      {sortConfig.key === col.key && (
                        sortConfig.direction === 'asc' 
                          ? <ChevronUp className="w-3 h-3 text-slate-400" />
                          : <ChevronDown className="w-3 h-3 text-slate-400" />
                      )}
                    </div>
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + (bulkActions.length > 0 ? 1 : 0)} className="p-8 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 rounded-full bg-indigo-600 animate-bounce"></div>
                    <div className="w-4 h-4 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-4 h-4 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (bulkActions.length > 0 ? 1 : 0)} className="p-12 text-center text-sm font-semibold text-slate-400 dark:text-slate-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={cn(
                    "border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors",
                    onRowClick && "cursor-pointer"
                  )}
                >
                  {/* Checkbox Cell */}
                  {bulkActions.length > 0 && (
                    <td className="p-4 w-12 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedRows.has(row.id)}
                        onChange={() => handleSelectRow(row.id)}
                        className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                      />
                    </td>
                  )}
                  {/* Render Cells */}
                  {columns
                    .filter(col => visibleColumns.has(col.key || col.id))
                    .map((col) => (
                      <td key={col.key || col.id} className="p-4">
                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                      </td>
                    ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      {filteredData.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-1.5 focus:outline-none"
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} records
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              // Simple logic to show a subset of page numbers if they're too many
              if (totalPages > 5 && Math.abs(currentPage - pageNum) > 1 && pageNum !== 1 && pageNum !== totalPages) {
                if (pageNum === 2 || pageNum === totalPages - 1) {
                  return <span key={pageNum} className="px-2 text-slate-400 text-xs select-none">...</span>;
                }
                return null;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-bold transition-all",
                    currentPage === pageNum
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                      : "border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
