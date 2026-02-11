'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { FiUser, FiImage, FiSave } from 'react-icons/fi';
import Modal from '@/app/components/Modal';

export default function ProfileForm() {
    const { data: session, update } = useSession();
    const [name, setName] = useState(session?.user?.name || '');
    const [image, setImage] = useState(session?.user?.image || '');
    const [isSaving, setIsSaving] = useState(false);
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        type: 'success' | 'error';
    }>({
        isOpen: false,
        title: '',
        message: '',
        type: 'success'
    });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const response = await fetch('/api/profile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, image }),
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            // Update session data
            await update({ name, image });

            setModalConfig({
                isOpen: true,
                title: 'Profile Updated',
                message: 'Your personal information has been saved successfully.',
                type: 'success'
            });
        } catch (error) {
            console.error(error);
            setModalConfig({
                isOpen: true,
                title: 'Update Failed',
                message: 'We could not update your profile. Please try again.',
                type: 'error'
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-[#121212] rounded-xl shadow-sm border border-[#333] overflow-hidden">
            <div className="p-6 border-b border-[#222]">
                <h3 className="text-lg font-bold text-white flex items-center">
                    <FiUser className="mr-2 text-[#D4AF37]" />
                    Edit Profile
                </h3>
                <p className="text-gray-500 text-sm mt-1">Change your display name and profile picture.</p>
            </div>

            <form onSubmit={handleSave} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FiUser className="text-gray-500" />
                            </div>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl pl-10 pr-4 py-3 text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 outline-none transition-all placeholder:text-gray-600"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Profile Picture URL</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FiImage className="text-gray-500" />
                            </div>
                            <input
                                type="url"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                                className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl pl-10 pr-4 py-3 text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 outline-none transition-all placeholder:text-gray-600"
                                placeholder="https://example.com/avatar.jpg"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="bg-[#D4AF37] hover:bg-[#b5952f] text-black font-bold py-3 px-8 rounded-xl flex items-center justify-center transition-all shadow-lg hover:shadow-[#D4AF37]/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {isSaving ? (
                            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <FiSave className="mr-2 w-5 h-5" /> Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>

            <Modal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                title={modalConfig.title}
                message={modalConfig.message}
                type={modalConfig.type}
            />
        </div>
    );
}
