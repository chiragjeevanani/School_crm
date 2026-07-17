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

export const DataTable = ({ 
  columns, 
  data, 
  searchPlaceholder = "Search records...", 
  searchKey = "studentName",
  filterOptions = [],
  bulkActions = [],
  onRowClick,
  loading = false,
  emptyMessage = "No matching financial records found."
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({});
  const [sortConfig, setSortConfig] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [visibleColumns, setVisibleColumns] = useState(new Set(columns.map(c => c.key)));
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [showColumnToggle, setShowColumnToggle] = useState(false);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (key, value) => {
    setSelectedFilters(prev => {
      const next = { ...prev };
      if (!value || value === 'ALL') {
        delete next[key];
      } else {
        next[key] = value;
      }
      return next;
    });
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleSelectAll = (e, currentRows) => {
    if (e.target.checked) {
      const ids = new Set(currentRows.map(r => r.id));
      setSelectedIds(ids);
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectRow = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleColumn = (key) => {
    setVisibleColumns(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size > 1) next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const processedData = useMemo(() => {
    let result = [...data];

    if (searchTerm) {
      result = result.filter(item => {
        const val = item[searchKey];
        return val && String(val).toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    Object.entries(selectedFilters).forEach(([key, val]) => {
      result = result.filter(item => String(item[key]) === String(val));
    });

    if (sortConfig) {
      result.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];

        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortConfig.direction === 'ascending' ? valA - valB : valB - valA;
        }

        valA = valA ? String(valA).toLowerCase() : '';
        valB = valB ? String(valB).toLowerCase() : '';

        if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchTerm, searchKey, selectedFilters, sortConfig]);

  const totalPages = Math.ceil(processedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedData.slice(start, start + pageSize);
  }, [processedData, currentPage, pageSize]);

  const activeColumns = columns.filter(c => visibleColumns.has(c.key));

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl shadow-sm">
        {/* Search */}
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pl-9 pr-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-205 dark:border-slate-850 focus:border-violet-605 focus:ring-1 focus:ring-violet-605 focus:outline-none"
            />
          </div>
          {filterOptions.length > 0 && (
            <button
              onClick={() => setShowFilterDrawer(!showFilterDrawer)}
              className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all shrink-0 ${
                showFilterDrawer 
                  ? 'bg-violet-50 border-violet-200 text-violet-600 dark:bg-violet-955/20' 
                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 dark:bg-slate-950'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
          )}
        </div>

        {/* Action triggers */}
        <div className="flex items-center gap-2.5 self-end md:self-auto">
          {/* Column Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowColumnToggle(!showColumnToggle)}
              className="px-3.5 py-2.5 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-850 text-slate-505 rounded-xl text-xs font-bold hover:bg-slate-100 flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Columns</span>
            </button>
            {showColumnToggle && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl p-3 shadow-xl z-20 space-y-1.5">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block pb-1 border-b">Toggle Columns</span>
                <div className="max-h-48 overflow-y-auto space-y-1 pt-1.5">
                  {columns.map(c => (
                    <label key={c.key} className="flex items-center gap-2 px-1 py-0.5 cursor-pointer text-xs font-semibold">
                      <input
                        type="checkbox"
                        checked={visibleColumns.has(c.key)}
                        onChange={() => toggleColumn(c.key)}
                        className="rounded text-violet-600 border-slate-350 w-3.5 h-3.5 focus:ring-violet-600"
                      />
                      <span className="truncate">{c.title}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CSV Export */}
          <button
            onClick={() => exportToCSV(processedData, `financial_report_${Date.now()}.csv`)}
            className="px-3.5 py-2.5 bg-violet-600 hover:bg-violet-750 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Advanced Filter Drawer */}
      {showFilterDrawer && filterOptions.length > 0 && (
        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-850 rounded-3xl p-4 grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {filterOptions.map((filter) => (
            <div key={filter.key} className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                {filter.label}
              </label>
              <select
                value={selectedFilters[filter.key] || 'ALL'}
                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border text-xs font-bold rounded-xl px-2.5 py-2 focus:ring-1 focus:ring-violet-600"
              >
                <option value="ALL">All {filter.label}s</option>
                {filter.options.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      {/* Table Data View */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-100 dark:border-slate-850/85">
                {bulkActions.length > 0 && (
                  <th className="px-6 py-4 w-10 shrink-0">
                    <input
                      type="checkbox"
                      onChange={(e) => handleSelectAll(e, paginatedData)}
                      checked={paginatedData.length > 0 && selectedIds.size === paginatedData.length}
                      className="rounded text-violet-600 border-slate-350 focus:ring-violet-600 w-4 h-4 cursor-pointer"
                    />
                  </th>
                )}
                {activeColumns.map((col) => (
                  <th 
                    key={col.key} 
                    onClick={() => col.sortable && handleSort(col.key)}
                    className={`px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-450 dark:text-slate-400 select-none ${col.sortable ? 'cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-900/50' : ''}`}
                  >
                    <div className="flex items-center gap-1">
                      <span>{col.title}</span>
                      {col.sortable && sortConfig && sortConfig.key === col.key && (
                        sortConfig.direction === 'ascending' ? <ChevronUp className="w-3 h-3 text-violet-600" /> : <ChevronDown className="w-3 h-3 text-violet-600" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850/50">
              {loading ? (
                Array.from({ length: pageSize }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    {bulkActions.length > 0 && <td className="px-6 py-4 w-4 h-4"><div className="w-4 h-4 bg-slate-105 dark:bg-slate-850 rounded"></div></td>}
                    {activeColumns.map(c => (
                      <td key={c.key} className="px-6 py-4"><div className="h-4 bg-slate-105 dark:bg-slate-850 rounded w-2/3"></div></td>
                    ))}
                  </tr>
                ))
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={activeColumns.length + (bulkActions.length > 0 ? 1 : 0)} className="text-center py-12 px-4 text-xs font-semibold text-slate-400">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                paginatedData.map((row) => {
                  const isSelected = selectedIds.has(row.id);
                  return (
                    <tr 
                      key={row.id} 
                      onClick={() => onRowClick && onRowClick(row)}
                      className={`hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-all ${onRowClick ? 'cursor-pointer' : ''} ${isSelected ? 'bg-violet-50/10 dark:bg-violet-955/10' : ''}`}
                    >
                      {bulkActions.length > 0 && (
                        <td className="px-6 py-4 w-10 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(row.id)}
                            className="rounded text-violet-600 border-slate-350 focus:ring-violet-600 w-4 h-4 cursor-pointer"
                          />
                        </td>
                      )}
                      {activeColumns.map((col) => (
                        <td key={col.key} className="px-6 py-3.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {col.render ? col.render(row[col.key], row) : row[col.key]}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer controls */}
        <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-850 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-405 dark:text-slate-500">Rows per page</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-850 text-xs font-bold rounded-lg px-2 py-1 focus:ring-1 focus:ring-violet-650"
            >
              {[5, 10, 20, 50].map(sz => (
                <option key={sz} value={sz}>{sz}</option>
              ))}
            </select>
            <span className="text-[11px] font-bold text-slate-405 dark:text-slate-500 ml-2">
              Showing {processedData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, processedData.length)} of {processedData.length} entries
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 border dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-550 disabled:opacity-40 hover:bg-slate-100"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => {
              const p = idx + 1;
              const isCurrent = p === currentPage;
              return (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                    isCurrent 
                      ? 'bg-violet-600 text-white shadow-sm' 
                      : 'border dark:border-slate-800 bg-slate-50 dark:bg-slate-955 text-slate-550 hover:bg-slate-100'
                  }`}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 border dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-955 text-slate-550 disabled:opacity-40 hover:bg-slate-100"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Bulk Actions Drawer */}
      {selectedIds.size > 0 && bulkActions.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-4 z-40 transition-all select-none">
          <span className="text-xs font-bold text-violet-400">{selectedIds.size} row(s) selected</span>
          <div className="h-4 w-px bg-slate-800"></div>
          <div className="flex items-center gap-2">
            {bulkActions.map((action, idx) => {
              const ActionIcon = action.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    action.onClick(Array.from(selectedIds));
                    setSelectedIds(new Set());
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-xs font-bold rounded-lg transition-colors text-white"
                >
                  {ActionIcon && <ActionIcon className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
export default DataTable;
