import React, { useState, useMemo } from 'react';
import { 
    FiCalendar, 
    FiSearch, 
    FiCheckCircle, 
    FiXCircle, 
    FiClock, 
    FiUser, 
    FiFilter,
    FiDownload,
    FiMoreVertical
} from 'react-icons/fi';
import StatsCard from '../../../common/components/ui/StatsCard';
import SearchBar from '../../../common/components/ui/SearchBar';
import Table from '../../../common/components/ui/Table';

const TeacherAttendance = () => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    // Dummy Data - In a real app, this would come from an API based on selectedDate
    const [attendanceData, setAttendanceData] = useState([
        { id: 1, name: 'Dr. John Doe', department: 'Mathematics', status: 'Present', checkIn: '07:55 AM', checkOut: '04:05 PM', totalHours: '8h 10m' },
        { id: 2, name: 'Jane Smith', department: 'Science', status: 'Absent', checkIn: '--:--', checkOut: '--:--', totalHours: '0h 0m' },
        { id: 3, name: 'Robert Brown', department: 'History', status: 'Late', checkIn: '09:15 AM', checkOut: '04:30 PM', totalHours: '7h 15m' },
        { id: 4, name: 'Emily Davis', department: 'English', status: 'Present', checkIn: '08:00 AM', checkOut: '04:00 PM', totalHours: '8h 0m' },
        { id: 5, name: 'Michael Wilson', department: 'Physics', status: 'Half Day', checkIn: '08:00 AM', checkOut: '12:00 PM', totalHours: '4h 0m' },
        { id: 6, name: 'Sarah Johnson', department: 'Chemistry', status: 'Present', checkIn: '07:50 AM', checkOut: '04:10 PM', totalHours: '8h 20m' },
        { id: 7, name: 'David Lee', department: 'Biology', status: 'On Leave', checkIn: '--:--', checkOut: '--:--', totalHours: '0h 0m' },
    ]);

    const stats = {
        present: attendanceData.filter(d => d.status === 'Present').length,
        absent: attendanceData.filter(d => d.status === 'Absent').length,
        late: attendanceData.filter(d => d.status === 'Late').length,
        onLeave: attendanceData.filter(d => d.status === 'On Leave').length,
    };

    const filteredData = useMemo(() => {
        return attendanceData.filter(record => {
            const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  record.department.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filterStatus === 'All' || record.status === filterStatus;
            return matchesSearch && matchesFilter;
        });
    }, [attendanceData, searchTerm, filterStatus]);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Present': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20';
            case 'Absent': return 'bg-rose-100 text-rose-800 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200 dark:border-rose-500/20';
            case 'Late': return 'bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20';
            case 'Half Day': return 'bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/20';
            case 'On Leave': return 'bg-purple-100 text-purple-800 dark:bg-purple-500/10 dark:text-purple-400 border-purple-200 dark:border-purple-500/20';
            default: return 'bg-slate-100 text-slate-800 dark:bg-slate-500/10 dark:text-slate-400 border-slate-200 dark:border-slate-500/20';
        }
    };

    const columns = useMemo(() => [
        { key: 'name', header: 'Teacher', isPrimary: true },
        { key: 'department', header: 'Department' },
        { key: 'status', header: 'Status', render: (item) => (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(item.status)}`}>
                {item.status}
            </span>
        )},
        { key: 'checkIn', header: 'Check In', className: 'font-mono' },
        { key: 'checkOut', header: 'Check Out', className: 'font-mono' },
        { key: 'totalHours', header: 'Total Hours', className: 'font-mono' },
    ], []);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Teacher Attendance</h1>
                    <p className="text-slate-400 mt-1">Manage and view daily attendance records for faculty.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2">
                        <FiCalendar className="text-slate-400" />
                        <input 
                            type="date" 
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-transparent border-none text-white focus:ring-0 outline-none text-sm"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors font-medium">
                        <FiDownload className="w-4 h-4" />
                        <span>Export Report</span>
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard 
                    title="Present" 
                    value={stats.present} 
                    icon={FiCheckCircle} 
                    color="emerald" 
                    subtitle={`${Math.round((stats.present / attendanceData.length) * 100)}% of total`}
                />
                <StatsCard 
                    title="Absent" 
                    value={stats.absent} 
                    icon={FiXCircle} 
                    color="rose" 
                    subtitle={`${Math.round((stats.absent / attendanceData.length) * 100)}% of total`}
                />
                <StatsCard 
                    title="Late Arrival" 
                    value={stats.late} 
                    icon={FiClock} 
                    color="amber" 
                    subtitle={`${Math.round((stats.late / attendanceData.length) * 100)}% of total`}
                />
                <StatsCard 
                    title="On Leave" 
                    value={stats.onLeave} 
                    icon={FiUser} 
                    color="purple" 
                    subtitle={`${Math.round((stats.onLeave / attendanceData.length) * 100)}% of total`}
                />
            </div>

            {/* Filters and Search */}
            <div className="mb-6">
                <SearchBar
                    onSearch={(term) => setSearchTerm(term)}
                    placeholder="Search by name or department..."
                />
            </div>

            {/* Attendance Table */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-xl">
                <Table
                    data={filteredData}
                    columns={columns}
                    primaryKey="id"
                />
            </div>
        </div>
    );
};

export default TeacherAttendance;