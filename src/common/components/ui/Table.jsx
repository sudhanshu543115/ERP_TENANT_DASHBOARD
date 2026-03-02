import React, { useState } from 'react';
import {
  PencilSquareIcon,
  TrashIcon,
  ChevronUpDownIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const Table = ({ data, columns, onEdit, onDelete, primaryKey = 'id', isLoading = false, striped = false, compact = false, hoverable = false, onSort }) => {
  const [expandedRows, setExpandedRows] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }


  const primaryDisplayColumn = columns.find(c => c.isPrimary) || columns[0] || { key: primaryKey, header: 'ID' };
  const secondaryDisplayColumn = columns.find(c => c.isSecondary) || null;

  if (!data?.length) {
    return (
      <div className="w-full">
        {/* --- Mobile Cards --- */}
        <div className="grid grid-cols-1 gap-4 md:hidden px-4 pb-6">
          {data.map((item) => (
            <div key={item[primaryKey]} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-3">
                <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">{primaryDisplayColumn.header}</p>
                <h3 className="text-slate-900 dark:text-white font-bold text-lg truncate">{item[primaryDisplayColumn.key]}</h3>
                {secondaryDisplayColumn && (
                  <p className="text-slate-500 dark:text-slate-400 text-sm truncate">{item[secondaryDisplayColumn.key]}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 py-3 border-t border-b border-slate-200 dark:border-slate-700 text-sm">
                {columns.filter(c => !c.isPrimary && !c.isSecondary).slice(0, 4).map(col => (
                  <div key={col.key}>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">{col.header}</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 truncate">{col.render ? col.render(item) : item[col.key]}</p>
                  </div>
                ))}
              </div>

              {(onEdit || onDelete) && (
                <div className="flex justify-end gap-2 mt-4">
                  {onEdit && (
                    <button onClick={() => onEdit(item)} className="flex-1 flex justify-center items-center gap-2 bg-slate-100 dark:bg-slate-700/40 text-cyan-600 dark:text-cyan-400 p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                      <PencilSquareIcon className="h-5 w-5" /> <span className="text-xs font-semibold">Edit</span>
                    </button>
                  )}
                  {onDelete && (
                    <button onClick={() => onDelete(item[primaryKey])} className="flex-1 flex justify-center items-center gap-2 bg-slate-100 dark:bg-slate-700/40 text-rose-600 dark:text-rose-400 p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                      <TrashIcon className="h-5 w-5" /> <span className="text-xs font-semibold">Delete</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* --- Desktop Table --- */}
        <div className="hidden md:block">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
            <table className="w-full table-auto border-collapse bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <thead className="bg-slate-50 dark:bg-slate-900">
                <tr>
                  {columns.map(col => (
                    <th key={col.key} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {col.header}
                    </th>
                  ))}
                  {(onEdit || onDelete) && (
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {data.map((item, idx) => (
                  <tr key={item[primaryKey]} className={`border-b border-slate-200 dark:border-slate-700 ${idx % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-900'} hover:bg-slate-100 dark:hover:bg-slate-700/50 transition`}>
                    {columns.map(col => (
                      <td key={col.key} className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300 truncate">
                        {col.render ? col.render(item) : item[col.key]}
                      </td>
                    ))}
                    {(onEdit || onDelete) && (
                      <td className="px-4 py-3 text-right flex justify-end gap-2">
                        {onEdit && <button onClick={() => onEdit(item)} className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 p-2 rounded-lg hover:bg-cyan-50 dark:hover:bg-cyan-400/10 transition-all active:scale-90"><PencilSquareIcon className="h-5 w-5" /></button>}
                        {onDelete && <button onClick={() => onDelete(item[primaryKey])} className="text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-400/10 transition-all active:scale-90"><TrashIcon className="h-5 w-5" /></button>}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <style jsx>{`
                .scrollbar-thin::-webkit-scrollbar { height: 6px; width: 6px; }
                .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
                .scrollbar-thin::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 8px; }
                .dark .scrollbar-thin::-webkit-scrollbar-thumb { background: #334155; }
            `}</style>
        <div className="mt-8 text-center">
          <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">No data found</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Try adding a new entry or adjusting your filters</p>
        </div>
      </div>
    );
  }



  const toggleRowExpansion = (rowId) => {
    setExpandedRows(prev => ({
      ...prev,
      [rowId]: !prev[rowId]
    }));
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null;
    }

    setSortConfig({ key, direction });
    if (onSort) {
      onSort(key, direction);
    }
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ChevronUpDownIcon className="h-4 w-4 text-slate-400" />;
    }
    return sortConfig.direction === 'asc'
      ? <span className="text-cyan-600">↑</span>
      : sortConfig.direction === 'desc'
        ? <span className="text-cyan-600">↓</span>
        : <ChevronUpDownIcon className="h-4 w-4 text-slate-400" />;
  };

  const cellPadding = compact ? 'px-3 py-2' : 'px-5 py-4';

  return (
    <div className="w-full bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">

      {/* Mobile View: Cards */}
      <div className="grid grid-cols-1 gap-4 lg:hidden p-4">
        {data.map((item, index) => (
          <div
            key={item[primaryKey]}
            className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-cyan-200 dark:hover:border-cyan-800"
          >
            {/* Card Header with Primary Info */}
            <div
              className="p-4 cursor-pointer flex items-center justify-between"
              onClick={() => toggleRowExpansion(item[primaryKey])}
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                  {index + 1}
                </div>
                <div>
                  <div className="text-slate-900 dark:text-white font-semibold text-base">
                    {primaryDisplayColumn.render ? primaryDisplayColumn.render(item) : item[primaryDisplayColumn.key]}
                  </div>
                  {secondaryDisplayColumn && (
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                      {item[secondaryDisplayColumn.key]}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {(onEdit || onDelete) && (
                  <div className="flex items-center gap-1">
                    {onEdit && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onEdit(item); }}
                        className="p-2 text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-400/10 rounded-lg transition-all"
                      >
                        <PencilSquareIcon className="h-4 w-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onDelete(item[primaryKey]); }}
                        className="p-2 text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-400/10 rounded-lg transition-all"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                )}
                <ChevronUpDownIcon className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${expandedRows[item[primaryKey]] ? 'rotate-180' : ''}`} />
              </div>
            </div>

            {/* Expanded Content */}
            {expandedRows[item[primaryKey]] && (
              <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4">
                <div className="grid grid-cols-2 gap-4">
                  {columns
                    .filter(c => c.key !== primaryDisplayColumn.key && (!secondaryDisplayColumn || c.key !== secondaryDisplayColumn.key))
                    .map(col => (
                      <div key={col.key} className="space-y-1">
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          {col.header}
                        </p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {col.render ? col.render(item) : item[col.key] || '-'}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop View: Single Table with Sticky Columns */}
      <div className="hidden lg:block overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
              {/* Primary Column - Sticky Left */}
              <th className={`${cellPadding} text-left sticky left-0 z-20 bg-slate-50 dark:bg-slate-800 shadow-[4px_0_24px_-2px_rgba(0,0,0,0.1)]`}>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {primaryDisplayColumn.header}
                  </span>
                  <button
                    onClick={() => handleSort(primaryDisplayColumn.key)}
                    className="hover:bg-slate-100 dark:hover:bg-slate-700 rounded p-1"
                  >
                    {getSortIcon(primaryDisplayColumn.key)}
                  </button>
                </div>
              </th>

              {/* Other Columns */}
              {columns.slice(1).map(col => (
                <th key={col.key} className={`${cellPadding} text-left whitespace-nowrap`}>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {col.header}
                    </span>
                    <button
                      onClick={() => handleSort(col.key)}
                      className="hover:bg-slate-100 dark:hover:bg-slate-700 rounded p-1"
                    >
                      {getSortIcon(col.key)}
                    </button>
                  </div>
                </th>
              ))}

              {/* Actions Column - Sticky Right */}
              {(onEdit || onDelete) && (
                <th className={`${cellPadding} text-right sticky right-0 z-20 bg-slate-50 dark:bg-slate-800 shadow-[-4px_0_24px_-2px_rgba(0,0,0,0.1)]`}>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Actions
                  </span>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {data.map((item, index) => (
              <tr
                key={item[primaryKey]}
                className={`
                  ${striped && index % 2 === 1 ? 'bg-slate-50 dark:bg-slate-800/50' : 'bg-white dark:bg-slate-800'}
                  ${hoverable ? 'hover:bg-slate-100 dark:hover:bg-slate-700/50' : ''}
                  transition-colors duration-150
                `}
              >
                {/* Primary Cell - Sticky Left */}
                <td className={`${cellPadding} font-medium text-slate-900 dark:text-white sticky left-0 z-10 ${striped && index % 2 === 1 ? 'bg-slate-50 dark:bg-slate-800/50' : 'bg-white dark:bg-slate-800'} shadow-[4px_0_24px_-2px_rgba(0,0,0,0.1)]`}>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-semibold bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded-full">
                      {index + 1}
                    </span>
                    {primaryDisplayColumn.render ? primaryDisplayColumn.render(item) : <span>{item[primaryDisplayColumn.key]}</span>}
                    {secondaryDisplayColumn && (
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {item[secondaryDisplayColumn.key]}
                      </span>
                    )}
                  </div>
                </td>

                {/* Other Cells */}
                {columns.slice(1).map(col => (
                  <td key={col.key} className={`${cellPadding} whitespace-nowrap text-slate-600 dark:text-slate-300`}>
                    {col.render ? col.render(item) : item[col.key] || '-'}
                  </td>
                ))}

                {/* Actions Cell - Sticky Right */}
                {(onEdit || onDelete) && (
                  <td className={`${cellPadding} text-right sticky right-0 z-10 ${striped && index % 2 === 1 ? 'bg-slate-50 dark:bg-slate-800/50' : 'bg-white dark:bg-slate-800'} shadow-[-4px_0_24px_-2px_rgba(0,0,0,0.1)]`}>
                    <div className="flex justify-end items-center gap-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className="p-1.5 text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-400/10 rounded-lg transition-all"
                          title="Edit"
                        >
                          <PencilSquareIcon className="h-4 w-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(item[primaryKey])}
                          className="p-1.5 text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-400/10 rounded-lg transition-all"
                          title="Delete"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          height: 8px;
          width: 8px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 20px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
          background-clip: content-box;
        }
        .dark .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #475569;
          background-clip: content-box;
        }
        .dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #64748b;
          background-clip: content-box;
        }
      `}</style>
    </div>
  );
};

export default Table;
