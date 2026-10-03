import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { X, Instagram, MessageCircle, ExternalLink } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QrModal({ isOpen, onClose }: QrModalProps) {
  const { settings } = useStore();
  const [instagramQr, setInstagramQr] = useState<string>('');
  const [whatsappQr, setWhatsappQr] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'instagram' | 'whatsapp'>('instagram');

  useEffect(() => {
    if (!isOpen) return;

    QRCode.toDataURL(settings.instagramUrl, {
      width: 360,
      margin: 2,
      color: { dark: '#833AB4', light: '#FFFFFF' }
    }).then(setInstagramQr).catch(console.error);

    const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');
    QRCode.toDataURL(`https://wa.me/${cleanPhone}`, {
      width: 360,
      margin: 2,
      color: { dark: '#075E54', light: '#FFFFFF' }
    }).then(setWhatsappQr).catch(console.error);
  }, [isOpen, settings.instagramUrl, settings.whatsappNumber]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200 relative p-6 sm:p-8 animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
            {settings.nameAr} · {settings.nameEn}
          </div>
          <h3 className="text-xl font-bold text-stone-900">
            مسح الكودبار السريع
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            وجّه كاميرا هاتفك لمسح الرمز أو اضغط على الزر للفتح المباشر
          </p>
        </div>

        {/* Segmented Controls for Tab switching */}
        <div className="flex rounded-xl bg-stone-100 p-1 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('instagram')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'instagram'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Instagram className="w-4 h-4 text-purple-700" />
            <span>إنستغرام (@{settings.instagramHandle})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('whatsapp')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'whatsapp'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>واتساب</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'instagram' ? (
          <div className="flex flex-col items-center text-center">
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 mb-4">
              {instagramQr ? (
                <img
                  src={instagramQr}
                  alt="Instagram QR Code"
                  className="w-56 h-56 object-contain"
                />
              ) : (
                <div className="w-56 h-56 flex items-center justify-center text-xs text-stone-400">
                  جارٍ التحميل...
                </div>
              )}
            </div>
            <p className="text-xs text-stone-600 mb-5">
              متابعة حساب إنستغرام لمشاهدة جميع الستوريات والعروض اليومية الجديدة
            </p>
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:opacity-95 transition-opacity"
            >
              <Instagram className="w-4 h-4" />
              <span>فتح حساب الإنستغرام مباشرة</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 mb-4">
              {whatsappQr ? (
                <img
                  src={whatsappQr}
                  alt="WhatsApp QR Code"
                  className="w-56 h-56 object-contain"
                />
              ) : (
                <div className="w-56 h-56 flex items-center justify-center text-xs text-stone-400">
                  جارٍ التحميل...
                </div>
              )}
            </div>
            <p className="text-xs text-stone-600 mb-5">
              محادثة مباشرة عبر واتساب لتأكيد الطلبيات
            </p>
            <a
              href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>بدء محادثة واتساب الآن</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

      </div>
    </div>
  );
}
