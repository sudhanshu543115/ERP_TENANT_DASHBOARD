import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        tenantName: localStorage.getItem('tenantName') || null,
    },
    reducers: {
        setCredentials: (state, action) => {
            const { user, tenantName } = action.payload;
            state.user = user;
            state.tenantName = tenantName;
            localStorage.setItem('tenantName', tenantName);
        },
        logout: (state) => {
            state.user = null;
            state.tenantName = null;
            localStorage.removeItem('tenantName');
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentTenant = (state) => state.auth.tenantName;
