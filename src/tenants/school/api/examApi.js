import { apiSlice } from '../../../api/apiSlice';

export const examApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        //  Get All Examinations
        // getExaminations: builder.query({
        //     query: (tenantName) => `tenant/${tenantName}/examination-portal`,
        //     providesTags: ['Examination'],
        //     transformResponse: (response) =>  response?.data || [],
        // }),
        getExaminations: builder.query({
            query: ({ tenantName, classId }) => ({
                url: `tenant/${tenantName}/examination-portal/class/${classId}`,
                providesTags: ['Examination'],
            })
        }),

        //  Create Examination
        createExamination: builder.mutation({
            query: ({ tenantName, data }) => ({
                url: `tenant/${tenantName}/examination-portal`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Examination'],
        }),

        // Update Examination
        updateExamination: builder.mutation({
            query: ({ tenantName, id, data }) => ({
                url: `tenant/${tenantName}/examination-portal/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Examination'],
        }),

        // Delete Examination
        deleteExamination: builder.mutation({
            query: ({ tenantName, id }) => ({
                url: `tenant/${tenantName}/examination-portal/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Examination'],
        }),







        createExamSchedule: builder.mutation({
            query: ({ tenantName, data }) => ({
                url: `tenant/${tenantName}/examination-portal/schedule`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Examination'],
        }),


        getDatesheet: builder.query({
            query: ({ tenantName, examinationId }) => ({
                url: `tenant/${tenantName}/examination-portal/${examinationId}/datesheet`,
            }),
            providesTags: ['Examination'],
        }),

        updateExamSchedule: builder.mutation({
            query: ({ tenantName, id, data }) => ({
                url: `tenant/${tenantName}/examination-portal/schedule/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Examination'],
        }),

        deleteExamSchedule: builder.mutation({
            query: ({ tenantName, id }) => ({
                url: `tenant/${tenantName}/examination-portal/schedule/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Examination'],
        }),

    }),
});

export const {
    useGetExaminationsQuery,
    useCreateExaminationMutation,
    useUpdateExaminationMutation,
    useDeleteExaminationMutation,
    useGetDatesheetQuery,
    useCreateExamScheduleMutation,
    useUpdateExamScheduleMutation,
    useDeleteExamScheduleMutation,
} = examApi;
