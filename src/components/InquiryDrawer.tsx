import { X, Trash2, MessageCircle } from 'lucide-react';
import { Product } from '../data/products';
import { useStore } from '../context/StoreContext';

export interface InquiryItem {
  product: Product;
  selectedColor: string;
  quantity: number;
}

interface InquiryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: InquiryItem[];
  onRemoveItem: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onClear: () => void;
}

export default function InquiryDrawer({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onUpdateQuantity,
  onClear
}: InquiryDrawerProps) {
  const { settings } = useStore();
  if (!isOpen) return null;

  const totalAmount = items.reduce((acc, item) => {
    const p = item.product.price && item.product.price > 0 ? item.product.price : 0;
    return acc + (p * item.quantity);
  }, 0);

  const handleSendWhatsApp = () => {
    const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');
    let message = `السلام عليكم ورحمة الله،\nأنا مهتم بالمنتوجات التالية من متجركم ${settings.nameAr} (${settings.nameEn}):\n\n`;

    items.forEach((item, index) => {
      const lines: string[] = [];
      lines.push(`${index + 1}. ${item.product.name || 'موديل من المعرض'}`);
      if (item.product.ref) lines.push(`   - المرجع: ${item.product.ref}`);
      if (item.selectedColor) lines.push(`   - اللون: ${item.selectedColor}`);
      lines.push(`   - الكمية: ${item.quantity}`);
      if (item.product.price && item.product.price > 0) {
        lines.push(`   - الثمن: ${item.product.price * item.quantity} درهم`);
      }
      message += `${lines.join('\n')}\n\n`;
    });

    if (totalAmount > 0) {
      message += `المجموع الإجمالي التقريبي: ${totalAmount} درهم\n\n`;
    }
    message += `عفاك واش هاد الموديلات متوفرين؟ بغيت نأكد الطلب ومعلومات التواصل. شكراً!`;

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 left-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Drawer Header */}
          <div className="p-4 sm:p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div>
              <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-emerald-600" />
                <span>قائمة المنتوجات</span>
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                {items.length === 0 ? 'القائمة فارغة' : `${items.length} منتوج محدد للإرسال على واتساب`}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-200 rounded-xl transition-colors"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-4">
                  <MessageCircle className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-stone-800 text-base mb-1">
                  لم تختر أي منتوج بعد
                </h3>
                <p className="text-xs text-stone-500 max-w-xs leading-relaxed mb-6">
                  تصفح المنتوجات واضغط على زر (+) لإضافتها إلى القائمة وإرسالها للمحل.
                </p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors"
                >
                  العودة للمنتوجات
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3 bg-stone-50 p-3 rounded-2xl border border-stone-200/80 items-center"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-xl shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-[11px] text-stone-500">
                      <span className="font-mono dir-ltr font-bold text-stone-700">{item.product.ref || ''}</span>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                        title="حذف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {item.product.name && (
                      <h4 className="font-bold text-xs text-stone-900 truncate">
                        {item.product.name}
                      </h4>
                    )}
                    {item.selectedColor && (
                      <div className="text-[11px] text-stone-600 mt-0.5">
                        اللون: <span className="font-medium text-amber-900">{item.selectedColor}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden text-xs">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                          className="px-2 py-0.5 hover:bg-stone-100 text-stone-600 font-bold"
                        >
                          -
                        </button>
                        <span className="px-2 font-mono tabular-nums">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-0.5 hover:bg-stone-100 text-stone-600 font-bold"
                        >
                          +
                        </button>
                      </div>
                      <div className="font-bold text-xs text-stone-900 tabular-nums">
                        {item.product.price && item.product.price > 0 ? (
                          `${item.product.price * item.quantity} درهم`
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-stone-200 bg-stone-50 space-y-3">
              {totalAmount > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-600">المجموع التقريبي:</span>
                  <span className="font-bold text-lg text-stone-900 tabular-nums">
                    {totalAmount} درهم
                  </span>
                </div>
              )}

              <button
                onClick={handleSendWhatsApp}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-colors shadow-md shadow-emerald-600/20"
              >
                <MessageCircle className="w-5 h-5" />
                <span>إرسال القائمة كاملة عبر واتساب</span>
              </button>

              <button
                onClick={onClear}
                className="w-full text-center text-xs text-stone-500 hover:text-stone-800 transition-colors py-1"
              >
                مسح كل العناصر المحددة
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
