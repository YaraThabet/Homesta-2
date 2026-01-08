import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, XCircle, Info, X } from 'lucide-react';

const GlobalAlert = ({ isOpen, type, title, message, onClose }) => {
    if (!isOpen) return null;

    const config = {
        success: {
            icon: CheckCircle2,
            iconBg: 'bg-green-50',
            iconColor: 'text-green-500',
            buttonBg: 'bg-green-500 hover:bg-green-600',
            buttonShadow: 'shadow-green-500/20'
        },
        error: {
            icon: XCircle,
            iconBg: 'bg-red-50',
            iconColor: 'text-red-500',
            buttonBg: 'bg-red-500 hover:bg-red-600',
            buttonShadow: 'shadow-red-500/20'
        },
        warning: {
            icon: AlertCircle,
            iconBg: 'bg-amber-50',
            iconColor: 'text-amber-500',
            buttonBg: 'bg-amber-500 hover:bg-amber-600',
            buttonShadow: 'shadow-amber-500/20'
        },
        info: {
            icon: Info,
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-500',
            buttonBg: 'bg-blue-500 hover:bg-blue-600',
            buttonShadow: 'shadow-blue-500/20'
        }
    };

    const current = config[type] || config.info;
    const Icon = current.icon;

    return createPortal(
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl relative overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Decorative top bar */}
                    <div className={`absolute top-0 left-0 right-0 h-1.5 ${current.buttonBg.split(' ')[0]}`} />

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                    >
                        <X size={20} />
                    </button>

                    {/* Icon */}
                    <div className={`w-20 h-20 ${current.iconBg} rounded-[24px] flex items-center justify-center mx-auto mb-6`}>
                        <Icon size={36} className={current.iconColor} />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                        {title || (type.charAt(0).toUpperCase() + type.slice(1))}
                    </h3>
                    <p className="text-gray-500 text-center mb-8 leading-relaxed font-light">
                        {message}
                    </p>

                    {/* Action Button */}
                    <button
                        onClick={onClose}
                        className={`w-full py-4 text-white font-bold rounded-2xl shadow-xl ${current.buttonBg} ${current.buttonShadow} transition-all active:scale-95`}
                    >
                        Got it
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>,
        document.body
    );
};

export default GlobalAlert;
