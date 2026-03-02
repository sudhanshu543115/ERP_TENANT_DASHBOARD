import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/authcontext';
import {
    BellIcon,
    UserCircleIcon,
    Bars3Icon,
    MagnifyingGlassIcon,
    ArrowRightOnRectangleIcon,
    UserIcon,
    Cog6ToothIcon,
    QuestionMarkCircleIcon,
    ArrowsPointingOutIcon,
    ArrowsPointingInIcon,
    XMarkIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    InformationCircleIcon,
    SunIcon,
    MoonIcon,
    ComputerDesktopIcon,
    SparklesIcon,
    ChevronDownIcon
} from '@heroicons/react/24/outline';
import { BellIcon as BellIconSolid } from '@heroicons/react/24/solid';

const Navbar = ({ onMenuClick }) => {
    const { user, logout } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isThemeOpen, setIsThemeOpen] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme || 'system';
    });
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'New user registered', time: '5 min ago', type: 'success', read: false },
        { id: 2, title: 'System update completed', time: '1 hour ago', type: 'info', read: false },
        { id: 3, title: 'Security alert', time: '2 hours ago', type: 'warning', read: true },
        { id: 4, title: 'Backup successful', time: '5 hours ago', type: 'success', read: true },
    ]);
    const [unreadCount, setUnreadCount] = useState(2);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    const profileRef = useRef(null);
    const notificationsRef = useRef(null);
    const themeRef = useRef(null);
    const searchInputRef = useRef(null);

    // Update time every minute
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    // Theme management
    useEffect(() => {
        const root = window.document.documentElement;

        const getSystemTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

        const updateTheme = (currentTheme) => {
            const activeTheme = currentTheme === 'system' ? getSystemTheme() : currentTheme;

            // Remove previous classes to avoid conflicts
            if (activeTheme === 'dark') {
                root.classList.add('dark');
                root.classList.remove('light');
            } else {
                root.classList.add('light');
                root.classList.remove('dark');
            }

            // Update meta theme-color
            const metaThemeColor = document.querySelector('meta[name="theme-color"]');
            if (metaThemeColor) {
                metaThemeColor.setAttribute('content', activeTheme === 'dark' ? '#0f172a' : '#ffffff');
            }
        };

        updateTheme(theme);

        try {
            localStorage.setItem('theme', theme);
        } catch (e) {
            console.error("Failed to save theme preference:", e);
        }

        // Listen for system changes if theme is set to system
        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = () => updateTheme('system');

            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, [theme]);

    // Handle fullscreen toggle
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
            if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
                setIsNotificationsOpen(false);
            }
            if (themeRef.current && !themeRef.current.contains(event.target)) {
                setIsThemeOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle fullscreen change event
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // Mark notification as read
    const markAsRead = (notificationId) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === notificationId ? { ...notif, read: true } : notif
            )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    // Mark all as read
    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notif => ({ ...notif, read: true }))
        );
        setUnreadCount(0);
    };

    // Get notification icon based on type
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'success':
                return <CheckCircleIcon className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />;
            case 'warning':
                return <ExclamationCircleIcon className="w-5 h-5 text-amber-500 dark:text-amber-400" />;
            case 'info':
                return <InformationCircleIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" />;
            default:
                return <BellIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />;
        }
    };

    // Get theme icon
    const getThemeIcon = () => {
        switch (theme) {
            case 'light':
                return <SunIcon className="w-5 h-5 text-amber-500" />;
            case 'dark':
                return <MoonIcon className="w-5 h-5 text-indigo-400" />;
            default:
                return <ComputerDesktopIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />;
        }
    };

    // Format time
    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    // Format date
    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <>
            <nav className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between px-4 md:px-8 sticky top-0 z-50 shadow-lg shadow-slate-200/20 dark:shadow-slate-900/20 transition-colors duration-300">

                {/* Left section - Menu and Search */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        className="p-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl md:hidden transition-all duration-300 group"
                    >
                        <Bars3Icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    </button>

                    {/* Logo/Brand */}
                    <div className="hidden lg:flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <SparklesIcon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                            Dashboard
                        </span>
                    </div>

                    {/* Search Bar */}
                    <div className={`relative hidden sm:block group transition-all duration-300 ${isSearchFocused ? 'scale-105' : ''
                        }`}>
                        <MagnifyingGlassIcon className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isSearchFocused
                                ? 'text-blue-500 dark:text-blue-400'
                                : 'text-slate-400 dark:text-slate-500'
                            }`} />
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                            placeholder="Search..."
                            className="bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 focus:outline-none w-48 lg:w-80 transition-all duration-300 hover:bg-slate-200 dark:hover:bg-slate-800/70"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                            >
                                <XMarkIcon className="w-4 h-4" />
                            </button>
                        )}

                        {/* Search shortcut hint */}
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1">
                            <kbd className="px-1.5 py-0.5 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 rounded border border-slate-300 dark:border-slate-600">
                                ⌘
                            </kbd>
                            <kbd className="px-1.5 py-0.5 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 rounded border border-slate-300 dark:border-slate-600">
                                K
                            </kbd>
                        </div>
                    </div>
                </div>

                {/* Right section - Actions */}
                <div className="flex items-center gap-2 md:gap-4">
                    {/* Date & Time */}
                    <div className="hidden lg:flex items-center gap-3 mr-2">
                        <div className="text-right">
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                {formatTime(currentTime)}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-500">
                                {formatDate(currentTime)}
                            </p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                {currentTime.getHours() > 11 ? 'PM' : 'AM'}
                            </span>
                        </div>
                    </div>

                    {/* Theme Toggle */}
                    <div className="relative" ref={themeRef}>
                        <button
                            onClick={() => setIsThemeOpen(!isThemeOpen)}
                            className="p-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-all duration-300 relative group"
                        >
                            {getThemeIcon()}
                            <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        </button>

                        {/* Theme Dropdown */}
                        {isThemeOpen && (
                            <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl shadow-slate-200/20 dark:shadow-slate-900/50 overflow-hidden animate-slideDown">
                                <div className="p-2">
                                    <button
                                        onClick={() => {
                                            setTheme('light');
                                            setIsThemeOpen(false);
                                        }}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-all duration-200 group ${theme === 'light'
                                                ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                                            }`}
                                    >
                                        <SunIcon className={`w-5 h-5 ${theme === 'light' ? 'text-blue-500' : 'text-slate-500'
                                            }`} />
                                        <span className="flex-1 text-left">Light</span>
                                        {theme === 'light' && (
                                            <CheckCircleIcon className="w-4 h-4 text-blue-500" />
                                        )}
                                    </button>

                                    <button
                                        onClick={() => {
                                            setTheme('dark');
                                            setIsThemeOpen(false);
                                        }}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-all duration-200 group ${theme === 'dark'
                                                ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                                            }`}
                                    >
                                        <MoonIcon className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-500' : 'text-slate-500'
                                            }`} />
                                        <span className="flex-1 text-left">Dark</span>
                                        {theme === 'dark' && (
                                            <CheckCircleIcon className="w-4 h-4 text-blue-500" />
                                        )}
                                    </button>

                                    <button
                                        onClick={() => {
                                            setTheme('system');
                                            setIsThemeOpen(false);
                                        }}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-all duration-200 group ${theme === 'system'
                                                ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                                            }`}
                                    >
                                        <ComputerDesktopIcon className={`w-5 h-5 ${theme === 'system' ? 'text-blue-500' : 'text-slate-500'
                                            }`} />
                                        <span className="flex-1 text-left">System</span>
                                        {theme === 'system' && (
                                            <CheckCircleIcon className="w-4 h-4 text-blue-500" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Fullscreen Toggle */}
                    <button
                        onClick={toggleFullscreen}
                        className="p-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-all duration-300 relative group hidden md:block"
                        title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                    >
                        {isFullscreen ? (
                            <ArrowsPointingInIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        ) : (
                            <ArrowsPointingOutIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        )}
                    </button>

                    {/* Notifications */}
                    <div className="relative" ref={notificationsRef}>
                        <button
                            onClick={() => {
                                setIsNotificationsOpen(!isNotificationsOpen);
                                setIsProfileOpen(false);
                                setIsThemeOpen(false);
                            }}
                            className="p-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-all duration-300 relative group"
                        >
                            {unreadCount > 0 ? (
                                <BellIconSolid className="w-5 h-5 text-amber-500 dark:text-amber-400 group-hover:scale-110 transition-transform" />
                            ) : (
                                <BellIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            )}
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold rounded-full min-w-[1.25rem] h-5 flex items-center justify-center px-1 shadow-lg shadow-rose-500/30 animate-pulse">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {/* Notifications Dropdown */}
                        {isNotificationsOpen && (
                            <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl shadow-slate-200/20 dark:shadow-slate-900/50 overflow-hidden animate-slideDown">
                                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                                    <h3 className="text-slate-900 dark:text-white font-semibold">Notifications</h3>
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={markAllAsRead}
                                            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                                        >
                                            Mark all as read
                                        </button>
                                    )}
                                </div>

                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.length > 0 ? (
                                        notifications.map((notification) => (
                                            <div
                                                key={notification.id}
                                                onClick={() => markAsRead(notification.id)}
                                                className={`p-4 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-500/5' : ''
                                                    }`}
                                            >
                                                <div className="flex gap-3">
                                                    <div className="flex-shrink-0">
                                                        {getNotificationIcon(notification.type)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-sm ${!notification.read
                                                                ? 'text-slate-900 dark:text-white font-medium'
                                                                : 'text-slate-600 dark:text-slate-400'
                                                            }`}>
                                                            {notification.title}
                                                        </p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                                                            {notification.time}
                                                        </p>
                                                    </div>
                                                    {!notification.read && (
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center">
                                            <BellIcon className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                                            <p className="text-slate-500 dark:text-slate-400 text-sm">No notifications</p>
                                        </div>
                                    )}
                                </div>

                                <div className="p-3 border-t border-slate-200 dark:border-slate-700 text-center">
                                    <button className="text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                        View all notifications
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="h-8 w-[1px] bg-gradient-to-b from-transparent via-slate-300 dark:via-slate-700 to-transparent hidden xs:block" />

                    {/* Profile Section */}
                    <div className="relative" ref={profileRef}>
                        <button
                            onClick={() => {
                                setIsProfileOpen(!isProfileOpen);
                                setIsNotificationsOpen(false);
                                setIsThemeOpen(false);
                            }}
                            className="flex items-center gap-3 group"
                        >
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-[120px] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {user?.name || 'Admin User'}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-500 flex items-center justify-end gap-1">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                    Administrator
                                </p>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                                <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                                    </span>
                                </div>

                                {/* Online status indicator */}
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                            </div>

                            <ChevronDownIcon className={`w-4 h-4 text-slate-500 dark:text-slate-400 transition-transform duration-300 hidden md:block ${isProfileOpen ? 'rotate-180' : ''
                                }`} />
                        </button>

                        {/* Profile Dropdown */}
                        {isProfileOpen && (
                            <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl shadow-slate-200/20 dark:shadow-slate-900/50 overflow-hidden animate-slideDown">
                                {/* User info */}
                                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-500/10 dark:to-purple-500/10 border-b border-slate-200 dark:border-slate-700">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                                            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                                        </div>
                                        <div>
                                            <p className="text-slate-900 dark:text-white font-medium">{user?.name || 'Admin User'}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email || 'admin@example.com'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Menu items */}
                                <div className="p-2">
                                    <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl transition-all duration-200 group">
                                        <UserIcon className="w-5 h-5 text-slate-500 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
                                        <span className="flex-1 text-left">My Profile</span>
                                        <span className="text-xs text-slate-400">✨</span>
                                    </button>

                                    <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl transition-all duration-200 group">
                                        <Cog6ToothIcon className="w-5 h-5 text-slate-500 dark:text-slate-500 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors" />
                                        <span className="flex-1 text-left">Settings</span>
                                        <span className="text-xs text-slate-400">⚙️</span>
                                    </button>

                                    <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl transition-all duration-200 group">
                                        <QuestionMarkCircleIcon className="w-5 h-5 text-slate-500 dark:text-slate-500 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors" />
                                        <span className="flex-1 text-left">Help & Support</span>
                                        <span className="text-xs text-slate-400">?</span>
                                    </button>

                                    <div className="border-t border-slate-200 dark:border-slate-700 my-2"></div>

                                    <button
                                        onClick={logout}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-rose-600 dark:text-rose-400 hover:text-white hover:bg-gradient-to-r hover:from-rose-500 hover:to-pink-500 rounded-xl transition-all duration-200 group"
                                    >
                                        <ArrowRightOnRectangleIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                        <span className="flex-1 text-left">Logout</span>
                                        <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Add these styles to your global CSS */}
            <style>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slideDown {
                    animation: slideDown 0.2s ease-out;
                }

                /* Light mode scrollbar */
                .light ::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                
                .light ::-webkit-scrollbar-track {
                    background: #f1f5f9;
                }
                
                .light ::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 4px;
                }
                
                .light ::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }

                /* Dark mode scrollbar */
                .dark ::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                
                .dark ::-webkit-scrollbar-track {
                    background: #1e293b;
                }
                
                .dark ::-webkit-scrollbar-thumb {
                    background: #475569;
                    border-radius: 4px;
                }
                
                .dark ::-webkit-scrollbar-thumb:hover {
                    background: #64748b;
                }

                /* Smooth theme transition */
                * {
                    transition: background-color 0.3s ease, border-color 0.3s ease, color 0.2s ease;
                }
            `}</style>
        </>
    );
};

export default Navbar;