import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  FiUsers,
  FiUserPlus,
  FiAlertCircle,
  FiMail,
  FiPhone,
  FiCalendar,
  FiMapPin,
  FiEdit2,
  FiStar,
  FiX,
  FiUpload,
  FiAward,
  FiClock,
  FiPlus
} from 'react-icons/fi';
import {
  useGetTeachersQuery,
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
  useDeleteTeacherMutation
} from '../api/schoolApi';
import Form from '../../../common/components/ui/Form';
import Table from '../../../common/components/ui/Table';
import StatsCard from '../../../common/components/ui/StatsCard';
import SearchBar from '../../../common/components/ui/SearchBar';

// Teacher Details Modal
const TeacherDetailsModal = ({ isOpen, onClose, teacher }) => {
  if (!isOpen || !teacher) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 w-full max-w-2xl">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Teacher Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <FiX className="w-6 h-6 text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl">
              {teacher.firstName?.[0]}{teacher.lastName?.[0]}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{teacher.firstName} {teacher.lastName}</h3>
              <p className="text-xs text-slate-500 mb-1">ID: {teacher.teacherId}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
              <p className="text-sm text-slate-500">Email</p>
              <p className="text-slate-900 dark:text-white">{teacher.email}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
              <p className="text-sm text-slate-500">Phone</p>
              <p className="text-slate-900 dark:text-white">{teacher.phone}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
              <p className="text-sm text-slate-500">Qualification</p>
              <p className="text-slate-900 dark:text-white">{teacher.qualification || 'N/A'}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
              <p className="text-sm text-slate-500">Experience</p>
              <p className="text-slate-900 dark:text-white">{teacher.experience || 'N/A'}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
              <p className="text-sm text-slate-500">Joining Date</p>
              <p className="text-slate-900 dark:text-white">{teacher.joiningDate || 'N/A'}</p>
            </div>
          </div>

          {teacher.address && (
            <div>
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Address</h4>
              <p className="text-slate-600 dark:text-slate-300">{teacher.address}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, teacherName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 w-full max-w-md">
        <div className="p-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <FiAlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white text-center mb-2">Delete Teacher</h3>
          <p className="text-slate-500 dark:text-slate-400 text-center mb-6">
            Are you sure you want to delete <span className="text-slate-900 dark:text-white font-medium">{teacherName}</span>?
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Teacher Management Component
const TeacherManagement = () => {
  const { tenantName } = useParams();
  const { data: teachersData, isLoading, error: queryError } = useGetTeachersQuery(tenantName, {
    skip: !tenantName,
  });
  const [createTeacher] = useCreateTeacherMutation();
  const [updateTeacher] = useUpdateTeacherMutation();
  const [deleteTeacher] = useDeleteTeacherMutation();

  const [searchTerm, setSearchTerm] = useState('');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [formMode, setFormMode] = useState('add');
  const [showFilters, setShowFilters] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    qualification: '',
    experience: '',
    joiningDate: '',
    address: '',
  });

  // Debugging: Log data to console to verify API response and Tenant
  useEffect(() => {
    console.log("Teacher Page - Tenant:", tenantName);
    console.log("Teacher Page - Data:", teachersData);
    console.log("Teacher Page - Error:", queryError);
  }, [tenantName, teachersData, queryError]);

  const teachers = React.useMemo(() => {
    if (!teachersData) return [];
    if (Array.isArray(teachersData)) return teachersData;
    if (Array.isArray(teachersData.teachers)) return teachersData.teachers;
    if (Array.isArray(teachersData.data)) return teachersData.data;
    return [];
  }, [teachersData]);

  // Filter teachers using useMemo (prevents render loops)
  const filteredTeachers = React.useMemo(() => {
    let filtered = teachers;

    if (searchTerm) {
      filtered = filtered.filter(teacher =>
        (teacher.firstName + ' ' + teacher.lastName).toLowerCase().includes(searchTerm.toLowerCase()) || 
        teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.teacherId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [teachers, searchTerm]);

  const stats = [
    { label: 'Total Teachers', value: teachers.length.toString(), icon: FiUsers, color: 'blue', change: '+2 this month' },
  ];

  const teacherFields = {
    firstName: { label: 'First Name', type: 'text', icon: FiUsers, tab: 'basic' },
    lastName: { label: 'Last Name', type: 'text', icon: FiUsers, tab: 'basic' },
    email: { label: 'Email', type: 'email', icon: FiMail, tab: 'contact' },
    phone: { label: 'Phone', type: 'tel', icon: FiPhone, tab: 'contact' },
    gender: { label: 'Gender', type: 'select', icon: FiUsers, tab: 'personal' },
    dateOfBirth: { label: 'Date of Birth', type: 'date', icon: FiCalendar, tab: 'personal' },
    address: { label: 'Address', type: 'textarea', icon: FiMapPin, tab: 'location' },
    qualification: { label: 'Qualification', type: 'text', icon: FiAward, tab: 'professional' },
    experience: { label: 'Experience', type: 'text', icon: FiClock, tab: 'professional' },
    joiningDate: { label: 'Joining Date', type: 'date', icon: FiCalendar, tab: 'professional' },
  };

  const handleAddTeacher = async (data) => {
    try {
      const teacherData = {
        ...data,
        joiningDate: data.joiningDate || null,
      };
      await createTeacher({ tenantName, data: teacherData }).unwrap();
      setIsFormModalOpen(false);
    } catch (error) {
      console.error("Failed to create teacher", error);
      alert(error?.data?.message || "Failed to create teacher");
    }
  };

  const handleEditTeacher = async (updatedTeacher) => {
    try {
      const teacherData = {
        ...updatedTeacher,
        joiningDate: updatedTeacher.joiningDate || null,
      };
      await updateTeacher({ tenantName, id: updatedTeacher._id || updatedTeacher.id || updatedTeacher.teacherId, data: teacherData }).unwrap();
      setIsFormModalOpen(false);
    } catch (error) {
      console.error("Failed to update teacher", error);
      alert(error?.data?.message || "Failed to update teacher");
    }
  };

  const handleDeleteTeacher = async (id) => {
    try {
      await deleteTeacher({ tenantName, id: id }).unwrap();
    } catch (error) {
      console.error("Failed to delete teacher", error);
      alert("Failed to delete teacher");
    }
  };

  const columns = useMemo(() => [
    { key: 'name', header: 'Name', isPrimary: true, render: (item) => (
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                {item.firstName?.[0]}{item.lastName?.[0]}
            </div>
            <div>
                <p className="font-medium text-slate-900 dark:text-white">{item.firstName} {item.lastName}</p>
                <p className="text-xs text-slate-500">{item.email}</p>
            </div>
        </div>
    )},
    { key: 'phone', header: 'Phone' },
    { key: 'qualification', header: 'Qualification' },
    { key: 'experience', header: 'Experience' },
    { key: 'joiningDate', header: 'Joining Date', render: (item) => item.joiningDate ? new Date(item.joiningDate).toLocaleDateString() : 'N/A' },
  ], []);

  const handleEdit = (teacher) => {
    setSelectedTeacher(teacher);
    setFormMode('edit');
    setFormData(teacher);
    setIsFormModalOpen(true);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
          Teacher Management
        </h1>
        <p className="text-slate-500 dark:text-slate-400">Complete CRUD operations for faculty management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.label}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            subtitle={stat.change}
          />
        ))}
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[300px]">
          <SearchBar onSearch={(term) => setSearchTerm(term)} placeholder="Search teachers..." />
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setFormMode('add');
              setSelectedTeacher(null);
              setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                gender: '',
                dateOfBirth: '',
                qualification: '',
                experience: '',
                joiningDate: '',
                address: '',
              });
              setIsFormModalOpen(true);
            }}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-medium hover:from-blue-600 hover:to-purple-600 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/25"
          >
            <FiUserPlus className="w-4 h-4" />
            Add Teacher
          </button>
        </div>
      </div>

      {/* Error Display */}
      {queryError && (
        <div className="bg-rose-500/10 backdrop-blur-sm rounded-xl border border-rose-500/20 p-4 text-rose-500 dark:text-rose-400 text-sm flex items-center gap-3 mb-6">
            <div className="p-2 bg-rose-500/20 rounded-lg">
                <FiAlertCircle className="h-5 w-5" />
            </div>
            <div>
                <p className="font-bold">Error: {queryError.status}</p>
                <p>
                  {queryError?.data?.message || 'Failed to load teachers. Please check the API endpoint and server status.'}
                </p>
            </div>
        </div>
      )}

      {/* Teachers Grid */}
      <div className="bg-white dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden">
        <Table
          data={filteredTeachers}
          columns={columns}
          onEdit={handleEdit}
          onDelete={(id) => {
            const teacher = teachers.find(t => (t._id || t.id || t.teacherId) === id);
            setSelectedTeacher(teacher);
            setIsDeleteModalOpen(true);
          }}
          primaryKey="_id"
        />
      </div>

      {/* Empty State */}
      {filteredTeachers.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center">
            <FiUsers className="w-12 h-12 text-slate-400 dark:text-slate-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No teachers found</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Try adjusting your filters or add a new teacher</p>
          <button
            onClick={() => {
              setFormMode('add');
              setSelectedTeacher(null);
              setIsFormModalOpen(true);
            }}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors inline-flex items-center gap-2"
          >
            <FiPlus className="w-5 h-5" />
            Add Your First Teacher
          </button>
        </div>
      )}

      {/* Modals */}
      <Form
        isOpen={isFormModalOpen}
        formData={formData}
        setFormData={setFormData}
        onClose={() => setIsFormModalOpen(false)}
        initialData={selectedTeacher}
        onSubmit={formMode === 'add' ? handleAddTeacher : handleEditTeacher}
        title="Teacher"
        fields={teacherFields}
      />

      <TeacherDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        teacher={selectedTeacher}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => selectedTeacher && handleDeleteTeacher(selectedTeacher._id || selectedTeacher.id || selectedTeacher.teacherId)}
        teacherName={selectedTeacher ? `${selectedTeacher.firstName} ${selectedTeacher.lastName}` : ''}
      />
    </div>
  );
};

export default TeacherManagement;