'use client';

import React, { useEffect, useState } from 'react';
import { FiX, FiAlertTriangle, FiCheckCircle, FiInfo } from 'react-icons/fi';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    type?: 'info' | 'success' | 'warning' | 'error';
    mode?: 'alert' | 'confirm';
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
}

export default function Modal({
    isOpen,
    onClose,
    title,
    message,
    type = 'info',
    mode = 'alert',
    onConfirm,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isDestructive = false
}: ModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setMounted(true);
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => {
                setMounted(false);
                document.body.style.overflow = 'unset';
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen && !mounted) return null;

    const iconMap = {
        info: <FiInfo className="w-10 h-10 text-blue-400" />,
        success: <FiCheckCircle className="w-10 h-10 text-green-400" />,
        warning: <FiAlertTriangle className="w-10 h-10 text-[#D4AF37]" />,
        error: <FiAlertTriangle className="w-10 h-10 text-red-500" />
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ease-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/60 backdrop-blur-sm ${mode === 'alert' ? 'cursor-pointer' : ''}`}
                onClick={mode === 'alert' ? onClose : undefined}
            ></div>

            {/* Modal Body */}
            <div className={`relative w-full max-w-md bg-[#121212] border border-[#333] rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ease-out ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
                {/* Header Decoration */}
                <div className={`h-1.5 w-full ${type === 'error' ? 'bg-red-500' :
                    type === 'success' ? 'bg-green-500' :
                        type === 'warning' ? 'bg-[#D4AF37]' :
                            'bg-blue-400'
                    }`}></div>

                <div className="p-8">
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-6 p-3 bg-white/5 rounded-full ring-4 ring-white/5">
                            {iconMap[type]}
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2 tracking-tight">{title}</h3>
                        <p className="text-gray-400 leading-relaxed">{message}</p>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row gap-3">
                        {mode === 'confirm' && (
                            <button
                                onClick={onClose}
                                className="flex-1 px-6 py-3 rounded-xl border border-[#333] text-gray-400 font-bold hover:bg-[#1a1a1a] transition-all active:scale-95 cursor-pointer"
                            >
                                {cancelText}
                            </button>
                        )}
                        <button
                            onClick={() => {
                                if (mode === 'confirm' && onConfirm) {
                                    onConfirm();
                                }
                                onClose();
                            }}
                            className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all active:scale-95 shadow-lg cursor-pointer ${isDestructive
                                ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-900/20'
                                : 'bg-[#D4AF37] hover:bg-[#b5952f] text-black shadow-orange-900/20'
                                }`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>

                {/* Close X (optional for alerts) */}
                {mode === 'alert' && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors cursor-pointer"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
}
