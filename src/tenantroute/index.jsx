import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import Layout from '../common/layout/Layout';
import ProtectedRoute from '../common/components/ProtectedRoute';
import Login from '../common/auth/Login';
import Dashboard from '../common/pages/Dashboard';
import schoolRoutes from '../tenants/school/schoolroute';
import hospitalRoutes from '../tenants/hospital/hospitalroute';
import PlanHistory from '../common/pages/PlanHistory';
import Pricing from '../common/pages/Pricing';
import PaymentPage from '../common/pages/PaymentPage';
import RegisterPage from '../common/auth/Register';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/login" replace />,
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <RegisterPage />,
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: '/:tenantName/pricing',
                element: <Pricing />,
            },
            {
                path: '/:tenantName/checkout',
                element: <PaymentPage />,
            },
            {
                path: '/:tenantName',
                element: <Layout />,
                children: [
                    {
                        index: true,
                        element: <Dashboard />,
                    },

                    {
                        path: 'plan-history',
                        element: <PlanHistory />,
                    },

                    {
                        path: ':domain',
                        element: <Outlet />,
                        children: [
                            ...schoolRoutes,
                            ...hospitalRoutes,
                        ]
                    },
                ],
            },
        ],
    },
    {
        path: '*',
        element: <div className="min-h-screen bg-[#0B1120] flex items-center justify-center text-white text-2xl font-bold">404 - Page Not Found</div>,
    },
]);

export default router;
