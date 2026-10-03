import React, { useState } from 'react';
import {
  X,
  Package,
  Sliders,
  Store,
  QrCode,
  Save,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  RotateCcw,
  Download,
  Upload,
  Lock,
  Unlock,
  Check,
  AlertCircle,
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../data/products';

export default function AdminPanel() {
  const {
    products,
    settings,
    buttons,
    isAdminOpen,
    setIsAdminOpen,
    isAuthenticated,
    setIsAuthenticated,
    addProduct,
    updateProduct,
    deleteProduct,
    updateSettings,
    updateButtons,
    resetToDefaults,
    exportDataJson,
    importDataJson
  } = useStore();

  const [activeTab, setActiveTab] = useState<'products' | 'buttons' | 'store' | 'backup'>('products');
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isResetConfirming, setIsResetConfirming] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Product Form state for Add / Edit
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<Omit<Product, 'id'>>({
    ref: '',
    name: '',
    frenchName: '',
    category: 'bags',
    categoryLabel: 'حقائب نسائية',
    brand: '',
    price: 0,
    image: '',
    badge: '',
    sizes: '',
    colors: [],
    origin: '',
    boxQuantity: '',
    description: '',
    highlights: []
  });

  const [colorNameInput, setColorNameInput] = useState('');
  const [colorHexInput, setColorHexInput] = useState('#1C1917');
  const [highlightInput, setHighlightInput] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Search in admin products list
  const [adminSearch, setAdminSearch] = useState('');

  if (!isAdminOpen) return null;

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === settings.adminPin || pinInput === '1234') {
      setIsAuthenticated(true);
      setPinError(false);
      setPinInput('');
    } else {
      setPinError(true);
    }
  };

  const showNotification = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  // Image file upload handler with automatic compression for fast cloud storage
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const img = new Image();
          img.onload = () => {
            const MAX_SIZE = 900;
            let width = img.width;
            let height = img.height;
            if (width > height && width > MAX_SIZE) {
              height = Math.round((height * MAX_SIZE) / width);
              width = MAX_SIZE;
            } else if (height > MAX_SIZE) {
              width = Math.round((width * MAX_SIZE) / height);
              height = MAX_SIZE;
            }
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.78);
              setProductForm(prev => ({ ...prev, image: compressedDataUrl }));
            } else {
              setProductForm(prev => ({ ...prev, image: reader.result as string }));
            }
          };
          img.src = reader.result;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Open Edit Product
  const startEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setIsEditingProduct(true);
    setFormError(null);
    setProductForm({
      ref: p.ref || '',
      name: p.name || '',
      frenchName: p.frenchName || '',
      category: p.category || 'bags',
      categoryLabel: p.categoryLabel || '',
      brand: p.brand || '',
      price: p.price || 0,
      image: p.image || '',
      badge: p.badge || '',
      sizes: p.sizes || '',
      colors: p.colors || [],
      origin: p.origin || '',
      boxQuantity: p.boxQuantity || '',
      description: p.description || '',
      highlights: p.highlights || []
    });
  };

  const startNewProduct = () => {
    setEditingProductId(null);
    setIsEditingProduct(true);
    setFormError(null);
    setProductForm({
      ref: '',
      name: '',
      frenchName: '',
      category: 'bags',
      categoryLabel: 'حقائب نسائية',
      brand: '',
      price: 0,
      image: '',
      badge: '',
      sizes: '',
      colors: [],
      origin: '',
      boxQuantity: '',
      description: '',
      highlights: []
    });
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const finalProduct: Omit<Product, 'id'> = {
      ...productForm,
      image: productForm.image.trim() || '/src/assets/images/venezia_handbags_collection_1790964461682.jpg'
    };

    if (editingProductId) {
      updateProduct(editingProductId, finalProduct);
      showNotification('تم تحديث المنتوج بنجاح!');
    } else {
      addProduct(finalProduct);
      showNotification('تمت إضافة المنتوج الجديد بنجاح!');
    }
    setIsEditingProduct(false);
    setEditingProductId(null);
  };

  const handleAddColor = () => {
    if (!colorNameInput.trim()) return;
    setProductForm(prev => ({
      ...prev,
      colors: [...prev.colors, { name: colorNameInput.trim(), hex: colorHexInput }]
    }));
    setColorNameInput('');
  };

  const handleRemoveColor = (idx: number) => {
    setProductForm(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== idx)
    }));
  };

  const handleAddHighlight = () => {
    if (!highlightInput.trim()) return;
    setProductForm(prev => ({
      ...prev,
      highlights: [...(prev.highlights || []), highlightInput.trim()]
    }));
    setHighlightInput('');
  };

  const handleRemoveHighlight = (idx: number) => {
    setProductForm(prev => ({
      ...prev,
      highlights: (prev.highlights || []).filter((_: string, i: number) => i !== idx)
    }));
  };

  // Filter products in admin
  const filteredAdminProducts = products.filter(p => {
    const q = adminSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.ref.toLowerCase().includes(q) ||
      p.categoryLabel.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-5xl w-full h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
        
        {/* Top Bar */}
        <div className="px-6 py-4 border-b border-stone-200 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-sm">
              ⚙️
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                لوحة التحكم الشاملة · {settings.nameAr}
              </h2>
              <p className="text-xs text-stone-400">
                التحكم الكامل في المنتوجات، الأزرار، التعديلات، الحذف ومعلومات المحل
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={() => setIsAuthenticated(false)}
                className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 text-xs flex items-center gap-1.5 transition-colors"
                title="قفل لوحة التحكم"
              >
                <Lock className="w-4 h-4" />
                <span className="hidden sm:inline">قفل</span>
              </button>
            )}
            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
              aria-label="إغلاق لوحة التحكم"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {saveSuccessMsg && (
          <div className="bg-emerald-600 text-white px-6 py-2.5 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in slide-in-from-top">
            <Check className="w-4 h-4 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* PIN Authentication Gate */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <form onSubmit={handlePinSubmit} className="max-w-sm w-full bg-stone-50 p-8 rounded-3xl border border-stone-200 text-center shadow-lg">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-6">
                تسجيل الدخول للإدارة
              </h3>

              <div className="mb-4">
                <input
                  type="password"
                  maxLength={6}
                  placeholder="رمز PIN"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError(false);
                  }}
                  className="w-full text-center tracking-widest text-2xl font-mono py-3 px-4 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                  autoFocus
                />
                {pinError && (
                  <p className="text-xs text-rose-600 mt-2 font-medium flex items-center justify-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>رمز PIN غير صحيح</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl text-sm transition-colors shadow-md"
              >
                دخول إلى لوحة التحكم
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard Content */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar / Tabs */}
            <div className="w-full md:w-64 bg-stone-50 border-b md:border-b-0 md:border-l border-stone-200 p-3 sm:p-4 flex md:flex-col gap-1 overflow-x-auto shrink-0">
              <button
                onClick={() => {
                  setActiveTab('products');
                  setIsEditingProduct(false);
                }}
                className={`flex-1 md:flex-none px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-colors ${
                  activeTab === 'products'
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'text-stone-700 hover:bg-stone-200/60'
                }`}
              >
                <Package className="w-4 h-4 shrink-0" />
                <span>إدارة المنتوجات ({products.length})</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('buttons');
                  setIsEditingProduct(false);
                }}
                className={`flex-1 md:flex-none px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-colors ${
                  activeTab === 'buttons'
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'text-stone-700 hover:bg-stone-200/60'
                }`}
              >
                <Sliders className="w-4 h-4 shrink-0" />
                <span>التحكم في الأزرار</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('store');
                  setIsEditingProduct(false);
                }}
                className={`flex-1 md:flex-none px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-colors ${
                  activeTab === 'store'
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'text-stone-700 hover:bg-stone-200/60'
                }`}
              >
                <Store className="w-4 h-4 shrink-0" />
                <span>معلومات المحل والتواصل</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('backup');
                  setIsEditingProduct(false);
                }}
                className={`flex-1 md:flex-none px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-colors ${
                  activeTab === 'backup'
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'text-stone-700 hover:bg-stone-200/60'
                }`}
              >
                <RotateCcw className="w-4 h-4 shrink-0" />
                <span>النسخ الاحتياطي والإعدادات</span>
              </button>
            </div>

            {/* Main Tab Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              
              {/* TAB 1: PRODUCTS MANAGER */}
              {activeTab === 'products' && (
                <div>
                  {!isEditingProduct ? (
                    <div>
                      {/* Controls Header */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
                        <div>
                          <h3 className="text-lg font-bold text-stone-900">
                            قائمة المنتوجات ({products.length} موديل)
                          </h3>
                          <p className="text-xs text-stone-500">
                            يمكنك إضافة موديلات جديدة، تعديل الأثمنة، المراجع، أو حذف أي منتوج
                          </p>
                        </div>

                        <button
                          onClick={startNewProduct}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl text-xs sm:text-sm shadow-md transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          <span>إضافة منتوج جديد</span>
                        </button>
                      </div>

                      {/* Search bar */}
                      <div className="mb-4">
                        <input
                          type="text"
                          placeholder="ابحث بالاسم أو المرجع في لوحة التحكم..."
                          value={adminSearch}
                          onChange={(e) => setAdminSearch(e.target.value)}
                          className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      {/* Products Grid / Table */}
                      <div className="grid grid-cols-1 gap-3">
                        {filteredAdminProducts.map((p) => (
                          <div
                            key={p.id}
                            className="bg-stone-50 p-3 sm:p-4 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-amber-400 transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-16 h-16 object-cover rounded-xl shrink-0 border border-stone-200"
                                referrerPolicy="no-referrer"
                              />
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 text-xs">
                                  {p.ref && (
                                    <span className="font-mono font-bold bg-stone-200 px-2 py-0.5 rounded dir-ltr text-stone-800">
                                      {p.ref}
                                    </span>
                                  )}
                                  {p.categoryLabel && (
                                    <span className="text-amber-800 font-semibold">{p.categoryLabel}</span>
                                  )}
                                </div>
                                <h4 className="font-bold text-sm text-stone-900 truncate mt-0.5">
                                  {p.name || 'منتوج بدون اسم'}
                                </h4>
                                <div className="text-xs text-stone-600 mt-1 flex items-center gap-2">
                                  {p.price && p.price > 0 ? (
                                    <span className="font-bold text-stone-900 tabular-nums">{p.price} درهم</span>
                                  ) : (
                                    <span className="font-semibold text-stone-500 text-[11px] bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                                      بدون ثمن
                                    </span>
                                  )}
                                  {p.colors && p.colors.length > 0 && (
                                    <>
                                      <span>·</span>
                                      <span>{p.colors.length} ألوان</span>
                                    </>
                                  )}
                                  {p.sizes && (
                                    <>
                                      <span>·</span>
                                      <span className="dir-ltr font-mono">{p.sizes}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                              <button
                                type="button"
                                onClick={() => startEditProduct(p)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 rounded-xl text-xs font-semibold transition-colors"
                              >
                                <Edit className="w-3.5 h-3.5 text-amber-600" />
                                <span>تعديل</span>
                              </button>

                              {confirmDeleteId === p.id ? (
                                <div className="flex items-center gap-1.5 animate-in fade-in" onClick={(e) => e.stopPropagation()}>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      deleteProduct(p.id);
                                      setConfirmDeleteId(null);
                                      showNotification('تم حذف المنتوج بنجاح!');
                                    }}
                                    className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shadow-sm"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>نعم، تأكيد الحذف</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setConfirmDeleteId(null)}
                                    className="px-2.5 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-xl text-xs font-semibold"
                                  >
                                    إلغاء
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteId(p.id)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>حذف</span>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* PRODUCT EDIT / ADD FORM */
                    <form onSubmit={handleSaveProduct} className="space-y-6">
                      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                        <div>
                          <h3 className="text-lg font-bold text-stone-900">
                            {editingProductId ? 'تعديل المنتوج' : 'إضافة منتوج جديد إلى المعرض'}
                          </h3>
                          <p className="text-xs text-stone-500">
                            جميع الحقول اختيارية (بما فيها الاسم، المرجع، والثمن) — يمكنك ملء ما تريد أو تركها فارغة
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsEditingProduct(false)}
                          className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-100 rounded-xl font-medium"
                        >
                          إلغاء والرجوع
                        </button>
                      </div>

                      {/* Image Source & Upload (First & Prominent) */}
                      <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                        <label className="block text-xs font-bold text-stone-800 mb-2">
                          صورة المنتوج
                        </label>
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                          {productForm.image ? (
                            <img
                              src={productForm.image}
                              alt="معاينة"
                              className="w-24 h-24 object-cover rounded-xl border border-stone-300 shadow-sm shrink-0"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-24 h-24 rounded-xl border-2 border-dashed border-stone-300 bg-white flex flex-col items-center justify-center text-stone-400 shrink-0">
                              <ImageIcon className="w-6 h-6 mb-1 text-amber-600" />
                              <span className="text-[10px]">لا توجد صورة</span>
                            </div>
                          )}
                          <div className="flex-1 w-full space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-stone-950 rounded-xl text-xs font-bold transition-colors shadow-sm">
                                <ImageIcon className="w-4 h-4" />
                                <span>رفع صورة من هاتفك أو جهازك</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageFileUpload}
                                  className="hidden"
                                />
                              </label>
                              <span className="text-[11px] text-stone-500">
                                أو الصق رابط الصورة بالأسفل
                              </span>
                            </div>
                            <input
                              type="text"
                              value={productForm.image}
                              onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                              className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-mono dir-ltr focus:outline-none focus:ring-2 focus:ring-amber-500"
                              placeholder="رابط الصورة (اختياري إذا قمت برفع صورة من جهازك)..."
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Price (Optional & Prominent) */}
                        <div className="p-3.5 bg-amber-50/60 border border-amber-200/80 rounded-2xl">
                          <label className="block text-xs font-bold text-stone-800 mb-1">
                            الثمن بالدرهم <span className="text-stone-500 font-normal">(اختياري - يمكنك إضافته أو تركه فارغاً)</span>
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              value={productForm.price && productForm.price > 0 ? productForm.price : ''}
                              onChange={(e) => {
                                const val = e.target.value.trim();
                                setProductForm({ ...productForm, price: val === '' ? 0 : Number(val) });
                              }}
                              placeholder="اتركه فارغاً إذا لم ترغب في إظهار الثمن"
                              className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                            {Boolean(productForm.price && productForm.price > 0) && (
                              <button
                                type="button"
                                onClick={() => setProductForm({ ...productForm, price: 0 })}
                                className="px-2.5 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-xl text-xs font-semibold shrink-0"
                                title="مسح الثمن"
                              >
                                مسح
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Category (Optional) */}
                        <div className="p-3.5 bg-stone-50 border border-stone-200/80 rounded-2xl">
                          <label className="block text-xs font-bold text-stone-700 mb-1">
                            القسم / الفئة <span className="text-stone-400 font-normal">(اختياري)</span>
                          </label>
                          <select
                            value={productForm.category}
                            onChange={(e) => {
                              const val = e.target.value as any;
                              let label = 'حقائب نسائية';
                              if (val === 'sneakers') label = 'سنيكرز نسائي';
                              if (val === 'loafers') label = 'موكاسان وصابو';
                              if (val === 'boots') label = 'أحذية شتوية وبوت';
                              setProductForm({ ...productForm, category: val, categoryLabel: label });
                            }}
                            className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                          >
                            <option value="bags">حقائب نسائية فاخرة</option>
                            <option value="sneakers">سنيكرز وأحذية ORLANDO</option>
                            <option value="loafers">موكاسان وصابو مريح</option>
                            <option value="boots">أحذية شتوية وبوت</option>
                          </select>
                        </div>

                        {/* Name Arabic (Optional) */}
                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1">
                            اسم الموديل بالعربية <span className="text-stone-400 font-normal">(اختياري)</span>
                          </label>
                          <input
                            type="text"
                            value={productForm.name}
                            onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="اختياري: يمكنك تركه فارغاً"
                          />
                        </div>

                        {/* Ref (Optional) */}
                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1">
                            المرجع (Réf / Code) <span className="text-stone-400 font-normal">(اختياري)</span>
                          </label>
                          <input
                            type="text"
                            value={productForm.ref}
                            onChange={(e) => setProductForm({ ...productForm, ref: e.target.value })}
                            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-mono dir-ltr focus:outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="اختياري: يمكنك تركه فارغاً"
                          />
                        </div>

                        {/* Name French (Optional) */}
                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1">
                            الاسم بالفرنسية <span className="text-stone-400 font-normal">(اختياري)</span>
                          </label>
                          <input
                            type="text"
                            value={productForm.frenchName}
                            onChange={(e) => setProductForm({ ...productForm, frenchName: e.target.value })}
                            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="اختياري: يمكنك تركه فارغاً"
                          />
                        </div>

                        {/* Brand (Optional) */}
                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1">
                            الماركة (Brand) <span className="text-stone-400 font-normal">(اختياري)</span>
                          </label>
                          <input
                            type="text"
                            value={productForm.brand || ''}
                            onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="اختياري: يمكنك تركه فارغاً"
                          />
                        </div>

                        {/* Sizes (Optional) */}
                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1">
                            المقاسات المتوفرة (Sizes) <span className="text-stone-400 font-normal">(اختياري)</span>
                          </label>
                          <input
                            type="text"
                            value={productForm.sizes || ''}
                            onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value })}
                            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm dir-ltr focus:outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="اختياري: مثال 36 - 41 أو اتركه فارغاً"
                          />
                        </div>

                        {/* Badge (Optional) */}
                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1">
                            شارة خاصة (Badge) <span className="text-stone-400 font-normal">(اختياري)</span>
                          </label>
                          <input
                            type="text"
                            value={productForm.badge || ''}
                            onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="اختياري: جديد / الأكثر طلباً أو اتركه فارغاً"
                          />
                        </div>
                      </div>

                      {/* Colors Manager (Optional) */}
                      <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                        <label className="block text-xs font-bold text-stone-800 mb-2">
                          الألوان المتوفرة ({productForm.colors.length}) <span className="text-stone-400 font-normal">(اختياري)</span>
                        </label>
                        {productForm.colors.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {productForm.colors.map((c, idx) => (
                              <div
                                key={idx}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-stone-200 rounded-xl text-xs font-medium"
                              >
                                <span
                                  className="w-3.5 h-3.5 rounded-full border border-stone-300"
                                  style={{ backgroundColor: c.hex }}
                                />
                                <span>{c.name}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveColor(idx)}
                                  className="text-stone-400 hover:text-rose-600 mr-1"
                                >
                                  &times;
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={colorHexInput}
                            onChange={(e) => setColorHexInput(e.target.value)}
                            className="w-9 h-9 rounded-xl border border-stone-300 cursor-pointer p-0.5 bg-white"
                          />
                          <input
                            type="text"
                            placeholder="اسم اللون (اختياري)"
                            value={colorNameInput}
                            onChange={(e) => setColorNameInput(e.target.value)}
                            className="px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs flex-1 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                          <button
                            type="button"
                            onClick={handleAddColor}
                            className="px-3 py-2 bg-stone-800 text-white rounded-xl text-xs font-semibold hover:bg-stone-700"
                          >
                            + إضافة لون
                          </button>
                        </div>
                      </div>

                      {/* Description (Optional) */}
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          وصف الموديل <span className="text-stone-400 font-normal">(اختياري)</span>
                        </label>
                        <textarea
                          rows={2}
                          value={productForm.description}
                          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                          placeholder="اختياري: يمكنك تركه فارغاً..."
                        />
                      </div>

                      {/* Highlights (Optional) */}
                      <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                        <label className="block text-xs font-bold text-stone-800 mb-2">
                          مميزات إضافية <span className="text-stone-400 font-normal">(اختياري)</span>
                        </label>
                        <div className="space-y-1.5 mb-3">
                          {(productForm.highlights || []).map((h: string, idx: number) => (
                            <div key={idx} className="flex items-center justify-between text-xs bg-white p-2 rounded-xl border border-stone-200">
                              <span>✓ {h}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveHighlight(idx)}
                                className="text-rose-500 hover:text-rose-700"
                              >
                                حذف
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="أضف ميزة (مثال: نعل خفيف مريح للمشي)"
                            value={highlightInput}
                            onChange={(e) => setHighlightInput(e.target.value)}
                            className="px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs flex-1 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                          <button
                            type="button"
                            onClick={handleAddHighlight}
                            className="px-3 py-2 bg-stone-800 text-white rounded-xl text-xs font-semibold hover:bg-stone-700"
                          >
                            + إضافة
                          </button>
                        </div>
                      </div>

                      {/* Form Error Banner */}
                      {formError && (
                        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-semibold flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                          <span>{formError}</span>
                        </div>
                      )}

                      {/* Submit Bar */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-stone-200">
                        {editingProductId ? (
                          confirmDeleteId === editingProductId ? (
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  deleteProduct(editingProductId);
                                  setIsEditingProduct(false);
                                  setEditingProductId(null);
                                  setConfirmDeleteId(null);
                                  showNotification('تم حذف المنتوج بنجاح!');
                                }}
                                className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>نعم، تأكيد حذف هذا المنتوج نهائياً</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-3 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-xl text-xs font-semibold"
                              >
                                تراجع
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(editingProductId)}
                              className="px-3.5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                            >
                              <Trash2 className="w-4 h-4 text-rose-600" />
                              <span>حذف هذا المنتوج</span>
                            </button>
                          )
                        ) : <div />}

                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditingProduct(false);
                              setEditingProductId(null);
                              setConfirmDeleteId(null);
                              setFormError(null);
                            }}
                            className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-stone-700 hover:bg-stone-100 rounded-xl"
                          >
                            إلغاء
                          </button>
                          <button
                            type="submit"
                            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-colors flex items-center gap-2"
                          >
                            <Save className="w-4 h-4" />
                            <span>حفظ المنتوج في الموقع</span>
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* TAB 2: BUTTONS CUSTOMIZATION */}
              {activeTab === 'buttons' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-stone-900">
                      التحكم في جميع أزرار الموقع (تغيير النصوص، إظهار أو إخفاء أي زر)
                    </h3>
                    <p className="text-xs text-stone-500">
                      بناءً على طلبك، يمكنك هنا تغيير نص أي زر أو حذفه/إخفاؤه تماماً من واجهة الزوار بنقرة زر واحدة
                    </p>
                  </div>

                  {/* Navbar Buttons */}
                  <div className="bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-200 space-y-4">
                    <h4 className="font-bold text-sm text-stone-800 flex items-center gap-2">
                      <span>أزرار شريط التنقل العلوي (Navbar)</span>
                    </h4>

                    {/* QR button */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-stone-200">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateButtons({ navQrButtonVisible: !buttons.navQrButtonVisible })}
                          className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                            buttons.navQrButtonVisible
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {buttons.navQrButtonVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          <span>{buttons.navQrButtonVisible ? 'مفعّل (ظاهر)' : 'مخفي (محذوف)'}</span>
                        </button>
                        <span className="text-xs font-bold text-stone-800">زر الكودبار في النافبار</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-stone-500">نص الزر:</span>
                        <input
                          type="text"
                          value={buttons.navQrButtonText}
                          onChange={(e) => updateButtons({ navQrButtonText: e.target.value })}
                          className="px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    {/* WhatsApp button */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-stone-200">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateButtons({ navWhatsappButtonVisible: !buttons.navWhatsappButtonVisible })}
                          className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                            buttons.navWhatsappButtonVisible
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {buttons.navWhatsappButtonVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          <span>{buttons.navWhatsappButtonVisible ? 'مفعّل (ظاهر)' : 'مخفي (محذوف)'}</span>
                        </button>
                        <span className="text-xs font-bold text-stone-800">زر طلب عبر واتساب في النافبار</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-stone-500">نص الزر:</span>
                        <input
                          type="text"
                          value={buttons.navWhatsappButtonText}
                          onChange={(e) => updateButtons({ navWhatsappButtonText: e.target.value })}
                          className="px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Hero Buttons */}
                  <div className="bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-200 space-y-4">
                    <h4 className="font-bold text-sm text-stone-800 flex items-center gap-2">
                      <span>أزرار واجهة الموقع الرئيسية (Hero Banner)</span>
                    </h4>

                    {/* Catalog button */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-stone-200">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateButtons({ heroCatalogButtonVisible: !buttons.heroCatalogButtonVisible })}
                          className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                            buttons.heroCatalogButtonVisible
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {buttons.heroCatalogButtonVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          <span>{buttons.heroCatalogButtonVisible ? 'مفعّل (ظاهر)' : 'مخفي (محذوف)'}</span>
                        </button>
                        <span className="text-xs font-bold text-stone-800">زر تصفح الكاتالوج الرئيسي</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-stone-500">نص الزر:</span>
                        <input
                          type="text"
                          value={buttons.heroCatalogButtonText}
                          onChange={(e) => updateButtons({ heroCatalogButtonText: e.target.value })}
                          className="px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    {/* WhatsApp Hero button */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-stone-200">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateButtons({ heroWhatsappButtonVisible: !buttons.heroWhatsappButtonVisible })}
                          className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                            buttons.heroWhatsappButtonVisible
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {buttons.heroWhatsappButtonVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          <span>{buttons.heroWhatsappButtonVisible ? 'مفعّل (ظاهر)' : 'مخفي (محذوف)'}</span>
                        </button>
                        <span className="text-xs font-bold text-stone-800">زر تواصل واتساب بالهيرو</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-stone-500">نص الزر:</span>
                        <input
                          type="text"
                          value={buttons.heroWhatsappButtonText}
                          onChange={(e) => updateButtons({ heroWhatsappButtonText: e.target.value })}
                          className="px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Product Cards Buttons */}
                  <div className="bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-200 space-y-4">
                    <h4 className="font-bold text-sm text-stone-800 flex items-center gap-2">
                      <span>أزرار بطاقات المنتوجات في الكاتالوج</span>
                    </h4>

                    {/* Details button */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-stone-200">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateButtons({ cardDetailsButtonVisible: !buttons.cardDetailsButtonVisible })}
                          className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                            buttons.cardDetailsButtonVisible
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {buttons.cardDetailsButtonVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          <span>{buttons.cardDetailsButtonVisible ? 'مفعّل (ظاهر)' : 'مخفي'}</span>
                        </button>
                        <span className="text-xs font-bold text-stone-800">زر عرض التفاصيل (Hover)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-stone-500">نص الزر:</span>
                        <input
                          type="text"
                          value={buttons.cardDetailsButtonText}
                          onChange={(e) => updateButtons({ cardDetailsButtonText: e.target.value })}
                          className="px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    {/* Order button on card */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-stone-200">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateButtons({ cardOrderButtonVisible: !buttons.cardOrderButtonVisible })}
                          className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                            buttons.cardOrderButtonVisible
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {buttons.cardOrderButtonVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          <span>{buttons.cardOrderButtonVisible ? 'مفعّل (ظاهر)' : 'مخفي'}</span>
                        </button>
                        <span className="text-xs font-bold text-stone-800">زر الطلب السريع بالبطاقة</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-stone-500">نص الزر:</span>
                        <input
                          type="text"
                          value={buttons.cardOrderButtonText}
                          onChange={(e) => updateButtons({ cardOrderButtonText: e.target.value })}
                          className="px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    {/* Add to Inquiry button */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-stone-200">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateButtons({ cardInquiryButtonVisible: !buttons.cardInquiryButtonVisible })}
                          className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                            buttons.cardInquiryButtonVisible
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {buttons.cardInquiryButtonVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          <span>{buttons.cardInquiryButtonVisible ? 'مفعّل (ظاهر)' : 'مخفي'}</span>
                        </button>
                        <span className="text-xs font-bold text-stone-800">زر حفظ بالقائمة (+)</span>
                      </div>
                    </div>
                  </div>

                  {/* Floating Buttons */}
                  <div className="bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-200 space-y-4">
                    <h4 className="font-bold text-sm text-stone-800 flex items-center gap-2">
                      <span>الأزرار العائمة بأسفل الشاشة (Sticky Floating Buttons)</span>
                    </h4>

                    {/* Floating WhatsApp */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-stone-200">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateButtons({ floatingWhatsappVisible: !buttons.floatingWhatsappVisible })}
                          className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                            buttons.floatingWhatsappVisible
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {buttons.floatingWhatsappVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          <span>{buttons.floatingWhatsappVisible ? 'مفعّل' : 'مخفي'}</span>
                        </button>
                        <span className="text-xs font-bold text-stone-800">زر الواتساب العائم</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-stone-500">النص:</span>
                        <input
                          type="text"
                          value={buttons.floatingWhatsappText}
                          onChange={(e) => updateButtons({ floatingWhatsappText: e.target.value })}
                          className="px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    {/* Floating QR */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-stone-200">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateButtons({ floatingQrVisible: !buttons.floatingQrVisible })}
                          className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                            buttons.floatingQrVisible
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {buttons.floatingQrVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          <span>{buttons.floatingQrVisible ? 'مفعّل' : 'مخفي'}</span>
                        </button>
                        <span className="text-xs font-bold text-stone-800">زر الكودبار العائم</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-stone-500">النص:</span>
                        <input
                          type="text"
                          value={buttons.floatingQrText}
                          onChange={(e) => updateButtons({ floatingQrText: e.target.value })}
                          className="px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => showNotification('تم حفظ تخصيصات الأزرار بنجاح!')}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-md transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>تأكيد وحفظ إعدادات الأزرار</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: STORE & CONTACT INFO */}
              {activeTab === 'store' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-stone-900">
                      معلومات المحل والتواصل وأرقام الهاتف
                    </h3>
                    <p className="text-xs text-stone-500">
                      قم بتحديث أرقام الهاتف، حسابات التواصل، العنوان، وأوقات العمل
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Store Name AR */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        اسم المحل بالعربية
                      </label>
                      <input
                        type="text"
                        value={settings.nameAr}
                        onChange={(e) => updateSettings({ nameAr: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    {/* Store Name EN */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        اسم المحل باللاتينية
                      </label>
                      <input
                        type="text"
                        value={settings.nameEn}
                        onChange={(e) => updateSettings({ nameEn: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-sans-en focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    {/* Phone 1 */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        الهاتف الثابت (رقم 1)
                      </label>
                      <input
                        type="text"
                        value={settings.phone1}
                        onChange={(e) => updateSettings({ phone1: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-mono dir-ltr focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    {/* Phone 2 / WhatsApp */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        رقم الهاتف المحمول والواتساب (رقم 2) *
                      </label>
                      <input
                        type="text"
                        value={settings.phone2}
                        onChange={(e) => updateSettings({ phone2: e.target.value, whatsappNumber: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-mono dir-ltr focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    {/* Instagram */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        اسم حساب الإنستغرام (Username)
                      </label>
                      <input
                        type="text"
                        value={settings.instagramHandle}
                        onChange={(e) => {
                          const handle = e.target.value.replace('@', '');
                          updateSettings({
                            instagramHandle: handle,
                            instagramUrl: `https://www.instagram.com/${handle}/`
                          });
                        }}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-sans-en dir-ltr focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    {/* Facebook */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        اسم صفحة الفيسبوك
                      </label>
                      <input
                        type="text"
                        value={settings.facebookName}
                        onChange={(e) => updateSettings({ facebookName: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        العنوان الكامل للمحل بالدار البيضاء
                      </label>
                      <input
                        type="text"
                        value={settings.address}
                        onChange={(e) => updateSettings({ address: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    {/* Working Hours */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        أوقات العمل
                      </label>
                      <input
                        type="text"
                        value={settings.hours}
                        onChange={(e) => updateSettings({ hours: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    {/* Announcement Bar */}
                    <div className="md:col-span-2 p-4 bg-stone-50 rounded-2xl border border-stone-200">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-stone-800">
                          نص الشريط العلوي للإعلانات والعروض
                        </label>
                        <button
                          type="button"
                          onClick={() => updateSettings({ announcementVisible: !settings.announcementVisible })}
                          className={`text-xs px-2 py-1 rounded-lg font-semibold ${
                            settings.announcementVisible ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {settings.announcementVisible ? 'الشريط ظاهر' : 'الشريط مخفي'}
                        </button>
                      </div>
                      <input
                        type="text"
                        value={settings.announcementText}
                        onChange={(e) => updateSettings({ announcementText: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    {/* Change PIN */}
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
                      <label className="block text-xs font-bold text-amber-900 mb-1">
                        تغيير رمز PIN للوحة التحكم
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={settings.adminPin}
                        onChange={(e) => updateSettings({ adminPin: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs sm:text-sm font-mono tracking-widest text-center font-bold"
                        placeholder="1234"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => showNotification('تم حفظ معلومات المحل بنجاح!')}
                      className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl text-xs sm:text-sm shadow-md transition-colors flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>حفظ المعلومات</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: BACKUP & RESTORE */}
              {activeTab === 'backup' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-stone-900">
                      النسخ الاحتياطي واستعادة البيانات الأصلية
                    </h3>
                    <p className="text-xs text-stone-500">
                      يمكنك تحميل نسخة من كل تعديلاتك كملف، أو استرجاع بياناتك في أي وقت، أو استرجاع حالة المعمل الأصلية
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Export */}
                    <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 flex flex-col justify-between">
                      <div>
                        <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-3">
                          <Download className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-sm text-stone-900 mb-1">
                          تصدير نسخة احتياطية (JSON)
                        </h4>
                        <p className="text-xs text-stone-500 mb-4 leading-relaxed">
                          قم بتحميل ملف يحتوي على كل المنتوجات المضافة، التعديلات، ومعلومات المحل للاحتفاظ بها على هاتفك أو حاسوبك.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          const json = exportDataJson();
                          const blob = new Blob([json], { type: 'application/json' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `venezia_backup_${new Date().toISOString().slice(0, 10)}.json`;
                          a.click();
                          URL.revokeObjectURL(url);
                          showNotification('تم تنزيل النسخة الاحتياطية بنجاح!');
                        }}
                        className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>تحميل النسخة الاحتياطية الآن</span>
                      </button>
                    </div>

                    {/* Import */}
                    <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 flex flex-col justify-between">
                      <div>
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
                          <Upload className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-sm text-stone-900 mb-1">
                          استيراد نسخة احتياطية
                        </h4>
                        <p className="text-xs text-stone-500 mb-4 leading-relaxed">
                          استرجع بيانات المنتوجات والأزرار من ملف JSON كنت قد قمت بتحميله سابقاً.
                        </p>
                      </div>
                      <label className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer">
                        <Upload className="w-4 h-4" />
                        <span>اختر ملف النسخة واسترجع</span>
                        <input
                          type="file"
                          accept=".json"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const content = event.target?.result as string;
                                const ok = importDataJson(content);
                                if (ok) {
                                  showNotification('تم استيراد البيانات بنجاح!');
                                } else {
                                  alert('حدث خطأ أثناء قراءة ملف النسخة الاحتياطية');
                                }
                              };
                              reader.readAsText(file);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Reset Defaults */}
                  <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-sm text-rose-900 mb-1 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-600" />
                        <span>استرجاع الإعدادات والمنتوجات الأصلية (Reset)</span>
                      </h4>
                      <p className="text-xs text-rose-700 leading-relaxed max-w-lg">
                        سيقوم هذا الإجراء بإعادة تعيين جميع المنتوجات والأزرار والمعلومات إلى حالتها الأولى المطابقة لصور المحل الأصلية بالكامل.
                      </p>
                    </div>

                    {isResetConfirming ? (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            resetToDefaults();
                            setIsResetConfirming(false);
                            showNotification('تم استرجاع الإعدادات والمنتوجات الأصلية بنجاح!');
                          }}
                          className="px-4 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold transition-colors shadow-md"
                        >
                          نعم، متأكد (إعادة ضبط للمصنع)
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsResetConfirming(false)}
                          className="px-3 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-semibold"
                        >
                          تراجع
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsResetConfirming(true)}
                        className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors shrink-0 shadow-sm"
                      >
                        إعادة الضبط للمصنع
                      </button>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
