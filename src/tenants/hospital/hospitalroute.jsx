import React from 'react';

import DoctorManagement from './pages/DoctorManagement';
import DoctorAppointments from './pages/DoctorAppointments';
import PatientManagement from './pages/PatientManagement';
import LabManagement from './pages/LabManagement';
import RoomManagement from './pages/RoomManagement';

const hospitalRoutes = [
    {
        path: 'doctor-management',
        element: <DoctorManagement />,
    },
    {
        path: 'doctor-appointment',
        element: <DoctorAppointments />,
    },
    {
        path: 'patient-management',
        element: <PatientManagement />,
    },
    {
        path: 'lab-management',
        element: <LabManagement />,
    },
    {
        path: 'room-management',
        element: <RoomManagement />,
    },
];

export default hospitalRoutes;
