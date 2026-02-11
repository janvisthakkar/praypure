import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { redirect } from 'next/navigation';
import { FiUser, FiLogOut, FiSettings, FiCreditCard, FiShield } from 'react-icons/fi';
import SettingsClient from './SettingsClient';
import UserManagement from './UserManagement';
import ProfileForm from './ProfileForm';

export default async function SettingsPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/login');
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-white">Account Settings</h2>
                <p className="text-gray-400 mt-1">Manage your profile and preferences.</p>
            </div>

            {/* Profile Section */}
            <ProfileForm />

            <div className="bg-[#121212] rounded-xl shadow-sm border border-[#333] overflow-hidden">
                <div className="p-6 border-b border-[#222]">
                    <h4 className="font-semibold text-white">System Actions</h4>
                </div>
                <div className="p-6 flex justify-between items-center group">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-red-900/20 text-red-400 rounded-lg group-hover:bg-red-900/30 transition-colors">
                            <FiLogOut className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-white">Security & Access</h4>
                            <p className="text-sm text-gray-500">Sign out of your account</p>
                        </div>
                    </div>
                    <SettingsClient />
                </div>
            </div>

            {/* Admin Only Section */}
            {(session.user?.role === 'ADMIN' || !session.user?.role) && (
                <UserManagement />
            )}
        </div>
    );
}
