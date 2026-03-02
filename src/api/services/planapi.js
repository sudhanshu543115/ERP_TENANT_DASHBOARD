// src/store/api/subscriptionApi.js

import { apiSlice } from '../apiSlice'; // your base API

export const subscriptionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all subscription plans
    getSubscriptionPlans: builder.query({
      query: () => 'super-admin/subscription',
      providesTags: ['Subscription'],
    }),

    // Get subscription history for a tenant
    getSubscriptionHistory: builder.query({
      query: (tenantId) => `tenant/sps/${tenantId}/plan-history`,
      providesTags: ['Subscription'],
      transformResponse: (res) => {
        const history = res?.tenantPlanHistory || (Array.isArray(res) ? res : res?.history || res?.data || []);
        if (Array.isArray(history)) {
          return history.map(item => ({
            id: item.id,
            planName: item.plan_name || item.planName,
            startDate: item.assigned_at || item.startDate,
            endDate: item.expires_at || item.endDate,
            status: item.status?.toLowerCase() || 'expired',
            amount: item.amount || 0,
          }));
        }
        return [];
      },
    }),
  }),
  overrideExisting: false, // keeps existing endpoints safe
});

export const {
  useGetSubscriptionPlansQuery,
  useGetSubscriptionHistoryQuery,
} = subscriptionApi;