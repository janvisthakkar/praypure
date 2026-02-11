import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function PATCH(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { name, image } = body;

        await dbConnect();

        const updatedUser = await User.findOneAndUpdate(
            { email: session.user.email },
            {
                $set: {
                    ...(name && { name }),
                    ...(image && { image })
                }
            },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            user: {
                name: updatedUser.name,
                image: updatedUser.image,
                email: updatedUser.email
            }
        });
    } catch (error) {
        console.error('Profile Update Error:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
