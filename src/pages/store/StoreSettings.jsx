import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Store,
    Phone,
    Mail,
    MapPin,
    Clock,
    MessageCircle,
    Send,
    Check,
    ArrowLeft,
    Save,
    Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/axios';

const StoreSettings = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);

    const [formData, setFormData] = useState({
        storeId: 0,
        name: '',
        phone: '',
        email: '',
        address: '',
        workingHours: '',
        hasWhatsapp: true,
        hasSms: true
    });

    const storeId = localStorage.getItem('storeId');

    useEffect(() => {
        const fetchStoreData = async () => {
            try {
                setLoading(true);
                const userEmail = localStorage.getItem('userEmail');

                // Fetch all stores to find the one belonging to this email
                const response = await api.get('/Store');
                const stores = Array.isArray(response.data) ? response.data : [response.data];

                const myStore = stores.find(s => s.email?.toLowerCase() === userEmail?.toLowerCase());

                if (myStore) {
                    const sid = myStore.storeId || myStore.id;
                    localStorage.setItem('storeId', sid.toString());
                    setFormData({
                        storeId: sid,
                        name: myStore.name || '',
                        phone: myStore.phone || '',
                        email: myStore.email || '',
                        address: myStore.address || '',
                        workingHours: myStore.workingHours || '',
                        hasWhatsapp: myStore.hasWhatsapp ?? true,
                        hasSms: myStore.hasSms ?? true
                    });
                } else {
                    // If no store found for this email, they need to create one
                    navigate('/create-store');
                }
            } catch (err) {
                console.error("Failed to fetch store data:", err);
                setApiError("Failed to load store settings.");
            } finally {
                setLoading(false);
            }
        };

        fetchStoreData();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError(null);
        setFieldErrors({});

        // Validation
        const newErrors = {};
        if (!formData.name.trim() || formData.name.length < 3) {
            newErrors.name = "Store name must be at least 3 characters.";
        }
        if (!formData.phone.trim() || !/^\d{10,15}$/.test(formData.phone.replace(/\D/g, ''))) {
            newErrors.phone = "Enter a valid phone number (10-15 digits).";
        }
        if (!formData.address.trim() || formData.address.length < 10) {
            newErrors.address = "Address must be detailed (at least 10 chars).";
        }
        if (!formData.workingHours.trim()) {
            newErrors.workingHours = "Please specify working hours.";
        }

        if (Object.keys(newErrors).length > 0) {
            setFieldErrors(newErrors);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setIsSaving(true);

        try {
            // PUT /api/Store/{id}
            await api.put(`/Store/${formData.storeId}`, formData);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (err) {
            console.error("Update failed:", err);
            setApiError(err.response?.data?.message || "Failed to update store settings.");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB]">
                <div className="w-12 h-12 border-4 border-[#205457]/10 border-t-[#205457] rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFCFB] pt-[110px] px-6 lg:px-16 pb-24 font-outfit">
            <motion.div
                className="max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Header */}
                <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <button
                            onClick={() => navigate('/seller-home')}
                            className="flex items-center gap-2 text-gray-400 hover:text-[#205457] transition-colors mb-4 group text-sm font-medium"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Dashboard
                        </button>
                        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
                            Store <span className="text-[#205457]">Settings</span>
                        </h1>
                        <p className="text-gray-400 mt-3 text-lg font-light">
                            Manage your showroom's public profile and communication channels.
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-[30px] lg:rounded-[45px] shadow-[0_20px_60px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden">
                    <div className="p-6 md:p-10 lg:p-12">
                        {apiError && (
                            <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl text-red-700 text-sm flex items-center gap-3">
                                <AlertCircle size={20} />
                                {apiError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-10">
                            {/* Profile Section */}
                            <section>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 bg-[#205457]/10 rounded-2xl flex items-center justify-center text-[#205457]">
                                        <Store size={24} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">Showroom Profile</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Store Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className={`w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 focus:bg-white outline-none transition-all font-bold ${fieldErrors.name ? 'border-red-500 focus:border-red-500' : 'border-transparent focus:border-[#205457]/10'}`}
                                        />
                                        {fieldErrors.name && <p className="text-red-500 text-xs font-bold ml-2 mt-1">{fieldErrors.name}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Business Phone</label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="e.g. 0599123456"
                                            className={`w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 focus:bg-white outline-none transition-all font-bold ${fieldErrors.phone ? 'border-red-500 focus:border-red-500' : 'border-transparent focus:border-[#205457]/10'}`}
                                        />
                                        {fieldErrors.phone && <p className="text-red-500 text-xs font-bold ml-2 mt-1">{fieldErrors.phone}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Business Email</label>
                                        <input
                                            type="email"
                                            readOnly
                                            value={formData.email}
                                            className="w-full px-6 py-4 rounded-2xl bg-gray-100 border-2 border-transparent text-gray-400 cursor-not-allowed outline-none font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Working Hours</label>
                                        <input
                                            type="text"
                                            value={formData.workingHours}
                                            onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                                            placeholder="e.g. Mon-Fri: 9AM - 6PM"
                                            className={`w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 focus:bg-white outline-none transition-all font-bold ${fieldErrors.workingHours ? 'border-red-500 focus:border-red-500' : 'border-transparent focus:border-[#205457]/10'}`}
                                        />
                                        {fieldErrors.workingHours && <p className="text-red-500 text-xs font-bold ml-2 mt-1">{fieldErrors.workingHours}</p>}
                                    </div>
                                </div>
                                <div className="mt-8 space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Showroom Address</label>
                                    <textarea
                                        rows={3}
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        placeholder="Full address (City, Street, Building)"
                                        className={`w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 focus:bg-white outline-none transition-all font-bold resize-none ${fieldErrors.address ? 'border-red-500 focus:border-red-500' : 'border-transparent focus:border-[#205457]/10'}`}
                                    />
                                    {fieldErrors.address && <p className="text-red-500 text-xs font-bold ml-2 mt-1">{fieldErrors.address}</p>}
                                </div>
                            </section>

                            <hr className="border-gray-50" />

                            {/* Communication Section */}
                            <section>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 bg-[#B19470]/10 rounded-2xl flex items-center justify-center text-[#B19470]">
                                        <Shield size={24} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">Communication Channels</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, hasWhatsapp: !formData.hasWhatsapp })}
                                        className={`flex items-center justify-between p-6 rounded-3xl border-2 transition-all ${formData.hasWhatsapp ? 'border-[#205457] bg-[#205457]/5' : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200'}`}
                                    >
                                        <div className="flex items-center gap-4 font-bold">
                                            <MessageCircle className={formData.hasWhatsapp ? 'text-[#205457]' : ''} />
                                            <span>WhatsApp Business</span>
                                        </div>
                                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${formData.hasWhatsapp ? 'bg-[#205457] text-white' : 'bg-gray-200'}`}>
                                            {formData.hasWhatsapp && <Check size={14} />}
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, hasSms: !formData.hasSms })}
                                        className={`flex items-center justify-between p-6 rounded-3xl border-2 transition-all ${formData.hasSms ? 'border-[#205457] bg-[#205457]/5' : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200'}`}
                                    >
                                        <div className="flex items-center gap-4 font-bold">
                                            <Send className={formData.hasSms ? 'text-[#205457]' : ''} />
                                            <span>SMS Direct</span>
                                        </div>
                                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${formData.hasSms ? 'bg-[#205457] text-white' : 'bg-gray-200'}`}>
                                            {formData.hasSms && <Check size={14} />}
                                        </div>
                                    </button>
                                </div>
                            </section>

                            <div className="pt-6 flex items-center gap-6">
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-1 bg-[#205457] text-white py-5 rounded-[22px] font-bold flex items-center justify-center gap-3 hover:shadow-2xl hover:shadow-[#205457]/20 transition-all active:scale-[0.98] disabled:opacity-50 shadow-xl"
                                >
                                    {isSaving ? "Updating Showroom..." : "Save Showroom Settings"}
                                    {!isSaving && <Save size={20} />}
                                </button>

                                <AnimatePresence>
                                    {showSuccess && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="flex items-center gap-2 text-green-500 font-bold"
                                        >
                                            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-green-500/20">
                                                <Check size={16} />
                                            </div>
                                            <span>Saved Successfully</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default StoreSettings;
