import React from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useNavigate, useParams } from "react-router-dom";


const ExamTable = ({ data, onEdit, onDelete }) => {
    const params = useParams();
    console.log(params);

    const exams = data || [];
    const navigate = useNavigate()
    if (!exams?.length) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <p className="text-lg font-medium">No examinations found</p>
                <p className="text-sm opacity-70">Click "Add Examination" to create one.</p>
            </div>
        );
    }

    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString();
    };

    return (
        <div className="w-full">

            {/* ---------- Mobile Card View ---------- */}
            <div className="grid grid-cols-1 gap-4 md:hidden px-4 pb-6">
                {exams.map((exam) => (
                    <div key={exam.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-md">

                        <h3 className="text-white font-bold text-lg mb-1">
                            {exam.name}
                        </h3>

                        <p className="text-slate-400 text-sm mb-2">
                            {exam.examType} • {exam.academicYear}
                        </p>

                        <div className="grid grid-cols-2 gap-2 py-3 border-y border-slate-700/50 text-sm">
                            <div>
                                <p className="text-slate-500 text-xs uppercase font-semibold">Term</p>
                                <p className="text-slate-300">{exam.term}</p>
                            </div>

                            <div>
                                <p className="text-slate-500 text-xs uppercase font-semibold">Schedules</p>
                                <p className="text-slate-300">
                                    {exam.schedules?.length || 0}
                                </p>
                            </div>

                            <div>
                                <p className="text-slate-500 text-xs uppercase font-semibold">Start</p>
                                <p className="text-slate-300">
                                    {formatDate(exam.startDate)}
                                </p>
                            </div>

                            <div>
                                <p className="text-slate-500 text-xs uppercase font-semibold">End</p>
                                <p className="text-slate-300">
                                    {formatDate(exam.endDate)}
                                </p>
                            </div>
                        </div>

                        <p className="text-slate-400 text-sm mt-3 line-clamp-2">
                            {exam.description}
                        </p>

                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => onEdit(exam)}
                                className="flex-1 flex justify-center items-center gap-2 bg-slate-700/50 text-cyan-400 p-2 rounded-lg hover:bg-slate-700 transition"
                            >
                                <PencilSquareIcon className="h-5 w-5" />
                                <span className="text-xs font-bold">Edit</span>
                            </button>

                            <button
                                onClick={() => onDelete(exam.id)}
                                className="flex-1 flex justify-center items-center gap-2 bg-slate-700/50 text-rose-400 p-2 rounded-lg hover:bg-slate-700 transition"
                            >
                                <TrashIcon className="h-5 w-5" />
                                <span className="text-xs font-bold">Delete</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* ---------- Desktop Table View ---------- */}
            <div className="hidden md:block bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-xl">
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700">
                    <table className="w-full divide-y divide-slate-700 border-collapse">

                        <thead className="bg-slate-800/50">
                            <tr>
                                <th className="table-head">Exam Name</th>
                                <th className="table-head">Type</th>
                                <th className="table-head">Academic Year</th>
                                <th className="table-head">Term</th>
                                <th className="table-head">Start Date</th>
                                <th className="table-head">End Date</th>
                                <th className="table-head text-center">Schedules</th>
                                <th className="table-head text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-700">
                            {exams.map((exam) => (
                                <tr
                                    key={exam.id}
                                    className="hover:bg-slate-800/40 transition-colors duration-200"
                                >
                                    <td className="table-cell font-semibold text-white">
                                        {exam.name}
                                    </td>

                                    <td className="table-cell text-slate-300">
                                        {exam.examType}
                                    </td>

                                    <td className="table-cell text-slate-300">
                                        {exam.academicYear}
                                    </td>

                                    <td className="table-cell text-slate-300">
                                        {exam.term}
                                    </td>

                                    <td className="table-cell text-slate-400">
                                        {formatDate(exam.startDate)}
                                    </td>

                                    <td className="table-cell text-slate-400">
                                        {formatDate(exam.endDate)}
                                    </td>

                                    <td className="table-cell text-center">
                                        <span
                                            className=" cursor-pointer inline-flex px-3 py-1 text-[11px] rounded-full font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                                            onClick={() => navigate(`/${params.tenantName}/${params.domain}/exam-schedule/${exam.id}`)}
                                        >
                                            {exam.schedules?.length || 0}
                                        </span>
                                    </td>

                                    <td className="table-cell text-right whitespace-nowrap">
                                        <div className="flex justify-end space-x-1">
                                            <button
                                                onClick={() => onEdit(exam)}
                                                className="text-cyan-400 hover:text-cyan-300 p-2 rounded-lg hover:bg-cyan-400/10 transition-all active:scale-90"
                                            >
                                                <PencilSquareIcon className="h-5 w-5" />
                                            </button>

                                            <button
                                                onClick={() => onDelete(exam.id)}
                                                className="text-rose-400 hover:text-rose-300 p-2 rounded-lg hover:bg-rose-400/10 transition-all active:scale-90"
                                            >
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
                .table-head {
                    padding: 16px 20px;
                    text-align: left;
                    font-size: 11px;
                    font-weight: 700;
                    color: #94a3b8;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }

                .table-cell {
                    padding: 14px 20px;
                    font-size: 14px;
                }

                .scrollbar-thin::-webkit-scrollbar {
                    height: 6px;
                }

                .scrollbar-thin::-webkit-scrollbar-track {
                    background: #0f172a;
                }

                .scrollbar-thin::-webkit-scrollbar-thumb {
                    background: #334155;
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
};

export default ExamTable;
