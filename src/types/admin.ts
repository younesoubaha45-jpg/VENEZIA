import { Product } from '../data/products';

export interface SiteButtonsConfig {
  // Navbar buttons
  navQrButtonVisible: boolean;
  navQrButtonText: string;
  navWhatsappButtonVisible: boolean;
  navWhatsappButtonText: string;

  // Hero buttons
  heroCatalogButtonVisible: boolean;
  heroCatalogButtonText: string;
  heroWhatsappButtonVisible: boolean;
  heroWhatsappButtonText: string;

  // Product Card buttons
  cardDetailsButtonVisible: boolean;
  cardDetailsButtonText: string;
  cardOrderButtonVisible: boolean;
  cardOrderButtonText: string;
  cardInquiryButtonVisible: boolean;

  // Floating buttons
  floatingWhatsappVisible: boolean;
  floatingWhatsappText: string;
  floatingQrVisible: boolean;
  floatingQrText: string;

  // Contact buttons
  contactWhatsappButtonVisible: boolean;
  contactWhatsappButtonText: string;
  contactCallButtonVisible: boolean;
  contactCallButtonText: string;
}

export interface StoreSettings {
  nameAr: string;
  nameEn: string;
  tagline: string;
  address: string;
  phone1: string;
  phone2: string;
  whatsappNumber: string;
  facebookName: string;
  facebookUrl: string;
  instagramHandle: string;
  instagramUrl: string;
  hours: string;
  announcementText: string;
  announcementVisible: boolean;
  adminPin: string;
}

export interface StoreContextType {
  products: Product[];
  settings: StoreSettings;
  buttons: SiteButtonsConfig;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  // Product actions
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  // Settings actions
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  // Button actions
  updateButtons: (newButtons: Partial<SiteButtonsConfig>) => void;
  // Reset actions
  resetToDefaults: () => void;
  exportDataJson: () => string;
  importDataJson: (jsonData: string) => boolean;
}
