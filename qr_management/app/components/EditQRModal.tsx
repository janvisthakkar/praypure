'use client';

import React, { useState, useEffect } from 'react';
import { FiX, FiSave, FiAlertCircle, FiInfo } from 'react-icons/fi';
import { BsQrCode } from 'react-icons/bs';
import { QRCodeType } from '@/schemas/qrcode';
import QRCode from 'qrcode';
import { getTrackingUrl } from '@/lib/utils';

interface EditQRModalProps {
    isOpen: boolean;
    onClose: () => void;
    qrCode: QRCodeType | null;
    onSuccess: () => void;
}

export default function EditQRModal({ isOpen, onClose, qrCode, onSuccess }: EditQRModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        content: '',
        status: 'active' as 'active' | 'inactive'
    });
    const [errors, setErrors] = useState<{ name?: string; content?: string }>({});
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [qrDataUrl, setQrDataUrl] = useState<string>('');
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        if (qrCode) {
            setFormData({
                name: qrCode.name,
                content: qrCode.content,
                status: (qrCode.status || 'active') as 'active' | 'inactive'
            });
            setErrors({});
            setErrorMessage('');
            setHasChanges(false);
            generateQRPreview(qrCode._id);
        }
    }, [qrCode]);

    // Generate QR code preview
    const generateQRPreview = async (id: string) => {
        try {
            const trackingUrl = getTrackingUrl(id);
            const url = await QRCode.toDataURL(trackingUrl, {
                width: 200,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#ffffff',
                },
            });
            setQrDataUrl(url);
        } catch (error) {
            console.error('Failed to generate QR preview:', error);
        }
    };


    // Handle Safari iOS viewport height
    useEffect(() => {
        const setVh = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        setVh();
        window.addEventListener('resize', setVh);
        return () => window.removeEventListener('resize', setVh);
    }, []);

    // Prevent body scroll when modal is open (Safari fix)
    useEffect(() => {
        if (isOpen) {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        } else {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }

        return () => {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        };
    }, [isOpen]);

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            // Escape to close
            if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);


    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);

        // Clear error for this field
        if (errors[field as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
        setErrorMessage('');
    };

    const validate = () => {
        const newErrors: { name?: string; content?: string } = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.length > 100) {
            newErrors.name = 'Name too long (max 100 characters)';
        }

        if (!formData.content.trim()) {
            newErrors.content = 'Content is required';
        } else if (formData.content.length > 2000) {
            newErrors.content = 'Content too long (max 2000 characters)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate() || !qrCode) return;

        setIsSaving(true);
        setErrorMessage('');

        try {
            const response = await fetch(`/api/qrcodes?id=${qrCode._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update QR code');
            }

            onSuccess();
            onClose();
        } catch (error: any) {
            setErrorMessage(error.message || 'Failed to update QR code. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen || !qrCode) return null;

    const nameCharCount = formData.name.length;
    const contentCharCount = formData.content.length;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-[#121212] rounded-xl shadow-2xl border border-[#333] max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col animate-slide-up" style={{ maxHeight: 'calc(var(--vh, 1vh) * 95)' }}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#222] bg-gradient-to-r from-[#121212] to-[#1a1a1a]">
                    <div>
                        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                            <BsQrCode className="text-[#D4AF37]" />
                            Edit QR Code
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-400 mt-1">Update name, content, or status</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-all hover:rotate-90 duration-300"
                        aria-label="Close modal"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6" style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain', touchAction: 'pan-y' }}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                        {/* Form Section */}
                        <div className="lg:col-span-2 space-y-6">
                            {errorMessage && (
                                <div className="bg-red-900/20 border border-red-900/50 p-4 rounded-lg flex items-start space-x-3 animate-shake">
                                    <FiAlertCircle className="text-red-500 w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-red-200">
                                        <span className="font-semibold block mb-1">Error</span>
                                        <span>{errorMessage}</span>
                                    </div>
                                </div>
                            )}

                            {/* Name Field */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label htmlFor="edit-name" className="block text-sm font-semibold text-gray-300">
                                        Name
                                    </label>
                                    <span className={`text-xs ${nameCharCount > 100 ? 'text-red-500' : 'text-gray-500'}`}>
                                        {nameCharCount}/100
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    id="edit-name"
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    className={`w-full px-4 py-3 bg-[#1a1a1a] border rounded-lg focus:ring-2 focus:ring-offset-0 outline-none transition-all text-white placeholder-gray-600 ${errors.name
                                        ? 'border-red-900 focus:border-red-500 focus:ring-red-500/20'
                                        : 'border-[#333] focus:border-[#D4AF37] focus:ring-[#D4AF37]/20'
                                        }`}
                                    placeholder="e.g. Marketing Campaign 2024"
                                />
                                {errors.name && (
                                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                                        <FiAlertCircle className="w-4 h-4" />
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Content Field */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label htmlFor="edit-content" className="block text-sm font-semibold text-gray-300">
                                        Content
                                    </label>
                                    <span className={`text-xs ${contentCharCount > 2000 ? 'text-red-500' : 'text-gray-500'}`}>
                                        {contentCharCount}/2000
                                    </span>
                                </div>
                                <textarea
                                    id="edit-content"
                                    value={formData.content}
                                    onChange={(e) => handleChange('content', e.target.value)}
                                    rows={5}
                                    className={`w-full px-4 py-3 bg-[#1a1a1a] border rounded-lg focus:ring-2 focus:ring-offset-0 outline-none transition-all text-white placeholder-gray-600 resize-none ${errors.content
                                        ? 'border-red-900 focus:border-red-500 focus:ring-red-500/20'
                                        : 'border-[#333] focus:border-[#D4AF37] focus:ring-[#D4AF37]/20'
                                        }`}
                                    placeholder="Enter content here..."
                                />
                                {errors.content && (
                                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                                        <FiAlertCircle className="w-4 h-4" />
                                        {errors.content}
                                    </p>
                                )}
                            </div>

                            {/* Status Field */}
                            <div>
                                <label htmlFor="edit-status" className="block text-sm font-semibold text-gray-300 mb-2">
                                    Status
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => handleChange('status', 'active')}
                                        className={`p-3 rounded-lg border-2 transition-all font-medium ${formData.status === 'active'
                                            ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                                            : 'border-[#333] bg-[#1a1a1a] text-gray-400 hover:border-[#444]'
                                            }`}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${formData.status === 'active' ? 'bg-[#D4AF37]' : 'bg-gray-600'}`} />
                                            Active
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleChange('status', 'inactive')}
                                        className={`p-3 rounded-lg border-2 transition-all font-medium ${formData.status === 'inactive'
                                            ? 'border-gray-500 bg-gray-500/10 text-gray-300'
                                            : 'border-[#333] bg-[#1a1a1a] text-gray-400 hover:border-[#444]'
                                            }`}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${formData.status === 'inactive' ? 'bg-gray-500' : 'bg-gray-600'}`} />
                                            Inactive
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Preview Section */}
                        <div className="lg:col-span-1">
                            <div className="bg-[#1a1a1a] p-4 sm:p-6 rounded-xl border border-[#333] lg:sticky lg:top-0">
                                <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">QR Preview</h3>
                                <div className="bg-white p-4 rounded-lg mb-4 flex items-center justify-center">
                                    {qrDataUrl ? (
                                        <img
                                            src={qrDataUrl}
                                            alt="QR Code Preview"
                                            className="w-full h-auto max-w-[200px]"
                                        />
                                    ) : (
                                        <div className="w-[200px] h-[200px] flex items-center justify-center bg-gray-100 rounded-lg">
                                            <BsQrCode className="w-12 h-12 text-gray-300" />
                                        </div>
                                    )}
                                </div>

                                <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-lg p-3">
                                    <div className="flex items-start gap-2">
                                        <FiInfo className="text-[#D4AF37] w-4 h-4 flex-shrink-0 mt-0.5" />
                                        <p className="text-xs text-[#D4AF37]">
                                            QR code will continue to redirect to the tracking URL. Only the metadata is being updated.
                                        </p>
                                    </div>
                                </div>

                                {hasChanges && (
                                    <div className="mt-3 text-xs text-gray-400 flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                                        Unsaved changes
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-t border-[#222] bg-[#0a0a0a]">
                    <div className="text-xs text-gray-500 hidden sm:block">
                        <kbd className="px-2 py-1 bg-[#1a1a1a] border border-[#333] rounded text-gray-400">Esc</kbd> to close
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
                        <button
                            onClick={onClose}
                            disabled={isSaving}
                            className="flex-1 sm:flex-none px-4 sm:px-6 py-2 border border-[#333] rounded-lg text-gray-300 hover:bg-[#1a1a1a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm sm:text-base"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving || !hasChanges}
                            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#b5952f] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-[#D4AF37]/20 font-bold active:scale-95 text-sm sm:text-base"
                        >
                            {isSaving ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <FiSave className="w-5 h-5" />
                                    <span>Save Changes</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
