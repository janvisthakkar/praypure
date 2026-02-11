import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import QRCode from '@/models/QRCode';
import { ScanTrackingSchema } from '@/schemas/scan';
import mongoose from 'mongoose';

async function getLocationData(ip: string) {
  // Skip local IPs
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
  } catch (err) {
    console.error('Geolocation failed:', err);
  }
  return {};
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    let { id } = ScanTrackingSchema.parse(body);
    id = id?.trim();

    // Relaxed ID check with extremely detailed logging
    if (!id || id === 'undefined' || id === 'null' || !mongoose.isValidObjectId(id)) {
      console.error('--- SCAN DATA VALIDATION FAILURE ---');
      console.error('Full Body:', JSON.stringify(body));
      console.error('Parsed ID:', `"${id}"`);
      console.error('ID Type:', typeof id);
      console.error('Is Valid ObjectId:', mongoose.isValidObjectId(id));
      console.error('------------------------------------');

      return NextResponse.json({
        error: 'Invalid QR Code ID format',
        receivedId: id,
        debug: {
          type: typeof id,
          isValid: mongoose.isValidObjectId(id)
        }
      }, { status: 400 });
    }

    console.log(`SCAN LOG: Validating and tracking scan for ID: ${id}`);

    // Get Client IP reliably
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : (request.headers.get('x-real-ip') || '127.0.0.1');
    const userAgent = request.headers.get('user-agent') || 'Unknown User Agent';

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
      console.error('QR Code not found in DB:', id);
      return NextResponse.json({ error: 'QR Code not found' }, { status: 404 });
    }

    if (qrCode.status === 'inactive') {
      console.warn(`SCAN REJECT: QR Code ${id} is inactive`);
      return NextResponse.json({ error: 'This QR Code has been deactivated by the administrator.' }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      content: qrCode.content,
      id: qrCode._id.toString()
    });
  } catch (error: any) {
    console.error('CRITICAL Scan Route Error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }

    return NextResponse.json({
      error: 'Unable to track this scan. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}