import React from 'react';
import { useParams } from 'react-router-dom';
import {
    UserGroupIcon,
    AcademicCapIcon,
    BuildingOfficeIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';

const DashboardCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all group shadow-sm dark:shadow-none">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-opacity-100`}>
                <Icon className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded"> +12.5% </span>
        </div>
        <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</p>
    </div> 
);

const Dashboard = () => {
    const { tenantName } = useParams();  

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 capitalize">
                    Welcome Back, {tenantName}! 👋
                </h1>

                <p className="text-slate-500 dark:text-slate-400 text-sm">
                    Here is what's happening in your organization today.
                </p>
                
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardCard
                    title="Total Students"
                    value="1,284"
                    icon={UserGroupIcon}
                    color="bg-blue-500 text-blue-500"
                />

                <DashboardCard
                    title="Active Teachers"
                    value="42"
                    icon={AcademicCapIcon}
                    color="bg-purple-500 text-purple-500"
                />

                <DashboardCard
                    title="Departments"
                    value="12"
                    icon={BuildingOfficeIcon}
                    color="bg-emerald-500 text-emerald-500"
                />

                <DashboardCard
                    title="Revenue"
                    value="$12,450"
                    icon={ChartBarIcon}
                    color="bg-amber-500 text-amber-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 h-64 flex flex-col items-center justify-center text-center shadow-sm dark:shadow-none">
                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-600/10 rounded-full flex items-center justify-center mb-4">
                        <ChartBarIcon className="w-8 h-8 text-blue-500" />
                    </div>
                    <h3 className="text-slate-900 dark:text-white font-semibold mb-1">Growth Analytics</h3>
                    <p className="text-slate-500 text-sm max-w-[250px]">
                        Your organization has grown by 15% compared to last month.
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 h-64 flex flex-col items-center justify-center text-center shadow-sm dark:shadow-none">
                    <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-600/10 rounded-full flex items-center justify-center mb-4">
                        <UserGroupIcon className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h3 className="text-slate-900 dark:text-white font-semibold mb-1">Recent Activity</h3>
                    <p className="text-slate-500 text-sm max-w-[250px]">
                        15 new students enrolled in the last 24 hours.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
