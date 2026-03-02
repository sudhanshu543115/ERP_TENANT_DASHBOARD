import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUser, FaEnvelope, FaLock, FaPhone, FaEye, FaEyeSlash, 
  FaGoogle, FaFacebook, FaGithub, FaArrowLeft, FaCheckCircle, 
  FaRegCheckCircle, FaGraduationCap, FaSchool, FaMapMarkerAlt,
  FaChartLine, FaUsers, FaBookOpen, FaRocket, FaStar,
  FaShieldAlt, FaBolt, FaGem, FaHeart, FaSmile, FaGlobe,
  FaCalendarCheck, FaAward, FaRegSun, FaMoon, FaCloudSun
} from 'react-icons/fa';
import { 
  MdBusiness, MdLocationOn, MdEmail, MdLockOutline, MdSchool,
  MdSecurity, MdStars, MdWbSunny, MdCloudQueue, MdFingerprint
} from 'react-icons/md';
import { 
  HiOutlineSparkles, HiAcademicCap, HiLightBulb, HiChip
} from 'react-icons/hi';
import { 
  BsShieldCheck, BsLightningCharge, BsGraphUp, BsPeople,
  BsAward, BsGlobe2, BsSun, BsCloudSun, BsShieldShaded
} from 'react-icons/bs';
import { 
  RiTeamLine, RiFlashlightLine, RiGovernmentLine, RiStarLine,
  RiHeartLine, RiShieldCheckLine, RiRocketLine, RiSunLine
} from 'react-icons/ri';
import { 
  GiTeacher, GiBookshelf, GiDiploma, GiSmartphone,
  GiSpellBook, GiEarthAmerica, GiStarSwirl
} from 'react-icons/gi';
import { useRegisterTenantMutation } from '../../api/services/authapi';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [registerTenant, { isLoading }] = useRegisterTenantMutation();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    company: '',
    location: '',
    tenantType: 'School'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState('');

  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'password') {
      checkPasswordStrength(value);
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const checkPasswordStrength = (password) => {
    setPasswordStrength({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const strengthCount = Object.values(passwordStrength).filter(Boolean).length;
      if (strengthCount < 3) {
        newErrors.password = 'Password is too weak';
      }
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!agreeTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Organization name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        const payload = {
          tenantName: formData.company,
          tenantType: formData.tenantType,
          tenantUsername: formData.username,
          tenantPassword: formData.password,
          tenantEmail: formData.email,
          tenantPhone: formData.phone,
          tenantAddress: formData.location,
          tenantWebsite: '',
          logoUrl: '',
          subscription_planId: null,
          faviconUrl: '',
          themeColor: '#000000'
        };

        await registerTenant(payload).unwrap();
        alert('Registration successful! Please login.');
        navigate('/login');
      } catch (err) {
        console.error('Registration failed:', err);
        setErrors({ ...errors, submit: err?.data?.message || 'Registration failed. Please try again.' });
      }
    }
  };

  const getPasswordStrengthPercentage = () => {
    const strengthCount = Object.values(passwordStrength).filter(Boolean).length;
    return (strengthCount / 5) * 100;
  };

  const getPasswordStrengthInfo = () => {
    const percentage = getPasswordStrengthPercentage();
    if (percentage <= 20) return { 
      color: 'from-red-400 to-red-500', 
      text: 'Very Weak', 
      textColor: 'text-red-500',
      icon: <FaBolt className="text-red-500" />
    };
    if (percentage <= 40) return { 
      color: 'from-orange-400 to-orange-500', 
      text: 'Weak', 
      textColor: 'text-orange-500',
      icon: <BsLightningCharge className="text-orange-500" />
    };
    if (percentage <= 60) return { 
      color: 'from-yellow-400 to-yellow-500', 
      text: 'Fair', 
      textColor: 'text-yellow-500',
      icon: <FaRegSun className="text-yellow-500" />
    };
    if (percentage <= 80) return { 
      color: 'from-blue-400 to-blue-500', 
      text: 'Good', 
      textColor: 'text-blue-500',
      icon: <BsCloudSun className="text-blue-500" />
    };
    return { 
      color: 'from-green-400 to-emerald-500', 
      text: 'Strong', 
      textColor: 'text-green-500',
      icon: <FaShieldAlt className="text-green-500" />
    };
  };

  const strengthInfo = getPasswordStrengthInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-300 to-cyan-400 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements with React Icons */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Floating Educational Icons */}
        <div className="absolute top-40 right-40 animate-float-slow">
          <FaGraduationCap className="text-white/10 text-7xl transform rotate-12" />
        </div>
        <div className="absolute bottom-40 left-40 animate-float">
          <GiBookshelf className="text-white/10 text-7xl" />
        </div>
        
        {/* Small Floating Icons */}
        <div className="absolute top-32 left-1/4 animate-float">
          <RiTeamLine className="text-white/10 text-4xl" />
        </div>
        <div className="absolute bottom-32 right-1/3 animate-float-slow">
          <HiAcademicCap className="text-white/10 text-4xl" />
        </div>
        
        {/* Animated Particles with Icons */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float-particle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 7}s`
            }}
          >
            {i % 2 === 0 ? (
              <FaStar className="text-white/20 text-lg" />
            ) : (
              <FaGem className="text-white/20 text-lg" />
            )}
          </div>
        ))}
      </div>

      {/* Main Card - Reduced Height */}
      <div className="relative w-full max-w-4xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden animate-fadeInUp border border-white/20">
        <div className="flex flex-row">
          {/* Left Side - Equal Width (50%) with Reduced Height */}
          <div className="w-1/2 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-5 text-white relative overflow-hidden group">
            {/* Decorative Overlays */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            {/* Rotating Icons Background */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 animate-spin-slow flex items-center justify-center">
              <FaGraduationCap className="text-white/20 text-5xl" />
            </div>
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-black/5 rounded-full -ml-28 -mb-28 animate-spin-slow-reverse flex items-center justify-center">
              <GiEarthAmerica className="text-white/20 text-6xl" />
            </div>
            
            {/* Floating Icons */}
            <div className="absolute top-16 right-16 animate-float">
              <HiOutlineSparkles className="text-white/30 text-4xl" />
            </div>
            <div className="absolute bottom-16 left-16 animate-float-delay">
              <BsLightningCharge className="text-white/30 text-4xl" />
            </div>
            
            <div className="relative z-10 h-full flex flex-col">
              {/* Logo with Icons - Compact */}
              <div className="flex items-center space-x-2 mb-4 animate-slideDown">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center transform rotate-3 hover:rotate-6 transition-transform duration-300 shadow-lg">
                  <FaGraduationCap className="text-emerald-600 text-xl" />
                </div>
                <div>
                  <div className="flex items-center space-x-1">
                    <span className="text-lg font-bold tracking-tight">EduTrack</span>
                    <HiAcademicCap className="text-yellow-200 text-lg" />
                  </div>
                  <div className="flex items-center space-x-1 text-[10px] text-white/80">
                    <BsShieldShaded className="text-[10px]" />
                    <span>5000+ schools</span>
                  </div>
                </div>
              </div>

              {/* Welcome Content - Compact */}
              <div className="flex-1 flex flex-col justify-center">
                <h1 className="text-xl lg:text-2xl font-bold mb-2 animate-slideRight leading-tight">
                  Begin Your
                  <span className="block text-yellow-200 flex items-center">
                    Journey
                    <FaRocket className="ml-2 text-yellow-200 text-xl animate-bounce" />
                  </span>
                </h1>
                
                <p className="text-xs text-white/90 mb-3 animate-slideRight delay-100 leading-relaxed flex items-center">
                  <FaGlobe className="mr-1 text-sm" />
                  Join future of education!
                </p>

                {/* Stats Section - Compact */}
                <div className="grid grid-cols-2 gap-2 mb-4 animate-slideRight delay-200">
                  <div className="bg-white/10 rounded-lg p-2 backdrop-blur-sm border border-white/20 flex items-center space-x-1">
                    <FaUsers className="text-lg text-yellow-200" />
                    <div>
                      <div className="text-sm font-bold">50K+</div>
                      <div className="text-[8px] text-white/80">Users</div>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-2 backdrop-blur-sm border border-white/20 flex items-center space-x-1">
                    <FaAward className="text-lg text-yellow-200" />
                    <div>
                      <div className="text-sm font-bold">98%</div>
                      <div className="text-[8px] text-white/80">Happy</div>
                    </div>
                  </div>
                </div>

                {/* Features Grid - Compact */}
                <div className="grid grid-cols-2 gap-1 mb-4">
                  {[
                    { icon: <FaRocket className="text-xs" />, text: 'Free forever', color: 'from-yellow-400 to-orange-400' },
                    { icon: <FaUsers className="text-xs" />, text: 'Unlimited', color: 'from-blue-400 to-indigo-400' },
                    { icon: <BsGraphUp className="text-xs" />, text: 'Analytics', color: 'from-green-400 to-emerald-400' },
                    { icon: <MdSecurity className="text-xs" />, text: 'Secure', color: 'from-purple-400 to-pink-400' }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-1 animate-slideRight bg-white/5 rounded-lg p-1" style={{ animationDelay: `${index * 100 + 300}ms` }}>
                      <div className={`w-5 h-5 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center text-white shadow`}>
                        {feature.icon}
                      </div>
                      <span className="text-[9px] font-medium">{feature.text}</span>
                    </div>
                  ))}
                </div>

                {/* Testimonial Card - Compact */}
                <div className="bg-white/10 rounded-lg p-2 backdrop-blur-sm border border-white/20 animate-slideRight delay-500 hover:bg-white/20 transition-all duration-300">
                  <div className="flex items-center space-x-0.5 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-300 text-[10px]" />
                    ))}
                  </div>
                  <p className="text-[10px] italic mb-1 leading-tight">
                    "EduTrack transformed our management!"
                  </p>
                  <div className="flex items-center space-x-1">
                    <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-white font-bold shadow">
                      <FaUser className="text-white text-xs" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold flex items-center">
                        Sarah J.
                        <FaCheckCircle className="ml-1 text-green-300 text-[6px]" />
                      </p>
                      <p className="text-[8px] text-white/80 flex items-center">
                        <GiTeacher className="mr-0.5 text-[8px]" />
                        Principal
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Link - Compact */}
              <div className="mt-3 text-center animate-slideUp">
                <p className="text-white/90 text-[10px] flex items-center justify-center">
                  <FaUsers className="mr-1 text-xs" />
                  Have account?{' '}
                  <a href="/login" className="ml-1 text-white font-semibold hover:text-yellow-200 transition-colors duration-300 underline decoration-white/30 hover:decoration-white flex items-center">
                    Sign in
                    <FaArrowLeft className="ml-1 text-[8px] rotate-180" />
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Equal Width (50%) with Reduced Height */}
          <div className="w-1/2 p-5 bg-white">
            <div className="max-w-sm mx-auto">
              {/* Back Link - Compact */}
              <a href="/" className="inline-flex items-center text-gray-500 hover:text-emerald-600 mb-2 text-xs group transition-all duration-300">
                <FaArrowLeft className="mr-1 group-hover:-translate-x-1 transition-transform duration-300" size={10} />
                <span>Back</span>
              </a>

              {/* Header - Compact */}
              <div className="mb-3 animate-slideRight">
                <div className="flex items-center space-x-1 mb-0.5">
                  <h2 className="text-xl font-bold text-gray-800">Register</h2>
                  <MdStars className="text-emerald-500 text-xl" />
                </div>
                <p className="text-gray-500 text-[10px] flex items-center">
                  <HiOutlineSparkles className="mr-0.5 text-emerald-500 text-xs" />
                  Join educators worldwide
                </p>
              </div>

              {/* Social Buttons - Compact */}
              <div className="grid grid-cols-3 gap-1 mb-3 animate-slideRight delay-100">
                <button className="flex items-center justify-center space-x-1 py-1.5 border border-gray-200 rounded-lg hover:border-emerald-200 hover:bg-emerald-50 transition-all duration-300 group">
                  <FaGoogle className="text-red-500 group-hover:scale-110 transition-transform duration-300" size={12} />
                  <span className="text-[10px] font-medium text-gray-700">Google</span>
                </button>
                <button className="flex items-center justify-center space-x-1 py-1.5 border border-gray-200 rounded-lg hover:border-emerald-200 hover:bg-emerald-50 transition-all duration-300 group">
                  <FaFacebook className="text-blue-600 group-hover:scale-110 transition-transform duration-300" size={12} />
                  <span className="text-[10px] font-medium text-gray-700">FB</span>
                </button>
                <button className="flex items-center justify-center space-x-1 py-1.5 border border-gray-200 rounded-lg hover:border-emerald-200 hover:bg-emerald-50 transition-all duration-300 group">
                  <FaGithub className="text-gray-800 group-hover:scale-110 transition-transform duration-300" size={12} />
                  <span className="text-[10px] font-medium text-gray-700">Git</span>
                </button>
              </div>

              {/* Divider - Compact */}
              <div className="relative mb-3 animate-fadeIn">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-2 bg-white text-gray-400 text-[8px] flex items-center">
                    <MdEmail className="mr-0.5 text-emerald-400 text-[10px]" />
                    or email
                  </span>
                </div>
              </div>

              {/* Form - Compact with reduced spacing */}
              <form onSubmit={handleSubmit} className="space-y-2">
                {/* Username */}
                <div className="group animate-slideRight delay-200">
                  <label className="block text-[10px] font-medium text-gray-700 mb-0.5 ml-1 flex items-center">
                    <FaUser className="mr-1 text-emerald-500" size={10} />
                    Username
                  </label>
                  <div className="relative">
                    <div className={`absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none transition-all duration-300 ${
                      focusedField === 'username' ? 'text-emerald-500 scale-110' : 'text-gray-400'
                    }`}>
                      <FaUser size={10} />
                    </div>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('username')}
                      onBlur={() => setFocusedField('')}
                      className={`w-full pl-7 pr-3 py-1.5 text-xs border ${
                        errors.username 
                          ? 'border-red-300 bg-red-50' 
                          : focusedField === 'username'
                          ? 'border-emerald-300 bg-emerald-50/30'
                          : 'border-gray-200 hover:border-gray-300'
                      } rounded-lg focus:ring-1 focus:ring-emerald-200 focus:border-emerald-400 outline-none transition-all duration-300`}
                      placeholder="username"
                    />
                  </div>
                  {errors.username && (
                    <p className="text-red-500 text-[8px] mt-0.5 ml-1 animate-shake flex items-center">
                      <FaBolt className="mr-0.5 text-[8px]" />
                      {errors.username}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="group animate-slideRight delay-300">
                  <label className="block text-[10px] font-medium text-gray-700 mb-0.5 ml-1 flex items-center">
                    <FaEnvelope className="mr-1 text-emerald-500" size={10} />
                    Email
                  </label>
                  <div className="relative">
                    <div className={`absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none transition-all duration-300 ${
                      focusedField === 'email' ? 'text-emerald-500 scale-110' : 'text-gray-400'
                    }`}>
                      <FaEnvelope size={10} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField('')}
                      className={`w-full pl-7 pr-3 py-1.5 text-xs border ${
                        errors.email 
                          ? 'border-red-300 bg-red-50' 
                          : focusedField === 'email'
                          ? 'border-emerald-300 bg-emerald-50/30'
                          : 'border-gray-200 hover:border-gray-300'
                      } rounded-lg focus:ring-1 focus:ring-emerald-200 focus:border-emerald-400 outline-none transition-all duration-300`}
                      placeholder="you@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-[8px] mt-0.5 ml-1 animate-shake flex items-center">
                      <FaBolt className="mr-0.5 text-[8px]" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password Fields - Side by Side */}
                <div className="grid grid-cols-2 gap-1 animate-slideRight delay-400">
                  <div>
                    <label className="block text-[10px] font-medium text-gray-700 mb-0.5 ml-1 flex items-center">
                      <FaLock className="mr-1 text-emerald-500" size={10} />
                      Pass
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField('')}
                        className={`w-full pl-2 pr-6 py-1.5 text-xs border ${
                          errors.password 
                            ? 'border-red-300 bg-red-50' 
                            : focusedField === 'password'
                            ? 'border-emerald-300 bg-emerald-50/30'
                            : 'border-gray-200 hover:border-gray-300'
                        } rounded-lg focus:ring-1 focus:ring-emerald-200 focus:border-emerald-400 outline-none transition-all duration-300`}
                        placeholder="••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-1.5 flex items-center text-gray-400 hover:text-emerald-500 transition-colors duration-300"
                      >
                        {showPassword ? <FaEyeSlash size={10} /> : <FaEye size={10} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-gray-700 mb-0.5 ml-1 flex items-center">
                      <FaLock className="mr-1 text-emerald-500" size={10} />
                      Confirm
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('confirmPassword')}
                        onBlur={() => setFocusedField('')}
                        className={`w-full pl-2 pr-6 py-1.5 text-xs border ${
                          errors.confirmPassword 
                            ? 'border-red-300 bg-red-50' 
                            : focusedField === 'confirmPassword'
                            ? 'border-emerald-300 bg-emerald-50/30'
                            : 'border-gray-200 hover:border-gray-300'
                        } rounded-lg focus:ring-1 focus:ring-emerald-200 focus:border-emerald-400 outline-none transition-all duration-300`}
                        placeholder="••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-1.5 flex items-center text-gray-400 hover:text-emerald-500 transition-colors duration-300"
                      >
                        {showConfirmPassword ? <FaEyeSlash size={10} /> : <FaEye size={10} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Password Strength - Compact */}
                {formData.password && (
                  <div className="mt-0.5 animate-slideDown">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[8px] font-medium text-gray-600 flex items-center">
                        <span className="mr-0.5">{strengthInfo.icon}</span>
                        Strength:
                      </span>
                      <span className={`text-[8px] font-bold px-1 py-0.5 rounded-full flex items-center space-x-0.5 ${strengthInfo.textColor} bg-opacity-10`}>
                        {strengthInfo.icon}
                        <span>{strengthInfo.text}</span>
                      </span>
                    </div>
                    <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${strengthInfo.color} transition-all duration-500 rounded-full`}
                        style={{ width: `${getPasswordStrengthPercentage()}%` }}
                      ></div>
                    </div>
                    
                    {/* Password Requirements - Compact */}
                    <div className="grid grid-cols-5 gap-0.5 mt-1">
                      {[
                        { key: 'length', text: '8+', icon: <HiChip className="text-[6px]" /> },
                        { key: 'uppercase', text: 'A-Z', icon: <FaArrowLeft className="text-[6px] rotate-90" /> },
                        { key: 'lowercase', text: 'a-z', icon: <FaArrowLeft className="text-[6px] -rotate-90" /> },
                        { key: 'number', text: '0-9', icon: <GiSmartphone className="text-[6px]" /> },
                        { key: 'special', text: '!@#', icon: <HiLightBulb className="text-[6px]" /> }
                      ].map((req) => (
                        <div 
                          key={req.key} 
                          className={`flex flex-col items-center p-0.5 rounded ${
                            passwordStrength[req.key] 
                              ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200' 
                              : 'bg-gray-50 border border-gray-100 opacity-50'
                          }`}
                        >
                          <div className="text-[6px]">{req.icon}</div>
                          <div className="flex items-center space-x-0.5">
                            {passwordStrength[req.key] ? (
                              <FaCheckCircle className="text-emerald-500 text-[4px]" />
                            ) : (
                              <FaRegCheckCircle className="text-gray-300 text-[4px]" />
                            )}
                            <span className={`text-[5px] font-medium ${
                              passwordStrength[req.key] ? 'text-emerald-600' : 'text-gray-400'
                            }`}>
                              {req.text}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {(errors.password || errors.confirmPassword) && (
                  <div className="space-y-0.5">
                    {errors.password && (
                      <p className="text-red-500 text-[8px] ml-1 animate-shake flex items-center">
                        <FaBolt className="mr-0.5 text-[8px]" />
                        {errors.password}
                      </p>
                    )}
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-[8px] ml-1 animate-shake flex items-center">
                        <FaBolt className="mr-0.5 text-[8px]" />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                )}

                {/* Phone & School - Side by Side */}
                <div className="grid grid-cols-2 gap-1 animate-slideRight delay-500">
                  <div>
                    <label className="block text-[10px] font-medium text-gray-700 mb-0.5 ml-1 flex items-center">
                      <FaPhone className="mr-1 text-emerald-500" size={8} />
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full pl-2 pr-2 py-1.5 text-xs border ${
                        errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                      } rounded-lg focus:ring-1 focus:ring-emerald-200 focus:border-emerald-400 outline-none transition-all duration-300`}
                      placeholder="Phone"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-[8px] mt-0.5 ml-1 animate-shake flex items-center">
                        <FaBolt className="mr-0.5 text-[8px]" />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-gray-700 mb-0.5 ml-1 flex items-center">
                      <FaSchool className="mr-1 text-emerald-500" size={8} />
                      School
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className={`w-full pl-2 pr-2 py-1.5 text-xs border ${errors.company ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'} rounded-lg focus:ring-1 focus:ring-emerald-200 focus:border-emerald-400 outline-none transition-all duration-300`}
                      placeholder="Organization Name"
                    />
                  </div>
                </div>

                {/* Location & Tenant Type */}
                <div className="grid grid-cols-2 gap-1 animate-slideRight delay-600">
                  <div>
                    <label className="block text-[10px] font-medium text-gray-700 mb-0.5 ml-1 flex items-center">
                      <FaMapMarkerAlt className="mr-1 text-emerald-500" size={8} />
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full pl-2 pr-2 py-1.5 text-xs border border-gray-200 hover:border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-200 focus:border-emerald-400 outline-none transition-all duration-300"
                      placeholder="City, Country"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-gray-700 mb-0.5 ml-1 flex items-center">
                      <MdBusiness className="mr-1 text-emerald-500" size={8} />
                      Type
                    </label>
                    <select
                      name="tenantType"
                      value={formData.tenantType}
                      onChange={handleChange}
                      className="w-full pl-2 pr-2 py-1.5 text-xs border border-gray-200 hover:border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-200 focus:border-emerald-400 outline-none transition-all duration-300 bg-white"
                    >
                      <option value="School">School</option>
                      <option value="Hospital">Hospital</option>
                      <option value="University">University</option>
                      <option value="Organization">Organization</option>
                    </select>
                  </div>
                </div>

                {/* Terms - Compact */}
                <div className="flex items-start space-x-1 animate-slideRight delay-700">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-3 h-3 mt-0.5 text-emerald-500 border border-gray-300 rounded focus:ring-emerald-200 transition-all duration-300"
                  />
                  <div className="text-[8px]">
                    <label className="text-gray-600 flex items-center flex-wrap">
                      <MdFingerprint className="mr-0.5 text-emerald-500 text-[8px]" />
                      I agree to{' '}
                      <a href="/terms" className="mx-0.5 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors duration-300 hover:underline">
                        Terms
                      </a>
                      &
                      <a href="/privacy" className="ml-0.5 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors duration-300 hover:underline">
                        Privacy
                      </a>
                    </label>
                    {errors.terms && (
                      <p className="text-red-500 text-[8px] mt-0.5 animate-shake flex items-center">
                        <FaBolt className="mr-0.5 text-[8px]" />
                        {errors.terms}
                      </p>
                    )}
                  </div>
                </div>

                {errors.submit && (
                  <div className="text-red-500 text-[10px] text-center bg-red-50 p-1 rounded border border-red-100 animate-shake">
                    {errors.submit}
                  </div>
                )}

                {/* Submit Button - Compact */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-medium text-xs hover:from-emerald-600 hover:to-teal-600 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 transform hover:scale-[1.01] disabled:opacity-70 mt-2 animate-slideRight delay-800 relative overflow-hidden group"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center space-x-1">
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs">Creating...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center space-x-1">
                      <FaRocket className="group-hover:rotate-12 transition-transform duration-300" size={10} />
                      <span className="text-xs">Create Account</span>
                    </span>
                  )}
                </button>

                {/* Trust Badge - Compact */}
                <div className="flex items-center justify-center space-x-2 mt-1 text-gray-400 text-[8px] animate-fadeIn">
                  <div className="flex items-center space-x-0.5">
                    <BsShieldShaded className="text-emerald-500 text-[8px]" />
                    <span>Encrypted</span>
                  </div>
                  <div className="flex items-center space-x-0.5">
                    <MdFingerprint className="text-emerald-500 text-[8px]" />
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center space-x-0.5">
                    <FaHeart className="text-emerald-500 text-[8px]" />
                    <span>Trusted</span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations - Same as before */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-5deg); }
        }
        
        @keyframes float-particle {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
          25% { opacity: 0.3; transform: translateY(-25vh) translateX(10px) rotate(90deg); }
          50% { opacity: 0.5; transform: translateY(-50vh) translateX(0) rotate(180deg); }
          75% { opacity: 0.3; transform: translateY(-75vh) translateX(-10px) rotate(270deg); }
          100% { transform: translateY(-100vh) translateX(20px) rotate(360deg); opacity: 0; }
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideRight {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-slow-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        
        .animate-float-particle {
          animation: float-particle linear infinite;
        }
        
        .animate-float-delay {
          animation: float 7s ease-in-out infinite;
          animation-delay: 2s;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out;
        }
        
        .animate-slideRight {
          animation: slideRight 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-slideDown {
          animation: slideDown 0.6s ease-out forwards;
        }
        
        .animate-slideUp {
          animation: slideUp 0.6s ease-out forwards;
        }
        
        .animate-fadeIn {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 25s linear infinite;
        }
        
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-400 { animation-delay: 400ms; }
        .delay-500 { animation-delay: 500ms; }
        .delay-600 { animation-delay: 600ms; }
        .delay-700 { animation-delay: 700ms; }
        .delay-800 { animation-delay: 800ms; }
        .delay-1000 { animation-delay: 1000ms; }
      `}</style>
    </div>
  );
};

export default RegisterPage;