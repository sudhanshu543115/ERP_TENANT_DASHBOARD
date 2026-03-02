import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/authcontext';
import { useLogoutMutation } from '../../api/services/authapi';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircleIcon,
    CreditCardIcon,
    QrCodeIcon,
    ArrowLeftIcon,
    ShieldCheckIcon,
    LockClosedIcon,
    SparklesIcon,
    BanknotesIcon,
    DevicePhoneMobileIcon,
    ClockIcon,
    StarIcon
} from '@heroicons/react/24/outline';
import {
    HiOutlineCheckCircle,
    HiOutlineShieldCheck,
    HiOutlineSparkles,
    HiOutlineClock,
    HiOutlineArrowPath,
    HiOutlineCreditCard,
    HiOutlineDevicePhoneMobile
} from 'react-icons/hi2';
import { FiSmartphone, FiLock, FiShield, FiZap } from 'react-icons/fi';

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [logoutApi] = useLogoutMutation();
    const { tenantName } = useParams();
    const plan = location.state?.plan || {
        id: 'default',
        name: 'Subscription Plan',
        price: 0,
        features: ['24/7 Support', 'Secure Payment', 'Instant Access']
    };

    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('modal');
    const [qrData, setQrData] = useState(null);
    const [polling, setPolling] = useState(false);
    const [countdown, setCountdown] = useState(300); // 5 minutes countdown

    // Countdown timer for QR payment
    useEffect(() => {
        let timer;
        if (paymentMethod === 'qr' && qrData && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [paymentMethod, qrData, countdown]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleModalPayment = async () => {
        setLoading(true);
        const toastId = toast.loading("Creating order...");

        try {
            const orderResponse = await fetch('https://bt-erp-backend-edww.onrender.com/api/v1/subscription-payment/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ planId: plan.id })
            });
            const data = await orderResponse.json();

            if (!data.success) throw new Error(data.message || "Failed to create order");

            toast.success("Order created successfully!", { id: toastId });

            const { orderId, amount, key, planName } = data;

            const options = {
                key: key,
                amount: amount,
                currency: "INR",
                name: "BT-ERP",
                description: `Subscription for ${planName}`,
                order_id: orderId,
                handler: async function (response) {
                    setVerifying(true); // Start full-screen loader
                    const verifyToastId = toast.loading("Verifying payment...");
                    try {
                        const verifyResponse = await fetch('https://bt-erp-backend-edww.onrender.com/api/v1/subscription-payment/verify', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            credentials: 'include',
                            body: JSON.stringify({
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature,
                                planId: plan.id
                            })
                        });

                        const result = await verifyResponse.json();
                        if (result.success) {
                            toast.success("Payment verified! Redirecting...", { id: verifyToastId });
                            setTimeout(async () => {
                                try {
                                    await logoutApi().unwrap();
                                } catch (e) {
                                    console.error("Logout error", e);
                                }
                                logout();
                                window.location.href = '/login?message=Please login again to continue';
                            }, 2000);
                        } else {
                            throw new Error(result.message || "Verification failed");
                        }
                    } catch (err) {
                        setVerifying(false); // Stop loader on error
                        toast.error(err.message || "Verification failed", { id: verifyToastId });
                    }
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                        toast("Payment cancelled", { icon: 'ℹ️' });
                    }
                },
                prefill: {
                    name: "Tenant Admin",
                    email: "admin@tenant.com",
                    contact: "9999999999"
                },
                theme: {
                    color: "#8b5cf6"
                },
                method: {
                    upi: true,
                    card: true,
                    netbanking: true,
                    wallet: true,
                    paylater: true
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Payment failed", error);
            toast.error(error.message || "Payment initiation failed", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    const handleQrPayment = async () => {
        setLoading(true);
        setQrData(null);
        setCountdown(300);
        const toastId = toast.loading("Generating QR Code...");

        try {
            const response = await fetch('https://bt-erp-backend-edww.onrender.com/api/v1/subscription-payment/create-qr', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ planId: plan.id })
            });

            const data = await response.json();
            if (data.success) {
                setQrData(data);
                setPaymentMethod('qr');
                toast.success("QR Code Generated! Scan to pay.", { id: toastId });
                startPolling(data.qr_id);
            } else {
                throw new Error(data.message || "Failed to create QR code");
            }
        } catch (error) {
            console.error("QR Error:", error);
            toast.error(error.message || "Failed to generate QR Code", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    const startPolling = (qrId) => {
        setPolling(true);
        // We won't toast on every poll tick, only on success/outcome
        const interval = setInterval(async () => {
            try {
                const response = await fetch(`https://bt-erp-backend-edww.onrender.com/api/v1/subscription-payment/check-status/${qrId}?planId=${plan.id}`, {
                    credentials: 'include'
                });
                const data = await response.json();

                if (data.success) {
                    clearInterval(interval);
                    setPolling(false);
                    setVerifying(true); // START FULL SCREEN LOADER
                    toast.success("Payment Received! Redirecting...");
                    setTimeout(async () => {
                        try {
                            await logoutApi().unwrap();
                        } catch (e) {
                            console.error("Logout error", e);
                        }
                        logout();
                        window.location.href = '/login?message=Please login again to continue';
                    }, 2000);
                }
            } catch (error) {
                console.error("Polling error", error);
            }
        }, 5000);

        return () => clearInterval(interval);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 py-12 px-4 relative overflow-hidden">
            <Toaster position="top-center" reverseOrder={false} />

            {/* Full Screen Freeze Loader */}
            <AnimatePresence>
                {verifying && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-white/90 backdrop-blur-md flex flex-col items-center justify-center p-4 cursor-wait"
                    >
                        <div className="relative">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-24 h-24 border-4 border-violet-200 border-t-violet-600 rounded-full"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <ShieldCheckIcon className="w-10 h-10 text-violet-600" />
                            </div>
                        </div>
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="mt-8 text-center"
                        >
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Verifying Payment</h2>
                            <p className="text-slate-600 max-w-md mx-auto">
                                Please wait while we securely verify your transaction. Do not close this window or press back.
                            </p>
                            <div className="mt-6 flex justify-center gap-2">
                                <span className="w-2 h-2 bg-violet-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                                <span className="w-2 h-2 bg-violet-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                <span className="w-2 h-2 bg-violet-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Decorative elements */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-violet-200 to-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
            />
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, -90, 0],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
            />

            {/* Floating particles */}
            {[...Array(15)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-violet-300 rounded-full"
                    initial={{
                        x: Math.random() * window.innerWidth,
                        y: Math.random() * window.innerHeight
                    }}
                    animate={{
                        y: [null, -50, 50, -50],
                        x: [null, 50, -50, 50]
                    }}
                    transition={{
                        duration: 15 + Math.random() * 10,
                        repeat: Infinity,
                        delay: Math.random() * 5
                    }}
                    style={{ opacity: 0.1 + Math.random() * 0.2 }}
                />
            ))}

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-6xl mx-auto relative z-10"
            >
                {/* Header */}
                <motion.div variants={itemVariants} className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-block mb-4"
                    >
                        <span className="bg-white/50 backdrop-blur-sm text-violet-600 px-6 py-2 rounded-full text-sm font-medium shadow-lg border border-violet-200 inline-flex items-center gap-2">
                            <SparklesIcon className="w-4 h-4" />
                            Secure Checkout
                            <SparklesIcon className="w-4 h-4" />
                        </span>
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-2">
                        Complete Your
                        <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent ml-2">
                            Payment
                        </span>
                    </h1>
                </motion.div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Order Summary */}
                    <motion.div variants={itemVariants} className="lg:col-span-1">
                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-violet-100 overflow-hidden sticky top-24">
                            {/* Summary Header */}
                            <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-6">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <BanknotesIcon className="w-6 h-6" />
                                    Order Summary
                                </h2>
                            </div>

                            {/* Plan Details */}
                            <div className="p-6 space-y-6">
                                <div className="flex items-start gap-4 pb-6 border-b border-violet-100">
                                    <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center">
                                        <SparklesIcon className="w-8 h-8 text-violet-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-violet-600 font-medium">Selected Plan</p>
                                        <h3 className="text-xl font-bold text-slate-800">{plan.name}</h3>
                                    </div>
                                </div>

                                {/* Price Breakdown */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-600">Plan Price</span>
                                        <span className="font-semibold text-slate-800">₹{plan.price}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-600">Duration</span>
                                        <span className="font-semibold text-slate-800">30 Days</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-600">Platform Fee</span>
                                        <span className="text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">Free</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-600">GST (18%)</span>
                                        <span className="font-semibold text-slate-800">₹{Math.round(plan.price * 0.18)}</span>
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="pt-4 border-t border-violet-100">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-lg font-semibold text-slate-800">Total Amount</span>
                                        <div className="text-right">
                                            <span className="text-3xl font-black text-violet-600">
                                                ₹{plan.price + Math.round(plan.price * 0.18)}
                                            </span>
                                            <p className="text-xs text-slate-500">inclusive of all taxes</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="bg-violet-50/50 rounded-2xl p-4">
                                    <p className="text-xs font-semibold text-violet-600 uppercase tracking-wider mb-3">What's included</p>
                                    <ul className="space-y-2">
                                        {plan.features?.slice(0, 3).map((feature, idx) => (
                                            <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                                                <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Security Badge */}
                                <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                                    <LockClosedIcon className="w-3 h-3" />
                                    <span>256-bit SSL Secure</span>
                                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                    <ShieldCheckIcon className="w-3 h-3" />
                                    <span>PCI Compliant</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column - Payment Options */}
                    <motion.div variants={itemVariants} className="lg:col-span-2">
                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-violet-100 overflow-hidden">
                            {/* Payment Header */}
                            <div className="p-6 border-b border-violet-100">
                                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                    <CreditCardIcon className="w-6 h-6 text-violet-600" />
                                    Payment Method
                                </h2>
                            </div>

                            <div className="p-6">
                                {/* Payment Method Tabs */}
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setPaymentMethod('modal')}
                                        className={`relative p-4 rounded-2xl border-2 transition-all overflow-hidden ${paymentMethod === 'modal'
                                            ? 'border-violet-500 bg-violet-50'
                                            : 'border-slate-200 hover:border-violet-200 bg-white'
                                            }`}
                                    >
                                        {paymentMethod === 'modal' && (
                                            <motion.div
                                                layoutId="paymentTab"
                                                className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-purple-500/10"
                                                initial={false}
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}
                                        <div className="relative flex flex-col items-center gap-2">
                                            <CreditCardIcon className={`w-8 h-8 ${paymentMethod === 'modal' ? 'text-violet-600' : 'text-slate-400'}`} />
                                            <span className={`text-sm font-semibold ${paymentMethod === 'modal' ? 'text-violet-600' : 'text-slate-600'}`}>
                                                Cards & NetBanking
                                            </span>
                                        </div>
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setPaymentMethod('qr')}
                                        className={`relative p-4 rounded-2xl border-2 transition-all overflow-hidden ${paymentMethod === 'qr'
                                            ? 'border-violet-500 bg-violet-50'
                                            : 'border-slate-200 hover:border-violet-200 bg-white'
                                            }`}
                                    >
                                        {paymentMethod === 'qr' && (
                                            <motion.div
                                                layoutId="paymentTab"
                                                className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-purple-500/10"
                                                initial={false}
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}
                                        <div className="relative flex flex-col items-center gap-2">
                                            <QrCodeIcon className={`w-8 h-8 ${paymentMethod === 'qr' ? 'text-violet-600' : 'text-slate-400'}`} />
                                            <span className={`text-sm font-semibold ${paymentMethod === 'qr' ? 'text-violet-600' : 'text-slate-600'}`}>
                                                UPI QR Code
                                            </span>
                                        </div>
                                    </motion.button>
                                </div>

                                <AnimatePresence mode="wait">
                                    {paymentMethod === 'modal' ? (
                                        <motion.div
                                            key="modal"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className="space-y-6"
                                        >
                                            {/* Payment Methods Grid */}
                                            <div className="grid grid-cols-3 gap-3 mb-6">
                                                {['Visa', 'Mastercard', 'RuPay', 'UPI', 'Paytm', 'PhonePe'].map((method, idx) => (
                                                    <div key={idx} className="bg-slate-50 rounded-xl p-3 text-center border border-slate-200">
                                                        <span className="text-xs font-medium text-slate-600">{method}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="text-center">
                                                <p className="text-slate-600 mb-6">
                                                    You'll be redirected to our secure payment partner, Razorpay.
                                                </p>

                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={handleModalPayment}
                                                    disabled={loading}
                                                    className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-400 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-violet-500/30 transition-all flex items-center justify-center gap-2 relative overflow-hidden group"
                                                >
                                                    {loading ? (
                                                        <>
                                                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                                            <span>Processing...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span>Pay ₹{plan.price + Math.round(plan.price * 0.18)} Now</span>
                                                            <motion.span
                                                                animate={{ x: [0, 5, 0] }}
                                                                transition={{ repeat: Infinity, duration: 1.5 }}
                                                            >
                                                                →
                                                            </motion.span>
                                                        </>
                                                    )}
                                                    <motion.div
                                                        className="absolute inset-0 bg-white"
                                                        initial={{ x: "-100%" }}
                                                        whileHover={{ x: "100%" }}
                                                        transition={{ duration: 0.5 }}
                                                        style={{ opacity: 0.2 }}
                                                    />
                                                </motion.button>
                                            </div>

                                            {/* Trust Badges */}
                                            <div className="flex items-center justify-center gap-4 pt-4">
                                                <img src="https://razorpay.com/assets/razorpay-icon.svg" alt="Razorpay" className="h-6 opacity-50" />
                                                <img src="https://www.pcisecuritystandards.org/wp-content/uploads/2022/10/pci-logo.png" alt="PCI" className="h-6 opacity-50" />
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="qr"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className="space-y-6"
                                        >
                                            {!qrData ? (
                                                <>
                                                    <div className="text-center space-y-4">
                                                        <div className="bg-violet-50 rounded-2xl p-8">
                                                            <DevicePhoneMobileIcon className="w-16 h-16 text-violet-600 mx-auto mb-4" />
                                                            <h3 className="text-lg font-semibold text-slate-800 mb-2">
                                                                Scan & Pay with UPI
                                                            </h3>
                                                            <p className="text-slate-600 text-sm">
                                                                Generate a QR code and pay instantly using any UPI app like GPay, PhonePe, or Paytm.
                                                            </p>
                                                        </div>

                                                        <motion.button
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            onClick={handleQrPayment}
                                                            disabled={loading}
                                                            className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-400 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-violet-500/30 transition-all flex items-center justify-center gap-2"
                                                        >
                                                            {loading ? (
                                                                <>
                                                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                                                    Generating QR Code...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <QrCodeIcon className="w-5 h-5" />
                                                                    Generate QR Code
                                                                </>
                                                            )}
                                                        </motion.button>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="text-center space-y-6">
                                                    {/* Timer */}
                                                    <div className="flex items-center justify-center gap-2 text-sm">
                                                        <ClockIcon className="w-4 h-4 text-amber-500" />
                                                        <span className="text-slate-600">QR Code expires in</span>
                                                        <span className="font-mono font-bold text-violet-600 bg-violet-100 px-2 py-1 rounded-lg">
                                                            {formatTime(countdown)}
                                                        </span>
                                                    </div>

                                                    {/* QR Code */}
                                                    <motion.div
                                                        initial={{ scale: 0.9, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        className="relative inline-block"
                                                    >
                                                        <div className="bg-white p-4 rounded-3xl shadow-2xl border-4 border-violet-100">
                                                            <img src={qrData.image_url} alt="UPI QR Code" className="w-56 h-56" />
                                                        </div>

                                                        {/* Scanning Animation */}
                                                        <motion.div
                                                            animate={{
                                                                y: [0, 100, 0],
                                                                opacity: [0, 1, 0]
                                                            }}
                                                            transition={{
                                                                duration: 2,
                                                                repeat: Infinity,
                                                                ease: "linear"
                                                            }}
                                                            className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-violet-500 to-transparent"
                                                        />
                                                    </motion.div>

                                                    {/* Payment Status */}
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                                            <p className="text-emerald-600 font-medium">
                                                                {polling ? 'Waiting for payment...' : 'Scan the QR code to pay'}
                                                            </p>
                                                        </div>

                                                        {/* UPI Apps */}
                                                        <div className="flex justify-center gap-3">
                                                            {['gpay', 'phonepe', 'paytm'].map((app) => (
                                                                <div key={app} className="bg-slate-100 rounded-lg px-3 py-1.5">
                                                                    <span className="text-xs font-medium text-slate-600 capitalize">{app}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex gap-3 justify-center">
                                                        <button
                                                            onClick={() => {
                                                                setQrData(null);
                                                                setCountdown(300);
                                                            }}
                                                            className="text-sm text-slate-500 hover:text-violet-600 flex items-center gap-1 transition-colors"
                                                        >
                                                            <HiOutlineArrowPath className="w-4 h-4" />
                                                            Generate New Code
                                                        </button>
                                                        <span className="text-slate-300">|</span>
                                                        <button
                                                            onClick={() => setPaymentMethod('modal')}
                                                            className="text-sm text-slate-500 hover:text-violet-600 transition-colors"
                                                        >
                                                            Try Other Methods
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Message Display Removed - Replaced by Toasts */}

                                {/* Back Button */}
                                <motion.button
                                    whileHover={{ x: -5 }}
                                    onClick={() => navigate(-1)}
                                    className="mt-6 text-sm text-slate-500 hover:text-violet-600 flex items-center gap-1 transition-colors"
                                >
                                    <ArrowLeftIcon className="w-4 h-4" />
                                    Back to Plans
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Footer */}
                <motion.div variants={itemVariants} className="mt-8 text-center">
                    <div className="inline-flex items-center gap-4 bg-white/50 backdrop-blur-sm px-6 py-3 rounded-full border border-slate-200 shadow-sm">
                        <ShieldCheckIcon className="w-5 h-5 text-emerald-500" />
                        <span className="text-sm text-slate-600">100% Secure Payment</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <LockClosedIcon className="w-5 h-5 text-violet-500" />
                        <span className="text-sm text-slate-600">Encrypted Transaction</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <FiZap className="w-5 h-5 text-amber-500" />
                        <span className="text-sm text-slate-600">Instant Activation</span>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default PaymentPage;