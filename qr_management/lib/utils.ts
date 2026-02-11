export const getTrackingUrl = (id: string) => {
    if (!id) return '';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
    // Clean base URL and ensure no trailing slashes
    const cleanBase = baseUrl.replace(/\/+$/, '');
    return `${cleanBase}/scan/${id}`;
};
