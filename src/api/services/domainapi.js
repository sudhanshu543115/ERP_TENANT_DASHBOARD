import { apiSlice } from "../apiSlice";

export const domainApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getdomain: builder.query({
            query: (planId) => ({
                url: '/super-admin/subscription/all-domains',
                method: 'GET',
                params: { planId },
            }),
        }),

    }),
});

export const { useGetdomainQuery } = domainApi;
