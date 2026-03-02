import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../context/authcontext';
import { useLoginMutation } from '../../api/services/authapi';

const Login = () => {
    const [tenantUsername, setTenantUsername] = useState('jbm');
    const [password, setPassword] = useState('Abcd123@#');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login: setAuthContext, user, loading } = useAuth();
    const [loginApi, { isLoading }] = useLoginMutation();

    useEffect(() => {
        if (!loading && user) {
            const tenantPath = user.tenantUsername;
            if (user.subscription_planId && user.isActive) {
                navigate(`/${tenantPath}`, { replace: true });
            } else {
                navigate(`/${tenantPath}/pricing`, { replace: true });
            }
        }
    }, [user, loading, navigate]);

    useEffect(() => {
        const msg = searchParams.get('message');
        if (msg) {
            toast.error(msg, { duration: 5000, icon: '🔒' });
            // Clean up URL
            navigate('/login', { replace: true });
        }
    }, [searchParams, navigate]);

    if (loading) {
        return (
            <div className="h-screen w-screen flex justify-center items-center bg-slate-900">
                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await loginApi({ tenantUsername, password }).unwrap();

            const { token, tenant } = response;

            setAuthContext({
                user: tenant,
                token: token,
                tenantName: tenant.tenantUsername,
                planId: tenant.subscription_planId
            });

            const tenantPath = tenant.tenantUsername;

            if (tenant.subscription_planId && tenant.isActive) {
                navigate(`/${tenantPath}`);
            } else {
                navigate(`/${tenantPath}/pricing`);
            }
        } catch (error) {
            console.error('Login failed:', error);
            alert(error?.data?.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 flex justify-center items-center p-2 sm:p-3 md:p-4">
            <Toaster position="top-center" reverseOrder={false} />
            <div className="w-full max-w-6xl h-[95vh] sm:h-[90vh] md:h-[85vh] lg:h-[80vh] max-h-[700px] bg-white bg-opacity-40 backdrop-blur-lg shadow-2xl rounded-2xl sm:rounded-3xl flex flex-col lg:flex-row overflow-hidden border border-white border-opacity-30">
                {/* Left Side: Form with Glass Effect - No Scroll */}
                <div className="w-full lg:w-1/2 h-full p-4 sm:p-5 md:p-6 lg:p-8 flex flex-col justify-center bg-white bg-opacity-20 backdrop-blur-md">
                    {/* Dynamic Animated Header - Compact for mobile */}
                    <div className="text-center mb-2 sm:mb-3 md:mb-4 relative">
                        {/* Animated Background Glow - Smaller on mobile */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 sm:w-20 md:w-24 lg:w-32 h-16 sm:h-20 md:h-24 lg:h-32 bg-emerald-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                        </div>

                        {/* Animated Icon Container - Responsive sizing */}
                        <div className="relative inline-flex items-center justify-center mb-1 sm:mb-2">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
                            <div className="relative bg-white bg-opacity-90 rounded-2xl p-1.5 sm:p-2 md:p-2.5 lg:p-3.5 shadow-lg">
                                <svg
                                    className="w-6 sm:w-7 md:w-10 lg:w-14 h-6 sm:h-7 md:h-10 lg:h-14"
                                    viewBox="0 0 100 100"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    {/* Animated Graduation Cap */}
                                    <g>
                                        <path d="M50 20 L80 35 L50 50 L20 35 Z" fill="#059669">
                                            <animate
                                                attributeName="opacity"
                                                values="1;0.7;1"
                                                dur="2s"
                                                repeatCount="indefinite"
                                            />
                                        </path>
                                        <path d="M50 50 L50 70 L35 62 L35 45 Z" fill="#10B981" />
                                        <path d="M50 50 L50 70 L65 62 L65 45 Z" fill="#34D399" />
                                        <rect x="48" y="15" width="4" height="12" fill="#047857" />
                                        <circle cx="50" cy="12" r="3" fill="#FCD34D">
                                            <animate
                                                attributeName="r"
                                                values="3;4;3"
                                                dur="1.5s"
                                                repeatCount="indefinite"
                                            />
                                        </circle>
                                    </g>
                                    {/* Sparkle Effects */}
                                    <circle cx="25" cy="30" r="2" fill="#FCD34D">
                                        <animate
                                            attributeName="opacity"
                                            values="0;1;0"
                                            dur="2s"
                                            repeatCount="indefinite"
                                        />
                                    </circle>
                                    <circle cx="75" cy="25" r="2" fill="#10B981">
                                        <animate
                                            attributeName="opacity"
                                            values="0;1;0"
                                            dur="2.5s"
                                            repeatCount="indefinite"
                                        />
                                    </circle>
                                    <circle cx="70" cy="55" r="1.5" fill="#3B82F6">
                                        <animate
                                            attributeName="opacity"
                                            values="0;1;0"
                                            dur="3s"
                                            repeatCount="indefinite"
                                        />
                                    </circle>
                                </svg>
                            </div>
                        </div>

                        {/* Dynamic Text with Gradient - Responsive text sizes */}
                        <div className="relative">
                            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-extrabold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-0.5">
                                ERP Portal
                            </h1>
                            <div className="flex items-center justify-center gap-1 text-gray-700">
                                <div className="flex items-center gap-1">
                                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                    <span className="text-[10px] sm:text-xs md:text-sm font-medium">
                                        Secure Authentication
                                    </span>
                                </div>
                            </div>
                            <p className="text-gray-600 text-[10px] sm:text-xs mt-0.5 font-medium hidden sm:block">
                                Access your dashboard securely
                            </p>
                        </div>

                        {/* Decorative Line - Hidden on very small devices */}
                        <div className="mt-1 sm:mt-2 md:mt-3 flex items-center justify-center gap-2">
                            <div className="h-px w-6 sm:w-8 md:w-12 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>
                            <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-emerald-400 rounded-full"></div>
                            <div className="h-px w-6 sm:w-8 md:w-12 bg-gradient-to-r from-transparent via-teal-400 to-transparent"></div>
                        </div>
                    </div>

                    {/* Form Section - Centered vertically */}
                    <div className="flex flex-col items-center justify-center w-full flex-1">
                        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-sm xl:max-w-md">
                            {/* Google Sign In - Optional, you can remove if not needed */}
                            <button className="w-full px-3 sm:px-4 md:px-6 font-semibold rounded-lg sm:rounded-xl py-1.5 sm:py-2 md:py-2.5 bg-white bg-opacity-50 backdrop-blur-sm border border-white border-opacity-60 text-gray-800 flex items-center justify-center transition-all duration-300 hover:bg-opacity-70 hover:shadow-lg focus:outline-none text-[10px] sm:text-xs md:text-sm">
                                <div className="bg-white p-0.5 sm:p-1 rounded-full">
                                    <svg className="w-3 sm:w-4 h-3 sm:h-4" viewBox="0 0 533.5 544.3">

                                        <path
                                            d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
                                            fill="#4285f4"
                                        />
                                        <path
                                            d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
                                            fill="#34a853"
                                        />
                                        <path
                                            d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
                                            fill="#fbbc04"
                                        />
                                        <path
                                            d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
                                            fill="#ea4335"
                                        />
                                    </svg>
                                </div>
                                <span className="ml-1.5 sm:ml-2 text-[10px] sm:text-xs font-medium">Sign In with Google</span>
                            </button>

                            {/* Divider */}
                            <div className="w-full border-b border-gray-300 border-opacity-50 text-center my-2 sm:my-2.5">
                                <div className="leading-none px-1.5 sm:px-2 inline-block text-[9px] sm:text-xs text-gray-700 tracking-wide font-medium bg-white bg-opacity-50 backdrop-blur-sm transform -translate-y-1/2 rounded-full py-0.5">
                                    Or use email
                                </div>
                            </div>

                            {/* Login Form */}
                            <form
                                className="w-full flex flex-col space-y-2 sm:space-y-2.5"
                                onSubmit={handleLogin}
                            >
                                <input
                                    className="w-full px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-lg sm:rounded-xl font-medium bg-white bg-opacity-50 backdrop-blur-sm border border-white border-opacity-60 placeholder-gray-600 text-[10px] sm:text-xs md:text-sm focus:outline-none focus:border-emerald-400 focus:bg-opacity-70 transition-all duration-300"
                                    type="text"
                                    placeholder="Tenant Username"
                                    value={tenantUsername}
                                    onChange={(e) => setTenantUsername(e.target.value)}
                                    required
                                />
                                <div className="relative w-full">
                                    <input
                                        className="w-full px-3 sm:px-4 md:px-5 pr-8 sm:pr-10 md:pr-11 py-1.5 sm:py-2 md:py-2.5 rounded-lg sm:rounded-xl font-medium bg-white bg-opacity-50 backdrop-blur-sm border border-white border-opacity-60 placeholder-gray-600 text-[10px] sm:text-xs md:text-sm focus:outline-none focus:border-emerald-400 focus:bg-opacity-70 transition-all duration-300"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((s) => !s)}
                                        className="absolute right-2 sm:right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-emerald-600 focus:outline-none transition-colors p-0.5 sm:p-1"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-3 sm:h-4 md:h-5 w-3 sm:w-4 md:w-5"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.96 9.96 0 012.58-6.39M3 3l18 18"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                            </svg>
                                        ) : (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-3 sm:h-4 md:h-5 w-3 sm:w-4 md:w-5"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M12 15a3 3 0 100-6 3 3 0 000 6z"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="mt-1 sm:mt-1.5 md:mt-2 tracking-wide font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 text-white w-full py-1.5 sm:py-2 md:py-2.5 rounded-lg sm:rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:outline-none shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-[10px] sm:text-xs md:text-sm disabled:opacity-50"
                                >
                                    <span>{isLoading ? 'Verifying...' : 'Access Dashboard'}</span>
                                </button>
                                <div className="mt-3 text-center">
                                    <p className="text-[10px] sm:text-xs text-gray-600">
                                        Don't have an account?{' '}
                                        <button
                                            type="button"
                                            onClick={() => navigate('/register')}
                                            className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline transition-colors"
                                        >
                                            Register here
                                        </button>
                                    </p>
                                </div>
                            </form>

                            {/* Terms - Smaller text on mobile */}
                            <p className="mt-2 sm:mt-2.5 text-[8px] sm:text-[10px] md:text-xs text-gray-700 text-center px-2">
                                By signing in, you agree to our{" "}
                                <a
                                    href="#"
                                    className="text-emerald-600 hover:underline font-medium"
                                >
                                    Terms
                                </a>{" "}
                                and{" "}
                                <a
                                    href="#"
                                    className="text-emerald-600 hover:underline font-medium"
                                >
                                    Privacy Policy
                                </a>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Creative Education Illustration - Hidden on mobile/tablet */}
                <div className="hidden lg:flex lg:w-1/2 h-full bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 items-center justify-center p-4 relative overflow-hidden">
                    {/* Decorative Background Shapes */}
                    <div className="absolute top-5 left-5 w-16 md:w-20 h-16 md:h-20 bg-white opacity-20 rounded-full blur-xl"></div>
                    <div className="absolute bottom-16 right-5 w-24 md:w-32 h-24 md:h-32 bg-white opacity-20 rounded-full blur-xl"></div>
                    <div className="absolute top-1/2 right-16 w-12 md:w-16 h-12 md:h-16 bg-white opacity-20 rounded-full blur-xl"></div>

                    {/* Main Illustration - Simplified for better performance */}
                    <svg
                        className="w-full h-auto max-h-full relative z-10"
                        viewBox="0 0 400 400"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* Desk/Table */}
                        <ellipse
                            cx="200"
                            cy="320"
                            rx="140"
                            ry="20"
                            fill="#047857"
                            opacity="0.3"
                        />

                        {/* Computer Monitor */}
                        <rect
                            x="140"
                            y="180"
                            width="120"
                            height="90"
                            rx="4"
                            fill="#1F2937"
                        />
                        <rect
                            x="150"
                            y="190"
                            width="100"
                            height="70"
                            rx="2"
                            fill="#3B82F6"
                        />

                        {/* Monitor Screen Content - Dashboard */}
                        <rect x="160" y="200" width="35" height="8" rx="2" fill="#10B981" />
                        <rect
                            x="160"
                            y="215"
                            width="80"
                            height="4"
                            rx="1"
                            fill="white"
                            opacity="0.6"
                        />
                        <rect
                            x="160"
                            y="223"
                            width="70"
                            height="4"
                            rx="1"
                            fill="white"
                            opacity="0.6"
                        />
                        <rect
                            x="160"
                            y="231"
                            width="60"
                            height="4"
                            rx="1"
                            fill="white"
                            opacity="0.6"
                        />
                        <circle cx="170" cy="250" r="8" fill="#34D399" />
                        <circle cx="190" cy="250" r="8" fill="#FCD34D" />
                        <circle cx="210" cy="250" r="8" fill="#F87171" />

                        {/* Monitor Stand */}
                        <rect x="185" y="270" width="30" height="40" fill="#374151" />
                        <rect x="170" y="310" width="60" height="8" rx="4" fill="#4B5563" />

                        {/* Laptop beside */}
                        <g transform="rotate(-15 320 260)">
                            <rect
                                x="280"
                                y="240"
                                width="80"
                                height="50"
                                rx="3"
                                fill="#6B7280"
                            />
                            <rect
                                x="285"
                                y="245"
                                width="70"
                                height="40"
                                rx="2"
                                fill="#34D399"
                            />
                            <line
                                x1="295"
                                y1="255"
                                x2="335"
                                y2="255"
                                stroke="white"
                                strokeWidth="2"
                                opacity="0.5"
                            />
                            <line
                                x1="295"
                                y1="265"
                                x2="340"
                                y2="265"
                                stroke="white"
                                strokeWidth="2"
                                opacity="0.5"
                            />
                            <line
                                x1="295"
                                y1="275"
                                x2="330"
                                y2="275"
                                stroke="white"
                                strokeWidth="2"
                                opacity="0.5"
                            />
                        </g>

                        {/* Books Stack on left */}
                        <g>
                            <rect
                                x="70"
                                y="265"
                                width="50"
                                height="10"
                                rx="1"
                                fill="#EF4444"
                            />
                            <rect
                                x="75"
                                y="253"
                                width="45"
                                height="10"
                                rx="1"
                                fill="#3B82F6"
                            />
                            <rect
                                x="80"
                                y="241"
                                width="40"
                                height="10"
                                rx="1"
                                fill="#FCD34D"
                            />
                        </g>

                        {/* Coffee Mug */}
                        <ellipse cx="320" cy="305" rx="15" ry="5" fill="#6B7280" />
                        <rect
                            x="305"
                            y="285"
                            width="30"
                            height="20"
                            rx="2"
                            fill="#0EA5E9"
                        />
                        <path
                            d="M 335 290 Q 345 290 345 295 Q 345 300 335 300"
                            stroke="#0EA5E9"
                            strokeWidth="3"
                            fill="none"
                        />

                        {/* Graduation Cap Icon */}
                        <g>
                            <path d="M 80 100 L 110 85 L 140 100 L 110 115 Z" fill="#1F2937">
                                <animateTransform
                                    attributeName="transform"
                                    type="translate"
                                    values="0 0; 0 -8; 0 0"
                                    dur="3s"
                                    repeatCount="indefinite"
                                />
                            </path>
                            <path d="M 110 115 L 110 135 L 95 127 L 95 110 Z" fill="#047857">
                                <animateTransform
                                    attributeName="transform"
                                    type="translate"
                                    values="0 0; 0 -8; 0 0"
                                    dur="3s"
                                    repeatCount="indefinite"
                                />
                            </path>
                        </g>

                        {/* Light Bulb - Idea */}
                        <g>
                            <circle cx="340" cy="180" r="18" fill="#FCD34D" opacity="0.9">
                                <animate
                                    attributeName="opacity"
                                    values="0.9;0.6;0.9"
                                    dur="2s"
                                    repeatCount="indefinite"
                                />
                            </circle>
                            <rect
                                x="333"
                                y="198"
                                width="14"
                                height="8"
                                rx="2"
                                fill="#6B7280"
                            />
                        </g>

                        {/* Checkmark Badge */}
                        <g>
                            <circle cx="350" cy="320" r="16" fill="#10B981">
                                <animateTransform
                                    attributeName="transform"
                                    type="translate"
                                    values="0 0; 0 -6; 0 0"
                                    dur="2.8s"
                                    repeatCount="indefinite"
                                />
                            </circle>
                            <path
                                d="M 343 320 L 348 325 L 357 315"
                                stroke="white"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="none"
                            >
                                <animateTransform
                                    attributeName="transform"
                                    type="translate"
                                    values="0 0; 0 -6; 0 0"
                                    dur="2.8s"
                                    repeatCount="indefinite"
                                />
                            </path>
                        </g>
                    </svg>
                </div>
            </div>
        </div >
    );
};

export default Login;