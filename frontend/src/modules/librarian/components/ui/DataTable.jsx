import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Download, 
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2
} from 'lucide-react';
import { exportToCSV } from '../../utils/exportHelpers';
import { cn } from '../../utils/cn';

export const DataTable = ({
  columns,
  data = [],
  searchPlaceholder = 'Search...',
  searchKeys = [],
  actions,
  bulkActions,
  onRowClick,
  csvFilename = 'library_export.csv'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [columnFilters, setColumnFilters] = useState({});

  // 1. Search filter
  const searchedData = useMemo(() => {
    if (!searchQuery.trim() || !searchKeys.length) return data;
    
    return data.filter(item => {
      return searchKeys.some(key => {
        const value = item[key];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(searchQuery.toLowerCase());
      });
    });
  }, [data, searchQuery, searchKeys]);

  // 2. Column filters
  const filteredData = useMemo(() => {
    let result = searchedData;
    Object.keys(columnFilters).forEach(key => {
      const filterValue = columnFilters[key];
      if (filterValue) {
        result = result.filter(item => {
          const itemVal = item[key];
          return String(itemVal ?? '').toLowerCase() === filterValue.toLowerCase();
        });
      }
    });
    return result;
  }, [searchedData, columnFilters]);

  // 3. Sort
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;
    
    const sorted = [...filteredData];
    sorted.sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      
      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      
      const comparison = String(aVal).localeCompare(String(bVal), undefined, { numeric: true, sensitivity: 'base' });
      return sortConfig.direction === 'ascending' ? comparison : -comparison;
    });
    return sorted;
  }, [filteredData, sortConfig]);

  // 4. Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(paginatedData.map(row => row.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (e, id) => {
    e.stopPropagation();
    if (e.target.checked) {
      setSelectedRows(prev => [...prev, id]);
    } else {
      setSelectedRows(prev => prev.filter(rowId => rowId !== id));
    }
  };

  const getFilterOptions = (key) => {
    const values = data.map(item => item[key]).filter(Boolean);
    return [...new Set(values)].map(val => ({ label: String(val), value: String(val) }));
  };

  return (
    <div className="space-y-4">
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        {searchKeys.length > 0 && (
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-10 pl-10 pr-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          {columns.some(col => col.filterable) && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "h-10 px-3.5 border rounded-xl flex items-center gap-2 text-sm font-semibold transition-all duration-150",
                showFilters 
                  ? "border-amber-600 bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
                  : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850"
              )}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
            </button>
          )}

          <button
            onClick={() => exportToCSV(sortedData, csvFilename)}
            className="h-10 px-3.5 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center gap-2 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-850 transition-all duration-150"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>

          {actions}
        </div>
      </div>

      {/* Dynamic Filters panel */}
      {showFilters && (
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-wrap gap-4 animate-fadeIn">
          {columns.filter(col => col.filterable).map(col => (
            <div key={col.key} className="w-full sm:w-48 space-y-1">
              <label className="text-2xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Filter by {col.title}
              </label>
              <select
                value={columnFilters[col.key] || ''}
                onChange={(e) => {
                  setColumnFilters(prev => ({ ...prev, [col.key]: e.target.value }));
                  setCurrentPage(1);
                }}
                className="w-full h-9 px-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-white dark:bg-slate-950"
              >
                <option value="">All</option>
                {getFilterOptions(col.key).map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
          <button
            onClick={() => {
              setColumnFilters({});
              setCurrentPage(1);
            }}
            className="text-xs text-rose-600 hover:text-rose-700 font-semibold self-end pb-2 ml-auto"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Bulk action floating panel */}
      {selectedRows.length > 0 && bulkActions && (
        <div className="p-3 bg-amber-50 border border-amber-250 dark:bg-amber-950/20 dark:border-amber-900/50 rounded-xl flex items-center justify-between animate-slideUp">
          <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
            {selectedRows.length} item(s) selected
          </span>
          <div className="flex gap-2">
            {bulkActions(selectedRows, () => setSelectedRows([]))}
          </div>
        </div>
      )}

      {/* Table grid wrapper */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                {bulkActions && (
                  <th className="px-6 py-4 w-10">
                    <input
                      type="checkbox"
                      checked={paginatedData.length > 0 && selectedRows.length === paginatedData.length}
                      onChange={handleSelectAll}
                      className="rounded border-slate-350 text-amber-600 focus:ring-amber-500"
                    />
                  </th>
                )}
                {columns.map(col => (
                  <th
                    key={col.key}
                    onClick={() => col.sortable && handleSort(col.key)}
                    className={cn(
                      "px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider",
                      col.sortable ? "cursor-pointer select-none hover:text-slate-800 dark:hover:text-slate-200" : ""
                    )}
                  >
                    <div className="flex items-center gap-1">
                      <span>{col.title}</span>
                      {col.sortable && sortConfig && sortConfig.key === col.key && (
                        sortConfig.direction === 'ascending' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {paginatedData.length > 0 ? (
                paginatedData.map((row, rIdx) => (
                  <tr
                    key={row.id || rIdx}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={cn(
                      "group transition-colors",
                      onRowClick ? "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-850/50" : "hover:bg-slate-50/30 dark:hover:bg-slate-850/20"
                    )}
                  >
                    {bulkActions && (
                      <td className="px-6 py-3.5">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(row.id)}
                          onChange={(e) => handleSelectRow(e, row.id)}
                          className="rounded border-slate-350 text-amber-600 focus:ring-amber-500"
                        />
                      </td>
                    )}
                    {columns.map(col => (
                      <td key={col.key} className="px-6 py-3.5 text-sm text-slate-800 dark:text-slate-200 whitespace-nowrap">
                        {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '-')}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + (bulkActions ? 1 : 0)} className="px-6 py-12 text-center text-slate-500">
                    No matching records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-1">
          <p className="text-xs text-slate-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} records
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={cn(
                  "h-8 px-3 rounded-lg text-xs font-semibold transition-colors",
                  currentPage === i + 1
                    ? "bg-amber-600 text-white"
                    : "border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850"
                )}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
