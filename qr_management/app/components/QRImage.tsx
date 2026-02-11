'use client';

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

interface QRImageProps {
    content: string;
    size?: number;
    className?: string;
}

export const QRImage = ({ content, size = 300, className = '' }: QRImageProps) => {
    const [dataUrl, setDataUrl] = useState<string>('');

    useEffect(() => {
        const generate = async () => {
            try {
                const url = await QRCode.toDataURL(content, {
                    width: size,
                    margin: 2,
                    color: {
                        dark: '#000000',
                        light: '#ffffff',
                    },
                });
                setDataUrl(url);
            } catch {
            }
        };

        if (content) {
            generate();
        }
    }, [content, size]);

    if (!dataUrl) {
        return <div className={`animate-pulse bg-gray-200 rounded ${className}`} style={{ width: size, height: size }}></div>;
    }

    return (
        <img
            src={dataUrl}
            alt="QR Code"
            className={className}
            loading="lazy"
        />
    );
};
