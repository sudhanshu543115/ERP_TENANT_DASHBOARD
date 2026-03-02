import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authcontext';

const ProtectedRoute = () => {
    const { user, loading } = useAuth(); // Check user and loading state
    const location = useLocation();

    if (loading) {
        // You can replace this with a proper Loading Spinner component
        return (
            <div className="flex items-center justify-center h-screen bg-slate-900">
                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Check plan status
    const hasActivePlan = user.subscription_planId && user.isActive;
    const isPricingFlow = location.pathname.includes('/pricing') ||
        location.pathname.includes('/checkout') ||
        location.pathname.includes('/payment') ||
        location.pathname.includes('/plan-history'); // Maybe allow history too?

    if (!hasActivePlan && !isPricingFlow) {
        return <Navigate to={`/${user.tenantUsername}/pricing`} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
