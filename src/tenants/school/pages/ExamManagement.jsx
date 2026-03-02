import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import {
    useGetExaminationsQuery,
    useCreateExaminationMutation,
    useUpdateExaminationMutation,
    useDeleteExaminationMutation
} from '../api/examApi';

import { useGetAllClassesQuery } from '../api/classApi';

import DataCards from '../../../common/components/ui/DataCards';
import Form from '../../../common/components/ui/Form';

import {
    ClipboardDocumentListIcon,
    PlusIcon,
    AcademicCapIcon
} from '@heroicons/react/24/outline';

const ExamManagement = () => {
    const { tenantName, domain } = useParams();
    const navigate = useNavigate();

    const initialFormState = {
        name: '',
        examType: '',
        academicYear: '',
        term: '',
        startDate: '',
        endDate: '',
        description: '',
        classId: '',
    };

    const [selectedClassId, setSelectedClassId] = useState('');
    const [selectedExam, setSelectedExam] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState(initialFormState);

    // -------------------- GET CLASSES --------------------
    const { data: classesData } = useGetAllClassesQuery({ tenantId: tenantName });
    const classes = classesData?.classes || [];

    useEffect(() => {
        if (classes.length > 0 && !selectedClassId) {
            setSelectedClassId(classes[0].id);
        }
    }, [classes, selectedClassId]);

    // -------------------- GET EXAMS --------------------
    const {
        data: examsData,
        isLoading,
        error,
        refetch
    } = useGetExaminationsQuery(
        { tenantName, classId: selectedClassId },
        { skip: !selectedClassId }
    );

    const examCardsData = examsData?.class?.examinations || [];
    const totalExams = examCardsData.length;

    // -------------------- MUTATIONS --------------------
    const [createExam, { isLoading: isCreating }] = useCreateExaminationMutation();
    const [updateExam, { isLoading: isUpdating }] = useUpdateExaminationMutation();
    const [deleteExam] = useDeleteExaminationMutation();

    // -------------------- HANDLERS --------------------
    const handleCreate = () => {
        setSelectedExam(null);
        setFormData({ ...initialFormState, classId: selectedClassId });
        setIsModalOpen(true);
    };

    const handleEdit = (exam) => {
        setSelectedExam(exam);
        setIsModalOpen(true);
    };

    const handleDelete = async (exam) => {
        if (!window.confirm("Delete this exam?")) return;
        await deleteExam({ tenantName, id: exam.id });
        refetch();
    };

    const handleSubmit = async (data) => {
        try {
            if (!data.name) {
                alert("Exam name is required");
                return;
            }

            if (selectedExam) {
                await updateExam({ tenantName, id: selectedExam.id, data }).unwrap();
            } else {
                await createExam({ tenantName, classId: selectedClassId, data }).unwrap();
            }

            setIsModalOpen(false);
            setSelectedExam(null);
            setFormData(initialFormState);
            refetch();
        } catch (err) {
            alert(err?.data?.message || 'Something went wrong');
        }
    };

    const examFields = [
        { key: 'examType', label: 'Type' },
        { key: 'academicYear', label: 'Year' },
        { key: 'term', label: 'Term' },
        {
            key: 'startDate',
            label: 'Start',
            render: (value) =>
                new Date(value).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short'
                }),
        },
        {
            key: 'endDate',
            label: 'End',
            render: (value) =>
                new Date(value).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short'
                }),
        },
        {
            key: 'schedules',
            label: 'Schedules',
            render: (value, row) => (
                <span
                    onClick={() =>
                        navigate(`/${tenantName}/${domain}/exam-schedule/${selectedClassId}/${row.id}`)
                    }
                    className="px-2 py-1 bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 rounded-md text-xs font-bold cursor-pointer hover:bg-indigo-500/30 transition"
                >
                    {value?.length || 0}
                </span>
            ),
        }
    ];

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 min-h-screen 
        bg-slate-50 text-slate-900 
        dark:bg-slate-900 dark:text-slate-100 transition-colors duration-300">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 
            border-b border-slate-200 dark:border-slate-700 pb-6">

                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight 
                    text-slate-900 dark:text-white">
                        Exam Management
                    </h1>

                    <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                        <AcademicCapIcon className="h-4 w-4" />
                        Organize and monitor class-wise examinations
                    </p>
                </div>

                <button
                    onClick={handleCreate}
                    className="inline-flex items-center justify-center px-6 py-3 
                    bg-indigo-600 hover:bg-indigo-700 
                    dark:bg-indigo-500 dark:hover:bg-indigo-600
                    text-white font-semibold rounded-xl 
                    shadow-lg shadow-indigo-200 dark:shadow-none
                    transition-all active:scale-95"
                >
                    <PlusIcon className="h-5 w-5 mr-2 stroke-2" />
                    New Examination
                </button>
            </div>

            {/* Filter & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center 
            bg-white dark:bg-slate-800 
            border border-slate-200 dark:border-slate-700 
            rounded-2xl p-6 shadow-sm transition-colors">

                <div className="flex items-center gap-4 
                border-r border-slate-100 dark:border-slate-700">

                    <div className="p-3 bg-indigo-50 dark:bg-indigo-500/20 rounded-xl">
                        <ClipboardDocumentListIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-300" />
                    </div>

                    <div>
                        <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                            Total Scheduled
                        </p>
                        <p className="text-3xl font-black text-slate-900 dark:text-white">
                            {totalExams}
                        </p>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 ml-1">
                        Viewing Exams For:
                    </label>

                    <select
                        value={selectedClassId}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                        className="w-full 
                        bg-slate-50 dark:bg-slate-700 
                        border border-slate-200 dark:border-slate-600 
                        text-slate-900 dark:text-white 
                        text-sm rounded-xl 
                        focus:ring-2 focus:ring-indigo-500 
                        focus:border-indigo-500 
                        block p-3 transition-colors outline-none appearance-none cursor-pointer"
                    >
                        {classes.map((cls) => (
                            <option key={cls.id} value={cls.id}>
                                {cls.name} • Section {cls.section}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-center p-4 text-sm 
                text-red-800 dark:text-red-300 
                border border-red-200 dark:border-red-700 
                rounded-xl bg-red-50 dark:bg-red-900/30">
                    <span className="font-medium mr-2">Error:</span>
                    {error?.data?.message || 'Failed to load exams'}
                </div>
            )}

            {/* DataCards */}
            <div className="relative min-h-[400px]">
                <DataCards
                    data={examCardsData}
                    fields={examFields}
                    titleKey="name"
                    loading={isLoading}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    primaryKey="id"
                    emptyMessage="No examinations found for this class."
                />
            </div>

            {/* Form Modal */}
            <Form
                isOpen={isModalOpen}
                formData={formData}
                setFormData={setFormData}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={selectedExam}
                isLoading={isCreating || isUpdating}
                type="exam"
                classes={classes}
            />
        </div>
    );
};

export default ExamManagement;
