'use client';

import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { FiLogOut, FiMenu } from 'react-icons/fi';

export const Header = ({ onMenuClick }: { onMenuClick?: () => void }) => {
  const pathname = usePathname();
  const { status } = useSession();

  const getTitle = () => {
    switch (pathname) {
      case '/': return 'QR Generator';
      case '/manage': return 'Manage QR Codes';
      case '/analytics': return 'Analytics';
      case '/settings': return 'Settings';
      default: return 'Dashboard';
    }
  };

  return (
    <header className="bg-[#0a0a0a]/80 backdrop-blur-md border-b border-[#333]/50 px-6 md:px-10 py-5 flex justify-between items-center sticky top-0 z-10 shrink-0">
      <div className="flex items-center gap-6">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-gray-400 hover:text-[#D4AF37] transition-all cursor-pointer active:scale-95"
        >
          <FiMenu className="w-6 h-6" />
        </button>
        <div className="flex flex-col">
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span className="text-[#D4AF37]">PrayPure</span>
            <span className="text-gray-400 font-light hidden sm:inline">|</span>
            <span className="text-gray-300 font-medium">{getTitle()}</span>
          </h1>
        </div>
      </div>
      <div className="flex items-center space-x-6">
        {status === 'authenticated' && (
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="text-xs font-bold text-gray-400 hover:text-red-500 flex items-center gap-2 transition-all px-4 py-2 rounded-full border border-[#333] hover:border-red-500/50 bg-[#111] cursor-pointer active:scale-95"
          >
            <FiLogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        )}
      </div>
    </header>
  );
};