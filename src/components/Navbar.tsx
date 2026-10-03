import { useState } from 'react';
import { MessageCircle, Phone, MapPin, Clock, Instagram, Facebook, QrCode, Sliders, Menu, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface NavbarProps {
  inquiryCount: number;
  onOpenInquiry: () => void;
  onOpenQrModal: () => void;
  onSelectCategory?: (id: string) => void;
}

export default function Navbar({
  inquiryCount,
  onOpenInquiry,
  onOpenQrModal,
  onSelectCategory
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { settings, setIsAdminOpen, isAuthenticated } = useStore();

  const cleanWhatsappNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
  const cleanPhone1 = settings.phone1.replace(/\s+/g, '');
  const cleanPhone2 = settings.phone2.replace(/\s+/g, '');

  const handleCategoryClick = (catId: string) => {
    if (onSelectCategory) {
      onSelectCategory(catId);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      {/* 1. QUIET SLIM TOP BAR (العنوان، أوقات العمل، أرقام الهاتف، الأيقونات الاجتماعية) */}
      <div className="bg-[#1C1917] text-stone-300 text-[11px] sm:text-xs py-1.5 px-4 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-1 gap-x-4">
          
          {/* Address & Hours */}
          <div className="flex items-center gap-4 text-stone-300 font-medium overflow-hidden">
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
              <span className="truncate">{settings.address}</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 text-stone-400">
              <Clock className="w-3 h-3 text-amber-500/80 shrink-0" />
              <span>{settings.hours || 'مفتوح يومياً: 10:00 - 21:00'}</span>
            </div>
          </div>

          {/* Contact Phones & Social Icons Grouped Cleanly */}
          <div className="flex items-center gap-3 mr-auto">
            {/* Direct Phone Link */}
            {settings.phone1 && (
              <div className="flex items-center gap-1.5 text-stone-300">
                <Phone className="w-3 h-3 text-amber-400 shrink-0" />
                <a
                  href={`tel:${cleanPhone1}`}
                  className="font-mono dir-ltr hover:text-white transition-colors"
                  title="الهاتف الثابت"
                >
                  {settings.phone1}
                </a>
              </div>
            )}

            {/* Social Icons Grouped in one clean spot */}
            <div className="flex items-center gap-1.5 border-r border-stone-700 pr-2.5">
              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-5 h-5 flex items-center justify-center rounded-md hover:bg-stone-800 text-stone-400 hover:text-pink-400 transition-colors"
                  title={`إنستغرام: @${settings.instagramHandle}`}
                >
                  <Instagram className="w-3.5 h-3.5" />
                </a>
              )}

              {settings.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-5 h-5 flex items-center justify-center rounded-md hover:bg-stone-800 text-stone-400 hover:text-blue-400 transition-colors"
                  title={`فيسبوك: ${settings.facebookName}`}
                >
                  <Facebook className="w-3.5 h-3.5" />
                </a>
              )}

              <button
                type="button"
                onClick={onOpenQrModal}
                className="w-5 h-5 flex items-center justify-center rounded-md hover:bg-stone-800 text-stone-400 hover:text-amber-400 transition-colors"
                title="كودبار التواصل السريع"
              >
                <QrCode className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* 2. MAIN HEADER BAR (Brand Logo + Primary Action + Categories) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center group">
              <span className="text-xl sm:text-2xl font-black text-stone-900 group-hover:text-amber-900 transition-colors tracking-tight">
                {settings.nameAr}
              </span>
            </a>
          </div>

          {/* Navigation Links for Desktop */}
          <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-stone-600">
            <button
              onClick={() => handleCategoryClick('all')}
              className="hover:text-amber-900 transition-colors py-1"
            >
              الكل
            </button>
            <button
              onClick={() => handleCategoryClick('bags')}
              className="hover:text-amber-900 transition-colors py-1"
            >
              الحقائب
            </button>
            <button
              onClick={() => handleCategoryClick('sneakers')}
              className="hover:text-amber-900 transition-colors py-1"
            >
              سنيكرز ORLANDO
            </button>
            <button
              onClick={() => handleCategoryClick('loafers')}
              className="hover:text-amber-900 transition-colors py-1"
            >
              موكاسان وصابو
            </button>
            <button
              onClick={() => handleCategoryClick('boots')}
              className="hover:text-amber-900 transition-colors py-1"
            >
              أحذية شتوية
            </button>
          </nav>

          {/* Right Action: SINGLE PROMINENT PRIMARY CALL/WHATSAPP BUTTON + Basket */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Inquiry Basket Button (if items present) */}
            {inquiryCount > 0 && (
              <button
                onClick={onOpenInquiry}
                className="relative p-2 text-stone-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors"
                title="سلة الموديلات المختارة"
              >
                <MessageCircle className="w-4 h-4 text-amber-800" />
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-700 text-white text-[10px] font-bold flex items-center justify-center">
                  {inquiryCount}
                </span>
              </button>
            )}

            {/* THE ONE SINGLE PROMINENT ACTION BUTTON */}
            <a
              href={`https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent('السلام عليكم، بغيت نستفسر على معروضات ' + settings.nameAr)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm shadow-emerald-700/20 transition-all hover:shadow hover:scale-[1.02]"
              title="تواصل مباشر عبر واتساب"
            >
              <MessageCircle className="w-4 h-4 fill-white shrink-0" />
              <span>تواصل عبر واتساب</span>
            </a>

            {/* Admin Access Icon */}
            <button
              onClick={() => setIsAdminOpen(true)}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 transition-colors"
              title="لوحة التحكم"
            >
              <Sliders className="w-4 h-4" />
              {isAuthenticated && (
                <span className="sr-only">مدير مسجل</span>
              )}
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-600 hover:text-stone-900 rounded-xl hover:bg-stone-100 transition-colors"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 py-3 space-y-1">
          <div className="text-[11px] font-bold text-stone-400 px-3 py-1">الأقسام</div>
          <button
            onClick={() => handleCategoryClick('all')}
            className="w-full text-right px-3 py-2 text-xs font-semibold text-stone-800 hover:bg-stone-50 rounded-lg"
          >
            جميع المعروضات
          </button>
          <button
            onClick={() => handleCategoryClick('bags')}
            className="w-full text-right px-3 py-2 text-xs font-semibold text-stone-800 hover:bg-stone-50 rounded-lg"
          >
            الحقائب النسائية
          </button>
          <button
            onClick={() => handleCategoryClick('sneakers')}
            className="w-full text-right px-3 py-2 text-xs font-semibold text-stone-800 hover:bg-stone-50 rounded-lg"
          >
            سنيكرز ORLANDO
          </button>
          <button
            onClick={() => handleCategoryClick('loafers')}
            className="w-full text-right px-3 py-2 text-xs font-semibold text-stone-800 hover:bg-stone-50 rounded-lg"
          >
            موكاسان وصابو
          </button>
          <button
            onClick={() => handleCategoryClick('boots')}
            className="w-full text-right px-3 py-2 text-xs font-semibold text-stone-800 hover:bg-stone-50 rounded-lg"
          >
            أحذية شتوية وبوت
          </button>
        </div>
      )}
    </header>
  );
}
