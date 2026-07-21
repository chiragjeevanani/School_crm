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
} from 'lucide-react';
import { exportToCSV } from '../lib/exportHelpers';
import { cn } from '../lib/cn';

// Canonical merged DataTable — superset of three gen-2 DataTable variants
// that had diverged in prop naming:
//   - HR/accountant/principal: columns use `title`, single `searchKey`,
//     explicit `filterOptions`, array `bulkActions` (`{label, onClick, icon}`),
//     `loading`/`emptyMessage`.
//   - librarian/transport: columns use `title` + per-column `filterable`,
//     `searchKeys` (array), extra `actions` render slot, `bulkActions` as a
//     render-prop FUNCTION `(selectedRows, clearSelection) => ReactNode`.
//   - school-admin: columns use `header`/`id`, no explicit search prop
//     (searches every field by default), array `bulkActions` with an
//     `action` key + `variant`, `isLoading`/`enableExport`/`exportFilename`.
// All three naming conventions are accepted below via aliasing, and
// `bulkActions` is detected at runtime (array vs function) since that was
// the one genuinely incompatible shape. (Verified via repo-wide grep that
// `bulkActions` and `actions` are not currently passed by any page, so
// there was no real call-site behavior to preserve for those two — the
// support below is forward-looking superset coverage only.)
export const DataTable = ({
  columns,
  data,
  initialData,
  searchPlaceholder = 'Search records...',
  searchKey,
  searchKeys,
  filterOptions = [],
  bulkActions,
  actions,
  onRowClick,
  loading,
  isLoading,
  emptyMessage = 'No matching records found.',
  enableExport = true,
  csvFilename,
  exportFilename,
}) => {
  const rows = data ?? initialData ?? [];
  const busy = loading ?? isLoading ?? false;
  const exportName = csvFilename || exportFilename || `export_${Date.now()}.csv`;
  const getKey = (col) => col.key ?? col.id;
  const getTitle = (col) => col.title ?? col.header ?? '';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({});
  const [sortConfig, setSortConfig] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [visibleColumns, setVisibleColumns] = useState(() => new Set(columns.map(getKey)));
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [showColumnToggle, setShowColumnToggle] = useState(false);

  const effectiveSearchKeys = searchKeys?.length ? searchKeys : (searchKey ? [searchKey] : null);
  const derivedFilterOptions = filterOptions.length
    ? filterOptions
    : columns.filter(c => c.filterable).map(c => {
        const values = rows.map(item => item[getKey(c)]).filter(v => v !== null && v !== undefined && v !== '');
        return {
          key: getKey(c),
          label: getTitle(c),
          options: [...new Set(values)].map(v => ({ label: String(v), value: String(v) })),
        };
      });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (key, value) => {
    setSelectedFilters(prev => {
      const next = { ...prev };
      if (!value || value === 'ALL') delete next[key];
      else next[key] = value;
      return next;
    });
    setCurrentPage(1);
  };

  const handleSort = (col) => {
    if (!col.sortable) return;
    const key = getKey(col);
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleSelectAll = (e, currentRows) => {
    setSelectedIds(e.target.checked ? new Set(currentRows.map(r => r.id)) : new Set());
  };

  const handleSelectRow = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
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
    let result = [...rows];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item => {
        if (effectiveSearchKeys) {
          return effectiveSearchKeys.some(key => {
            const val = item[key];
            return val !== null && val !== undefined && String(val).toLowerCase().includes(term);
          });
        }
        return Object.values(item).some(val => {
          if (val === null || val === undefined) return false;
          return String(val).toLowerCase().includes(term);
        });
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
  }, [rows, searchTerm, effectiveSearchKeys, selectedFilters, sortConfig]);

  const totalPages = Math.ceil(processedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedData.slice(start, start + pageSize);
  }, [processedData, currentPage, pageSize]);

  const activeColumns = columns.filter(c => visibleColumns.has(getKey(c)));
  const hasBulkArray = Array.isArray(bulkActions) && bulkActions.length > 0;
  const hasBulkFn = typeof bulkActions === 'function';
  const showBulkCheckboxes = hasBulkArray || hasBulkFn;

  const clearSelection = () => setSelectedIds(new Set());

  return (
    <div className="space-y-4 text-xs font-semibold">
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pl-9 pr-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>
          {derivedFilterOptions.length > 0 && (
            <button
              onClick={() => setShowFilterDrawer(!showFilterDrawer)}
              className={cn(
                "p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all shrink-0",
                showFilterDrawer
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 dark:bg-slate-950 dark:border-slate-800"
              )}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5 self-end md:self-auto flex-wrap">
          <div className="relative">
            <button
              onClick={() => setShowColumnToggle(!showColumnToggle)}
              className="px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Columns</span>
            </button>
            {showColumnToggle && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-xl z-20 space-y-1.5">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block pb-1 border-b border-slate-100 dark:border-slate-800">Toggle Columns</span>
                <div className="max-h-48 overflow-y-auto space-y-1 pt-1.5">
                  {columns.map(c => (
                    <label key={getKey(c)} className="flex items-center gap-2 px-1 py-0.5 cursor-pointer text-xs font-semibold">
                      <input
                        type="checkbox"
                        checked={visibleColumns.has(getKey(c))}
                        onChange={() => toggleColumn(getKey(c))}
                        className="rounded text-primary border-slate-300 w-3.5 h-3.5 focus:ring-primary"
                      />
                      <span className="truncate">{getTitle(c)}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {enableExport && (
            <button
              onClick={() => exportToCSV(processedData, exportName)}
              className="px-3.5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          )}

          {actions}
        </div>
      </div>

      {/* Advanced Filter Drawer */}
      {showFilterDrawer && derivedFilterOptions.length > 0 && (
        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {derivedFilterOptions.map((filter) => (
            <div key={filter.key} className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                {filter.label}
              </label>
              <select
                value={selectedFilters[filter.key] || 'ALL'}
                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold rounded-xl px-2.5 py-2 focus:ring-1 focus:ring-primary"
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

      {/* Bulk action panel (function render-prop form) */}
      {selectedIds.size > 0 && hasBulkFn && (
        <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl flex items-center justify-between">
          <span className="text-xs font-bold text-primary">{selectedIds.size} item(s) selected</span>
          <div className="flex gap-2">
            {bulkActions(Array.from(selectedIds), clearSelection)}
          </div>
        </div>
      )}

      {/* Table Data View */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse font-sans">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
                {showBulkCheckboxes && (
                  <th className="px-6 py-4 w-10 shrink-0">
                    <input
                      type="checkbox"
                      onChange={(e) => handleSelectAll(e, paginatedData)}
                      checked={paginatedData.length > 0 && selectedIds.size === paginatedData.length}
                      className="rounded text-primary border-slate-300 focus:ring-primary w-4 h-4 cursor-pointer"
                    />
                  </th>
                )}
                {activeColumns.map((col) => (
                  <th
                    key={getKey(col)}
                    onClick={() => handleSort(col)}
                    className={cn(
                      "px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 select-none",
                      col.sortable && "cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-900/50"
                    )}
                  >
                    <div className="flex items-center gap-1">
                      <span>{getTitle(col)}</span>
                      {col.sortable && sortConfig && sortConfig.key === getKey(col) && (
                        sortConfig.direction === 'ascending' ? <ChevronUp className="w-3 h-3 text-primary" /> : <ChevronDown className="w-3 h-3 text-primary" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {busy ? (
                Array.from({ length: pageSize }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    {showBulkCheckboxes && <td className="px-6 py-4 w-4 h-4"><div className="w-4 h-4 bg-slate-100 dark:bg-slate-800 rounded" /></td>}
                    {activeColumns.map(c => (
                      <td key={getKey(c)} className="px-6 py-4"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-2/3" /></td>
                    ))}
                  </tr>
                ))
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={activeColumns.length + (showBulkCheckboxes ? 1 : 0)} className="text-center py-12 px-4 text-xs font-semibold text-slate-400">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, rIdx) => {
                  const isSelected = selectedIds.has(row.id);
                  return (
                    <tr
                      key={row.id ?? rIdx}
                      onClick={() => onRowClick && onRowClick(row)}
                      className={cn(
                        "hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all",
                        onRowClick && "cursor-pointer",
                        isSelected && "bg-primary/5"
                      )}
                    >
                      {showBulkCheckboxes && (
                        <td className="px-6 py-4 w-10 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(row.id)}
                            className="rounded text-primary border-slate-300 focus:ring-primary w-4 h-4 cursor-pointer"
                          />
                        </td>
                      )}
                      {activeColumns.map((col) => (
                        <td key={getKey(col)} className="px-6 py-3.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {col.render ? col.render(row[getKey(col)], row) : (row[getKey(col)] ?? '-')}
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
        <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">Rows per page</span>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold rounded-lg px-2 py-1 focus:ring-1 focus:ring-primary"
            >
              {[5, 10, 20, 50].map(sz => (<option key={sz} value={sz}>{sz}</option>))}
            </select>
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 ml-2">
              Showing {processedData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, processedData.length)} of {processedData.length} entries
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-500 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800"
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
                  className={cn(
                    "w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-all",
                    isCurrent
                      ? "bg-primary text-white shadow-sm"
                      : "border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-500 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Bulk Actions Drawer (array form) */}
      {selectedIds.size > 0 && hasBulkArray && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-4 z-40 transition-all select-none">
          <span className="text-xs font-bold text-primary/80">{selectedIds.size} row(s) selected</span>
          <div className="h-4 w-px bg-slate-800" />
          <div className="flex items-center gap-2">
            {bulkActions.map((action, idx) => {
              const ActionIcon = action.icon;
              const handler = action.onClick || action.action;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    handler && handler(Array.from(selectedIds));
                    clearSelection();
                  }}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors text-white",
                    action.variant === 'danger' ? "bg-rose-600 hover:bg-rose-700" : "bg-slate-800 hover:bg-slate-700"
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
    </div>
  );
};

export default DataTable;
