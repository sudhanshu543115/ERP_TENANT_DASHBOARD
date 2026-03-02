import { apiSlice } from '../../../api/apiSlice';

export const classApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({



        createClass: builder.mutation({
            query: ({ tenantId, data }) => ({
                url: `tenant/${tenantId}/classes`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Class'],
        }),


        getAllClasses: builder.query({
            query: ({ tenantId }) => ({
                url: `tenant/${tenantId}/classes`,
            }),
            providesTags: ['Class'],
        }),

        getClassById: builder.query({
            query: ({ tenantId, id }) => ({
                url: `tenant/${tenantId}/classes/${id}`,
            }),
            providesTags: ['Class'],
        }),

        updateClass: builder.mutation({
            query: ({ tenantId, id, data }) => ({
                url: `tenant/${tenantId}/classes/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Class'],
        }),

        deleteClass: builder.mutation({
            query: ({ tenantId, id }) => ({
                url: `tenant/${tenantId}/classes/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Class'],
        }),


    }),
});

export const {

    useCreateClassMutation,
    useGetAllClassesQuery,
    useGetClassByIdQuery,
    useUpdateClassMutation,
    useDeleteClassMutation,
} = classApi;
