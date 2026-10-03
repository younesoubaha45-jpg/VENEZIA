import { useState } from 'react';
import { Eye, MessageCircle, Plus, Check, Edit, Trash2 } from 'lucide-react';
import { Product } from '../data/products';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
  onOpenModal: (product: Product) => void;
  onAddToInquiry: (product: Product, selectedColor: string) => void;
  isInInquiry: boolean;
}

export default function ProductCard({
  product,
  onOpenModal,
  onAddToInquiry,
  isInInquiry
}: ProductCardProps) {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { buttons, settings, isAuthenticated, setIsAdminOpen, deleteProduct } = useStore();

  const selectedColor = product.colors?.[selectedColorIndex] || product.colors?.[0];
  const hasPrice = typeof product.price === 'number' && product.price > 0;

  const handleWhatsAppQuickOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const details: string[] = [];
    if (product.name) details.push(`- الموديل: ${product.name}`);
    if (product.ref) details.push(`- المرجع: ${product.ref}`);
    if (selectedColor?.name) details.push(`- اللون: ${selectedColor.name}`);
    if (hasPrice) details.push(`- الثمن: ${product.price} درهم`);
    const detailsBlock = details.length > 0 ? `\n${details.join('\n')}` : '';
    const message = `السلام عليكم ${settings.nameAr}، عجبني هذا الموديل وبغيت نسولكم واش كاين:${detailsBlock}\nشكراً!`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div
      onClick={() => onOpenModal(product)}
      className="group bg-white rounded-2xl border border-stone-200/90 overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-amber-300/80 cursor-pointer relative"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name || settings.nameAr}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />

        {/* Subtle Badge */}
        {product.badge && (
          <div className="absolute top-3 right-3 bg-stone-900/90 backdrop-blur-sm text-stone-100 text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-sm">
            {product.badge}
          </div>
        )}

        {/* Reference Tag (only if ref exists) */}
        {product.ref && (
          <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm text-stone-800 text-[11px] font-mono font-bold px-2 py-0.5 rounded shadow-sm border border-stone-200/60 dir-ltr">
            {product.ref}
          </div>
        )}

        {/* Quick Edit & Delete Shortcut Buttons (Only visible to authenticated Admin) */}
        {isAuthenticated && (
          <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {confirmDelete ? (
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl shadow-lg border border-rose-300 animate-in fade-in">
                <button
                  type="button"
                  onClick={() => {
                    deleteProduct(product.id);
                    setConfirmDelete(false);
                  }}
                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[11px] font-bold shadow-sm"
                >
                  تأكيد الحذف
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-[11px] font-semibold"
                >
                  إلغاء
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1 opacity-90 hover:opacity-100">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="bg-white/90 hover:bg-rose-50 text-stone-500 hover:text-rose-600 p-1.5 rounded-lg shadow-sm border border-stone-200/80 transition-colors"
                  title="حذف هذا المنتوج"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdminOpen(true)}
                  className="bg-amber-500 hover:bg-amber-400 text-stone-950 p-1.5 rounded-lg shadow-sm transition-colors"
                  title="تعديل في لوحة التحكم"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Hover Quickview Action Bar */}
        {buttons.cardDetailsButtonVisible && (
          <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4 pointer-events-none">
            <span className="bg-white/95 text-stone-900 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md inline-flex items-center gap-1.5 pointer-events-auto">
              <Eye className="w-3.5 h-3.5" />
              <span>{buttons.cardDetailsButtonText}</span>
            </span>
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata: Category & Brand */}
          {(product.brand || product.categoryLabel || product.sizes) && (
            <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1.5">
              {(product.brand || product.categoryLabel) && (
                <span className="font-semibold text-amber-800">{product.brand || product.categoryLabel}</span>
              )}
              {(product.brand || product.categoryLabel) && product.sizes && (
                <span aria-hidden="true">·</span>
              )}
              {product.sizes && (
                <span className="font-mono dir-ltr">{product.sizes}</span>
              )}
            </div>
          )}

          {/* Product Name */}
          {product.name && (
            <h3 className="font-bold text-sm sm:text-base text-stone-900 line-clamp-2 mb-1 group-hover:text-amber-800 transition-colors">
              {product.name}
            </h3>
          )}

          {/* French / Subtitle */}
          {product.frenchName && (
            <p className="text-xs text-stone-500 line-clamp-1 font-sans-en mb-3">
              {product.frenchName}
            </p>
          )}

          {/* Color Swatches */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1.5 mb-4" onClick={(e) => e.stopPropagation()}>
              <span className="text-[11px] text-stone-500 ml-1">الألوان:</span>
              <div className="flex items-center gap-1">
                {product.colors.map((c, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedColorIndex(idx)}
                    title={c.name}
                    className={`w-4 h-4 rounded-full border transition-all ${
                      selectedColorIndex === idx
                        ? 'ring-2 ring-amber-600 ring-offset-1 scale-110 border-white'
                        : 'border-stone-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
              {selectedColor?.name && (
                <span className="text-[11px] text-stone-600 font-medium mr-1">
                  ({selectedColor.name})
                </span>
              )}
            </div>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2 mt-auto">
          <div>
            {hasPrice && (
              <>
                <div className="text-xs text-stone-500">الثمن</div>
                <div className="text-base sm:text-lg font-bold text-stone-900 tabular-nums">
                  {product.price}{' '}
                  <span className="text-xs font-normal text-stone-600">درهم</span>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Add to WhatsApp List */}
            {buttons.cardInquiryButtonVisible && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToInquiry(product, selectedColor?.name || '');
                }}
                className={`p-2 rounded-xl border text-xs font-medium transition-colors ${
                  isInInquiry
                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                }`}
                title={isInInquiry ? 'موجود في قائمة الاستفسار' : 'إضافة لقائمة الواتساب'}
              >
                {isInInquiry ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
              </button>
            )}

            {/* Direct WhatsApp Order */}
            {buttons.cardOrderButtonVisible && (
              <button
                type="button"
                onClick={handleWhatsAppQuickOrder}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
                title="طلب مباشر عبر واتساب"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{buttons.cardOrderButtonText}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
