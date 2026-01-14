import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CiLogout } from "react-icons/ci";
import { X, ShieldCheck, LayoutDashboard, Store, Package, Layers, BarChart3, Bell, ShoppingBag } from "lucide-react";
import { logo } from "../assets/index";
import { createPortal } from "react-dom";

const AdminNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const userName = localStorage.getItem('userName') || 'Admin';

    const handleLogout = () => {
        localStorage.clear(); // Clear all auth data
        setShowLogoutModal(false);
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Stores', to: '/admin/stores', icon: Store },
        { name: 'Orders', to: '/admin/orders', icon: ShoppingBag },
        { name: 'Products', to: '/admin/products', icon: Package },
        { name: 'Categories', to: '/admin/categories', icon: Layers },

    ];

    return (
        <header className="w-full fixed z-50 top-0 left-0 bg-white border-b border-gray-100 shadow-sm font-outfit">
            <nav className="w-full h-20 px-6 md:px-12 xl:px-16 flex justify-between items-center max-w-[1440px] mx-auto">
                {/* Logo */}
                <div className="logo scale-90 lg:scale-100 origin-left">
                    <Link to='/admin/dashboard' className="flex gap-3 items-center group">
                        <div className="hidden md:block bg-[#205457]/10 p-2 rounded-xl group-hover:bg-[#205457]/10 transition-all duration-300">
                            <img src={logo} alt="logo" className="w-8 h-8 object-contain" />
                        </div>
                        <h1 className="capitalize text-[22px] lg:text-[28px] font-bold tracking-tight text-[#205457]">
                            homesta
                        </h1>
                        <span className="bg-red-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full mt-1">
                            Admin
                        </span>
                    </Link>
                </div>

                {/* Center Navigation - Desktop */}
                <div className="hidden xl:flex items-center gap-8">
                    {navItems.map((item) => (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`flex items-center gap-2 text-sm font-bold tracking-wide transition-all hover:text-[#205457] ${location.pathname === item.to ? 'text-[#205457] border-b-2 border-[#205457] pb-1' : 'text-gray-400'
                                }`}
                        >
                            <item.icon size={18} />
                            {item.name}
                        </Link>
                    ))}
                </div>

                {/* Right Side Icons */}
                <div className="flex gap-4 items-center">
                    <Link to="/admin/notifications" className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-[#205457] transition-all relative">
                        <Bell size={24} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </Link>

                    <div className="h-8 w-[1px] bg-gray-200 hidden lg:block"></div>

                    {/* Desktop Icons Group - Hidden on Mobile */}
                    <div className="items-center gap-3 hidden xl:flex">
                        <div className="flex flex-col items-end mr-2">
                            <span className="text-xs font-bold text-gray-900">{userName}</span>
                            <span className="text-[10px] text-gray-400">Super Admin</span>
                        </div>

                        <div className="w-10 h-10 bg-gradient-to-br from-[#205457] to-[#1a4345] rounded-full flex items-center justify-center text-white shadow-lg">
                            <ShieldCheck size={20} />
                        </div>

                        <button
                            onClick={() => setShowLogoutModal(true)}
                            className="p-2 rounded-full hover:bg-red-50 text-red-500 transition-all duration-300 group ml-2"
                            title="Log Out"
                        >
                            <CiLogout className="text-[26px] group-hover:scale-110 transition-transform" />
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="xl:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full ml-2"
                        onClick={() => setShowMobileMenu(true)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu Drawer */}
                {createPortal(
                    <AnimatePresence>
                        {showMobileMenu && (
                            <motion.div
                                key="mobile-menu-container"
                                className="fixed inset-0 z-[9999] xl:hidden"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                {/* Backdrop */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                                    onClick={() => setShowMobileMenu(false)}
                                />

                                {/* Drawer */}
                                <motion.div
                                    initial={{ x: "100%" }}
                                    animate={{ x: 0 }}
                                    exit={{ x: "100%" }}
                                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                    className="absolute right-0 top-0 bottom-0 w-3/4 max-w-xs bg-white shadow-2xl p-6 flex flex-col"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="flex justify-between items-center mb-8">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-[#205457]/10 p-2 rounded-xl">
                                                <img src={logo} alt="logo" className="w-6 h-6 object-contain" />
                                            </div>
                                            <span className="text-lg font-bold text-[#205457]">Admin Menu</span>
                                        </div>
                                        <button
                                            onClick={() => setShowMobileMenu(false)}
                                            className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        {navItems.map((item) => (
                                            <Link
                                                key={item.to}
                                                to={item.to}
                                                onClick={() => setShowMobileMenu(false)}
                                                className={`px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3 ${location.pathname === item.to
                                                    ? 'bg-[#205457]/10 text-[#205457]'
                                                    : 'text-gray-500 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <item.icon size={18} />
                                                {item.name}
                                            </Link>
                                        ))}
                                        <Link
                                            to="/admin/notifications"
                                            onClick={() => setShowMobileMenu(false)}
                                            className="px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3 text-gray-500 hover:bg-gray-50"
                                        >
                                            <Bell size={18} />
                                            Notifications
                                        </Link>
                                    </div>

                                    <div className="mt-auto pt-6 border-t border-gray-100">
                                        <div className="flex items-center justify-between gap-3 mb-4 px-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-[#205457] to-[#1a4345] rounded-full flex items-center justify-center text-white shadow-lg">
                                                    <ShieldCheck size={20} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-900">{userName}</span>
                                                    <span className="text-xs text-gray-400">Super Admin</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setShowMobileMenu(false);
                                                    setShowLogoutModal(true);
                                                }}
                                                className="p-2 text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                            >
                                                <CiLogout size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>,
                    document.body
                )}

                {/* Logout Confirmation Modal */}
                {showLogoutModal && createPortal(
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center relative animate-fade-in-up">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                                <CiLogout className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Logout Admin?</h3>
                            <p className="text-gray-600 mb-6 font-medium">Are you sure you want to exit the admin dashboard?</p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowLogoutModal(false)}
                                    className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors shadow-md"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
            </nav>
        </header>
    );
};

export default AdminNavbar;
