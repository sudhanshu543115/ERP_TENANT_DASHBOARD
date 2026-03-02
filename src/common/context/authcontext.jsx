import React, { createContext, useContext, useState, useEffect } from 'react';
import { useVerifySessionQuery } from '../../api/services/authapi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [tenantName, setTenantName] = useState(localStorage.getItem('tenantName') || null);
    const [planId, setPlanId] = useState(localStorage.getItem('planId') || null);

    // Verify session on mount or token change
    // Verify session on mount
    // Session verification removed as per request (endpoint 404)
    // const { data: verifiedUser, isSuccess, isLoading: isVerifying } = useVerifySessionQuery();

    // useEffect(() => {
    //     if (isSuccess && verifiedUser) {
    //         // Update state with fresh data from backend
    //         setUser(verifiedUser.user || verifiedUser); // Adjust based on backend response shape
    //         // If response includes updated tenantName/planId, update those too
    //         if (verifiedUser.tenantName) setTenantName(verifiedUser.tenantName);
    //         if (verifiedUser.planId) setPlanId(verifiedUser.planId);
    //     }
    // }, [isSuccess, verifiedUser]);

    const login = (userData) => {
        setUser(userData.user);
        setTenantName(userData.tenantName);
        setPlanId(userData.planId);

        localStorage.setItem('user', JSON.stringify(userData.user)); // Persist user
        localStorage.setItem('tenantName', userData.tenantName);
        localStorage.setItem('planId', userData.planId);
    };

    const logout = () => {
        setUser(null);
        setTenantName(null);
        setPlanId(null);

        localStorage.removeItem('user');
        localStorage.removeItem('tenantName');
        localStorage.removeItem('planId');
    };

    return (
        <AuthContext.Provider value={{ user, tenantName, planId, login, logout, loading: false }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
