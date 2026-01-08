import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Store, Phone, Mail, MapPin, Clock, MessageCircle, Send, Check } from 'lucide-react';
import api from '../lib/axios';
import PageLoader from '../components/PageLoader';

const CreateStore = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(null);
    const userEmail = localStorage.getItem('userEmail') || '';

    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        mode: 'onBlur',
        defaultValues: {
            email: userEmail,
            hasWhatsapp: true,
            hasSms: true
        }
    });

    const watchedWhatsapp = watch('hasWhatsapp');
    const watchedSms = watch('hasSms');

    useEffect(() => {
        // Redirect if not logged in or not a seller
        const token = localStorage.getItem('token');
        const roles = JSON.parse(localStorage.getItem('userRoles') || '[]');
        const rolesArray = Array.isArray(roles) ? roles : [roles];

        const isSeller = rolesArray.some(role => {
            if (typeof role === 'string') {
                return role.toLowerCase() === 'seller';
            }
            if (typeof role === 'object' && role !== null) {
                return (
                    role.roleName?.toLowerCase() === 'seller' ||
                    role.name?.toLowerCase() === 'seller' ||
                    role.id === '3' ||
                    role.id === 3
                );
            }
            return false;
        });

        if (!token || !isSeller) {
            console.log("Access Denied to CreateStore:", { hasToken: !!token, isSeller, roles: rolesArray });
            navigate('/login');
            return;
        }

        // Check if store already exists to prevent duplicate creation
        const checkExistingStore = async () => {
            try {
                const response = await api.get('Store');
                const stores = Array.isArray(response.data) ? response.data : [response.data];
                const myStore = stores.find(s => s.email?.toLowerCase() === userEmail?.toLowerCase());

                if (myStore) {
                    console.log("Store already exists, redirecting to dashboard...");
                    const sid = myStore.storeId || myStore.id;
                    localStorage.setItem('storeId', sid.toString());
                    navigate('/seller-home', { replace: true });
                }
            } catch (error) {
                console.error("Failed to check existing store:", error);
            }
        };

        checkExistingStore();
    }, [navigate]);

    const onSubmit = async (data) => {
        setLoading(true);
        setApiError(null);

        try {
            console.log('Sending Store Payload:', data);
            const response = await api.post('Store', data);
            console.log('Store Created Successfully:', response.data);

            // Save storeId to localStorage for use in AddProduct
            const storeId = response.data.storeId || response.data.id;
            if (storeId) {
                localStorage.setItem('storeId', storeId.toString());
            }

            navigate('/seller-home');
        } catch (error) {
            console.error('Store Creation Failed:', error);
            setApiError(error.response?.data?.message || 'Failed to create store. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <PageLoader />;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 lg:p-8 py-12 lg:py-20 font-outfit">
            <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
                {/* Left Side - Visual Sidebar */}
                <div className="md:w-1/3 bg-[#205457] p-8 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-6">
                            <Store className="w-6 h-6" />
                        </div>
                        <h1 className="text-3xl font-bold mb-4">Set Up Your Store</h1>
                        <p className="text-white/80 text-sm leading-relaxed">
                            Welcome to Homesta! Fill in your store details to start showcasing your products to thousands of customers.
                        </p>
                    </div>

                    <div className="mt-12 space-y-4 relative z-10">
                        <div className="flex items-center gap-3 text-sm text-white/70">
                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">1</div>
                            <span>Basic Information</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-white/50">
                            <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold">2</div>
                            <span>Store Verification</span>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                    <div className="absolute top-20 -right-20 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
                </div>

                {/* Right Side - Form */}
                <div className="flex-1 p-8 lg:p-12">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Store Profile</h2>
                        <p className="text-gray-500 text-sm">Tell us about your brand</p>
                    </div>

                    {apiError && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl text-red-700 text-sm flex items-center gap-3">
                            <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 font-bold">!</div>
                            {apiError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Store Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Store className="w-4 h-4 text-[#205457]" />
                                    Store Name
                                </label>
                                <input
                                    type="text"
                                    {...register('name', { required: 'Store name is required' })}
                                    className={`w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#205457]/10 focus:border-[#205457] transition-all ${errors.name ? 'border-red-500' : ''}`}
                                    placeholder="e.g. Modern Decor Homesta"
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                            </div>

                            {/* Phone Number */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-[#205457]" />
                                    Business Phone
                                </label>
                                <input
                                    type="tel"
                                    {...register('phone', {
                                        required: 'Phone number is required',
                                        pattern: {
                                            value: /^[0-9+\s-]{8,15}$/,
                                            message: 'Please enter a valid phone number (8-15 digits)'
                                        }
                                    })}
                                    onInput={(e) => {
                                        // Allow only numbers, +, -, and spaces
                                        e.target.value = e.target.value.replace(/[^0-9+\s-]/g, '');
                                    }}
                                    className={`w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#205457]/10 focus:border-[#205457] transition-all ${errors.phone ? 'border-red-500' : ''}`}
                                    placeholder="+123 456 7890"
                                />
                                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                            </div>

                            {/* Email - Auto-filled and Read-only */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-[#205457]" />
                                    Business Email
                                </label>
                                <input
                                    type="email"
                                    {...register('email')}
                                    readOnly
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed outline-none"
                                />
                            </div>

                            {/* Working Hours */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-[#205457]" />
                                    Working Hours
                                </label>
                                <input
                                    type="text"
                                    {...register('workingHours', { required: 'Working hours are required' })}
                                    className={`w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#205457]/10 focus:border-[#205457] transition-all ${errors.workingHours ? 'border-red-500' : ''}`}
                                    placeholder="e.g. Mon-Fri: 9AM - 6PM"
                                />
                                {errors.workingHours && <p className="text-red-500 text-xs mt-1">{errors.workingHours.message}</p>}
                            </div>
                        </div>

                        {/* Address */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-[#205457]" />
                                Store Address
                            </label>
                            <textarea
                                {...register('address', { required: 'Address is required' })}
                                rows={2}
                                className={`w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#205457]/10 focus:border-[#205457] transition-all resize-none ${errors.address ? 'border-red-500' : ''}`}
                                placeholder="State, City, Building Number"
                            />
                            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                        </div>

                        {/* Communication Preferences */}
                        <div className="space-y-4 pt-2">
                            <p className="text-sm font-bold text-gray-800 uppercase tracking-wider text-[10px]">Communication Channels</p>
                            <div className="flex flex-wrap gap-6">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        {...register('hasWhatsapp')}
                                        className="hidden"
                                    />
                                    <div className="w-6 h-6 rounded-md border-2 border-gray-200 flex items-center justify-center transition-all group-hover:border-[#205457] group-active:scale-95">
                                        <div className={`w-full h-full flex items-center justify-center rounded-sm bg-[#205457] transform transition-transform ${watchedWhatsapp ? 'scale-100' : 'scale-0'}`}>
                                            <Check className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MessageCircle className="w-4 h-4 text-green-600" />
                                        <span className="text-sm text-gray-600 font-medium">WhatsApp Enabled</span>
                                    </div>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        {...register('hasSms')}
                                        className="hidden"
                                    />
                                    <div className="w-6 h-6 rounded-md border-2 border-gray-200 flex items-center justify-center transition-all group-hover:border-[#205457] group-active:scale-95">
                                        <div className={`w-full h-full flex items-center justify-center rounded-sm bg-[#205457] transform transition-transform ${watchedSms ? 'scale-100' : 'scale-0'}`}>
                                            <Check className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Send className="w-4 h-4 text-blue-600" />
                                        <span className="text-sm text-gray-600 font-medium">SMS Notifications</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#205457] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#1a4345] hover:shadow-lg transition-all active:scale-[0.98] mt-4"
                        >
                            Create Store
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateStore;
