import { apiSlice } from "../../../api/apiSlice";

export const studentApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        // ✅ Get Students
        getStudents: builder.query({
            query: (tenantName) =>
                `/tenant/${tenantName}/students`,
            providesTags: ['Students'],
        }),

        // ✅ Get Student Details
        getStudentDetails: builder.query({
            query: ({ tenantName, id }) =>
                `/tenant/${tenantName}/students/${id}`,
            providesTags: ['Students'],
        }),

        // ✅ Get Classes (for filtering)
        getClasses: builder.query({
            query: (tenantName) =>
                `/tenant/${tenantName}/classes`,
            providesTags: ['Class'],
        }),

        // ✅ Create Student
        createStudent: builder.mutation({
            query: ({ tenantName, data }) => ({
                url: `/tenant/${tenantName}/students`,
                method: 'POST',
                body: {
                    // Basic Information (matching API response structure)
                    studentId: data.studentId?.trim(),
                    firstName: data.firstName?.trim(),
                    lastName: data.lastName?.trim(),
                    
                    // Contact Information
                    email: data.email?.trim().toLowerCase(),
                    phone: data.phone?.trim(),
                    
                    // Academic Information
                    classId: data.classId?.trim() || null,
                    
                    // Personal Information
                    gender: data.gender?.trim(),
                    dateOfBirth: data.dateOfBirth,
                    address: data.address?.trim() || '',
                    
                    // Parent/Guardian Information
                    parentName: data.parentName?.trim() || '',
                    parentPhone: data.parentPhone?.trim() || '',
                },
            }),
            invalidatesTags: ['Students'],
        }),

        // ✅ Update Student
        updateStudent: builder.mutation({
            query: ({ tenantName, id, data }) => ({
                url: `/tenant/${tenantName}/students/${id}`,
                method: 'PUT',
                body: {
                    // Basic Information (matching API response structure)
                    studentId: data.studentId?.trim(),
                    firstName: data.firstName?.trim(),
                    lastName: data.lastName?.trim(),
                    
                    // Contact Information
                    email: data.email?.trim().toLowerCase(),
                    phone: data.phone?.trim(),
                    
                    // Academic Information
                    classId: data.classId?.trim() || null,
                    
                    // Personal Information
                    gender: data.gender?.trim(),
                    dateOfBirth: data.dateOfBirth,
                    address: data.address?.trim() || '',
                    
                    // Parent/Guardian Information
                    parentName: data.parentName?.trim() || '',
                    parentPhone: data.parentPhone?.trim() || '',
                },
            }),
            invalidatesTags: ['Students'],
        }),

        // ✅ Delete Student
        deleteStudent: builder.mutation({
            query: ({ tenantName, id }) => ({
                url: `/tenant/${tenantName}/students/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Students'],
        }),

    }),
});

export const {
    useGetStudentsQuery,
    useGetStudentDetailsQuery,
    useGetClassesQuery,
    useCreateStudentMutation,
    useUpdateStudentMutation,
    useDeleteStudentMutation,
} = studentApi;
