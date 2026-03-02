import React from 'react';
import TeacherManagement from './pages/Teacher';
import Student from './pages/Student';
import Library from './pages/Library';
import ExamDatesheet from './pages/ExamDatesheet';
import ExamResult from './pages/ExamResult';
import LibraryBooks from './pages/LibraryBooks';
import ClassManagement from './pages/ClassManagement';
import SalaryManagement from './pages/SalaryManagement';
import FeeManagement from './pages/FeeManagement';
import TeacherAttendance from './pages/TeacherAttendance';
import StudentAttendance from './pages/StudentAttendance';
import ExamManagement from './pages/ExamManagement';
import ExamSchedule from './pages/ExamSchedule';

const schoolRoutes = [
    {
        path: 'student',
        element: <Student />,
    },
    {
        path: 'student-attendance',
        element: <StudentAttendance />,
    },
    {
        path: 'teacher',
        element: <TeacherManagement />,
    },
    {
        path: 'teacher-attendance',
        element: <TeacherAttendance />,
    },
    {
        path: 'library',
        element: <Library />,
    },
    {
        path: 'exam-datesheet',
        element: <ExamDatesheet />,
    },
    {
        path: 'exam-management',
        element: <ExamManagement />,
    },
    {
        path: 'exam-schedule',
        element: <ExamSchedule />,
    },
    {
        path: 'exam-schedule/:classId/:examId',
        element: <ExamSchedule />,
    },
    {
        path: 'exam-result',
        element: <ExamResult />,
    },
    {
        path: 'library-books-management',
        element: <LibraryBooks />,
    },
    {
        path: 'class-management',
        element: <ClassManagement />,
    },
    {
        path: 'salary-management',
        element: <SalaryManagement />,
    },
    {
        path: 'fee-management',
        element: <FeeManagement />,
    },
];

export default schoolRoutes;
