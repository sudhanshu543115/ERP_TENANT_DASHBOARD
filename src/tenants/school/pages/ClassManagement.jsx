import React, { useState, useEffect } from 'react';

import { useParams } from 'react-router-dom';

import {

    useGetAllClassesQuery,

    useCreateClassMutation,

    useUpdateClassMutation,

    useDeleteClassMutation,

} from '../api/classApi';



import Form from '../../../common/components/ui/Form';

import Table from '../../../common/components/ui/Table';

import DataCards from '../../../common/components/ui/DataCards';

import StatsCard from '../../../common/components/ui/StatsCard';

// import SearchBar from '../../../common/components/ui/SearchBar';

import SearchAndFilter from '../../../common/components/ui/SearchAndFilter';



import {

    PlusIcon,

    AcademicCapIcon,

    BookOpenIcon,

    UsersIcon,

    CalendarIcon,



} from '@heroicons/react/24/outline';

import { motion, AnimatePresence } from 'framer-motion';



const initialFormState = {

    name: '',

    section: '',

    academicYear: '',

    description: '',

    classTeacher: '',

    capacity: '',

};



const ClassManagement = () => {

    const { tenantName } = useParams();



    const [isModalOpen, setIsModalOpen] = useState(false);

    const [selectedClass, setSelectedClass] = useState(null);

    const [formData, setFormData] = useState(initialFormState);

    const [viewMode, setViewMode] = useState('cards');

    const [searchQuery, setSearchQuery] = useState('');

    const [activeFilters, setActiveFilters] = useState({});

    const [deleteConfirm, setDeleteConfirm] = useState(null);



    const { data: classesData, isLoading, error, refetch } =

        useGetAllClassesQuery({ tenantId: tenantName });



    const [createClass, { isLoading: isCreating }] = useCreateClassMutation();

    const [updateClass, { isLoading: isUpdating }] = useUpdateClassMutation();

    const [deleteClass, { isLoading: isDeleting }] = useDeleteClassMutation();



    // Safe access to classes array

    const classes = classesData?.classes || [];

    const totalClasses = classes.length;



    const academicYears = [...new Set(classes

        .map(cls => cls?.academicYear)

        .filter(Boolean)

    )];

    const classNames = [...new Set(

        classes

            .map(cls => cls?.name)

            .filter(Boolean)

    )];



    const searchFilters = [

        {

            key: 'name',

            label: 'Class Name',

            type: 'select',

            options: classNames.map(name => ({

                label: name,

                value: name

            }))

        },

        {

            key: 'academicYear',

            label: 'Academic Year',

            type: 'select',

            options: academicYears.map(year => ({

                label: year,

                value: year

            }))

        }

    ];



    // Safe filter function with null checks

    const filteredClasses = classes.filter(cls => {

        if (!cls) return false;



        const matchesSearch =

            !searchQuery ||

            cls.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||

            cls.section?.toLowerCase().includes(searchQuery.toLowerCase()) ||

            cls.description?.toLowerCase().includes(searchQuery.toLowerCase());



        const matchesName =

            !activeFilters.name ||

            cls.name === activeFilters.name;



        const matchesYear =

            !activeFilters.academicYear ||

            cls.academicYear === activeFilters.academicYear;



        return matchesSearch && matchesName && matchesYear;

    });





    const handleDelete = async (id) => {

        if (deleteConfirm === id) {

            try {

                await deleteClass({ tenantId: tenantName, id }).unwrap();

                setDeleteConfirm(null);

                refetch();

            } catch (err) {

                alert(err?.data?.message || 'Failed to delete class');

            }

        } else {

            setDeleteConfirm(id);

            setTimeout(() => setDeleteConfirm(null), 3000);

        }

    };



    const cancelDelete = () => {

        setDeleteConfirm(null);

    };



    useEffect(() => {

        if (!isModalOpen) {

            setSelectedClass(null);

            setFormData(initialFormState);

        }

    }, [isModalOpen]);



    const handleEdit = (cls) => {

        if (!cls) return;



        setSelectedClass(cls);

        setFormData({

            name: cls.name || '',

            section: cls.section || '',

            academicYear: cls.academicYear || '',

            description: cls.description || '',

            classTeacher: cls.classTeacher || '',

            capacity: cls.capacity || '',

        });

        setIsModalOpen(true);

    };



    const handleView = (cls) => {

        console.log('View class:', cls);

    };



    const handleDuplicate = (cls) => {

        if (!cls) return;



        setSelectedClass(null);

        setFormData({

            name: cls.name ? `${cls.name} (Copy)` : '',

            section: cls.section || '',

            academicYear: cls.academicYear || '',

            description: cls.description || '',

            classTeacher: cls.classTeacher || '',

            capacity: cls.capacity || '',

        });

        setIsModalOpen(true);

    };



    const handleSubmit = async (data) => {

        try {

            if (!data.name) {

                alert("Class name is required");

                return;

            }



            if (selectedClass) {

                await updateClass({

                    tenantId: tenantName,

                    id: selectedClass.id,

                    data

                }).unwrap();

            } else {

                await createClass({

                    tenantId: tenantName,

                    data

                }).unwrap();

            }



            setIsModalOpen(false);

            refetch();

        } catch (err) {

            alert(err?.data?.message || 'Something went wrong');

        }

    };

    // Card fields configuration with safe rendering

    const cardFields = [

        {

            key: 'name',

            label: 'Class Name',

            render: (value) => {

                if (value === null || value === undefined) return '—';

                if (typeof value === 'object') return JSON.stringify(value);

                return String(value);

            }

        },

        {

            key: 'section',

            label: 'Section',

            render: (value) => {

                if (value === null || value === undefined) return '—';

                if (typeof value === 'object') return JSON.stringify(value);

                return String(value);

            }

        },



        {

            key: 'academicYear',

            label: 'Academic Year',

            render: (value) => {

                if (!value) return 'Current';

                if (typeof value === 'object') return JSON.stringify(value);

                return String(value);

            }

        },



        {

            key: 'description',

            label: 'Description',

            render: (value) => {

                if (!value) return '—';

                if (typeof value === 'object') return JSON.stringify(value);

                return (

                    <span className="truncate block max-w-[200px]" title={String(value)}>

                        {String(value)}

                    </span>

                );

            }

        },

    ];



    // Table columns configuration with safe rendering

    const columns = [

        {

            key: 'name',

            header: 'Class Name',

        },

        {

            key: 'section',

            header: 'Section',

        },

        {

            key: 'academicYear',

            header: 'Academic Year',

        },

        {

            key: 'description',

            header: 'Description',

        },

        {

            key: 'examinations',

            header: 'Exams',

            render: (_, item) => item?._count?.examinations ?? 0

        },

        {

            key: 'schedules',

            header: 'Schedules',

            render: (_, item) => item?._count?.schedules ?? 0

        }

    ];





    // Calculate stats safely

    const totalStudents = classes.reduce((acc, cls) => {

        if (cls && cls.capacity) {

            const capacity = parseInt(cls.capacity);

            return acc + (isNaN(capacity) ? 0 : capacity);

        }

        return acc;

    }, 0);



    const activeClasses = classes.filter(c => c && c.isActive !== false).length;



    // Safely format stat values

    const formatStatValue = (value) => {

        if (typeof value === 'object') return '0';

        return String(value);

    };



    const stats = [

        {

            title: 'Total Classes', value: totalClasses, icon: AcademicCapIcon, color: 'blue'

        },

        {

            title: 'Total Students', value: totalStudents, icon: UsersIcon, color: 'green'

        },

        {

            title: 'Active Classes', value: activeClasses, icon: BookOpenIcon, color: 'purple'

        },

        {

            title: 'Academic Years', value: academicYears.length || 1, icon: CalendarIcon, color: 'orange'

        },

    ];



    return (

        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">

            <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">

                {/* Header */}

                <motion.div

                    initial={{ opacity: 0, y: -20 }}

                    animate={{ opacity: 1, y: 0 }}

                    className="bg-white dark:bg-slate-800 

           rounded-2xl shadow-sm 

           border border-gray-100 dark:border-slate-700 

           p-6 transition-colors duration-300"



                >

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

                        <div className="flex items-center gap-4">

                            <div className="p-3 bg-indigo-50 rounded-xl">

                                <AcademicCapIcon className="h-6 w-6 text-indigo-600" />

                            </div>

                            <div>

                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">

                                    Class Management

                                </h1>

                                <p className="text-gray-900 dark:text-white">

                                    Manage school classes, sections, and assignments

                                </p>

                            </div>

                        </div>



                        <motion.button

                            whileHover={{ scale: 1.02 }}

                            whileTap={{ scale: 0.98 }}

                            onClick={() => {

                                setSelectedClass(null);

                                setFormData(initialFormState);

                                setIsModalOpen(true);

                            }}

                            className="flex items-center px-5 py-2.5 bg-indigo-600 text-white rounded-xl shadow-sm hover:bg-indigo-700 transition-all duration-200"

                        >

                            <PlusIcon className="h-5 w-5 mr-2" />

                            Add Class

                        </motion.button>

                    </div>

                </motion.div>



                {/* Stats Cards */}

                <motion.div

                    initial={{ opacity: 0, y: 20 }}

                    animate={{ opacity: 1, y: 0 }}

                    transition={{ delay: 0.1 }}

                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"

                >

                    {stats.map((stat, index) => (

                        <StatsCard

                            key={index}

                            title={stat.title}

                            value={stat.value}

                            icon={stat.icon}

                            color={stat.color}

                            isLoading={isLoading}

                        />

                    ))}

                </motion.div>



                {/* Search and Filters */}

                <motion.div

                    initial={{ opacity: 0 }}

                    animate={{ opacity: 1 }}

                    transition={{ delay: 0.2 }}

                >

                    <SearchAndFilter

                        searchTerm={searchQuery}

                        setSearchTerm={setSearchQuery}

                        filters={activeFilters}

                        setFilters={setActiveFilters}

                        filterOptions={[

                            {

                                key: 'name',

                                label: 'Class Name',

                                placeholder: 'All Classes',

                                defaultValue: '',

                                options: classNames.map(name => ({

                                    label: name,

                                    value: name

                                }))

                            },

                            {

                                key: 'academicYear',

                                label: 'Academic Year',

                                placeholder: 'All Years',

                                defaultValue: '',

                                options: academicYears.map(year => ({

                                    label: year,

                                    value: year

                                }))

                            }

                        ]}

                        placeholder="Search classes..."

                        loading={isLoading}

                    />



                    <div className="mt-3 text-sm text-gray-500">

                        Showing {filteredClasses.length} of {totalClasses} classes

                    </div>

                </motion.div>



                {/* Error Display */}

                <AnimatePresence>

                    {error && (

                        <motion.div

                            initial={{ opacity: 0, y: -10 }}

                            animate={{ opacity: 1, y: 0 }}

                            exit={{ opacity: 0, y: -10 }}

                            className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600"

                        >

                            {error?.data?.message || 'Failed to load classes'}

                        </motion.div>

                    )}

                </AnimatePresence>



                {/* Main Content - Cards or Table */}

                <motion.div

                    key={viewMode}

                    initial={{ opacity: 0, y: 20 }}

                    animate={{ opacity: 1, y: 0 }}

                    transition={{ duration: 0.3 }}

                >

                    {viewMode === 'cards' ? (

                        <DataCards

                            data={filteredClasses}

                            fields={cardFields}

                            titleKey="name"

                            subtitleKey="section"

                            loading={isLoading}

                            onEdit={handleEdit}

                            onDelete={handleDelete}

                            onView={handleView}

                            onDuplicate={handleDuplicate}

                            emptyMessage="No classes found"

                            extraContent={(item) => deleteConfirm === item?.id && (

                                <motion.div

                                    initial={{ opacity: 0 }}

                                    animate={{ opacity: 1 }}

                                    className="mt-2 p-2 bg-red-50 rounded-lg flex items-center justify-between"

                                >

                                    <span className="text-xs text-red-600">Delete this class?</span>

                                    <div className="flex gap-2">

                                        <button

                                            onClick={() => handleDelete(item.id)}

                                            className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"

                                        >

                                            Confirm

                                        </button>

                                        <button

                                            onClick={cancelDelete}

                                            className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"

                                        >

                                            Cancel

                                        </button>

                                    </div>

                                </motion.div>

                            )}

                        />

                    ) : (

                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

                            <Table

                                data={filteredClasses}

                                columns={columns}

                                onEdit={handleEdit}

                                onDelete={handleDelete}

                                primaryKey="id"

                                isLoading={isLoading}

                                emptyMessage="No classes found"

                            />

                        </div>

                    )}

                </motion.div>

                <Form

                    isOpen={isModalOpen}

                    formData={formData}

                    setFormData={setFormData}

                    onClose={() => setIsModalOpen(false)}

                    onSubmit={handleSubmit}

                    initialData={selectedClass}

                    isLoading={isCreating || isUpdating}

                    type="class"

                />

            </div>

        </div>

    );

};

export default ClassManagement;