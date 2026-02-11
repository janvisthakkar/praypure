import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb-adapter';
import User from '@/models/User';
import dbConnect from '@/lib/mongodb';

export const authOptions: NextAuthOptions = {
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            allowDangerousEmailAccountLinking: true
        }),
    ],
    pages: {
        signIn: '/login',
        error: '/login',
    },
    session: {
        strategy: 'jwt', // Faster and compatible with default middleware
    },
    callbacks: {
        async signIn({ user }) {
            try {
                await dbConnect();

                // Strict Login: check if user exists in our User collection
                const existingUser = await User.findOne({ email: user.email });
                if (existingUser) return true;

                // Bootstrap: allow if no users exist
                const userCount = await User.countDocuments();
                if (userCount === 0) return true;

                return false;
            } catch (error) {
                console.error("SignIn Error:", error);
                return false;
            }
        },
        async jwt({ token, user, trigger, session }) {
            if (user) {
                // Initial sign in: get user from DB to ensure correct role/ID
                await dbConnect();
                const dbUser = await User.findOne({ email: user.email });
                if (dbUser) {
                    token.role = dbUser.role || 'VIEWER';
                    token.id = dbUser._id.toString();
                    token.name = dbUser.name;
                    token.picture = dbUser.image;
                }
            }

            if (trigger === "update" && (session?.name || session?.image)) {
                // Handle client-side update() call
                token.name = session.name || token.name;
                token.picture = session.image || token.picture;
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role as string;
                (session.user as any).id = token.id as string;
                session.user.name = token.name as string;
                session.user.image = token.picture as string;
            }
            return session;
        },
    },
    events: {
        async createUser({ user }) {
            try {
                await dbConnect();
                const userCount = await User.countDocuments();
                // If this is the only user, make them ADMIN
                if (userCount <= 1) {
                    await User.findByIdAndUpdate(user.id, { role: 'ADMIN' });
                }
            } catch (err) {
                console.error("Error in createUser event:", err);
            }
        }
    },
    theme: {
        colorScheme: 'dark',
    },
};
