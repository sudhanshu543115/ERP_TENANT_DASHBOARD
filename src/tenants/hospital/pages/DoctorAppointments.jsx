import React from 'react';
import DummyTable from '../components/DummyTable';

const DoctorAppointments = () => {
    const data = [
        { id: 1, patient: 'Alice Williams', doctor: 'Dr. Sarah Smith', date: '2025-10-15', time: '10:00 AM', status: 'Confirmed' },
        { id: 2, patient: 'Bob Miller', doctor: 'Dr. John Doe', date: '2025-10-16', time: '11:00 AM', status: 'Pending' },
        { id: 3, patient: 'Charlie Davis', doctor: 'Dr. Emily Brown', date: '2025-10-17', time: '09:00 AM', status: 'Confirmed' },
        { id: 4, patient: 'Diana Evans', doctor: 'Dr. Michael Wilson', date: '2025-10-18', time: '02:00 PM', status: 'Cancelled' },
        { id: 5, patient: 'Ethan Harris', doctor: 'Dr. Sarah Smith', date: '2025-10-19', time: '10:30 AM', status: 'Confirmed' },
    ];

    const columns = [
        { key: 'patient', header: 'Patient Name' },
        { key: 'doctor', header: 'Doctor' },
        { key: 'date', header: 'Date' },
        { key: 'time', header: 'Time' },
        { key: 'status', header: 'Status' },
    ];

    const handleEdit = (item) => {
        alert(`Edit appointment for ${item.patient}`);
    };

    const handleDelete = (item) => {
        alert(`Cancel appointment for ${item.patient}`);
    };

    return (
        <div className="p-6 bg-slate-950 min-h-screen text-slate-200">
            <header className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                    Doctor Appointments
                </h1>
                <p className="text-slate-400 mt-2">Schedule and manage patient appointments.</p>
            </header>

            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            placeholder="Search appointments..."
                            className="bg-slate-800 border-none rounded-lg text-slate-200 px-4 py-2 focus:ring-2 focus:ring-blue-500 w-64"
                        />
                        <select className="bg-slate-800 border-none rounded-lg text-slate-200 px-4 py-2 focus:ring-2 focus:ring-blue-500">
                            <option>All Statuses</option>
                            <option>Confirmed</option>
                            <option>Pending</option>
                            <option>Cancelled</option>
                        </select>
                    </div>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-lg shadow-blue-500/20">
                        + New Appointment
                    </button>
                </div>
                <DummyTable
                    title="Upcoming Appointments"
                    columns={columns}
                    data={data}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
};

export default DoctorAppointments;
