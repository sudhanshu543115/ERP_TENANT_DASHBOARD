import React from 'react';
import DummyTable from '../components/DummyTable';

const LabManagement = () => {
    const data = [
        { id: 1, testName: 'Complete Blood Count', patient: 'Alice Williams', date: '2025-10-15', status: 'Completed', result: 'Normal' },
        { id: 2, testName: 'X-Ray', patient: 'Charlie Davis', date: '2025-10-16', status: 'Proccessing', result: 'Pending' },
        { id: 3, testName: 'Lipid Profile', patient: 'Bob Miller', date: '2025-10-17', status: 'Completed', result: 'High Cholesterol' },
        { id: 4, testName: 'Blood Sugar', patient: 'Diana Evans', date: '2025-10-18', status: 'Completed', result: 'High' },
        { id: 5, testName: 'MRI Scan', patient: 'Ethan Harris', date: '2025-10-19', status: 'Scheduled', result: 'Pending' },
    ];

    const columns = [
        { key: 'testName', header: 'Test Name' },
        { key: 'patient', header: 'Patient Name' },
        { key: 'date', header: 'Date' },
        { key: 'status', header: 'Status' },
        { key: 'result', header: 'Result' },
    ];

    const handleEdit = (item) => {
        alert(`Edit lab test for ${item.patient}`);
    };

    const handleDelete = (item) => {
        alert(`Delete lab test for ${item.patient}`);
    };

    return (
        <div className="p-6 bg-slate-950 min-h-screen text-slate-200">
            <header className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
                    Lab Management
                </h1>
                <p className="text-slate-400 mt-2">Manage laboratory tests and reports.</p>
            </header>

            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            placeholder="Search tests..."
                            className="bg-slate-800 border-none rounded-lg text-slate-200 px-4 py-2 focus:ring-2 focus:ring-red-500 w-64"
                        />
                        <select className="bg-slate-800 border-none rounded-lg text-slate-200 px-4 py-2 focus:ring-2 focus:ring-red-500">
                            <option>All Statuses</option>
                            <option>Completed</option>
                            <option>Processing</option>
                            <option>Scheduled</option>
                        </select>
                    </div>
                    <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-lg shadow-red-500/20">
                        + Add Test
                    </button>
                </div>
                <DummyTable
                    title="Lab Reports"
                    columns={columns}
                    data={data}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
};

export default LabManagement;
