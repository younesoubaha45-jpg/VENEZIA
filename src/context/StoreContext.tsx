import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, PRODUCTS as DEFAULT_PRODUCTS, STORE_INFO } from '../data/products';
import { SiteButtonsConfig, StoreSettings, StoreContextType } from '../types/admin';

const DEFAULT_BUTTONS: SiteButtonsConfig = {
  navQrButtonVisible: true,
  navQrButtonText: 'الكودبار',
  navWhatsappButtonVisible: true,
  navWhatsappButtonText: 'طلب عبر واتساب',

  heroCatalogButtonVisible: true,
  heroCatalogButtonText: 'تصفح كاتالوج المنتوجات',
  heroWhatsappButtonVisible: true,
  heroWhatsappButtonText: 'تواصل مباشر على الواتساب',

  cardDetailsButtonVisible: true,
  cardDetailsButtonText: 'عرض التفاصيل',
  cardOrderButtonVisible: true,
  cardOrderButtonText: 'طلب',
  cardInquiryButtonVisible: true,

  floatingWhatsappVisible: true,
  floatingWhatsappText: 'تواصل واتساب',
  floatingQrVisible: false,
  floatingQrText: 'الكودبار',

  contactWhatsappButtonVisible: true,
  contactWhatsappButtonText: 'مراسلة عبر واتساب',
  contactCallButtonVisible: true,
  contactCallButtonText: 'اتصال هاتف'
};

const DEFAULT_SETTINGS: StoreSettings = {
  nameAr: STORE_INFO.nameAr,
  nameEn: STORE_INFO.nameEn,
  tagline: STORE_INFO.tagline,
  address: STORE_INFO.address,
  phone1: STORE_INFO.phone1,
  phone2: STORE_INFO.phone2,
  whatsappNumber: STORE_INFO.whatsappNumber,
  facebookName: STORE_INFO.facebookName,
  facebookUrl: STORE_INFO.facebookUrl,
  instagramHandle: STORE_INFO.instagramHandle,
  instagramUrl: STORE_INFO.instagramUrl,
  hours: STORE_INFO.hours,
  announcementText: 'مرحباً بكم في معرض أحذية فينيزيا - قيسارية قرطبة الدار البيضاء',
  announcementVisible: false,
  adminPin: '1234'
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial products from localStorage or defaults
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('venezia_products_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load products from localStorage', e);
    }
    return DEFAULT_PRODUCTS;
  });

  // Load initial store settings
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('venezia_settings_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          tagline: ''
        };
      }
    } catch (e) {
      console.error('Failed to load settings from localStorage', e);
    }
    return DEFAULT_SETTINGS;
  });

  // Load initial buttons config
  const [buttons, setButtons] = useState<SiteButtonsConfig>(() => {
    try {
      const saved = localStorage.getItem('venezia_buttons_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load buttons config from localStorage', e);
    }
    return DEFAULT_BUTTONS;
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('venezia_products_v1', JSON.stringify(products));
    } catch (e) {
      console.error('Error saving products', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('venezia_settings_v1', JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving settings', e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('venezia_buttons_v1', JSON.stringify(buttons));
    } catch (e) {
      console.error('Error saving buttons', e);
    }
  }, [buttons]);

  // Product CRUD
  const addProduct = (newProdData: Omit<Product, 'id'>) => {
    const newId = 'prod_' + Date.now();
    const newProduct: Product = {
      ...newProdData,
      id: newId
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updatedFields } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => {
      const next = prev.filter(p => p.id !== id);
      try {
        localStorage.setItem('venezia_products_v1', JSON.stringify(next));
      } catch (e) {
        console.error('Error persisting products on delete', e);
      }
      return next;
    });
  };

  // Settings update
  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Buttons update
  const updateButtons = (newButtons: Partial<SiteButtonsConfig>) => {
    setButtons(prev => ({ ...prev, ...newButtons }));
  };

  // Reset to original factory defaults
  const resetToDefaults = () => {
    setProducts(DEFAULT_PRODUCTS);
    setSettings(DEFAULT_SETTINGS);
    setButtons(DEFAULT_BUTTONS);
    localStorage.removeItem('venezia_products_v1');
    localStorage.removeItem('venezia_settings_v1');
    localStorage.removeItem('venezia_buttons_v1');
  };

  // Backup & Restore
  const exportDataJson = () => {
    const data = {
      products,
      settings,
      buttons,
      version: '1.0',
      exportDate: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  };

  const importDataJson = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.products && Array.isArray(parsed.products)) {
        setProducts(parsed.products);
      }
      if (parsed.settings) {
        setSettings(prev => ({ ...prev, ...parsed.settings }));
      }
      if (parsed.buttons) {
        setButtons(prev => ({ ...prev, ...parsed.buttons }));
      }
      return true;
    } catch (e) {
      console.error('Failed to import JSON', e);
      return false;
    }
  };

  return (
    <StoreContext.Provider
      value={{
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
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
