import React from 'react';
import DummyTable from '../components/DummyTable';

const DoctorManagement = () => {
    const data = [
        { id: 1, name: 'Dr. Sarah Smith', specialization: 'Cardiology', qualification: 'MD', experience: '12 Years', status: 'Active' },
        { id: 2, name: 'Dr. John Doe', specialization: 'Neurology', qualification: 'MBBS, MD', experience: '8 Years', status: 'Active' },
        { id: 3, name: 'Dr. Emily Brown', specialization: 'Pediatrics', qualification: 'MBBS', experience: '5 Years', status: 'On Leave' },
        { id: 4, name: 'Dr. Michael Wilson', specialization: 'Orthopedics', qualification: 'MS', experience: '15 Years', status: 'Active' },
        { id: 5, name: 'Dr. James Davis', specialization: 'Dermatology', qualification: 'MD', experience: '10 Years', status: 'Active' },
    ];

    const columns = [
        { key: 'name', header: 'Doctor Name' },
        { key: 'specialization', header: 'Specialization' },
        { key: 'qualification', header: 'Qualification' },
        { key: 'experience', header: 'Experience' },
        { key: 'status', header: 'Status' },
    ];

    const handleEdit = (item) => {
        alert(`Edit ${item.name}`);
    };

    const handleDelete = (item) => {
        alert(`Delete ${item.name}`);
    };

    return (
        <div className="p-6 bg-slate-950 min-h-screen text-slate-200">
            <header className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">
                    Doctor Management
                </h1>
                <p className="text-slate-400 mt-2">Manage medical staff and specialists.</p>
            </header>

            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            placeholder="Search doctors..."
                            className="bg-slate-800 border-none rounded-lg text-slate-200 px-4 py-2 focus:ring-2 focus:ring-teal-500 w-64"
                        />
                    </div>
                    <button className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-lg shadow-teal-500/20">
                        + Add Doctor
                    </button>
                </div>
                <DummyTable
                    title="Medical Staff"
                    columns={columns}
                    data={data}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
};

export default DoctorManagement;
