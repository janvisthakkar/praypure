'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { FiGrid, FiClock, FiSettings, FiUser, FiPieChart, FiLogIn, FiLogOut } from 'react-icons/fi';
import { BsQrCode } from 'react-icons/bs';
import IncenseLoader from '@/app/components/IncenseLoader';

export const SideNav = ({ onItemClick }: { onItemClick?: () => void }) => {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const navItems = [
    { href: '/', label: 'Generator', icon: <FiGrid className="w-5 h-5" /> },
    { href: '/manage', label: 'Manage QR Codes', icon: <FiClock className="w-5 h-5" /> },
    { href: '/analytics', label: 'Analytics', icon: <FiPieChart className="w-5 h-5" /> },
    { href: '/settings', label: 'Settings', icon: <FiSettings className="w-5 h-5" /> },
  ];


  if (status === 'loading') {
    return (
      <aside className="w-64 bg-[#0a0a0a] border-r border-[#333] flex flex-col items-center justify-center h-full shadow-xl z-20">
        <IncenseLoader size="sm" />
      </aside>
    );
  }

  const filteredNavItems = navItems.filter(item => {
    if (session?.user?.role === 'VIEWER' && item.href === '/') return false;
    return true;
  });

  return (
    <aside className="w-64 bg-[#0a0a0a] border-r border-[#333] flex flex-col h-full shadow-xl z-20">
      <div className="p-6 flex items-center space-x-3 border-b border-[#222]">
        <div className="bg-[#D4AF37] p-2 rounded-lg text-black shadow-lg shadow-orange-900/20">
          <BsQrCode className="w-6 h-6" />
        </div>
        <div>
          <img src="/logo.png" alt="PrayPure Logo" className="h-9 w-auto object-contain mb-1" />
          <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest block">QR Management</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 group cursor-pointer ${isActive
                ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 shadow-inner'
                : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-[#D4AF37]'
                }`}
            >
              <span className={isActive ? 'text-[#D4AF37]' : 'text-gray-500 group-hover:text-[#D4AF37]'}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#222]">
        {status === 'authenticated' && session?.user ? (
          <div className="space-y-3">
            <div className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-[#121212] border border-[#222]">
              <div className="w-10 h-10 rounded-full bg-[#222] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] text-sm font-bold overflow-hidden">
                {session.user.image ? (
                  <img src={session.user.image} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs">{session.user.name?.charAt(0)}</span>
                )}
              </div>
              <div className="text-sm overflow-hidden flex-1">
                <p className="font-semibold text-gray-200 truncate">{session.user.name}</p>
                <p className="text-[#D4AF37] text-xs font-bold truncate uppercase bg-[#D4AF37]/10 px-2 py-0.5 rounded-full inline-block mt-0.5 border border-[#D4AF37]/20">
                  {session.user.role || 'ADMIN'}
                </p>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-red-500 bg-red-900/10 hover:bg-red-900/20 transition-all text-sm font-bold border border-red-900/20 cursor-pointer active:scale-95"
            >
              <FiLogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        ) : (
          <Link href="/login" className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-[#D4AF37] text-black font-bold hover:bg-[#b5952f] transition-colors justify-center shadow-lg">
            <FiLogIn className="w-5 h-5" />
            <span>Sign In</span>
          </Link>
        )}
      </div>

      {/* Footer with Copyright */}
      <div className="px-4 py-3 border-t border-[#222] bg-[#0a0a0a]">
        <p className="text-xs text-gray-500 text-center">
          © {new Date().getFullYear()} <span className="text-[#D4AF37]">PrayPure</span>
        </p>
        <p className="text-[10px] text-gray-600 text-center mt-1">
          All rights reserved
        </p>
      </div>
    </aside>
  );
};