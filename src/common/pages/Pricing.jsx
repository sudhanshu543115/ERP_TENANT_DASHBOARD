import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/authcontext';
import { useGetSubscriptionPlansQuery } from '../../api/services/planapi';
import {
    HiOutlineCurrencyRupee,
    HiOutlineCheckCircle,
    HiOutlineXCircle,
    HiOutlineStar,
    HiOutlineArrowRight,
    HiOutlineCube,
    HiOutlineRefresh,
    HiOutlineSparkles,
    HiOutlineHeart,
    HiOutlineFire,
    HiOutlineLogout,
    HiX
} from 'react-icons/hi';
import { FiPackage, FiZap } from 'react-icons/fi';

const Pricing = () => {
    const { tenantName } = useParams();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { data, isLoading, isError } = useGetSubscriptionPlansQuery();
    const plans = data?.plans || [];
    const [selectedPlanFeatures, setSelectedPlanFeatures] = useState(null);

    const cardStyles = [
        {
            gradient: 'from-amber-50 to-orange-50',
            border: 'border-amber-200',
            shadow: 'shadow-amber-100/50',
            badge: 'bg-gradient-to-r from-amber-400 to-orange-400',
            button: 'bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500',
            icon: 'text-amber-500',
            light: 'bg-amber-100',
            price: 'text-amber-600'
        },
        {
            gradient: 'from-emerald-50 to-teal-50',
            border: 'border-emerald-200',
            shadow: 'shadow-emerald-100/50',
            badge: 'bg-gradient-to-r from-emerald-400 to-teal-400',
            button: 'bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500',
            icon: 'text-emerald-500',
            light: 'bg-emerald-100',
            price: 'text-emerald-600'
        },
        {
            gradient: 'from-sky-50 to-blue-50',
            border: 'border-sky-200',
            shadow: 'shadow-sky-100/50',
            badge: 'bg-gradient-to-r from-sky-400 to-blue-400',
            button: 'bg-gradient-to-r from-sky-400 to-blue-400 hover:from-sky-500 hover:to-blue-500',
            icon: 'text-sky-500',
            light: 'bg-sky-100',
            price: 'text-sky-600'
        },
        {
            gradient: 'from-rose-50 to-pink-50',
            border: 'border-rose-200',
            shadow: 'shadow-rose-100/50',
            badge: 'bg-gradient-to-r from-rose-400 to-pink-400',
            button: 'bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500',
            icon: 'text-rose-500',
            light: 'bg-rose-100',
            price: 'text-rose-600'
        },
        {
            gradient: 'from-violet-50 to-purple-50',
            border: 'border-violet-200',
            shadow: 'shadow-violet-100/50',
            badge: 'bg-gradient-to-r from-violet-400 to-purple-400',
            button: 'bg-gradient-to-r from-violet-400 to-purple-400 hover:from-violet-500 hover:to-purple-500',
            icon: 'text-violet-500',
            light: 'bg-violet-100',
            price: 'text-violet-600'
        }
    ];

    const getPlanIcon = (index) => {
        const icons = [
            <HiOutlineSparkles className="w-8 h-8" />,
            <FiZap className="w-8 h-8" />,
            <HiOutlineHeart className="w-8 h-8" />,
            <HiOutlineCube className="w-8 h-8" />,
            <HiOutlineStar className="w-8 h-8" />
        ];
        return icons[index % icons.length];
    };

    const handleSelectPlan = (plan) => {
        navigate(`/${tenantName}/checkout`, { state: { plan } });
    };

    const getPlanFeatures = (plan) => {
        if (plan.features && Array.isArray(plan.features) && plan.features.length > 0 && typeof plan.features[0] === 'string') {
            return plan.features;
        }
        
        const features = [];
        if (plan.domains && Array.isArray(plan.domains)) {
            plan.domains.forEach(d => {
                if (d.domain && d.domain.features && Array.isArray(d.domain.features)) {
                    d.domain.features.forEach(f => {
                        if (f.feature_name) features.push(f.feature_name);
                    });
                }
            });
        }
        return [...new Set(features)];
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin mx-auto mb-6"></div>
                    <p className="text-slate-600 font-medium">Loading amazing plans for you...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-xl border border-red-100"
                >
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <HiOutlineXCircle className="w-10 h-10 text-red-400" />
                    </div>
                    <p className="text-slate-800 font-bold text-xl mb-2">Oops! Something went wrong</p>
                    <p className="text-slate-500 mb-6">Failed to load plans</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-white text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-all shadow-md hover:shadow-lg flex items-center gap-2 mx-auto border border-slate-200"
                    >
                        <HiOutlineRefresh className="w-5 h-5" />
                        Try again
                    </button>
                </motion.div>
            </div>
        );
    }

    if (!plans.length) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-xl border border-slate-200"
                >
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiPackage className="w-10 h-10 text-slate-400" />
                    </div>
                    <p className="text-slate-800 font-bold text-xl mb-2">No plans available</p>
                    <p className="text-slate-500">We're working on bringing you amazing plans. Check back soon!</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-20 px-4">
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto relative"
            >
                {/* Logout Button */}
                <div className="absolute top-0 right-0 z-50">
                    <button
                        onClick={() => {
                            logout();
                            navigate('/login');
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm text-red-500 rounded-full font-medium shadow-sm border border-red-100 hover:bg-red-50 transition-all"
                    >
                        <HiOutlineLogout className="w-5 h-5" />
                        Logout
                    </button>
                </div>

                {/* Header Section */}
                <div className="text-center mb-16 pt-12">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-block mb-6"
                    >
                        <span className="bg-white/70 backdrop-blur-sm text-blue-600 px-6 py-2 rounded-full text-sm font-medium shadow-sm border border-blue-100">
                            ✨ Simple & Transparent Pricing
                        </span>
                    </motion.div>

                    <h1 className="text-5xl md:text-6xl font-black text-slate-800 mb-6">
                        Choose Your Perfect{' '}
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Plan
                        </span>
                    </h1>

                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Select the ideal subscription plan for{' '}
                        <span className="font-semibold text-blue-600">{tenantName || 'your organization'}</span>.
                        Upgrade or cancel anytime.
                    </p>
                </div>

                {/* Pricing Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 justify-center">
                    {plans.map((plan, index) => {
                        const style = cardStyles[index % cardStyles.length];
                        const planFeatures = getPlanFeatures(plan);

                        return (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative group"
                            >
                                {/* Animated border gradient */}
                                <div className={`absolute -inset-0.5 bg-gradient-to-r ${style.gradient} rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-300`}></div>

                                {/* Card */}
                                <div className={`relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border ${style.border} ${style.shadow} ${plan.recommended ? 'scale-105 z-10 ring-4 ring-blue-400/20' : ''}`}>

                                    {plan.recommended && (
                                        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-20">
                                            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-bold px-6 py-2 rounded-full shadow-lg flex items-center gap-2 whitespace-nowrap">
                                                <HiOutlineStar className="w-4 h-4" />
                                                Most Popular
                                            </div>
                                        </div>
                                    )}

                                    {/* Card Header */}
                                    <div className="text-center mb-8">
                                        <div className={`w-20 h-20 ${style.light} rounded-2xl flex items-center justify-center mx-auto mb-4 text-${style.icon}`}>
                                            {getPlanIcon(index)}
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-800 mb-2">{plan.name}</h3>
                                        <div className="flex items-center justify-center gap-1">
                                            <span className="text-4xl font-black text-slate-800">₹{plan.price}</span>
                                            <span className="text-slate-400 text-sm">/{plan.duration} days</span>
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <div className="mb-8">
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">What's included:</p>
                                        <ul className="space-y-3">
                                            {planFeatures.slice(0, 5).map((feature, idx) => (
                                                <motion.li
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 + idx * 0.05 }}
                                                    className="flex items-center text-slate-600 text-sm"
                                                >
                                                    <div className={`flex-shrink-0 w-5 h-5 rounded-full ${style.light} flex items-center justify-center mr-3`}>
                                                        <HiOutlineCheckCircle className={`w-4 h-4 ${style.icon}`} />
                                                    </div>
                                                    <span className="capitalize">{feature.toLowerCase().replace(/_/g, ' ')}</span>
                                                </motion.li>
                                            ))}
                                        </ul>

                                        {(planFeatures.length > 5) && (
                                            <button 
                                                onClick={() => setSelectedPlanFeatures({ name: plan.name, features: planFeatures })}
                                                className="text-xs text-blue-500 hover:text-blue-700 mt-3 text-center w-full font-medium transition-colors"
                                            >
                                                +{planFeatures.length - 5} more features
                                            </button>
                                        )}
                                    </div>

                                    {/* CTA Button */}
                                    <button
                                        onClick={() => handleSelectPlan(plan)}
                                        className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${style.button} group/btn relative overflow-hidden`}
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            Get Started
                                            <HiOutlineArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                        </span>
                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform"></div>
                                    </button>

                                    {/* Bottom decoration */}
                                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${style.gradient} rounded-b-3xl opacity-50`}></div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Footer Note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-center mt-16"
                >
                    <p className="text-slate-400 text-sm">
                        All plans include 24/7 customer support and a 30-day money-back guarantee
                    </p>
                </motion.div>
            </motion.div>

            {/* Features Modal */}
            {selectedPlanFeatures && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedPlanFeatures(null)}>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="text-xl font-bold text-slate-800">{selectedPlanFeatures.name} Features</h3>
                            <button onClick={() => setSelectedPlanFeatures(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                                <HiX className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            <ul className="space-y-3">
                                {selectedPlanFeatures.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start text-slate-600 text-sm">
                                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                                            <HiOutlineCheckCircle className="w-4 h-4 text-green-600" />
                                        </div>
                                        <span className="capitalize">{feature.toLowerCase().replace(/_/g, ' ')}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Pricing;