'use client';

import React from 'react';
import { SideNav } from '@/app/components/SideNav';
import { Header } from '@/app/components/Header';
import { useState } from 'react';

export default function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex min-h-screen overflow-hidden bg-[#000000]">
            {/* Sidebar with Desktop/Mobile logic */}
            <div className={`
                fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300
                ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
            `} onClick={() => setIsMobileMenuOpen(false)} />

            <div className={`
                fixed lg:static inset-y-0 left-0 z-50 w-64 transform lg:transform-none transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <SideNav onItemClick={() => setIsMobileMenuOpen(false)} />
            </div>

            <main className="flex-1 flex flex-col min-w-0 min-h-screen lg:h-screen lg:overflow-hidden">
                <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
                <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-safe">
                    {children}
                </div>
            </main>
        </div>
    );
}
