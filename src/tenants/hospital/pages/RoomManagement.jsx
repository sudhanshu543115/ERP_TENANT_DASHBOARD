import React from 'react';
import DummyTable from '../components/DummyTable';

const RoomManagement = () => {
    const data = [
        { id: 1, roomNo: '101', type: 'General Ward', patient: 'Alice Williams', status: 'Occupied' },
        { id: 2, roomNo: '102', type: 'Private Room', patient: 'Bob Miller', status: 'Occupied' },
        { id: 3, roomNo: '103', type: 'ICU', patient: 'Charlie Davis', status: 'Occupied' },
        { id: 4, roomNo: '104', type: 'Private Room', patient: '-', status: 'Vacant' },
        { id: 5, roomNo: '105', type: 'General Ward', patient: '-', status: 'Vacant' },
    ];

    const columns = [
        { key: 'roomNo', header: 'Room No' },
        { key: 'type', header: 'Room Type' },
        { key: 'patient', header: 'Occupant' },
        { key: 'status', header: 'Status' },
    ];

    const handleEdit = (item) => {
        alert(`Edit room ${item.roomNo}`);
    };

    const handleDelete = (item) => {
        alert(`Delete room ${item.roomNo}`);
    };

    return (
        <div className="p-6 bg-slate-950 min-h-screen text-slate-200">
            <header className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-lime-400 to-green-500 bg-clip-text text-transparent">
                    Room Management
                </h1>
                <p className="text-slate-400 mt-2">Manage hospital rooms and occupancy.</p>
            </header>

            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex space-x-2">
                        <select className="bg-slate-800 border-none rounded-lg text-slate-200 px-4 py-2 focus:ring-2 focus:ring-lime-500">
                            <option>All Types</option>
                            <option>General Ward</option>
                            <option>Private Room</option>
                            <option>ICU</option>
                        </select>
                        <select className="bg-slate-800 border-none rounded-lg text-slate-200 px-4 py-2 focus:ring-2 focus:ring-lime-500">
                            <option>All Statuses</option>
                            <option>Occupied</option>
                            <option>Vacant</option>
                        </select>
                    </div>
                    <button className="bg-lime-500 hover:bg-lime-600 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-lg shadow-lime-500/20">
                        + Assign Room
                    </button>
                </div>
                <DummyTable
                    title="Room Status"
                    columns={columns}
                    data={data}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
};

export default RoomManagement;
