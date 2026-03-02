import React, { useState, useMemo } from 'react';
import {
    PlusIcon,
    CurrencyDollarIcon,
    BanknotesIcon,
    CreditCardIcon,
    DocumentTextIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    PencilIcon,
    TrashIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    ArrowDownTrayIcon,
    PrinterIcon,
    SparklesIcon,
    ChartBarIcon,
    UserGroupIcon,
    CalendarIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

const FeeManagement = () => {
    const [selectedTab, setSelectedTab] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Mock data - replace with actual API data
    const feeCollections = [
        { 
            id: 1, 
            studentName: 'Rahul Sharma', 
            class: '10A', 
            feeType: 'Tuition Fee', 
            amount: 5000, 
            dueDate: '2024-02-15', 
            status: 'paid', 
            paidDate: '2024-02-10',
            paymentMethod: 'Online',
            color: 'emerald'
        },
        { 
            id: 2, 
            studentName: 'Priya Patel', 
            class: '10B', 
            feeType: 'Tuition Fee', 
            amount: 5000, 
            dueDate: '2024-02-15', 
            status: 'pending', 
            paidDate: null,
            paymentMethod: null,
            color: 'amber'
        },
        { 
            id: 3, 
            studentName: 'Amit Kumar', 
            class: '9A', 
            feeType: 'Library Fee', 
            amount: 1000, 
            dueDate: '2024-02-20', 
            status: 'overdue', 
            paidDate: null,
            paymentMethod: null,
            color: 'rose'
        },
        { 
            id: 4, 
            studentName: 'Neha Singh', 
            class: '9B', 
            feeType: 'Transport Fee', 
            amount: 2000, 
            dueDate: '2024-02-18', 
            status: 'paid', 
            paidDate: '2024-02-12',
            paymentMethod: 'Cash',
            color: 'emerald'
        },
        { 
            id: 5, 
            studentName: 'Rohan Verma', 
            class: '8A', 
            feeType: 'Tuition Fee', 
            amount: 4500, 
            dueDate: '2024-02-15', 
            status: 'pending', 
            paidDate: null,
            paymentMethod: null,
            color: 'amber'
        },
        { 
            id: 6, 
            studentName: 'Sneha Gupta', 
            class: '8B', 
            feeType: 'Sports Fee', 
            amount: 1500, 
            dueDate: '2024-02-12', 
            status: 'overdue', 
            paidDate: null,
            paymentMethod: null,
            color: 'rose'
        },
    ];

    const feeTypes = [
        { id: 1, name: 'Tuition Fee', amount: 5000, frequency: 'Monthly', students: 245, color: 'blue' },
        { id: 2, name: 'Transport Fee', amount: 2000, frequency: 'Monthly', students: 120, color: 'purple' },
        { id: 3, name: 'Library Fee', amount: 1000, frequency: 'Yearly', students: 380, color: 'emerald' },
        { id: 4, name: 'Sports Fee', amount: 1500, frequency: 'Yearly', students: 150, color: 'amber' },
        { id: 5, name: 'Laboratory Fee', amount: 800, frequency: 'Monthly', students: 180, color: 'rose' },
    ];

    const recentTransactions = [
        { id: 1, student: 'Rahul Sharma', amount: 5000, date: '2024-02-10', method: 'Online', status: 'success' },
        { id: 2, student: 'Neha Singh', amount: 2000, date: '2024-02-12', method: 'Cash', status: 'success' },
        { id: 3, student: 'Priya Patel', amount: 5000, date: '2024-02-13', method: 'Cheque', status: 'pending' },
    ];

    const filteredFees = useMemo(() => {
        return feeCollections.filter(fee => {
            const matchesSearch = fee.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 fee.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 fee.feeType.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filterStatus === 'all' || fee.status === filterStatus;
            return matchesSearch && matchesFilter;
        });
    }, [searchTerm, filterStatus]);

    const stats = [
        {
            id: 1,
            label: 'Total Collection',
            value: '₹1,24,500',
            change: '+12.5%',
            icon: BanknotesIcon,
            color: 'blue',
            gradient: 'from-blue-600 to-blue-400'
        },
        {
            id: 2,
            label: 'Pending Dues',
            value: '₹28,500',
            change: '-5.2%',
            icon: ClockIcon,
            color: 'amber',
            gradient: 'from-amber-600 to-amber-400'
        },
        {
            id: 3,
            label: 'Overdue Amount',
            value: '₹12,000',
            change: '+2.1%',
            icon: XCircleIcon,
            color: 'rose',
            gradient: 'from-rose-600 to-rose-400'
        },
        {
            id: 4,
            label: 'Collection Rate',
            value: '78%',
            change: '+8%',
            icon: ChartBarIcon,
            color: 'emerald',
            gradient: 'from-emerald-600 to-emerald-400'
        },
    ];

    const getStatusColor = (status) => {
        const colors = {
            paid: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
            pending: 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200 dark:border-amber-800',
            overdue: 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 border-rose-200 dark:border-rose-800',
        };
        return colors[status] || colors.pending;
    };

    const getColorClasses = (color) => {
        const colors = {
            blue: 'bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border-blue-200 dark:border-blue-800',
            purple: 'bg-purple-50 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 border-purple-200 dark:border-purple-800',
            emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
            amber: 'bg-amber-50 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200 dark:border-amber-800',
            rose: 'bg-rose-50 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 border-rose-200 dark:border-rose-800',
        };
        return colors[color] || colors.blue;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-950">
            
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-amber-400/10 to-rose-400/10 rounded-full blur-3xl animate-pulse delay-700"></div>
            </div>

            <div className="relative px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
                
                {/* Header with Glass Effect */}
                <div className="mb-8 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-teal-600/10 rounded-3xl blur-xl"></div>
                    <div className="relative bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-gray-700/30">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl blur-lg opacity-50"></div>
                                    <div className="relative p-3 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl">
                                        <CurrencyDollarIcon className="h-8 w-8 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                            Fee Management
                                        </h1>
                                        <SparklesIcon className="h-6 w-6 text-amber-500" />
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Track, manage, and collect fees efficiently
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex gap-3">
                                <button className="group relative inline-flex items-center justify-center px-4 py-2.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-xl hover:border-emerald-500/50 transition-all">
                                    <PrinterIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2 group-hover:text-emerald-500 transition-colors" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Print</span>
                                </button>
                                <button className="group relative inline-flex items-center justify-center px-4 py-2.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-xl hover:border-emerald-500/50 transition-all">
                                    <ArrowDownTrayIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2 group-hover:text-emerald-500 transition-colors" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Export</span>
                                </button>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="group relative inline-flex items-center justify-center px-6 py-2.5 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:shadow-teal-600/40 transition-all duration-300"
                                >
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                    <PlusIcon className="h-5 w-5 mr-2 relative z-10 transition-transform group-hover:rotate-90" />
                                    <span className="relative z-10">Collect Fee</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={stat.id}
                                className="group relative animate-in fade-in slide-in-from-bottom-4 duration-700"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                                <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 rounded-2xl p-6 hover:scale-105 transition-all duration-300">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 bg-gradient-to-br ${stat.gradient} rounded-xl shadow-lg`}>
                                            <Icon className="h-6 w-6 text-white" />
                                        </div>
                                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                                            stat.change.startsWith('+') 
                                                ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                                                : 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400'
                                        }`}>
                                            {stat.change}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{stat.value}</p>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                        <div 
                                            className={`bg-gradient-to-r ${stat.gradient} h-1.5 rounded-full transition-all duration-500 group-hover:w-full`}
                                            style={{ width: index === 0 ? '85%' : index === 1 ? '65%' : index === 2 ? '45%' : '78%' }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-6 text-white">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-white/20 rounded-xl">
                                <CreditCardIcon className="h-6 w-6" />
                            </div>
                            <h3 className="font-semibold">Quick Collection</h3>
                        </div>
                        <p className="text-sm text-white/80 mb-4">Collect fees quickly from students</p>
                        <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors text-sm font-medium">
                            Start Collection
                        </button>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-white/20 rounded-xl">
                                <DocumentTextIcon className="h-6 w-6" />
                            </div>
                            <h3 className="font-semibold">Generate Invoice</h3>
                        </div>
                        <p className="text-sm text-white/80 mb-4">Create and send fee invoices</p>
                        <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors text-sm font-medium">
                            Create Invoice
                        </button>
                    </div>

                    <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-white/20 rounded-xl">
                                <ChartBarIcon className="h-6 w-6" />
                            </div>
                            <h3 className="font-semibold">Due Reminders</h3>
                        </div>
                        <p className="text-sm text-white/80 mb-4">Send reminders for pending fees</p>
                        <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors text-sm font-medium">
                            Send Reminders
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-6">
                    <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl p-2 border border-white/20 dark:border-gray-700/30 inline-flex">
                        {['overview', 'collections', 'fee types', 'reports'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setSelectedTab(tab)}
                                className={`relative px-6 py-2.5 text-sm font-medium capitalize rounded-xl transition-all duration-300 ${
                                    selectedTab === tab
                                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="mb-6 flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-emerald-500 transition-colors z-10" />
                        <input
                            type="text"
                            placeholder="Search by student name, class, or fee type..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="relative w-full pl-12 pr-4 py-3.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-3.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-gray-700 dark:text-gray-300"
                    >
                        <option value="all">All Status</option>
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                        <option value="overdue">Overdue</option>
                    </select>
                    <button className="group relative inline-flex items-center justify-center px-6 py-3.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-xl hover:border-emerald-500/50 transition-all">
                        <FunnelIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2 group-hover:text-emerald-500 transition-colors" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">More Filters</span>
                    </button>
                </div>

                {/* Main Content */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-gray-700/50 overflow-hidden">
                    
                    {/* Overview Tab */}
                    {selectedTab === 'overview' && (
                        <div>
                            {/* Summary Cards */}
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Today's Summary</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-xl p-4">
                                        <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-1">Collected Today</p>
                                        <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">₹45,000</p>
                                        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">12 transactions</p>
                                    </div>
                                    <div className="bg-amber-50 dark:bg-amber-500/10 rounded-xl p-4">
                                        <p className="text-sm text-amber-600 dark:text-amber-400 mb-1">Due Today</p>
                                        <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">₹18,500</p>
                                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">8 pending</p>
                                    </div>
                                    <div className="bg-blue-50 dark:bg-blue-500/10 rounded-xl p-4">
                                        <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Upcoming Dues</p>
                                        <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">₹92,000</p>
                                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Next 7 days</p>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Transactions */}
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
                                    <button className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">View All</button>
                                </div>
                                <div className="space-y-3">
                                    {recentTransactions.map((transaction) => (
                                        <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${
                                                    transaction.status === 'success' 
                                                        ? 'bg-emerald-100 dark:bg-emerald-500/20' 
                                                        : 'bg-amber-100 dark:bg-amber-500/20'
                                                }`}>
                                                    {transaction.status === 'success' 
                                                        ? <CheckCircleSolid className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                                        : <ClockIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                                    }
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">{transaction.student}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {transaction.date} • {transaction.method}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-900 dark:text-white">{formatCurrency(transaction.amount)}</p>
                                                <p className={`text-xs ${
                                                    transaction.status === 'success' 
                                                        ? 'text-emerald-600 dark:text-emerald-400' 
                                                        : 'text-amber-600 dark:text-amber-400'
                                                }`}>
                                                    {transaction.status}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Collections Tab */}
                    {selectedTab === 'collections' && (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Class</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fee Type</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Due Date</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Payment</th>
                                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredFees.map((fee) => (
                                        <tr key={fee.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className={`p-2 rounded-lg ${getColorClasses(fee.color)} mr-3`}>
                                                        <UserGroupIcon className="h-4 w-4" />
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {fee.studentName}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                                {fee.class}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                                {fee.feeType}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                {formatCurrency(fee.amount)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                                    <CalendarIcon className="h-4 w-4 mr-1 text-gray-400" />
                                                    {fee.dueDate}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(fee.status)}`}>
                                                    {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                                {fee.paymentMethod || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <button className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 mr-3">
                                                    <CreditCardIcon className="h-5 w-5" />
                                                </button>
                                                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-3">
                                                    <PencilIcon className="h-5 w-5" />
                                                </button>
                                                <button className="text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300">
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Fee Types Tab */}
                    {selectedTab === 'fee types' && (
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {feeTypes.map((feeType, index) => (
                                    <div
                                        key={feeType.id}
                                        className="group relative animate-in fade-in slide-in-from-bottom-4 duration-500"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:border-transparent transition-all duration-300">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className={`p-3 rounded-xl ${getColorClasses(feeType.color)}`}>
                                                    <DocumentTextIcon className="h-6 w-6" />
                                                </div>
                                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg text-xs">
                                                    {feeType.frequency}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                {feeType.name}
                                            </h3>
                                            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-3">
                                                {formatCurrency(feeType.amount)}
                                            </p>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500 dark:text-gray-400">
                                                    {feeType.students} Students
                                                </span>
                                                <button className="text-emerald-600 dark:text-emerald-400 hover:underline">
                                                    Edit
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Reports Tab */}
                    {selectedTab === 'reports' && (
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Monthly Collection Chart */}
                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Collection</h3>
                                    <div className="space-y-3">
                                        {['Jan', 'Feb', 'Mar', 'Apr', 'May'].map((month, i) => (
                                            <div key={month}>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-gray-600 dark:text-gray-400">{month}</span>
                                                    <span className="font-medium text-gray-900 dark:text-white">
                                                        {formatCurrency(40000 + i * 5000)}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                                    <div 
                                                        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full"
                                                        style={{ width: `${60 + i * 5}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Fee Type Distribution */}
                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Fee Distribution</h3>
                                    <div className="space-y-3">
                                        {feeTypes.slice(0, 4).map((fee) => (
                                            <div key={fee.id} className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-3 h-3 rounded-full bg-${fee.color}-500`}></div>
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">{fee.name}</span>
                                                </div>
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {formatCurrency(fee.amount * fee.students)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Download Reports */}
                                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                                    <button className="flex items-center justify-center gap-2 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-emerald-500 transition-all">
                                        <DocumentTextIcon className="h-5 w-5 text-emerald-600" />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Daily Report</span>
                                    </button>
                                    <button className="flex items-center justify-center gap-2 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-emerald-500 transition-all">
                                        <DocumentTextIcon className="h-5 w-5 text-emerald-600" />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Monthly Report</span>
                                    </button>
                                    <button className="flex items-center justify-center gap-2 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-emerald-500 transition-all">
                                        <DocumentTextIcon className="h-5 w-5 text-emerald-600" />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Annual Report</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FeeManagement;