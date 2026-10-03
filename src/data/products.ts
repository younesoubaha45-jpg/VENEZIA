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

export const PRODUCTS: Product[] = [
  // --- الحقائب النسائية ---
  {
    id: "v1229",
    ref: "v1229",
    name: "حقيبة يد v1229 بقفل ملون وغطاء سويد",
    category: "bags",
    categoryLabel: "حقائب",
    price: 320,
    image: "/src/assets/images/venezia_handbags_collection_1790964461682.jpg",
    colors: [
      { name: "بيج رملي", hex: "#D2B48C" },
      { name: "بوردو عنابي", hex: "#800020" },
      { name: "أسود", hex: "#1C1917" },
      { name: "بني جملي", hex: "#9E6838" },
      { name: "بني غامق", hex: "#4A2E1B" },
      { name: "وردي ناعم", hex: "#D8A7B1" }
    ],
    description: "حقيبة نسائية أنيقة بـ 6 ألوان مع قفل ملون وحزام كتف ومقبض يد متين."
  },
  {
    id: "monsak-white-scarf",
    ref: "MONSAK-01",
    name: "حقيبة كتف MONSAK بيضاء مع فولار حريري",
    category: "bags",
    categoryLabel: "حقائب",
    price: 290,
    image: "/src/assets/images/venezia_handbags_collection_1790964461682.jpg",
    colors: [
      { name: "أبيض", hex: "#FDFBF7" }
    ],
    description: "حقيبة كتف MONSAK بيضاء أنيقة مع وشاح مربوط وقفل دائري ذهبي."
  },
  {
    id: "monsak-black-birkin",
    ref: "MONSAK-02",
    name: "حقيبة يد MONSAK سوداء مع فولار ملون",
    category: "bags",
    categoryLabel: "حقائب",
    price: 340,
    image: "/src/assets/images/venezia_handbags_collection_1790964461682.jpg",
    colors: [
      { name: "أسود", hex: "#0F0F10" }
    ],
    description: "حقيبة يد MONSAK سوداء مع قفل ذهبي ومقبض مزين بفولار ملون."
  },
  {
    id: "monsak-tote-white",
    ref: "MONSAK-03",
    name: "حقيبة MONSAK بيضاء مع حلية زهرة وفولار",
    category: "bags",
    categoryLabel: "حقائب",
    price: 280,
    image: "/src/assets/images/venezia_handbags_collection_1790964461682.jpg",
    colors: [
      { name: "أبيض", hex: "#F8FAFC" }
    ],
    description: "حقيبة يد بيضاء ناعمة بمقبض ملفوف بفولار وحلية زهرة ذهبية."
  },
  {
    id: "monsak-trapeze-camel",
    ref: "MONSAK-04",
    name: "حقيبة MONSAK جملي مع وشاح مطبوع",
    category: "bags",
    categoryLabel: "حقائب",
    price: 310,
    image: "/src/assets/images/venezia_handbags_collection_1790964461682.jpg",
    colors: [
      { name: "جملي", hex: "#C19A6B" }
    ],
    description: "حقيبة يد أنيقة بلون جملي دافئ مع فولار حريري مطبوع على المقبض."
  },
  {
    id: "chanel-quilted-white",
    ref: "SAC-05",
    name: "حقيبة كروس بيضاء مبطنة بحلقتين وسلسلة ذهبية",
    category: "bags",
    categoryLabel: "حقائب",
    price: 270,
    image: "/src/assets/images/venezia_handbags_collection_1790964461682.jpg",
    colors: [
      { name: "أبيض", hex: "#FBFBFA" }
    ],
    description: "حقيبة مبطنة باللون الأبيض الأنيق مع قفل حلقي مذهب وسلسلة كتف."
  },
  {
    id: "miumiu-white-mini",
    ref: "SAC-06",
    name: "حقيبة ميني بيضاء بحروف مذهبة",
    category: "bags",
    categoryLabel: "حقائب",
    price: 250,
    image: "/src/assets/images/venezia_handbags_collection_1790964461682.jpg",
    colors: [
      { name: "أبيض", hex: "#FAF8F5" }
    ],
    description: "حقيبة ميني خفيفة باللون الأبيض مع شارة معدنية مذهبة وسحاب علوي."
  },
  {
    id: "ref-2866-8",
    ref: "2866-8",
    name: "حقيبة يد 2866-8 بنقشة متداخلة ومقابض مجدولة",
    category: "bags",
    categoryLabel: "حقائب",
    price: 330,
    image: "/src/assets/images/venezia_handbags_collection_1790964461682.jpg",
    colors: [
      { name: "بني داكن", hex: "#3B271A" },
      { name: "بيج فاتح", hex: "#E8D8B8" },
      { name: "بني دافئ", hex: "#7B4F35" },
      { name: "أسود", hex: "#1A1A1A" },
      { name: "عنابي", hex: "#5C1D24" }
    ],
    description: "حقيبة يد بـ 5 ألوان مع حزام كتف ومقابض مقوسة مجدولة."
  },

  // --- سنيكرز وأحذية ORLANDO ---
  {
    id: "ord-108",
    ref: "ORD-108",
    name: "سنيكرز نسائي ORLANDO ORD-108",
    category: "sneakers",
    categoryLabel: "سنيكرز",
    price: 260,
    image: "/src/assets/images/venezia_orlando_sneakers_1790964473793.jpg",
    sizes: "36 - 41",
    colors: [
      { name: "وردي وأسود", hex: "#C07080" },
      { name: "رمادي وأبيض", hex: "#94A3B8" },
      { name: "أبيض", hex: "#F8FAFC" }
    ],
    description: "سنيكرز رياضي ORLANDO ORD-108 بنعل مريح وقماش شبكي للتهوية."
  },
  {
    id: "ord-232",
    ref: "ORD-232",
    name: "سنيكرز شمواه ORLANDO ORD-232",
    category: "sneakers",
    categoryLabel: "سنيكرز",
    price: 250,
    image: "/src/assets/images/venezia_orlando_sneakers_1790964473793.jpg",
    sizes: "36 - 41",
    colors: [
      { name: "أسود", hex: "#18181B" },
      { name: "بيج جملي", hex: "#C8A27A" },
      { name: "رمادي فاتح", hex: "#CBD5E1" }
    ],
    description: "سنيكرز كاجوال شمواه ORLANDO ORD-232 بأربطة عريضة ونعل مطاطي أبيض."
  },
  {
    id: "ord-624",
    ref: "ORD-624",
    name: "سنيكرز عريض ORLANDO ORD-624",
    category: "sneakers",
    categoryLabel: "سنيكرز",
    price: 260,
    image: "/src/assets/images/venezia_orlando_sneakers_1790964473793.jpg",
    sizes: "36 - 41",
    colors: [
      { name: "أبيض وأسود", hex: "#F8FAFC" },
      { name: "بيج", hex: "#EADCC9" },
      { name: "عنابي", hex: "#7E192B" },
      { name: "كاكي", hex: "#A88D70" }
    ],
    description: "سنيكرز ORLANDO ORD-624 بشرائط جانبية وأربطة سميكة بـ 4 ألوان."
  },
  {
    id: "ord-679",
    ref: "ORD-679",
    name: "سنيكرز عصري ORLANDO ORD-679",
    category: "sneakers",
    categoryLabel: "سنيكرز",
    price: 270,
    image: "/src/assets/images/venezia_orlando_sneakers_1790964473793.jpg",
    sizes: "36 - 41",
    colors: [
      { name: "أسود", hex: "#111827" },
      { name: "أبيض", hex: "#FFFFFF" },
      { name: "بيج", hex: "#D6C7B2" }
    ],
    description: "سنيكرز خفيف بنعل سميك ORLANDO ORD-679 بتصميم هندسي."
  },
  {
    id: "ord-253",
    ref: "ORD-253",
    name: "سنيكرز خفيف ORLANDO ORD-253",
    category: "sneakers",
    categoryLabel: "سنيكرز",
    price: 240,
    image: "/src/assets/images/venezia_orlando_sneakers_1790964473793.jpg",
    sizes: "36 - 41",
    colors: [
      { name: "أبيض", hex: "#F8FAFC" },
      { name: "أسود", hex: "#18181B" },
      { name: "كاكي", hex: "#A3866A" }
    ],
    description: "حذاء رياضي خفيف للمشي اليومي ORLANDO ORD-253."
  },
  {
    id: "ord-903",
    ref: "ORD-903",
    name: "سنيكرز كلاسيكي بنعل عسلي ORLANDO ORD-903",
    category: "sneakers",
    categoryLabel: "سنيكرز",
    price: 250,
    image: "/src/assets/images/venezia_orlando_sneakers_1790964473793.jpg",
    sizes: "36 - 41",
    colors: [
      { name: "أبيض وأسود", hex: "#F3F4F6" },
      { name: "بني شوكولا", hex: "#3B261D" },
      { name: "بيج كريمي", hex: "#DDD2C3" },
      { name: "أسود", hex: "#1F2937" }
    ],
    description: "سنيكرز ريترو ORLANDO ORD-903 بنعل مطاطي عسلي وخطين جانبيين."
  },
  {
    id: "ys-260",
    ref: "YS-260",
    name: "سنيكرز رانر ORLANDO YS-260",
    category: "sneakers",
    categoryLabel: "سنيكرز",
    price: 260,
    image: "/src/assets/images/venezia_orlando_sneakers_1790964473793.jpg",
    sizes: "36 - 41",
    colors: [
      { name: "بيج", hex: "#E2DCD5" },
      { name: "عنابي", hex: "#6B1D2F" },
      { name: "جملي", hex: "#B87333" },
      { name: "بني", hex: "#4B2E1E" }
    ],
    description: "سنيكرز ركض كلاسيكي ORLANDO YS-260 بشعار جانبي وكعب مريح."
  },
  {
    id: "ys-637",
    ref: "YS-637",
    name: "سنيكرز مرن ORLANDO YS-637",
    category: "sneakers",
    categoryLabel: "سنيكرز",
    price: 250,
    image: "/src/assets/images/venezia_orlando_sneakers_1790964473793.jpg",
    sizes: "36 - 41",
    colors: [
      { name: "أبيض", hex: "#E5E7EB" },
      { name: "كاكي", hex: "#BFA588" },
      { name: "بني", hex: "#382319" },
      { name: "أسود", hex: "#111827" }
    ],
    description: "سنيكرز نحيف خفيف ORLANDO YS-637 بنعل مطاطي مريح."
  },
  {
    id: "art-1-282",
    ref: "1-282",
    name: "حذاء مريح شبكي ORLANDO ART NO. 1-282",
    category: "sneakers",
    categoryLabel: "سنيكرز",
    price: 230,
    image: "/src/assets/images/venezia_orlando_sneakers_1790964473793.jpg",
    sizes: "36 - 41",
    colors: [
      { name: "فضي رمادي", hex: "#D1D5DB" },
      { name: "كحلي ووردي", hex: "#1E293B" },
      { name: "أسود", hex: "#111827" },
      { name: "بيج لوزي", hex: "#E5D9C5" }
    ],
    description: "حذاء شبكي خفيف ومرن ORLANDO 1-282 مريح جداً للقدمين."
  },

  // --- الموكاسان والصابو ---
  {
    id: "ref-7752",
    ref: "Ref - 7752",
    name: "صابو موكاسان شمواه مفتوح Ref - 7752",
    category: "loafers",
    categoryLabel: "موكاسان وصابو",
    price: 220,
    image: "/src/assets/images/venezia_suede_mules_1790964486376.jpg",
    sizes: "36 / 41",
    origin: "30 P - China",
    colors: [
      { name: "رمادي", hex: "#94A3B8" },
      { name: "بني داكن", hex: "#4A2E1B" },
      { name: "بيج جملي", hex: "#C8A27A" },
      { name: "أسود", hex: "#1C1917" }
    ],
    description: "صابو شمواه ناعم مفتوح من الخلف بنعل خفيف وبطانة مريحة بـ 4 ألوان."
  },
  {
    id: "ref-1141",
    ref: "Ref: 1141",
    name: "صابو بنقش مونوغرام وإبزيم معدني Ref: 1141",
    category: "loafers",
    categoryLabel: "موكاسان وصابو",
    price: 240,
    image: "/src/assets/images/venezia_suede_mules_1790964486376.jpg",
    sizes: "37 / 41",
    origin: "24 box - China",
    colors: [
      { name: "بيج مونوغرام", hex: "#E3D5C0" },
      { name: "أسود مونوغرام", hex: "#1F1F22" },
      { name: "بني مونوغرام", hex: "#5C3A21" }
    ],
    description: "صابو بنقشة مونوغرام مع إبزيم معدني قابل للتعديل ونعل سفلي عسلي مانع للتزحلق."
  },
  {
    id: "tassel-loafers",
    ref: "MOC-03",
    name: "موكاسان شمواه بشراشيب وحاشية بيضاء",
    category: "loafers",
    categoryLabel: "موكاسان وصابو",
    price: 260,
    image: "/src/assets/images/venezia_suede_mules_1790964486376.jpg",
    sizes: "36 - 41",
    colors: [
      { name: "عنابي", hex: "#721C24" },
      { name: "بيج جملي", hex: "#D6C7B2" },
      { name: "أوف وايت", hex: "#E8E6E1" },
      { name: "أسود", hex: "#171717" },
      { name: "بني", hex: "#4A3528" }
    ],
    description: "حذاء موكاسان شمواه أنيق بشراشيب وحاشية بيضاء تحيط بالمقدمة ونعل أبيض مرن."
  },
  {
    id: "chunky-suede-mules",
    ref: "MOC-04",
    name: "صابو موكاسان شمواه مريح",
    category: "loafers",
    categoryLabel: "موكاسان وصابو",
    price: 230,
    image: "/src/assets/images/venezia_suede_mules_1790964486376.jpg",
    sizes: "26-33 / 36-41 (24 pc)",
    colors: [
      { name: "بني داكن", hex: "#3B261D" },
      { name: "عسلي", hex: "#B87333" },
      { name: "أسود", hex: "#111827" }
    ],
    description: "صابو شمواه مريح جداً بخياطة أمامية متوفر بمقاسات الصغار والكبار."
  },

  // --- الأحذية الشتوية والبوت ---
  {
    id: "mr-boots-43839",
    ref: "MR: 43839-7 / 43839-8",
    name: "بوت شتوي نسائي MR مبطن بالفرو مع سحاب خلفي",
    category: "boots",
    categoryLabel: "بوت شتوي",
    price: 320,
    image: "/src/assets/images/venezia_winter_boots_1790964498638.jpg",
    sizes: "25:30 / 30:35 / 36:41",
    origin: "24 pcs",
    colors: [
      { name: "أسود", hex: "#18181B" },
      { name: "بني موكا", hex: "#3E2723" },
      { name: "بيج عاجي", hex: "#EAE6DF" }
    ],
    description: "بوت شتوي كاحلي مبطن بالفرو مع نعل سميك وسحاب خلفي لسهولة اللبس."
  }
];
