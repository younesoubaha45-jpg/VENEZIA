import { useState, useMemo } from 'react';
import { Search, MessageCircle, ArrowUpDown, Sliders } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import InquiryDrawer, { InquiryItem } from './components/InquiryDrawer';
import QrModal from './components/QrModal';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';
import { Product } from './data/products';
import { StoreProvider, useStore } from './context/StoreContext';

function AppContent() {
  const { products, settings, buttons, setIsAdminOpen, isAuthenticated } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);
  const [inquiryItems, setInquiryItems] = useState<InquiryItem[]>([]);
  const [isInquiryDrawerOpen, setIsInquiryDrawerOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Categories list
  const categories = useMemo(() => {
    return [
      { id: 'all', label: 'جميع المعروضات', count: products.length },
      { id: 'bags', label: 'الحقائب النسائية', count: products.filter(p => p.category === 'bags').length },
      { id: 'sneakers', label: 'سنيكرز ORLANDO', count: products.filter(p => p.category === 'sneakers').length },
      { id: 'loafers', label: 'موكاسان وصابو', count: products.filter(p => p.category === 'loafers').length },
      { id: 'boots', label: 'أحذية شتوية وبوت', count: products.filter(p => p.category === 'boots').length }
    ];
  }, [products]);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = !q || (
        product.name.toLowerCase().includes(q) ||
        (product.frenchName && product.frenchName.toLowerCase().includes(q)) ||
        product.ref.toLowerCase().includes(q) ||
        (product.brand && product.brand.toLowerCase().includes(q)) ||
        (product.colors && product.colors.some(c => c.name.toLowerCase().includes(q))) ||
        (product.description && product.description.toLowerCase().includes(q))
      );

      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0);
      return 0;
    });
  }, [products, selectedCategory, searchQuery, sortBy]);

  // Add / Toggle item in inquiry
  const handleAddToInquiry = (product: Product, selectedColor: string) => {
    setInquiryItems(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id);
      if (existingIndex > -1) {
        return prev.filter(item => item.product.id !== product.id);
      } else {
        return [...prev, { product, selectedColor, quantity: 1 }];
      }
    });
    setIsInquiryDrawerOpen(true);
  };

  const handleRemoveInquiryItem = (productId: string) => {
    setInquiryItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setInquiryItems(prev =>
      prev.map(item => item.product.id === productId ? { ...item, quantity } : item)
    );
  };

  const handleClearInquiry = () => {
    setInquiryItems([]);
  };

  const scrollToProducts = () => {
    const el = document.getElementById('featured');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col font-sans text-stone-900 selection:bg-amber-100 selection:text-amber-900">
      
      {/* Navigation with Quiet Slim Top Bar + Single Primary Action */}
      <Navbar
        inquiryCount={inquiryItems.length}
        onOpenInquiry={() => setIsInquiryDrawerOpen(true)}
        onOpenQrModal={() => setIsQrModalOpen(true)}
        onSelectCategory={(catId) => {
          setSelectedCategory(catId);
          scrollToProducts();
        }}
      />

      {/* Boutique Compact Showcase Banner featuring image representing boutique */}
      <Hero onExplore={scrollToProducts} />

      {/* Main Catalog Section */}
      <main id="featured" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
        
        {/* Controls Container */}
        <div className="mb-6 space-y-4">
          
          {/* Row 1: Wide Search Bar with Soft Rounded Corners + Sort Selector */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Wide Search Input */}
            <div className="relative flex-1 max-w-2xl">
              <Search className="w-4 h-4 text-stone-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="ابحث عن حقيبة، سنيكرز، مرجع، أو لون..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-11 py-2.5 sm:py-3 bg-white border border-stone-200/90 rounded-2xl text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700 px-1 py-0.5 font-medium"
                >
                  مسح
                </button>
              )}
            </div>

            {/* Sort & Admin Trigger */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  aria-label="ترتيب حسب"
                  className="appearance-none pl-8 pr-3.5 py-2.5 sm:py-3 bg-white border border-stone-200/90 rounded-2xl text-xs font-semibold text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 shadow-[0_1px_2px_rgba(0,0,0,0.03)] cursor-pointer"
                >
                  <option value="featured">الترتيب الافتراضي</option>
                  <option value="price-asc">الثمن: من الأقل للأعلى</option>
                  <option value="price-desc">الثمن: من الأعلى للأقل</option>
                </select>
                <ArrowUpDown className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Admin Panel Quick Trigger (Only visible when logged in as Admin) */}
              {isAuthenticated && (
                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2.5 sm:py-3 bg-white hover:bg-stone-100 text-stone-700 rounded-2xl text-xs font-bold border border-stone-200/90 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                  title="لوحة التحكم وتعديل المعروضات"
                >
                  <Sliders className="w-3.5 h-3.5 text-amber-700" />
                  <span className="hidden sm:inline">إدارة المعروضات</span>
                </button>
              )}
            </div>
          </div>

          {/* Row 2: Minimalist Horizontal Scrollable Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-[#29221D] text-amber-200 shadow-sm border border-amber-800/40 ring-1 ring-amber-700/30'
                    : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200/90 hover:bg-stone-50'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold tabular-nums ${
                  selectedCategory === cat.id
                    ? 'bg-amber-900/60 text-amber-300'
                    : 'bg-stone-100 text-stone-500'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-stone-200/80 my-8 shadow-sm">
            <h3 className="text-base font-bold text-stone-800 mb-1">
              {products.length === 0 ? 'لا توجد منتوجات مضافة حالياً' : 'لا توجد موديلات مطابقة للبحث'}
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              {products.length === 0
                ? 'يمكنك إضافة المنتوجات الجديدة من لوحة التحكم ليراها جميع الزوار مباشرة.'
                : 'يمكنك مسح كلمة البحث أو اختيار تصنيف آخر.'}
            </p>
            {(searchQuery || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors"
              >
                عرض جميع المعروضات
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenModal={setActiveModalProduct}
                onAddToInquiry={handleAddToInquiry}
                isInInquiry={inquiryItems.some(i => i.product.id === product.id)}
              />
            ))}
          </div>
        )}

      </main>

      {/* Clean Minimal Footer */}
      <Footer />

      {/* Modals & Drawers */}
      <ProductModal
        product={activeModalProduct}
        onClose={() => setActiveModalProduct(null)}
        onAddToInquiry={handleAddToInquiry}
        isInInquiry={activeModalProduct ? inquiryItems.some(i => i.product.id === activeModalProduct.id) : false}
      />

      <InquiryDrawer
        isOpen={isInquiryDrawerOpen}
        onClose={() => setIsInquiryDrawerOpen(false)}
        items={inquiryItems}
        onRemoveItem={handleRemoveInquiryItem}
        onUpdateQuantity={handleUpdateQuantity}
        onClear={handleClearInquiry}
      />

      <QrModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
      />

      {/* Admin Panel Component */}
      <AdminPanel />

      {/* Floating Action Button (Clean single WhatsApp button) */}
      {buttons.floatingWhatsappVisible && (
        <aside aria-label="تواصل واتساب" className="fixed bottom-5 left-5 z-40">
          <a
            href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('السلام عليكم ' + settings.nameAr)}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-full shadow-xl transition-all hover:scale-105"
            title="تواصل عبر واتساب"
          >
            <MessageCircle className="w-5 h-5 fill-white" />
            <span className="hidden sm:inline">{buttons.floatingWhatsappText}</span>
          </a>
        </aside>
      )}

    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
