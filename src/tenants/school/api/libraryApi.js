import { apiSlice } from '../../../api/apiSlice';

export const libraryApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Library endpoints
        getAllLibraries: builder.query({
            query: (tenantName) => `tenant/${tenantName}/libraries`,
            transformResponse: (response) => {
                if (Array.isArray(response)) return response;
                if (response?.data && Array.isArray(response.data)) return response.data;
                if (response?.libraries && Array.isArray(response.libraries)) return response.libraries;
                return [];
            },
            providesTags: (result) =>
                Array.isArray(result)
                    ? [...result.map(({ id, _id }) => ({ type: 'Library', id: id || _id })), { type: 'Library', id: 'LIST' }]
                    : [{ type: 'Library', id: 'LIST' }],
        }),
        getLibraryById: builder.query({
            query: ({ tenantName, id }) => `tenant/${tenantName}/libraries/${id}`,
            providesTags: (result, error, arg) => [{ type: 'Library', id: arg.id }],
        }),
        createLibrary: builder.mutation({
            query: ({ tenantName, data }) => ({
                url: `tenant/${tenantName}/libraries`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{ type: 'Library', id: 'LIST' }],
        }),
        updateLibrary: builder.mutation({
            query: ({ tenantName, id, data }) => ({
                url: `tenant/${tenantName}/libraries/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Library', id: arg.id }],
        }),
        deleteLibrary: builder.mutation({
            query: ({ tenantName, id }) => ({
                url: `tenant/${tenantName}/libraries/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Library', id: 'LIST' }],
        }),

        // Book endpoints
        getBooksByLibrary: builder.query({
            query: ({ tenantName, libraryId }) => `tenant/${tenantName}/libraries/${libraryId}/books`,
            transformResponse: (response) => {
                if (Array.isArray(response)) return response;
                if (response?.data && Array.isArray(response.data)) return response.data;
                if (response?.books && Array.isArray(response.books)) return response.books;
                return [];
            },
            providesTags: (result, error, arg) => [{ type: 'Book', libraryId: arg.libraryId }, { type: 'Book', id: 'LIST' }],
        }),
        getBookDetails: builder.query({
            query: ({ tenantName, id }) => `tenant/${tenantName}/books/${id}`,
            providesTags: (result, error, arg) => [{ type: 'Book', id: arg.id }],
        }),
        addBook: builder.mutation({
            query: ({ tenantName, libraryId, data }) => ({
                url: `tenant/${tenantName}/libraries/${libraryId}/books`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Book', libraryId: arg.libraryId }],
        }),
        updateBook: builder.mutation({
            query: ({ tenantName, id, data }) => ({
                url: `tenant/${tenantName}/books/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Book', id: arg.id }],
        }),
        deleteBook: builder.mutation({
            query: ({ tenantName, id }) => ({
                url: `tenant/${tenantName}/books/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Book', libraryId: arg.libraryId }],
        }),
    }),
});

export const {
    useGetAllLibrariesQuery,
    useGetLibraryByIdQuery,
    useCreateLibraryMutation,
    useUpdateLibraryMutation,
    useDeleteLibraryMutation,
    useGetBooksByLibraryQuery,
    useGetBookDetailsQuery,
    useAddBookMutation,
    useUpdateBookMutation,
    useDeleteBookMutation,
} = libraryApi;