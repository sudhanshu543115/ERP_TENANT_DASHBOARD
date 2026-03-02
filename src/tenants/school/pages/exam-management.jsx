import React, { useState, useMemo } from 'react';
import {
    PlusIcon,
    AcademicCapIcon,
    ClipboardDocumentListIcon,
    ClockIcon,
    CalendarIcon,
    ChartBarIcon,
    UserGroupIcon,
    DocumentTextIcon,
    PencilIcon,
    TrashIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    SparklesIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    BookOpenIcon,
    StarIcon,
    ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

const ExamManagement = () => {
    const [selectedTab, setSelectedTab] = useState('upcoming');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Mock data - replace with actual API data
    const exams = [
        { 
            id: 1, 
            name: 'Mathematics Final', 
            class: '10A', 
            subject: 'Mathematics',
            date: '2024-03-15', 
            time: '10:00 AM - 1:00 PM',
            duration: '3 hours',
            totalMarks: 100,
            passingMarks: 35,
            status: 'upcoming',
            venue: 'Hall A',
            teacher: 'Mr. Sharma',
            color: 'blue'
        },
        { 
            id: 2, 
            name: 'Science Mid-Term', 
            class: '10B', 
            subject: 'Science',
            date: '2024-03-10', 
            time: '9:00 AM - 12:00 PM',
            duration: '3 hours',
            totalMarks: 80,
            passingMarks: 28,
            status: 'ongoing',
            venue: 'Hall B',
            teacher: 'Ms. Patel',
            color: 'purple'
        },
        { 
            id: 3, 
            name: 'English Literature', 
            class: '9A', 
            subject: 'English',
            date: '2024-02-28', 
            time: '11:00 AM - 1:00 PM',
            duration: '2 hours',
            totalMarks: 50,
            passingMarks: 18,
            status: 'completed',
            venue: 'Classroom 101',
            teacher: 'Mr. Kumar',
            color: 'emerald'
        },
        { 
            id: 4, 
            name: 'Hindi Assessment', 
            class: '9B', 
            subject: 'Hindi',
            date: '2024-03-05', 
            time: '10:00 AM - 12:00 PM',
            duration: '2 hours',
            totalMarks: 50,
            passingMarks: 18,
            status: 'upcoming',
            venue: 'Classroom 102',
            teacher: 'Ms. Singh',
            color: 'amber'
        },
        { 
            id: 5, 
            name: 'Social Studies Test', 
            class: '8A', 
            subject: 'Social Studies',
            date: '2024-03-12', 
            time: '9:00 AM - 11:00 AM',
            duration: '2 hours',
            totalMarks: 60,
            passingMarks: 21,
            status: 'upcoming',
            venue: 'Hall C',
            teacher: 'Mr. Verma',
            color: 'rose'
        },
    ];

    const results = [
        { id: 1, studentName: 'Rahul Sharma', class: '10A', exam: 'Mathematics Final', marks: 85, totalMarks: 100, percentage: 85, grade: 'A', status: 'passed', color: 'emerald' },
        { id: 2, studentName: 'Priya Patel', class: '10B', exam: 'Science Mid-Term', marks: 72, totalMarks: 80, percentage: 90, grade: 'A+', status: 'passed', color: 'emerald' },
        { id: 3, studentName: 'Amit Kumar', class: '9A', exam: 'English Literature', marks: 42, totalMarks: 50, percentage: 84, grade: 'A', status: 'passed', color: 'emerald' },
        { id: 4, studentName: 'Neha Singh', class: '9B', exam: 'English Literature', marks: 38, totalMarks: 50, percentage: 76, grade: 'B+', status: 'passed', color: 'emerald' },
        { id: 5, studentName: 'Rohan Verma', class: '8A', exam: 'Social Studies Test', marks: 45, totalMarks: 60, percentage: 75, grade: 'B', status: 'passed', color: 'emerald' },
    ];

    const subjects = [
        { id: 1, name: 'Mathematics', exams: 4, avgMarks: 78, passRate: 92, color: 'blue' },
        { id: 2, name: 'Science', exams: 3, avgMarks: 82, passRate: 94, color: 'purple' },
        { id: 3, name: 'English', exams: 4, avgMarks: 75, passRate: 88, color: 'emerald' },
        { id: 4, name: 'Hindi', exams: 3, avgMarks: 80, passRate: 91, color: 'amber' },
        { id: 5, name: 'Social Studies', exams: 3, avgMarks: 73, passRate: 86, color: 'rose' },
    ];

    const filteredExams = useMemo(() => {
        return exams.filter(exam => {
            const matchesSearch = exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 exam.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 exam.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 exam.teacher.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filterStatus === 'all' || exam.status === filterStatus;
            return matchesSearch && matchesFilter;
        });
    }, [searchTerm, filterStatus]);

    const stats = [
        {
            id: 1,
            label: 'Total Exams',
            value: '24',
            change: '+4',
            icon: ClipboardDocumentListIcon,
            color: 'blue',
            gradient: 'from-blue-600 to-blue-400'
        },
        {
            id: 2,
            label: 'Upcoming Exams',
            value: '8',
            change: '+2',
            icon: CalendarIcon,
            color: 'purple',
            gradient: 'from-purple-600 to-purple-400'
        },
        {
            id: 3,
            label: 'Ongoing Exams',
            value: '3',
            change: '-1',
            icon: ClockIcon,
            color: 'amber',
            gradient: 'from-amber-600 to-amber-400'
        },
        {
            id: 4,
            label: 'Avg. Pass Rate',
            value: '92%',
            change: '+5%',
            icon: ChartBarIcon,
            color: 'emerald',
            gradient: 'from-emerald-600 to-emerald-400'
        },
    ];

    const getStatusColor = (status) => {
        const colors = {
            upcoming: 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border-blue-200 dark:border-blue-800',
            ongoing: 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200 dark:border-amber-800',
            completed: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
        };
        return colors[status] || colors.upcoming;
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
            
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-amber-400/10 to-rose-400/10 rounded-full blur-3xl animate-pulse delay-700"></div>
            </div>

            <div className="relative px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
                
                {/* Header with Glass Effect */}
                <div className="mb-8 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 rounded-3xl blur-xl"></div>
                    <div className="relative bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-gray-700/30">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur-lg opacity-50"></div>
                                    <div className="relative p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl">
                                        <AcademicCapIcon className="h-8 w-8 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                            Exam Management
                                        </h1>
                                        <SparklesIcon className="h-6 w-6 text-amber-500" />
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Create, schedule, and manage examinations efficiently
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-lg shadow-indigo-600/30 hover:shadow-xl hover:shadow-purple-600/40 transition-all duration-300"
                                >
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                    <PlusIcon className="h-5 w-5 mr-2 relative z-10 transition-transform group-hover:rotate-90" />
                                    <span className="relative z-10">Create Exam</span>
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
                                            style={{ width: index === 0 ? '85%' : index === 1 ? '65%' : index === 2 ? '45%' : '92%' }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl p-6 text-white">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-white/20 rounded-xl">
                                <DocumentTextIcon className="h-6 w-6" />
                            </div>
                            <h3 className="font-semibold">Schedule New Exam</h3>
                        </div>
                        <p className="text-sm text-white/80 mb-4">Create exam schedule and assign invigilators</p>
                        <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors text-sm font-medium">
                            Schedule Now
                        </button>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-white/20 rounded-xl">
                                <ChartBarIcon className="h-6 w-6" />
                            </div>
                            <h3 className="font-semibold">Enter Marks</h3>
                        </div>
                        <p className="text-sm text-white/80 mb-4">Add or update student marks and results</p>
                        <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors text-sm font-medium">
                            Enter Marks
                        </button>
                    </div>

                    <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-white/20 rounded-xl">
                                <StarIcon className="h-6 w-6" />
                            </div>
                            <h3 className="font-semibold">Generate Results</h3>
                        </div>
                        <p className="text-sm text-white/80 mb-4">Generate report cards and performance analysis</p>
                        <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors text-sm font-medium">
                            Generate
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-6">
                    <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl p-2 border border-white/20 dark:border-gray-700/30 inline-flex">
                        {['upcoming', 'ongoing', 'completed', 'results', 'analytics'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setSelectedTab(tab)}
                                className={`relative px-6 py-2.5 text-sm font-medium capitalize rounded-xl transition-all duration-300 ${
                                    selectedTab === tab
                                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
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
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors z-10" />
                        <input
                            type="text"
                            placeholder="Search exams by name, class, subject, or teacher..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="relative w-full pl-12 pr-4 py-3.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-3.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-gray-700 dark:text-gray-300"
                    >
                        <option value="all">All Status</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                    </select>
                    <button className="group relative inline-flex items-center justify-center px-6 py-3.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-xl hover:border-indigo-500/50 transition-all">
                        <FunnelIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2 group-hover:text-indigo-500 transition-colors" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Filters</span>
                    </button>
                </div>

                {/* Main Content */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-gray-700/50 overflow-hidden">
                    
                    {/* Upcoming/Ongoing/Completed Exams Tab */}
                    {(selectedTab === 'upcoming' || selectedTab === 'ongoing' || selectedTab === 'completed') && (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Exam Name</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Class</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Subject</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date & Time</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Duration</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Marks</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Venue</th>
                                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredExams
                                        .filter(exam => selectedTab === 'all' || exam.status === selectedTab)
                                        .map((exam) => (
                                        <tr key={exam.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className={`p-2 rounded-lg ${getColorClasses(exam.color)} mr-3`}>
                                                        <ClipboardDocumentListIcon className="h-4 w-4" />
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {exam.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                                {exam.class}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2.5 py-1 text-xs font-medium rounded-lg ${getColorClasses(exam.color)}`}>
                                                    {exam.subject}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="text-sm text-gray-900 dark:text-white">{exam.date}</span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">{exam.time}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                                {exam.duration}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                                {exam.totalMarks} (P: {exam.passingMarks})
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(exam.status)}`}>
                                                    {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                                {exam.venue}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mr-3">
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

                    {/* Results Tab */}
                    {selectedTab === 'results' && (
                        <div className="p-6">
                            <div className="grid grid-cols-1 gap-4">
                                {results.map((result) => (
                                    <div key={result.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-xl ${getColorClasses(result.color)}`}>
                                                <UserGroupIcon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 dark:text-white">{result.studentName}</h4>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {result.class} • {result.exam}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Marks</p>
                                                <p className="font-bold text-gray-900 dark:text-white">{result.marks}/{result.totalMarks}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Percentage</p>
                                                <p className="font-bold text-emerald-600 dark:text-emerald-400">{result.percentage}%</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Grade</p>
                                                <p className="font-bold text-indigo-600 dark:text-indigo-400">{result.grade}</p>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getColorClasses(result.color)}`}>
                                                {result.status}
                                            </div>
                                            <button className="p-2 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-colors">
                                                <DocumentTextIcon className="h-5 w-5 text-gray-400 hover:text-indigo-500" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Analytics Tab */}
                    {selectedTab === 'analytics' && (
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Subject Performance */}
                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Subject Performance</h3>
                                    <div className="space-y-4">
                                        {subjects.map((subject) => (
                                            <div key={subject.id}>
                                                <div className="flex justify-between items-center mb-1">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full bg-${subject.color}-500`}></div>
                                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{subject.name}</span>
                                                    </div>
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">{subject.avgMarks}% avg</span>
                                                </div>
                                                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                                    <div 
                                                        className={`bg-gradient-to-r from-${subject.color}-500 to-${subject.color}-400 h-2 rounded-full`}
                                                        style={{ width: `${subject.avgMarks}%` }}
                                                    ></div>
                                                </div>
                                                <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                    <span>{subject.exams} exams</span>
                                                    <span>{subject.passRate}% pass rate</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Performance Overview */}
                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Overview</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Highest Score</span>
                                            <span className="font-bold text-emerald-600 dark:text-emerald-400">98%</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Lowest Score</span>
                                            <span className="font-bold text-amber-600 dark:text-amber-400">45%</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Average Score</span>
                                            <span className="font-bold text-indigo-600 dark:text-indigo-400">76%</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Total Students Appeared</span>
                                            <span className="font-bold text-gray-900 dark:text-white">245</span>
                                        </div>
                                    </div>

                                    <div className="mt-6 grid grid-cols-2 gap-3">
                                        <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
                                            <CheckCircleSolid className="h-6 w-6 text-emerald-500 mx-auto mb-1" />
                                            <span className="text-xs text-gray-500 dark:text-gray-400">Passed</span>
                                            <p className="font-bold text-emerald-600 dark:text-emerald-400">215</p>
                                        </div>
                                        <div className="text-center p-3 bg-rose-50 dark:bg-rose-500/10 rounded-lg">
                                            <ExclamationTriangleIcon className="h-6 w-6 text-rose-500 mx-auto mb-1" />
                                            <span className="text-xs text-gray-500 dark:text-gray-400">Failed</span>
                                            <p className="font-bold text-rose-600 dark:text-rose-400">30</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Download Reports */}
                                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4">
                                    <button className="flex items-center justify-center gap-2 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-indigo-500 transition-all">
                                        <DocumentTextIcon className="h-5 w-5 text-indigo-600" />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Class Report</span>
                                    </button>
                                    <button className="flex items-center justify-center gap-2 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-indigo-500 transition-all">
                                        <DocumentTextIcon className="h-5 w-5 text-indigo-600" />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Subject Report</span>
                                    </button>
                                    <button className="flex items-center justify-center gap-2 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-indigo-500 transition-all">
                                        <DocumentTextIcon className="h-5 w-5 text-indigo-600" />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Student Report</span>
                                    </button>
                                    <button className="flex items-center justify-center gap-2 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-indigo-500 transition-all">
                                        <ArrowTrendingUpIcon className="h-5 w-5 text-indigo-600" />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Analytics</span>
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

export default ExamManagement;