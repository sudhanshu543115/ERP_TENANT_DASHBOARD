import { apiSlice } from '../../../api/apiSlice';

export const schoolApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTeachers: builder.query({
            query: (tenantName) => `tenant/${tenantName}/teachers`,
            providesTags: ['Teacher'],
            transformResponse: (response) => {
                if (Array.isArray(response)) return response;
                if (response?.teachers && Array.isArray(response.teachers)) return response.teachers;
                if (response?.data && Array.isArray(response.data)) return response.data;
                return [];
            },
        }),
        getTeacher: builder.query({
            query: ({ tenantName, id }) => `tenant/${tenantName}/teachers/${id}`,
            providesTags: (result, error, arg) => [{ type: 'Teacher', id: arg.id }],
        }),
        createTeacher: builder.mutation({
            query: ({ tenantName, data }) => ({
                url: `tenant/${tenantName}/teachers`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Teacher'],
        }),
        updateTeacher: builder.mutation({
            query: ({ tenantName, id, data }) => ({
                url: `tenant/${tenantName}/teachers/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, arg) => ['Teacher', { type: 'Teacher', id: arg.id }],
        }),
        deleteTeacher: builder.mutation({
            query: ({ tenantName, id }) => ({
                url: `tenant/${tenantName}/teachers/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Teacher'],
        }),
    }),
});

export const {
    useGetTeachersQuery,
    useGetTeacherQuery,
    useCreateTeacherMutation,
    useUpdateTeacherMutation,
    useDeleteTeacherMutation,
} = schoolApi;