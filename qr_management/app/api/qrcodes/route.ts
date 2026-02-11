import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import QRCode from '@/models/QRCode';
import { QRCodeCreateSchema, QRCodeUpdateSchema } from '@/schemas/qrcode';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const qrCodes = await QRCode.find({}).sort({ created: -1 });

    // Sanitize data based on user role
    const userRole = session.user?.role || 'VIEWER';

    if (userRole === 'VIEWER' || userRole === 'EDITOR') {
      // Viewers and Editors get analytics data but without sensitive PII
      const sanitized = qrCodes.map(qr => ({
        _id: qr._id,
        name: qr.name,
        content: qr.content,
        type: qr.type,
        status: qr.status,
        created: qr.created,
        // Include scan data for analytics but remove sensitive PII
        scans: qr.scans?.map((scan: any) => ({
          timestamp: scan.timestamp,
          country: scan.country,
          city: scan.city,
          // Exclude: ip, userAgent, latitude, longitude, region
        })) || []
      }));
      return NextResponse.json(sanitized);

    } else {
      // Admins get full data
      return NextResponse.json(qrCodes);
    }
  } catch {
    return NextResponse.json({ error: 'Failed to fetch QR codes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    await dbConnect();
    const body = await request.json();

    const validatedData = QRCodeCreateSchema.parse(body);

    const qrCode = new QRCode({
      ...validatedData
    });

    await qrCode.save();
    return NextResponse.json(qrCode, { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError' && 'errors' in error) {
      const zodError = error as { errors: unknown[] };
      return NextResponse.json({
        error: 'Validation failed',
        details: zodError.errors
      }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create QR code' }, { status: 500 });
  }
}


export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const validatedData = QRCodeUpdateSchema.parse(body);

    // Only update fields that are provided
    const updateData: any = {};
    if (validatedData.name !== undefined) updateData.name = validatedData.name;
    if (validatedData.content !== undefined) updateData.content = validatedData.content;
    if (validatedData.status !== undefined) updateData.status = validatedData.status;

    const updatedQRCode = await QRCode.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedQRCode) {
      return NextResponse.json({ error: 'QR Code not found' }, { status: 404 });
    }

    return NextResponse.json(updatedQRCode);
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError' && 'errors' in error) {
      const zodError = error as { errors: unknown[] };
      return NextResponse.json({
        error: 'Validation failed',
        details: zodError.errors
      }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update QR code' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await QRCode.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete QR code' }, { status: 500 });
  }
}