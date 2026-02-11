'use client';

import { useState, useEffect, Suspense } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { FiAlertTriangle } from 'react-icons/fi';
import IncenseLoader from '@/app/components/IncenseLoader';

function LoginContent() {
    const [loading, setLoading] = useState(false);
    const { status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    useEffect(() => {
        if (status === 'authenticated' && !error) {
            router.push('/');
        }
    }, [status, router, error]);

    const handleGoogleSignIn = async () => {
        setLoading(true);
        await signIn('google', { callbackUrl: '/' });
    };

    if ((status === 'loading' || status === 'authenticated') && !error) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <IncenseLoader />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#D4AF37] blur-[150px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#3E2723] blur-[100px]"></div>
            </div>

            <div className="w-full max-w-md z-10">
                <div className="bg-white/5 backdrop-blur-lg border border-[#D4AF37]/30 p-8 rounded-2xl shadow-2xl">
                    <div className="text-center mb-8 flex flex-col items-center">
                        <img src="/logo.png" alt="PrayPure Logo" className="h-16 w-auto object-contain mb-4" />
                        <p className="text-gray-300 text-sm tracking-widest uppercase">Pure QR Solutions</p>
                    </div>

                    <div className="space-y-6">
                        {error && (
                            <div className="bg-red-900/20 border border-red-900/50 p-4 rounded-lg flex items-start space-x-3">
                                <FiAlertTriangle className="text-red-500 w-5 h-5 flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-red-200">
                                    <span className="font-semibold block mb-1">Authentication Error</span>
                                    {error === 'Configuration' ? (
                                        <span>Missing Google OAuth Credentials. Please check server logs and env variables.</span>
                                    ) : (
                                        <span>{error}</span>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="text-center">
                            <h2 className="text-xl font-medium text-white mb-2">Welcome Back</h2>
                            <p className="text-gray-400 text-sm">Sign in to manage your QR codes</p>
                        </div>

                        <button
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                            className="w-full bg-white hover:bg-gray-50 text-gray-900 font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-3 transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <FcGoogle className="w-6 h-6" />
                            )}
                            <span>Sign in with Google</span>
                        </button>

                        <div className="mt-6 text-center text-xs text-gray-500">
                            <p>By continuing, you verify that you are an authorized user.</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-[#D4AF37]/60 text-xs tracking-wider">QR CODE SOLUTION</p>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
                <IncenseLoader />
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
