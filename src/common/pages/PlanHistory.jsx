import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/authcontext';
import { useGetSubscriptionHistoryQuery } from '../../api/services/planapi'; // adjust path

const PlanHistory = ({ tenantId }) => {
    const { tenantName } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    // Fetch history from API
    const { data: history = [], isLoading, isError } = useGetSubscriptionHistoryQuery(tenantId || user?.id);

    if (isLoading) return <div className="text-center text-white py-20">Loading subscription history...</div>;
    if (isError) return <div className="text-center text-red-500 py-20">Failed to load subscription history.</div>;
    if (!history.length) return <div className="text-center text-white py-20">No subscription history available.</div>;

    return (
        <div className="min-h-screen bg-[#0B1120] text-white p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-6xl mx-auto"
            >
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                            Subscription History
                        </h1>
                        <p className="text-slate-400 mt-2">View your past subscription plans and billing details.</p>
                    </div>
                    <button className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl border border-slate-700 transition-all font-medium">
                        Download Statement
                    </button>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-800 bg-slate-900/80">
                                    <th className="p-6 text-slate-400 font-semibold text-sm uppercase tracking-wider">Plan Name</th>
                                    <th className="p-6 text-slate-400 font-semibold text-sm uppercase tracking-wider">Start Date</th>
                                    <th className="p-6 text-slate-400 font-semibold text-sm uppercase tracking-wider">Amount</th>
                                    <th className="p-6 text-slate-400 font-semibold text-sm uppercase tracking-wider">Status</th>
                                    <th className="p-6 text-slate-400 font-semibold text-sm uppercase tracking-wider">Invoice</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {history.map((item, index) => (
                                    <motion.tr
                                        key={item.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="hover:bg-slate-800/30 transition-colors group"
                                    >
                                        <td className="p-6 font-medium text-white group-hover:text-cyan-400 transition-colors">
                                            {item.planName}
                                        </td>
                                        <td className="p-6 text-slate-400">
                                            {item.startDate}
                                        </td>
                                        <td className="p-6 text-slate-300 font-mono">
                                            ${item.amount}
                                        </td>
                                        <td className="p-6">
                                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${item.status === 'active'
                                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                    : 'bg-slate-700/30 text-slate-400 border-slate-600/30'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <button className="text-blue-400 hover:text-blue-300 font-medium text-sm flex items-center gap-2 transition-colors">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    PDF
                                                </button>
                                                {item.status !== 'active' && (
                                                    <button
                                                        onClick={() => navigate(`/${tenantName}/pricing`)}
                                                        className="text-emerald-400 hover:text-emerald-300 font-medium text-sm flex items-center gap-2 transition-colors"
                                                    >
                                                        Renew
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default PlanHistory;