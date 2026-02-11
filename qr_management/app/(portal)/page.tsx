'use client';

import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  FiLink,
  FiAlertCircle,
  FiHelpCircle,
  FiType,
  FiMail,
  FiPhone,
  FiGlobe,
  FiAlignLeft,
  FiSave
} from 'react-icons/fi';
import { BsQrCode } from 'react-icons/bs';
import { QRCodeCreateSchema } from '@/schemas/qrcode';
import QRCode from 'qrcode';
import { getTrackingUrl } from '@/lib/utils';
import IncenseLoader from '@/app/components/IncenseLoader';
import Modal from '@/app/components/Modal';

type QRCodeCreateInput = z.infer<typeof QRCodeCreateSchema>;

export default function GeneratorPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isViewer = session?.user?.role === 'VIEWER';

  const [formData, setFormData] = useState<QRCodeCreateInput>({
    name: '',
    content: '',
    type: 'url'
  });

  const [errors, setErrors] = useState<Partial<Record<keyof QRCodeCreateInput, string>>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Modal state
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'success'
  });

  const handleChange = (field: keyof QRCodeCreateInput, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);

    try {
      QRCodeCreateSchema.parse(newData);
      setErrors({});
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof QRCodeCreateInput, string>> = {};
        err.issues.forEach(issue => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0] as keyof QRCodeCreateInput] = issue.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
  };

  useEffect(() => {
    const generateQR = async () => {
      if (formData.content && Object.keys(errors).length === 0) {
        try {
          const previewTrackingUrl = getTrackingUrl('PREVIEW_ID');
          const url = await QRCode.toDataURL(previewTrackingUrl, {
            width: 300,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#ffffff',
            },
          });
          setQrDataUrl(url);
        } catch {
        }
      } else {
        setQrDataUrl('');
      }
    };
    generateQR();
  }, [formData.content, errors]);

  const handleSave = async () => {
    try {
      QRCodeCreateSchema.parse(formData);
      setIsSaving(true);

      let finalContent = formData.content;
      if (formData.type === 'phone' && !finalContent.toLowerCase().startsWith('tel://')) {
        finalContent = `tel:${finalContent}`;
      } else if (formData.type === 'email' && !finalContent.toLowerCase().startsWith('mail://')) {
        finalContent = `mailto:${finalContent}`;
      }

      const response = await fetch('/api/qrcodes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          content: finalContent
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create QR code');
      }

      router.push('/manage');
    } catch (err) {
      if (!(err instanceof z.ZodError)) {
        setModalConfig({
          isOpen: true,
          title: 'Operation Failed',
          message: 'We could not save your QR code. Please check your connection and try again.',
          type: 'error'
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const types = [
    { id: 'url', label: 'URL', icon: <FiGlobe /> },
    { id: 'text', label: 'Text', icon: <FiAlignLeft /> },
    { id: 'email', label: 'Email', icon: <FiMail /> },
    { id: 'phone', label: 'Phone', icon: <FiPhone /> },
  ] as const;

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <IncenseLoader />
      </div>
    );
  }

  if (isViewer) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="w-16 h-16 rounded-full bg-red-900/10 flex items-center justify-center mb-6 border border-red-900/20">
          <FiAlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
        <p className="text-gray-400 mb-8 max-w-md">
          You do not have permission to create QR codes. Please contact your administrator to upgrade your role.
        </p>
        <button
          onClick={() => router.push('/manage')}
          className="px-6 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#b5952f] font-bold transition-all shadow-lg hover:shadow-[#D4AF37]/20 active:scale-95 cursor-pointer"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Generate PrayPure QR</h2>
        <p className="text-gray-400 mt-1">Transform your spiritual presence with high-purity, trackable QR connections.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#121212] p-6 rounded-xl shadow-sm border border-[#333]">
            <label htmlFor="qr-name" className="block text-sm font-semibold text-gray-300 mb-2 flex items-center">
              <FiType className="mr-2" /> Name
            </label>
            <div className="relative">
              <input
                type="text"
                id="qr-name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`w-full px-4 py-3 bg-[#1a1a1a] border rounded-lg focus:ring-1 focus:ring-offset-0 outline-none transition-all text-white placeholder-gray-600 ${errors.name
                  ? 'border-red-900 focus:border-red-500'
                  : 'border-[#333] focus:border-[#D4AF37] focus:ring-[#D4AF37]'
                  }`}
                placeholder="e.g. Marketing Campaign 2024"
              />
              {errors.name && (
                <div className="absolute right-3 top-3.5 text-red-500">
                  <FiAlertCircle />
                </div>
              )}
            </div>
            {errors.name && <p className="mt-2 text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="bg-[#121212] p-6 rounded-xl shadow-sm border border-[#333]">
            <label className="block text-sm font-semibold text-gray-300 mb-4">QR Code Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {types.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleChange('type', t.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all cursor-pointer ${formData.type === t.id
                    ? 'bg-[#D4AF37]/10 border-[#D4AF37] text-[#D4AF37]'
                    : 'border-[#333] hover:bg-[#1a1a1a] text-gray-500'
                    }`}
                >
                  <span className="mb-2 text-lg">{t.icon}</span>
                  <span className="text-xs font-medium">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#121212] p-6 rounded-xl shadow-sm border border-[#333]">
            <label htmlFor="qr-content" className="block text-sm font-semibold text-gray-300 mb-2 flex items-center">
              <FiLink className="mr-2" /> Content
            </label>
            <div className="relative">
              <input
                type="text"
                id="qr-content"
                value={formData.content}
                onChange={(e) => handleChange('content', e.target.value)}
                className={`w-full px-4 py-3 bg-[#1a1a1a] border rounded-lg focus:ring-1 focus:ring-offset-0 outline-none transition-all text-white placeholder-gray-600 ${errors.content
                  ? 'border-red-900 focus:border-red-500'
                  : 'border-[#333] focus:border-[#D4AF37] focus:ring-[#D4AF37]'
                  }`}
                placeholder={formData.type === 'email' ? 'mailto:example@domain.com' : 'Enter content here...'}
              />
              {errors.content && (
                <div className="absolute right-3 top-3.5 text-red-500">
                  <FiAlertCircle />
                </div>
              )}
            </div>
            {errors.content && <p className="mt-2 text-sm text-red-500">{errors.content}</p>}
          </div>

          <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-xl p-6">
            <h3 className="text-[#D4AF37] font-semibold mb-2 flex items-center">
              <FiHelpCircle className="mr-2" /> Pro Tip
            </h3>
            <p className="text-[#a18a3a] text-sm">
              Make sure your URL is correct. Short URLs are recommended for cleaner QR codes that are easier to scan.
            </p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-[#121212] p-6 rounded-xl shadow-sm border border-[#333] flex flex-col items-center sticky top-24">
            <h3 className="text-gray-500 font-medium text-sm mb-4 uppercase tracking-wider">Preview</h3>
            <div className="bg-white p-4 rounded-xl border-2 border-dashed border-[#333] mb-6">
              {qrDataUrl && Object.keys(errors).length === 0 ? (
                <img
                  src={qrDataUrl}
                  alt="QR Code"
                  className="w-48 h-48 object-contain rounded-lg"
                  loading="lazy"
                />
              ) : (
                <div className="w-48 h-48 flex flex-col items-center justify-center text-gray-300 bg-gray-50 rounded-lg">
                  <BsQrCode className="w-12 h-12 mb-2 opacity-20" />
                  <span className="text-xs">No Data</span>
                </div>
              )}
            </div>

            {formData.content && Object.keys(errors).length === 0 && (
              <div className="mb-6 text-center animate-fade-in">
                <span className="inline-flex items-center px-2 py-1 rounded bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider border border-[#D4AF37]/20">
                  Dynamic Trackable Link
                </span>
                <p className="text-[9px] text-gray-500 mt-2 max-w-[180px] leading-relaxed">
                  Final QR will redirect through our tracking system for analytics.
                </p>
              </div>
            )}

            <button
              disabled={Object.keys(errors).length > 0 || !formData.content || isSaving}
              onClick={handleSave}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-[#D4AF37] text-black rounded-lg hover:bg-[#b5952f] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-[#D4AF37]/20 font-bold cursor-pointer"
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FiSave className="w-5 h-5" />
                  <span>Save & Create</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
      />
    </div>
  );
}