'use client';

import React, { useState, useEffect } from 'react';
import { FiUserPlus, FiTrash2, FiShield } from 'react-icons/fi';
import IncenseLoader from '@/app/components/IncenseLoader';
import Modal from '@/app/components/Modal';

export default function UserManagement() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState('VIEWER');
    const [inviteName, setInviteName] = useState('');
    const [inviteImage, setInviteImage] = useState('');

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

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch {
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: inviteEmail,
                    role: inviteRole,
                    name: inviteName,
                    image: inviteImage
                }),
            });
            if (res.ok) {
                setInviteEmail('');
                setInviteName('');
                setInviteImage('');
                fetchUsers();
                setModalConfig({
                    isOpen: true,
                    title: 'Invitation Sent',
                    message: `User ${inviteEmail} has been successfully invited as ${inviteRole}.`,
                    type: 'success',
                    mode: 'alert'
                });
            } else {
                setModalConfig({
                    isOpen: true,
                    title: 'Invite Failed',
                    message: 'Could not invite user. They might already be on the team.',
                    type: 'error',
                    mode: 'alert'
                });
            }
        } catch (error) {
            setModalConfig({
                isOpen: true,
                title: 'Error',
                message: 'An unexpected error occurred while inviting the user.',
                type: 'error',
                mode: 'alert'
            });
        }
    };

    const handleDelete = async (id: string, role: string) => {
        if (role === 'ADMIN' && users.filter(u => u.role === 'ADMIN').length <= 1) {
            setModalConfig({
                isOpen: true,
                title: 'Action Prohibited',
                message: 'You cannot remove the last remaining Administrator.',
                type: 'warning',
                mode: 'alert'
            });
            return;
        }

        setModalConfig({
            isOpen: true,
            title: 'Remove Team Member',
            message: 'Are you sure you want to remove this user? they will lose all access immediately.',
            type: 'warning',
            mode: 'confirm',
            onConfirm: () => executeDelete(id)
        });
    };

    const executeDelete = async (id: string) => {
        try {
            await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
            fetchUsers();
            setModalConfig({
                isOpen: true,
                title: 'User Removed',
                message: 'The team member has been removed successfully.',
                type: 'success',
                mode: 'alert'
            });
        } catch (error) {
            setModalConfig({
                isOpen: true,
                title: 'Error',
                message: 'Failed to remove user. Please try again.',
                type: 'error',
                mode: 'alert'
            });
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-12 bg-[#121212] rounded-xl border border-[#333] mt-8">
            <IncenseLoader size="sm" />
        </div>
    );

    return (
        <div className="bg-[#121212] rounded-xl shadow-sm border border-[#333] overflow-hidden mt-8">
            <div className="p-6 border-b border-[#222]">
                <h3 className="text-lg font-bold text-white flex items-center">
                    <FiShield className="mr-2 text-[#D4AF37]" />
                    Team Management
                </h3>
                <p className="text-gray-500 text-sm mt-1">Invite authorized users to the platform.</p>
            </div>

            <div className="p-8 bg-[#1a1a1a] border-b border-[#222]">
                <form onSubmit={handleInvite} className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-[2] space-y-1.5">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
                            <input
                                type="email"
                                required
                                value={inviteEmail}
                                onChange={e => setInviteEmail(e.target.value)}
                                className="w-full bg-[#121212] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 outline-none transition-all placeholder:text-gray-600"
                                placeholder="colleague@example.com"
                            />
                        </div>
                        <div className="flex-1 space-y-1.5">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
                            <input
                                type="text"
                                value={inviteName}
                                onChange={e => setInviteName(e.target.value)}
                                className="w-full bg-[#121212] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 outline-none transition-all placeholder:text-gray-600"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 space-y-1.5">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Profile Image URL (Optional)</label>
                            <input
                                type="url"
                                value={inviteImage}
                                onChange={e => setInviteImage(e.target.value)}
                                className="w-full bg-[#121212] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 outline-none transition-all placeholder:text-gray-600"
                                placeholder="https://example.com/avatar.jpg"
                            />
                        </div>
                        <div className="w-full md:w-48 space-y-1.5">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Role</label>
                            <div className="relative">
                                <select
                                    value={inviteRole}
                                    onChange={e => setInviteRole(e.target.value)}
                                    className="w-full bg-[#121212] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 outline-none transition-all appearance-none cursor-pointer"
                                >
                                    <option value="VIEWER">Viewer</option>
                                    <option value="EDITOR">Editor</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end pt-2">
                        <button type="submit" className="bg-[#D4AF37] hover:bg-[#b5952f] text-black font-bold py-3 px-8 rounded-xl flex items-center justify-center transition-all shadow-lg hover:shadow-[#D4AF37]/20 active:scale-95 cursor-pointer">
                            <FiUserPlus className="mr-2 w-5 h-5" /> Add Team Member
                        </button>
                    </div>
                </form>
            </div>

            <div className="divide-y divide-[#222]">
                {users.map(user => (
                    <div key={user._id} className="p-4 flex items-center justify-between hover:bg-[#1a1a1a] transition-colors">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-[#333] flex items-center justify-center text-[#D4AF37] font-bold text-xs overflow-hidden">
                                {user.image ? (
                                    <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    user.name?.charAt(0) || user.email.charAt(0)
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">{user.name || 'User'}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className={`text-xs px-2 py-1 rounded-full border ${user.role === 'ADMIN' ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30' :
                                'bg-gray-800 text-gray-400 border-gray-700'
                                }`}>
                                {user.role}
                            </span>
                            <button
                                onClick={() => handleDelete(user._id, user.role)}
                                className="text-red-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-900/10 transition-colors cursor-pointer"
                            >
                                <FiTrash2 />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                title={modalConfig.title}
                message={modalConfig.message}
                type={modalConfig.type}
                mode={modalConfig.mode}
                onConfirm={modalConfig.onConfirm}
                confirmText={modalConfig.mode === 'confirm' ? 'Remove' : 'OK'}
                isDestructive={modalConfig.mode === 'confirm'}
            />
        </div>
    );
}
