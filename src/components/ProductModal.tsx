import { useState } from 'react';
import { X, MessageCircle, Check, Copy, Tag } from 'lucide-react';
import { Product } from '../data/products';
import { useStore } from '../context/StoreContext';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToInquiry: (product: Product, selectedColor: string) => void;
  isInInquiry: boolean;
}

export default function ProductModal({
  product,
  onClose,
  onAddToInquiry,
  isInInquiry
}: ProductModalProps) {
  if (!product) return null;

  const { settings } = useStore();
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || '');
  const [selectedSize, setSelectedSize] = useState<string>('38');
  const [copied, setCopied] = useState(false);

  const availableSizes = ['36', '37', '38', '39', '40', '41'];
  const hasPrice = typeof product.price === 'number' && product.price > 0;
  const hasSizes = Boolean(product.sizes && product.sizes.trim() !== '');

  const handleWhatsAppOrder = () => {
    const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const details: string[] = [];
    if (product.name) details.push(`- الموديل: ${product.name}`);
    if (product.ref) details.push(`- المرجع (Ref): ${product.ref}`);
    if (selectedColor) details.push(`- اللون المختار: ${selectedColor}`);
    if (hasSizes && product.category !== 'bags') details.push(`- المقاس (Pointure): ${selectedSize}`);
    if (hasPrice) details.push(`- الثمن: ${product.price} درهم`);

    const detailsBlock = details.length > 0 ? `\n${details.join('\n')}\n` : '\n';
    const message = `السلام عليكم ورحمة الله،
أنا مهتم بهذا الموديل من متجركم ${settings.nameAr} (${settings.nameEn}):${detailsBlock}واش هاد الموديل متوفر عندكم في المحل؟ شكراً!`;

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleCopyDetails = () => {
    const parts: string[] = [];
    if (product.name) parts.push(product.name);
    if (product.ref) parts.push(`(Réf: ${product.ref})`);
    if (hasPrice) parts.push(`${product.price} DH`);
    parts.push(`متجر ${settings.nameAr} الدار البيضاء`);
    const text = parts.join(' - ');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-stone-200 relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur hover:bg-stone-100 text-stone-700 flex items-center justify-center shadow-md transition-colors"
          aria-label="إغلاق النافذة"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Image Stage */}
          <div className="relative bg-stone-100 aspect-square md:aspect-auto md:h-full flex items-center justify-center overflow-hidden">
            <img
              src={product.image}
              alt={product.name || settings.nameAr}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {product.badge && (
              <div className="absolute top-4 right-4 bg-stone-900/90 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm">
                {product.badge}
              </div>
            )}
            {product.ref && (
              <div className="absolute bottom-4 right-4 bg-white/95 text-stone-900 font-mono font-bold text-xs px-2.5 py-1 rounded shadow-sm border border-stone-200 dir-ltr">
                {product.ref}
              </div>
            )}
          </div>

          {/* Details Content */}
          <div className="p-6 sm:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div>
              {/* Category & Ref Header */}
              {(product.brand || product.categoryLabel || product.ref) && (
                <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                  <span className="font-semibold text-amber-800">
                    {product.brand || product.categoryLabel}
                  </span>
                  {product.ref && (
                    <span className="font-mono bg-stone-100 px-2 py-0.5 rounded dir-ltr text-stone-700 font-medium">
                      Réf: {product.ref}
                    </span>
                  )}
                </div>
              )}

              {/* Title */}
              {product.name && (
                <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mb-1 leading-snug">
                  {product.name}
                </h2>
              )}
              {product.frenchName && (
                <p className="text-xs text-stone-500 font-sans-en mb-4">
                  {product.frenchName}
                </p>
              )}

              {/* Price display */}
              {hasPrice && (
                <div className="flex items-baseline gap-2 mb-5 p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80">
                  <span className="text-xs text-stone-500 font-medium">الثمن:</span>
                  <div className="text-2xl sm:text-3xl font-bold text-stone-900 tabular-nums">
                    {product.price}{' '}
                    <span className="text-xs font-normal text-stone-600">درهم</span>
                  </div>
                </div>
              )}

              {/* Colors Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-5">
                  <div className="flex items-center justify-between text-xs font-semibold text-stone-800 mb-2">
                    <span>اختيار اللون:</span>
                    <span className="text-amber-800">{selectedColor}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((c, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedColor(c.name)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                          selectedColor === c.name
                            ? 'border-amber-600 bg-amber-50 text-amber-900 ring-1 ring-amber-600'
                            : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-stone-300 shrink-0"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span>{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes Selection (if footwear and sizes specified) */}
              {hasSizes && product.category !== 'bags' && (
                <div className="mb-5">
                  <div className="flex items-center justify-between text-xs font-semibold text-stone-800 mb-2">
                    <span>المقاس (Pointure):</span>
                    <span className="font-mono text-stone-600">{selectedSize}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`w-10 h-10 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center border ${
                          selectedSize === sz
                            ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {product.description && (
                <div className="mb-5 text-xs text-stone-600 leading-relaxed bg-stone-50 p-3.5 rounded-xl border border-stone-200/60">
                  <p>{product.description}</p>
                </div>
              )}
            </div>

            {/* CTAs */}
            <div className="space-y-3 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={handleWhatsAppOrder}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-colors shadow-md shadow-emerald-600/20"
              >
                <MessageCircle className="w-5 h-5" />
                <span>طلب عبر واتساب</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onAddToInquiry(product, selectedColor)}
                  className={`inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-colors ${
                    isInInquiry
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200'
                  }`}
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>{isInInquiry ? 'محفوظ في القائمة' : 'حفظ بالقائمة'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyDetails}
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>تم النسخ!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>نسخ المعلومات</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
