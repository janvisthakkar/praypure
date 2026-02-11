'use client';

import React, { useEffect, useState } from 'react';
import { FiTrash2, FiDownload, FiCalendar, FiMapPin, FiSearch, FiFilter, FiEdit2 } from 'react-icons/fi';
import { useSession } from 'next-auth/react';
import { BsQrCode } from 'react-icons/bs';
import { QRCodeType } from '@/schemas/qrcode';
import IncenseLoader from '@/app/components/IncenseLoader';
import { QRImage } from '@/app/components/QRImage';
import QRCode from 'qrcode';
import { getTrackingUrl } from '@/lib/utils';
import Modal from '@/app/components/Modal';
import EditQRModal from '@/app/components/EditQRModal';

export default function ManagePage() {
    const { data: session, status } = useSession();
    const isViewer = session?.user?.role === 'VIEWER';
    const [qrCodes, setQrCodes] = useState<QRCodeType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    // Modal state
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        type: 'info' | 'success' | 'warning' | 'error';
        mode: 'alert' | 'confirm';
        onConfirm?: () => void;
    }>({
        isOpen: false,
        title: '',
        message: '',
        type: 'info',
        mode: 'alert'
    });

    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

    // Edit modal state
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingQRCode, setEditingQRCode] = useState<QRCodeType | null>(null);

    const fetchQrCodes = async () => {
        try {
            const res = await fetch('/api/qrcodes');
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setQrCodes(data);
        } catch (err) {
            setError('Failed to load QR codes');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (qr: QRCodeType) => {
        setEditingQRCode(qr);
        setEditModalOpen(true);
    };

    const handleEditSuccess = () => {
        fetchQrCodes();
        setModalConfig({
            isOpen: true,
            title: 'Success',
            message: 'QR code has been updated successfully.',
            type: 'success',
            mode: 'alert'
        });
    };

    useEffect(() => {
        fetchQrCodes();
    }, []);

    const handleDelete = async (id: string) => {
        setPendingDeleteId(id);
        setModalConfig({
            isOpen: true,
            title: 'Delete QR Code',
            message: 'Are you sure you want to permanently delete this QR code? This action cannot be undone.',
            type: 'warning',
            mode: 'confirm',
            onConfirm: () => executeDelete(id)
        });
    };

    const executeDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/qrcodes?id=${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete');
            setQrCodes(qrCodes.filter(q => q._id !== id));
            setModalConfig({
                isOpen: true,
                title: 'Success',
                message: 'QR code has been deleted successfully.',
                type: 'success',
                mode: 'alert'
            });
        } catch {
            setModalConfig({
                isOpen: true,
                title: 'Error',
                message: 'Failed to delete the QR code. Please try again.',
                type: 'error',
                mode: 'alert'
            });
        } finally {
            setPendingDeleteId(null);
        }
    };

    const handleDownload = async (qr: QRCodeType) => {
        const id = qr._id?.toString() || '';
        const trackingUrl = getTrackingUrl(id);
        try {
            const dataUrl = await QRCode.toDataURL(trackingUrl, {
                width: 1024,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#ffffff',
                }
            });
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `${qr.name.replace(/\s+/g, '_')}_qr.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            alert('Failed to download QR code');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const filteredQrCodes = qrCodes.filter(qr => {
        const matchesSearch = qr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            qr.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || qr.type === filterType;
        const matchesStatus = filterStatus === 'all' || (qr.status || 'active') === filterStatus;

        return matchesSearch && matchesType && matchesStatus;
    });

    if (loading || status === 'loading') return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
            <IncenseLoader />
        </div>
    );
    if (error) return <div className="p-8 text-center text-red-500 font-bold">{error}</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Manage QR Codes</h2>
                    <p className="text-gray-400 mt-1">View and manage your generated QR codes.</p>
                </div>
                {!isViewer && (
                    <a href="/" className="inline-flex items-center px-4 py-2 border border-[#D4AF37] rounded-lg shadow-sm text-sm font-bold text-[#000] bg-[#D4AF37] hover:bg-[#b5952f] transition-all cursor-pointer">
                        Create New
                    </a>
                )}
            </div>

            {/* Filters Section */}
            <div className="bg-[#121212] p-5 rounded-lg shadow-sm border border-[#333] mb-8">
                <div className="flex flex-col md:flex-row gap-4 md:items-center">
                    <div className="flex-1 relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiSearch className="text-gray-500 group-focus-within:text-[#D4AF37] transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name or content..."
                            className="block w-full pl-10 pr-4 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <div className="relative min-w-[160px] flex-1 md:flex-none group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiFilter className="text-gray-500 group-focus-within:text-[#D4AF37] transition-colors" />
                            </div>
                            <select
                                className="block w-full pl-10 pr-8 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] sm:text-sm appearance-none cursor-pointer hover:border-[#444] transition-all font-medium"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                            >
                                <option value="all">All Types</option>
                                <option value="url">URL</option>
                                <option value="text">Text</option>
                                <option value="email">Email</option>
                                <option value="phone">Phone</option>
                            </select>
                        </div>
                        <div className="relative min-w-[160px] flex-1 md:flex-none group">
                            <select
                                className="block w-full pl-4 pr-8 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] sm:text-sm appearance-none cursor-pointer hover:border-[#444] transition-all font-medium"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {qrCodes.length === 0 ? (
                <div className="bg-[#121212] rounded-xl shadow-sm border border-[#333] p-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1a1a1a] mb-4 border border-[#333]">
                        <BsQrCode className="w-8 h-8 text-[#D4AF37]" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">No QR Codes Yet</h3>
                    <p className="text-gray-400 mb-6">Create your first QR code to see it here.</p>
                    <a href="/" className="inline-flex items-center px-4 py-2 border border-[#D4AF37] rounded-lg shadow-sm text-sm font-bold text-[#000] bg-[#D4AF37] hover:bg-[#b5952f] cursor-pointer">
                        Create QR Code
                    </a>
                </div>
            ) : filteredQrCodes.length === 0 ? (
                <div className="bg-[#121212] rounded-xl shadow-sm border border-[#333] p-12 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#1a1a1a] mb-4 border border-[#333]">
                        <FiSearch className="w-6 h-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">No Results Found</h3>
                    <p className="text-gray-400">Try adjusting your filters or search term.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredQrCodes.map((qr) => (
                        <div key={qr._id} className="bg-[#121212] rounded-xl shadow-sm border border-[#333] overflow-hidden hover:border-[#D4AF37]/50 transition-colors group">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-white rounded-lg border border-gray-100">
                                        <QRImage
                                            content={getTrackingUrl(qr._id?.toString() || '')}
                                            size={64}
                                            className="w-16 h-16"
                                        />
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize
                                            ${qr.status === 'active' ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-gray-800 text-gray-400'}`}>
                                            {qr.status || 'active'}
                                        </span>
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-white mb-0.5 truncate group-hover:text-[#D4AF37] transition-colors" title={qr.name}>{qr.name}</h3>
                                <p className="text-sm text-gray-400 mb-4 truncate" title={qr.content}>{qr.content}</p>

                                <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
                                    <span className="flex items-center">
                                        <FiCalendar className="mr-1.5 w-4 h-4" />
                                        {formatDate(qr.created)}
                                    </span>
                                    <span className="flex items-center">
                                        <FiMapPin className="mr-1.5 w-4 h-4" />
                                        {qr.scans?.length || 0} scans
                                    </span>
                                </div>

                                <div className="flex border-t border-[#222] pt-4 space-x-2">
                                    <button
                                        onClick={() => handleDownload(qr)}
                                        className="flex-1 flex items-center justify-center px-3 py-2 border border-[#333] shadow-sm text-sm font-bold rounded-lg text-gray-300 bg-[#1a1a1a] hover:bg-[#222] transition-colors cursor-pointer"
                                    >
                                        <FiDownload className="mr-2" /> PNG
                                    </button>
                                    {!isViewer && (
                                        <>
                                            <button
                                                onClick={() => handleEdit(qr)}
                                                className="flex items-center justify-center px-3 py-2 border border-[#D4AF37]/30 text-sm font-medium rounded-lg text-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 transition-colors cursor-pointer"
                                            >
                                                <FiEdit2 />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(qr._id)}
                                                className="flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-red-500 bg-red-900/10 hover:bg-red-900/20 transition-colors cursor-pointer"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                title={modalConfig.title}
                message={modalConfig.message}
                type={modalConfig.type}
                mode={modalConfig.mode}
                onConfirm={modalConfig.onConfirm}
                confirmText={modalConfig.mode === 'confirm' ? 'Delete' : 'OK'}
                isDestructive={modalConfig.mode === 'confirm'}
            />

            <EditQRModal
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                qrCode={editingQRCode}
                onSuccess={handleEditSuccess}
            />
        </div>
    );
}
