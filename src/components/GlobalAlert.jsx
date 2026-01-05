import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, XCircle, Info, X } from 'lucide-react';

const GlobalAlert = ({ isOpen, type, title, message, onClose, duration = 3000 }) => {
    if (!isOpen) return null;

    const config = {
        success: {
            icon: CheckCircle2,
            color: 'text-green-500',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-100',
            progressColor: 'bg-green-500'
        },
        error: {
            icon: XCircle,
            color: 'text-red-500',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-100',
            progressColor: 'bg-red-500'
        },
        warning: {
            icon: AlertCircle,
            color: 'text-yellow-500',
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-100',
            progressColor: 'bg-yellow-500'
        },
        info: {
            icon: Info,
            color: 'text-blue-500',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-100',
            progressColor: 'bg-blue-500'
        }
    };

    const current = config[type] || config.info;
    const Icon = current.icon;

    return createPortal(
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-[400px] px-4">
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                    className={`${current.bgColor} ${current.borderColor} border shadow-xl rounded-2xl p-4 flex items-start gap-3 relative overflow-hidden`}
                >
                    <div className={`${current.color} mt-0.5`}>
                        <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                        {title && <h3 className="font-bold text-gray-900 text-sm mb-0.5">{title}</h3>}
                        <p className="text-gray-600 text-xs leading-relaxed">{message}</p>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    {/* Progress bar */}
                    <motion.div
                        initial={{ width: '100%' }}
                        animate={{ width: 0 }}
                        transition={{ duration: duration / 1000, ease: 'linear' }}
                        onAnimationComplete={onClose}
                        className={`absolute bottom-0 left-0 h-1 ${current.progressColor}`}
                    />
                </motion.div>
            </AnimatePresence>
        </div>,
        document.body
    );
};

export default GlobalAlert;
