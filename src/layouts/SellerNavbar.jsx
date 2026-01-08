import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CiUser, CiLogout } from "react-icons/ci";
import { X } from "lucide-react";
import { logo } from "../assets/index";
import { createPortal } from "react-dom";

const SellerNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const userName = localStorage.getItem('userName') || 'Seller';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRoles');
        localStorage.removeItem('userEmail');
        setShowLogoutModal(false);
        navigate('/login');
    };

    return (
        <header className="w-full fixed z-50 top-0 left-0 bg-white border-b border-gray-100 shadow-sm font-outfit">
            <nav className="w-full h-20 px-6 md:px-12 xl:px-16 flex justify-between items-center max-w-[1440px] mx-auto">
                {/* Logo */}
                <div className="logo scale-90 lg:scale-100 origin-left">
                    <Link to='/seller-home' className="flex gap-3 items-center group">
                        <div className="bg-[#205457]/10 p-2 rounded-xl group-hover:bg-[#205457]/10 transition-all duration-300">
                            <img src={logo} alt="logo" className="w-8 h-8 object-contain" />
                        </div>
                        <h1 className="capitalize text-[22px] lg:text-[28px] font-bold tracking-tight text-[#205457]">
                            homesta
                        </h1>
                        <span className="bg-[#B19470] text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full mt-1">
                            Seller
                        </span>
                    </Link>
                </div>

                {/* Center Navigation - Desktop */}
                <div className="hidden xl:flex items-center gap-8">
                    {[
                        { name: 'Dashboard', to: '/seller-home' },
                        { name: 'Product Feed', to: '/seller-products' },
                        { name: 'Add Product', to: '/addproduct' },
                        { name: 'Orders', to: '/seller-orders' },
                        { name: 'Reviews', to: '/seller-reviews' },
                        { name: 'Analytics', to: '/analytics' },

                    ].map((item) => (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`text-sm font-bold tracking-wide transition-all hover:text-[#205457] ${location.pathname === item.to ? 'text-[#205457] border-b-2 border-[#205457] pb-1' : 'text-gray-400'
                                }`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>

                {/* Right Side Icons */}
                <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-2">
                        <div className="flex flex-col items-end mr-2 hidden lg:flex">
                            <span className="text-xs font-bold text-gray-900">{userName}</span>
                            <span className="text-[10px] text-gray-400">Store Manager</span>
                        </div>
                        <Link to="/store-settings" className="p-2 rounded-full hover:bg-gray-100 text-gray-900 transition-all duration-300 group" title="Store Settings">
                            <CiUser className="text-[26px] group-hover:scale-110 transition-transform" />
                        </Link>
                        <button
                            onClick={() => setShowLogoutModal(true)}
                            className="p-2 rounded-full hover:bg-red-50 text-red-600 transition-all duration-300 group"
                            title="Log Out"
                        >
                            <CiLogout className="text-[26px] group-hover:scale-110 transition-transform" />
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="xl:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full"
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
                            <div className="fixed inset-0 z-[9999] xl:hidden">
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
                                >
                                    <div className="flex justify-between items-center mb-8">
                                        <span className="text-lg font-bold text-[#205457]">Menu</span>
                                        <button
                                            onClick={() => setShowMobileMenu(false)}
                                            className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        {[
                                            { name: 'Dashboard', to: '/seller-home' },
                                            { name: 'Product Feed', to: '/seller-products' },
                                            { name: 'Add Piece', to: '/addproduct' },
                                            { name: 'Orders', to: '/seller-orders' },
                                            { name: 'Reviews', to: '/seller-reviews' },
                                            { name: 'Analytics', to: '/analytics' },
                                            { name: 'My Store', to: '/store-settings' },
                                        ].map((item) => (
                                            <Link
                                                key={item.to}
                                                to={item.to}
                                                onClick={() => setShowMobileMenu(false)}
                                                className={`px-4 py-3 rounded-xl text-sm font-bold transition-all ${location.pathname === item.to
                                                    ? 'bg-[#205457]/10 text-[#205457]'
                                                    : 'text-gray-500 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>

                                    <div className="mt-auto pt-6 border-t border-gray-100">
                                        <div className="flex items-center gap-3 mb-4 px-2">
                                            <div className="w-10 h-10 bg-[#205457]/10 rounded-full flex items-center justify-center text-[#205457] font-bold">
                                                {userName.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-900">{userName}</span>
                                                <span className="text-xs text-gray-400">Store Manager</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
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
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Logout?</h3>
                            <p className="text-gray-600 mb-6 font-medium">Are you sure you want to log out of your seller account?</p>
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

export default SellerNavbar;
