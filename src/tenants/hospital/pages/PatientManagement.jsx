import React from 'react';
import DummyTable from '../components/DummyTable';

const PatientManagement = () => {
    const data = [
        { id: 1, name: 'Alice Williams', age: '32', gender: 'Female', phone: '555-0101', condition: 'Flu' },
        { id: 2, name: 'Bob Miller', age: '45', gender: 'Male', phone: '555-0102', condition: 'Migraine' },
        { id: 3, name: 'Charlie Davis', age: '28', gender: 'Male', phone: '555-0103', condition: 'Fracture' },
        { id: 4, name: 'Diana Evans', age: '55', gender: 'Female', phone: '555-0104', condition: 'Diabetes' },
        { id: 5, name: 'Ethan Harris', age: '12', gender: 'Male', phone: '555-0105', condition: 'Fever' },
    ];

    const columns = [
        { key: 'name', header: 'Patient Name' },
        { key: 'age', header: 'Age' },
        { key: 'gender', header: 'Gender' },
        { key: 'phone', header: 'Phone' },
        { key: 'condition', header: 'Condition' },
    ];

    const handleEdit = (item) => {
        alert(`Edit patient ${item.name}`);
    };

    const handleDelete = (item) => {
        alert(`Delete patient ${item.name}`);
    };

    return (
        <div className="p-6 bg-slate-950 min-h-screen text-slate-200">
            <header className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    Patient Management
                </h1>
                <p className="text-slate-400 mt-2">Manage patient records and history.</p>
            </header>

            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            placeholder="Search patients..."
                            className="bg-slate-800 border-none rounded-lg text-slate-200 px-4 py-2 focus:ring-2 focus:ring-purple-500 w-64"
                        />
                    </div>
                    <button className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-lg shadow-purple-500/20">
                        + Register Patient
                    </button>
                </div>
                <DummyTable
                    title="Patient Records"
                    columns={columns}
                    data={data}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
};

export default PatientManagement;
