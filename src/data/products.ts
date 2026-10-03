export interface Product {
  id: string;
  ref: string;
  name: string;
  frenchName?: string;
  category: 'bags' | 'sneakers' | 'loafers' | 'boots';
  categoryLabel: string;
  brand?: string;
  price?: number;
  image: string;
  badge?: string;
  sizes?: string;
  colors: { name: string; hex: string }[];
  origin?: string;
  boxQuantity?: string;
  description: string;
  highlights?: string[];
  createdAt?: number;
}

export const STORE_INFO = {
  nameAr: "أحذية فينيزيا",
  nameEn: "VENEZIA Shoes",
  logoInitials: "",
  tagline: "",
  address: "582 شارع محمد السادس قيسارية قرطبة رقم 9 - الدار البيضاء",
  phone1: "05 20 62 23 10",
  phone2: "06 24 51 33 42",
  whatsappNumber: "+212624513342",
  facebookName: "Chez Abde",
  facebookUrl: "https://www.facebook.com/search/top?q=Chez%20Abde",
  instagramHandle: "chez_abde2",
  instagramUrl: "https://www.instagram.com/chez_abde2/",
  hours: "مفتوح يومياً من 10:00 صباحاً إلى 21:00 مساءً"
};

export const PRODUCTS: Product[] = [];
