import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  where
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Product, STORE_INFO } from '../data/products';
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
  tagline: '',
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

function sanitizeProductPayload(id: string, p: Partial<Product>, existingCreatedAt?: number): Product {
  const validCategories = ['bags', 'sneakers', 'loafers', 'boots'] as const;
  const cat = validCategories.includes(p.category as any) ? (p.category as Product['category']) : 'bags';
  return {
    id: id.slice(0, 128).replace(/[^a-zA-Z0-9_-]/g, '_'),
    ref: String(p.ref || '').slice(0, 100),
    name: String(p.name || '').slice(0, 300),
    frenchName: String(p.frenchName || '').slice(0, 300),
    category: cat,
    categoryLabel: String(p.categoryLabel || '').slice(0, 100),
    brand: String(p.brand || '').slice(0, 100),
    price: typeof p.price === 'number' && p.price >= 0 ? Math.min(p.price, 1000000) : 0,
    image: String(p.image || '/src/assets/images/venezia_handbags_collection_1790964461682.jpg').slice(0, 890000),
    badge: String(p.badge || '').slice(0, 100),
    sizes: String(p.sizes || '').slice(0, 100),
    colors: Array.isArray(p.colors)
      ? p.colors.slice(0, 20).map(c => ({
          name: String(c?.name || '').slice(0, 60),
          hex: String(c?.hex || '#1C1917').slice(0, 20)
        }))
      : [],
    origin: String(p.origin || '').slice(0, 100),
    boxQuantity: String(p.boxQuantity || '').slice(0, 100),
    description: String(p.description || '').slice(0, 2000),
    highlights: Array.isArray(p.highlights)
      ? p.highlights.slice(0, 20).map(h => String(h || '').slice(0, 300))
      : [],
    createdAt: existingCreatedAt ?? p.createdAt ?? Date.now()
  };
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [buttons, setButtons] = useState<SiteButtonsConfig>(DEFAULT_BUTTONS);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Clear legacy localStorage sample products so they never reappear
  useEffect(() => {
    try {
      localStorage.removeItem('venezia_products_v1');
    } catch {
      // ignore
    }
  }, []);

  // Real-time Firestore listener for Products
  useEffect(() => {
    const productsQuery = query(
      collection(db, 'products'),
      where('category', 'in', ['bags', 'sneakers', 'loafers', 'boots'])
    );

    const unsubscribe = onSnapshot(
      productsQuery,
      (snapshot) => {
        const list: Product[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as Product;
          list.push({
            ...data,
            id: docSnap.id
          });
        });
        list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setProducts(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'products');
      }
    );

    return () => unsubscribe();
  }, []);

  // Real-time Firestore listener for Store Config (settings & buttons)
  useEffect(() => {
    const configRef = doc(db, 'storeConfig', 'main');
    const unsubscribe = onSnapshot(
      configRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.settings) {
            setSettings({
              ...DEFAULT_SETTINGS,
              ...data.settings,
              tagline: ''
            });
          }
          if (data.buttons) {
            setButtons({
              ...DEFAULT_BUTTONS,
              ...data.buttons
            });
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'storeConfig/main');
      }
    );

    return () => unsubscribe();
  }, []);

  const persistStoreConfig = async (nextSettings: StoreSettings, nextButtons: SiteButtonsConfig) => {
    const path = 'storeConfig/main';
    try {
      await setDoc(doc(db, 'storeConfig', 'main'), {
        settings: nextSettings,
        buttons: nextButtons,
        updatedAt: Date.now(),
        initialized: true
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  // Product CRUD backed by Cloud Firestore
  const addProduct = async (newProdData: Omit<Product, 'id'>) => {
    const newId = 'prod_' + Date.now() + '_' + Math.floor(100 + Math.random() * 900);
    const payload = sanitizeProductPayload(newId, newProdData, Date.now());
    const path = `products/${newId}`;
    try {
      await setDoc(doc(db, 'products', newId), payload);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const updateProduct = async (id: string, updatedFields: Partial<Product>) => {
    const existing = products.find(p => p.id === id);
    const merged = { ...(existing || {}), ...updatedFields };
    const payload = sanitizeProductPayload(id, merged, existing?.createdAt);
    const path = `products/${id}`;
    try {
      await setDoc(doc(db, 'products', id), payload);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const deleteProduct = async (id: string) => {
    const path = `products/${id}`;
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  // Settings update backed by Cloud Firestore
  const updateSettings = async (newSettings: Partial<StoreSettings>) => {
    const updated = { ...settings, ...newSettings, tagline: '' };
    setSettings(updated);
    await persistStoreConfig(updated, buttons);
  };

  // Buttons update backed by Cloud Firestore
  const updateButtons = async (newButtons: Partial<SiteButtonsConfig>) => {
    const updated = { ...buttons, ...newButtons };
    setButtons(updated);
    await persistStoreConfig(settings, updated);
  };

  // Reset store settings/buttons to defaults and clear all products in Firestore
  const resetToDefaults = async () => {
    for (const p of products) {
      try {
        await deleteDoc(doc(db, 'products', p.id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `products/${p.id}`);
      }
    }
    setSettings(DEFAULT_SETTINGS);
    setButtons(DEFAULT_BUTTONS);
    await persistStoreConfig(DEFAULT_SETTINGS, DEFAULT_BUTTONS);
  };

  // Backup & Restore
  const exportDataJson = () => {
    const data = {
      products,
      settings,
      buttons,
      version: '2.0',
      exportDate: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  };

  const importDataJson = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.products && Array.isArray(parsed.products)) {
        parsed.products.forEach((p: Product) => {
          const id = p.id ? String(p.id).replace(/[^a-zA-Z0-9_-]/g, '_') : 'prod_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
          const payload = sanitizeProductPayload(id, p, p.createdAt);
          setDoc(doc(db, 'products', id), payload).catch(err =>
            handleFirestoreError(err, OperationType.WRITE, `products/${id}`)
          );
        });
      }
      const nextSettings = parsed.settings ? { ...settings, ...parsed.settings, tagline: '' } : settings;
      const nextButtons = parsed.buttons ? { ...buttons, ...parsed.buttons } : buttons;
      setSettings(nextSettings);
      setButtons(nextButtons);
      persistStoreConfig(nextSettings, nextButtons);
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
