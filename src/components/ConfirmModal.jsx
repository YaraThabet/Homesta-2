import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, X } from 'lucide-react';

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Are you sure?",
    message = "This action cannot be undone.",
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = "warning" // warning, danger, info
}) => {
    if (!isOpen) return null;

    const config = {
        warning: {
            icon: AlertTriangle,
            iconBg: 'bg-amber-50',
            iconColor: 'text-amber-500',
            buttonBg: 'bg-amber-500 hover:bg-amber-600',
            buttonShadow: 'shadow-amber-500/20'
        },
        danger: {
            icon: Trash2,
            iconBg: 'bg-red-50',
            iconColor: 'text-red-500',
            buttonBg: 'bg-red-500 hover:bg-red-600',
            buttonShadow: 'shadow-red-500/20'
        },
        info: {
            icon: AlertTriangle,
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-500',
            buttonBg: 'bg-blue-500 hover:bg-blue-600',
            buttonShadow: 'shadow-blue-500/20'
        }
    };

    const current = config[type] || config.warning;
    const Icon = current.icon;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return createPortal(
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Decorative top bar */}
                    <div className={`absolute top-0 left-0 right-0 h-1 ${current.buttonBg.split(' ')[0]}`} />

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                    >
                        <X size={20} />
                    </button>

                    {/* Icon */}
                    <div className={`w-20 h-20 ${current.iconBg} rounded-3xl flex items-center justify-center mx-auto mb-6`}>
                        <Icon size={36} className={current.iconColor} />
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-gray-900 text-center mb-3">
                        {title}
                    </h3>
                    <p className="text-gray-500 text-center mb-8 leading-relaxed font-light">
                        {message}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <button
                            onClick={onClose}
                            className="flex-1 py-4 bg-gray-50 text-gray-500 font-bold rounded-2xl hover:bg-gray-100 transition-all"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={handleConfirm}
                            className={`flex-1 py-4 text-white font-bold rounded-2xl shadow-xl ${current.buttonBg} ${current.buttonShadow} transition-all active:scale-95`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>,
        document.body
    );
};

export default ConfirmModal;
