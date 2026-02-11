'use client';

import React from 'react';

export default function IncenseLoader({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const sizes = {
        sm: { stick: 'h-8 w-0.5', glow: 'w-1 h-1', smoke: 'w-2 h-2' },
        md: { stick: 'h-16 w-1', glow: 'w-2 h-2', smoke: 'w-3 h-3' },
        lg: { stick: 'h-24 w-1.5', glow: 'w-3 h-3', smoke: 'w-4 h-4' },
    };

    const currentSize = sizes[size];

    return (
        <div className="flex flex-col items-center justify-center space-y-0 relative">
            {/* Smoke Effects */}
            <div className="relative h-10 w-full flex justify-center overflow-visible">
                <div className={`smoke smoke-1 ${currentSize.smoke} opacity-0`}></div>
                <div className={`smoke smoke-2 ${currentSize.smoke} opacity-0`}></div>
                <div className={`smoke smoke-3 ${currentSize.smoke} opacity-0`}></div>
            </div>

            {/* Incense Stick */}
            <div className="relative flex flex-col items-center">
                {/* Glowing Tip */}
                <div className={`${currentSize.glow} rounded-full bg-[#D4AF37] animate-incense-glow absolute -top-1 z-10`}></div>

                {/* The Stick */}
                <div className={`${currentSize.stick} bg-gradient-to-b from-[#3E2723] to-[#1a1a1a] rounded-full shadow-inner`}></div>

                {/* Base/Holder Shadow */}
                <div className="w-4 h-1 bg-black/40 blur-sm rounded-full mt-1"></div>
            </div>

            <p className="text-[10px] text-[#D4AF37] uppercase tracking-[0.2em] font-bold mt-4 animate-pulse">
                Purity Loading...
            </p>
        </div>
    );
}
