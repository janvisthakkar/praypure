import IncenseLoader from '@/app/components/IncenseLoader';

export default function Loading() {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center overflow-hidden">
            <div className="flex flex-col items-center scale-110">
                <IncenseLoader />
                <p className="text-[#D4AF37] text-[10px] uppercase tracking-[0.4em] font-bold mt-12 animate-pulse transition-opacity duration-1000 opacity-70">
                    Connecting to Purity
                </p>
            </div>

            {/* Subtle atmospheric glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#D4AF37]/5 blur-[130px] pointer-events-none"></div>
        </div>
    );
}
