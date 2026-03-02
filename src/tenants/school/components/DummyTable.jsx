import React from 'react';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

const DummyTable = ({ title, columns, data, onEdit, onDelete }) => {
    if (!data?.length) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <p className="text-lg font-medium">No records found for {title}</p>
                <p className="text-sm opacity-70">Add new records to see them here.</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="mb-4">
                <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
            </div>

            {/* --- Mobile View: Cards --- */}
            <div className="grid grid-cols-1 gap-4 md:hidden px-4 pb-6">
                {data.map((item, index) => (
                    <div key={index} className="bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-md">
                        {columns.map((col) => (
                            <div key={col.key} className="mb-2">
                                <p className="text-slate-500 text-xs uppercase font-semibold">{col.header}</p>
                                <p className="text-slate-300">{item[col.key]}</p>
                            </div>
                        ))}
                        <div className="flex justify-end gap-2 mt-4">
                            <button onClick={() => onEdit && onEdit(item)} className="flex-1 flex justify-center items-center gap-2 bg-slate-700/50 text-cyan-400 p-2 rounded-lg hover:bg-slate-700 transition">
                                <PencilSquareIcon className="h-5 w-5" /> <span className="text-xs font-bold">Edit</span>
                            </button>
                            <button onClick={() => onDelete && onDelete(item)} className="flex-1 flex justify-center items-center gap-2 bg-slate-700/50 text-rose-400 p-2 rounded-lg hover:bg-slate-700 transition">
                                <TrashIcon className="h-5 w-5" /> <span className="text-xs font-bold">Delete</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- Desktop View: Table --- */}
            <div className="hidden md:block bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-xl">
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700">
                    <table className="w-full divide-y divide-slate-700 border-collapse">
                        <thead className="bg-slate-800/50">
                            <tr>
                                {columns.map((col) => (
                                    <th key={col.key} className="table-head whitespace-nowrap">{col.header}</th>
                                ))}
                                <th className="table-head text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {data.map((item, index) => (
                                <tr key={index} className="hover:bg-slate-800/40 transition-colors duration-200">
                                    {columns.map((col) => (
                                        <td key={col.key} className="table-cell text-slate-300 whitespace-nowrap">
                                            {item[col.key]}
                                        </td>
                                    ))}
                                    <td className="table-cell text-right whitespace-nowrap">
                                        <div className="flex justify-end space-x-1">
                                            <button onClick={() => onEdit && onEdit(item)} className="text-cyan-400 hover:text-cyan-300 p-2 rounded-lg hover:bg-cyan-400/10 transition-all active:scale-90">
                                                <PencilSquareIcon className="h-5 w-5" />
                                            </button>
                                            <button onClick={() => onDelete && onDelete(item)} className="text-rose-400 hover:text-rose-300 p-2 rounded-lg hover:bg-rose-400/10 transition-all active:scale-90">
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <style jsx>{`
                .table-head { padding: 16px 20px; text-align: left; font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; }
                .table-cell { padding: 14px 20px; font-size: 14px; }
                .scrollbar-thin::-webkit-scrollbar { height: 6px; }
                .scrollbar-thin::-webkit-scrollbar-track { background: #0f172a; }
                .scrollbar-thin::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default DummyTable;
