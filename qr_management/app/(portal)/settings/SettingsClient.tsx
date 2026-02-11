'use client';

import { signOut } from 'next-auth/react';
import { FiLogOut } from 'react-icons/fi';

export default function SettingsClient() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex items-center space-x-2 px-4 py-2 bg-red-900/10 text-red-500 rounded-lg hover:bg-red-900/20 transition-colors font-bold border border-red-900/10 cursor-pointer active:scale-95"
        >
            <FiLogOut className="w-4 h-4" />
            <span>Sign Out</span>
        </button>
    );
}
