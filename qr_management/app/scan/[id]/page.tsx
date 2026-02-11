import { permanentRedirect } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import QRCode from '@/models/QRCode';
import { FiAlertCircle } from 'react-icons/fi';
import mongoose from 'mongoose';
import { headers } from 'next/headers';

async function getLocationData(ip: string) {
    if (!ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
        return { city: 'Internal', country: 'Local' };
    }

    try {
        const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,city,regionName,lat,lon`);
        const data = await response.json();

        if (data.status === 'success') {
            return {
                country: data.country,
                city: data.city,
                region: data.regionName,
                latitude: data.lat,
                longitude: data.lon
            };
        }
    } catch {
    }
    return {};
}

export default async function ScanPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    if (!id || !mongoose.isValidObjectId(id)) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
                <FiAlertCircle className="w-12 h-12 text-red-500/50 mb-6" />
                <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">Invalid QR Code</p>
            </div>
        );
    }

    try {
        await dbConnect();

        // Get Client IP and User Agent from headers
        const headersList = await headers();
        const forwarded = headersList.get('x-forwarded-for');
        const ip = forwarded ? forwarded.split(',')[0].trim() : (headersList.get('x-real-ip') || '127.0.0.1');
        const userAgent = headersList.get('user-agent') || 'Unknown User Agent';

        const locationData = await getLocationData(ip);

        const scanData = {
            timestamp: new Date(),
            ip,
            userAgent,
            ...locationData
        };

        const qrCode = await QRCode.findByIdAndUpdate(
            id,
            { $push: { scans: scanData } },
            { new: true }
        );

        if (!qrCode) {
            throw new Error('QR Code not found');
        }

        if (qrCode.status === 'inactive') {
            throw new Error('This QR Code has been deactivated by the administrator.');
        }

        if (qrCode.content) {
            permanentRedirect(qrCode.content);
        } else {
            throw new Error('Destination not found');
        }
    } catch (error: any) {
        // Next.js redirect throws a special error that should NOT be caught if we want it to work.
        // However, if we are in a try-catch, we MUST re-throw it.
        if (error.digest?.startsWith('NEXT_REDIRECT')) {
            throw error;
        }

        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
                <FiAlertCircle className="w-12 h-12 text-red-500/50 mb-6" />
                <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">
                    {error.message || 'This QR code is invalid or deactivated.'}
                </p>
            </div>
        );
    }
}
