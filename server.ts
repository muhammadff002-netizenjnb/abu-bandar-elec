import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { InventoryItem, SecurityPackage, Invoice, ServiceInquiry, BusinessInfo, StockLog } from "./src/types.ts";

const app = express();
const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), "data");

app.use(express.json());

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readDataFile<T>(filename: string, defaultData: T): T {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), "utf-8");
    return defaultData;
  }
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Error reading ${filename}:`, err);
    return defaultData;
  }
}

function writeDataFile<T>(filename: string, data: T): void {
  const filePath = path.join(DATA_DIR, filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error(`Error writing to ${filename}:`, err);
  }
}

// Initial Seed Data
const initialBusinessInfo: BusinessInfo = {
  name: "Abu Bandar Electronics",
  nameAr: "ابو بندر إلكترونيات",
  tagline: "Specialized Security System Installation & Smart Electronics in Jeddah",
  taglineAr: "خدمات توريد وتركيب الأنظمة الأمنية وكاميرات المراقبة المعتمدة في جدة",
  rating: 5.0,
  reviewCount: 2,
  category: "Security system installation service",
  categoryAr: "خدمة تركيب وتوريد أنظمة المراقبة والحماية الأمنية",
  address: "Khalid Bin Waleed St, As Salamah, Jeddah 23525, Saudi Arabia",
  addressAr: "شارع خالد بن الوليد، حي السلامة، جدة 23525، المملكة العربية السعودية",
  city: "Jeddah",
  cityAr: "جدة",
  phone: "+966 59 229 4435",
  whatsapp: "+966592294435",
  hours: "Open 24 hours",
  hoursAr: "مفتوح على مدار 24 ساعة",
  crNumber: "4030198421",
  vatNumber: "310492837100003",
  googleMapsUrl: "https://maps.google.com/?q=Abu+Bandar+Electronics+ابو+بندر+إلكترونيات+Khalid+Bin+Waleed+As+Salamah+Jeddah",
  logoUrl: "/logo.jpg"
};

const initialInventory: InventoryItem[] = [];

const initialPackages: SecurityPackage[] = [
  {
    id: "pkg-1",
    title: "Premium Villa 4-Camera 4K Security Package",
    titleAr: "باقة الفلل الذكية - 4 كاميرات 4K مع التركيب والبرمجة",
    category: "residential",
    priceSAR: 2450,
    description: "Complete security system for villas and private residences in Jeddah. Ultra HD 4K night color cameras, 2TB storage, mobile app setup.",
    descriptionAr: "نظام أمني متكامل للفلل والمنازل في جدة، يشمل 4 كاميرات تصوير ملون ليلي، جهاز تسجيل، هاردسك، وتوصيل بالتطبيق.",
    features: [
      "4x Hikvision 4K Ultra HD Outdoor Cameras (ColorVu Night Color)",
      "1x 4-Channel 4K NVR Network Recorder",
      "1x 2TB Surveillance Hard Drive (Stores 30+ days)",
      "High-grade Cat6 outdoor copper wiring up to 100m",
      "Free professional installation & cable conduit protection in Jeddah",
      "Mobile App configuration for remote live viewing 24/7",
      "2-Year Warranty with free technical visit"
    ],
    featuresAr: [
      "4 كاميرات هيكفيجن 4K فائقة الدقة تصوير ملون 24 ساعة",
      "جهاز تسجيل شبكي 4 قنوات يدعم دقة 4K",
      "هاردسك 2 تيرابايت مخصص للمراقبة (تسجيل 30 يوم)",
      "تمديد كابلات كات 6 نحاس أصلي مع مواسير حماية",
      "تركيب احترافي وبرمجة معتمدة في جدة",
      "ربط مجاني على جوالات العائلة للمشاهدة المباشرة",
      "ضمان لمدة سنتين شامل الصيانة"
    ],
    includesInstallation: true,
    warrantyYears: 2,
    badge: "Most Popular",
    badgeAr: "الأكثر طلباً للفلل"
  },
  {
    id: "pkg-2",
    title: "Commercial Store & Shop AcuSense Package (MOI & Baladiya Compliant)",
    titleAr: "باقة المحلات التجارية والمؤسسات - 8 كاميرات معتمدة للبلدية والدفاع المدني",
    category: "commercial",
    priceSAR: 4890,
    description: "Certified system meeting Saudi civil defense and municipal requirements for shops, clinics, and offices in Jeddah.",
    descriptionAr: "نظام أمني مطابق لاشتراطات الأمن العام والبلديات في المملكة، مناسب للمحلات والمستودعات والمكاتب بجدة.",
    features: [
      "8x 5MP/8MP High-Definition AI Cameras (Bullet + Dome)",
      "1x 8-Channel PoE 4K NVR with AI Smart Search",
      "1x 4TB Western Digital Purple Surveillance HDD",
      "Full cable trunking & certified installation standards",
      "ZATCA & Civil Defense compliant specifications",
      "Official certificate of installation from Abu Bandar Electronics",
      "2-Year Warranty + 1 Year free preventive maintenance"
    ],
    featuresAr: [
      "8 كاميرات ذكية عالية الدقة 5/8 ميجابكسل (داخلية وخارجية)",
      "جهاز تسجيل 8 قنوات PoE يدعم التمييز الذكي للأشخاص",
      "قرص صلب 4 تيرابايت ويسترن ديجيتال بيربل",
      "تمديدات وتراكات حماية مطابقة للمواصفات",
      "مطابق لاشتراطات الأمن العام واستخراج الرخص التجارية",
      "شهادة إنجاز وتركيب رسمية من مؤسسة ابو بندر إلكترونيات",
      "ضمان سنتين شامل فحص دوري مجاني"
    ],
    includesInstallation: true,
    warrantyYears: 2,
    badge: "Commercial Choice",
    badgeAr: "معتمد للمحلات"
  },
  {
    id: "pkg-3",
    title: "Smart Villa Access: Video Intercom + Smart Lock Bundle",
    titleAr: "باقة الدخول الذكي للفيلا: انتركم مرئي + قفل باب ذكي بالبصمة",
    category: "access_intercom",
    priceSAR: 1950,
    description: "Eliminate traditional keys. Answer your gate from anywhere in the world and unlock your front door with your fingerprint.",
    descriptionAr: "تخلص من المفاتيح التقليدية، رد على جرس الباب وافتح البوابة لضيوفك من جوالك من أي مكان بالعالم.",
    features: [
      "1x Hikvision IP Touchscreen Video Intercom Kit",
      "1x Biometric Heavy-Duty Smart Door Lock (Fingerprint/Code/Card/App)",
      "Full installation on aluminum, wood, or iron doors",
      "Mobile notification on doorbell press with 2-way audio",
      "Temporary guest pin code generation for deliveries and housekeepers",
      "2-Year Warranty on hardware and motor mechanics"
    ],
    featuresAr: [
      "طقم انتركم مرئي هيكفيجن شاشة لمس 7 بوصة وكاميرا خارجية",
      "قفل إلكتروني ذكي فائق المتانة للأبواب مع بصمة ورمز وبطاقة",
      "تركيب وتوليف احترافي على مختلف أنواع الأبواب (خشب، حديد، ليزر)",
      "إشعارات فورية على الجوال عند رن الجرس مع التحدث بالصوت والصورة",
      "إمكانية إرسال رمز سري مؤقت للضيوف أو العمالة",
      "ضمان شامل لمدة سنتين"
    ],
    includesInstallation: true,
    warrantyYears: 2,
    badge: "Modern Smart Home",
    badgeAr: "المنزل الذكي"
  },
  {
    id: "pkg-4",
    title: "24/7 Security Maintenance & Emergency Service Contract",
    titleAr: "عقد صيانة دورية وطوارئ 24 ساعة للأنظمة الأمنية بجدة",
    category: "maintenance",
    priceSAR: 750,
    description: "Annual maintenance service for existing camera systems, NVR repair, lens cleaning, cable troubleshooting in Jeddah.",
    descriptionAr: "خدمة صيانة وإصلاح وفحص الأنظمة القائمة وتعديل زوايا الكاميرات واسترجاع التسجيلات وحل مشاكل انقطاع الإشارة.",
    features: [
      "Quarterly preventive maintenance visits",
      "Emergency response within Jeddah city limits",
      "Camera lens cleaning, refocusing, and angle alignment",
      "Hard drive health inspection and backup verification",
      "Re-configuring mobile apps and router port forwarding",
      "Discounted rates on spare parts and upgrades"
    ],
    featuresAr: [
      "زيارات دورية ربع سنوية للفحص الوقائي",
      "استجابة سريعة لحالات الطوارئ في كافة أحياء جدة",
      "تنظيف عدسات الكاميرات وضبط زوايا الرؤية والفوكس",
      "فحص صحة الأقراص الصلبة واستمرارية التسجيل",
      "إعادة ضبط التطبيقات على الهواتف الجديدة",
      "خصم خاص على قطع الغيار والكاميرات الإضافية"
    ],
    includesInstallation: false,
    warrantyYears: 1,
    badge: "24/7 Service",
    badgeAr: "خدمة 24 ساعة"
  }
];

const initialInvoices: Invoice[] = [
  {
    id: "inv-1001",
    invoiceNumber: "INV-2026-0042",
    type: "tax_invoice",
    clientName: "Abdulrahman Al-Ghamdi (عبدالرحمن الغامدي)",
    clientPhone: "+966 50 123 4567",
    clientAddress: "Villa 14, Al Rawdah District, Jeddah",
    district: "Al Rawdah",
    date: "2026-09-18",
    validUntil: "2026-10-18",
    items: [
      {
        itemId: "item-1",
        description: "Hikvision ColorVu 4MP Cameras + Installation (Supply & Fit)",
        quantity: 4,
        unitPriceSAR: 320,
        totalSAR: 1280
      },
      {
        itemId: "item-3",
        description: "Dahua 16CH PoE 4K NVR with configuration",
        quantity: 1,
        unitPriceSAR: 1100,
        totalSAR: 1100
      },
      {
        itemId: "item-4",
        description: "WD Purple 4TB Surveillance Hard Drive",
        quantity: 1,
        unitPriceSAR: 420,
        totalSAR: 420
      },
      {
        itemId: "item-8",
        description: "Cat6 Pure Copper Outdoor Cables & PVC Conduits (Roll/Meters)",
        quantity: 1,
        unitPriceSAR: 350,
        totalSAR: 350
      }
    ],
    subtotalSAR: 3150,
    vatRate: 0.15,
    vatAmountSAR: 472.5,
    totalSAR: 3622.5,
    status: "paid",
    paymentMethod: "mada",
    notes: "Completed installation with 2-year full warranty and mobile app configuration on 3 devices."
  },
  {
    id: "inv-1002",
    invoiceNumber: "QUO-2026-0089",
    type: "quotation",
    clientName: "Al-Badr Commercial Market (أسواق البدر المركزية)",
    clientPhone: "+966 55 987 6543",
    clientAddress: "As Salamah Commercial St, Jeddah",
    district: "As Salamah",
    date: "2026-09-19",
    validUntil: "2026-10-05",
    items: [
      {
        itemId: "item-2",
        description: "Hikvision 8MP 4K AcuSense Dome Cameras for retail aisles",
        quantity: 8,
        unitPriceSAR: 520,
        totalSAR: 4160
      },
      {
        itemId: "item-3",
        description: "Dahua 16CH 4K NVR with 2x 4TB Surveillance HDD",
        quantity: 1,
        unitPriceSAR: 1950,
        totalSAR: 1950
      },
      {
        description: "Certified Civil Defense conduit piping and cabling work",
        quantity: 1,
        unitPriceSAR: 950,
        totalSAR: 950
      }
    ],
    subtotalSAR: 7060,
    vatRate: 0.15,
    vatAmountSAR: 1059,
    totalSAR: 8119,
    status: "sent",
    paymentMethod: "bank_transfer",
    notes: "Quotation valid for 15 days. Includes Baladiya safety certificate issuance."
  }
];

const initialInquiries: ServiceInquiry[] = [
  {
    id: "inq-1",
    customerName: "Mohammed Al-Zahrani (محمد الزهراني)",
    phone: "+966 54 332 1190",
    district: "Al Zahra, Jeddah",
    propertyType: "villa",
    serviceType: "cctv_installation",
    preferredDate: "2026-09-22",
    notes: "New villa under completion. Needs 6 cameras outside and video intercom at main gate.",
    status: "scheduled",
    createdAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString()
  },
  {
    id: "inq-2",
    customerName: "Salem Ba-Wazir (سالم باوزير)",
    phone: "+966 56 443 2211",
    district: "As Salamah, Jeddah",
    propertyType: "commercial_shop",
    serviceType: "smart_lock",
    preferredDate: "2026-09-21",
    notes: "Wants fingerprint smart locks on 2 administrative glass/aluminum office doors.",
    status: "new",
    createdAt: new Date(Date.now() - 3600 * 1000 * 1).toISOString()
  }
];

const initialStockLogs: StockLog[] = [];

// Lazy initialize Gemini API client
let genAI: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!genAI && process.env.GEMINI_API_KEY) {
    try {
      genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (e) {
      console.warn("Could not initialize GoogleGenAI:", e);
    }
  }
  return genAI;
}

// -------------------------------------------------------------
// API Routes
// -------------------------------------------------------------

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Business Info
app.get("/api/business", (req, res) => {
  const data = readDataFile<BusinessInfo>("business.json", initialBusinessInfo);
  res.json(data);
});

app.put("/api/business", (req, res) => {
  const current = readDataFile<BusinessInfo>("business.json", initialBusinessInfo);
  const updated = { ...current, ...req.body };
  writeDataFile("business.json", updated);
  res.json(updated);
});

// Inventory CRUD
app.get("/api/inventory", (req, res) => {
  const items = readDataFile<InventoryItem[]>("inventory.json", initialInventory);
  const { category, search, status, brand } = req.query;

  let filtered = [...items];

  if (category && category !== "all") {
    filtered = filtered.filter((i) => i.category === category);
  }

  if (status && status !== "all") {
    filtered = filtered.filter((i) => i.status === status);
  }

  if (brand && brand !== "all") {
    filtered = filtered.filter((i) => i.brand.toLowerCase() === String(brand).toLowerCase());
  }

  if (search && typeof search === "string" && search.trim() !== "") {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.nameAr.includes(q) ||
        i.sku.toLowerCase().includes(q) ||
        i.model.toLowerCase().includes(q) ||
        i.brand.toLowerCase().includes(q)
    );
  }

  res.json(filtered);
});

app.get("/api/inventory/:id", (req, res) => {
  const items = readDataFile<InventoryItem[]>("inventory.json", initialInventory);
  const item = items.find((i) => i.id === req.params.id);
  if (!item) {
    return res.status(404).json({ error: "Item not found" });
  }
  res.json(item);
});

app.post("/api/inventory", (req, res) => {
  const items = readDataFile<InventoryItem[]>("inventory.json", initialInventory);
  const body = req.body;

  const stockNum = Number(body.stock) || 0;
  const minStockNum = Number(body.minStockAlert) || 5;

  let status: 'in_stock' | 'low_stock' | 'out_of_stock' = 'in_stock';
  if (stockNum <= 0) status = 'out_of_stock';
  else if (stockNum <= minStockNum) status = 'low_stock';

  const newItem: InventoryItem = {
    id: `item-${Date.now()}`,
    sku: body.sku || `SKU-${Date.now().toString().slice(-6)}`,
    name: body.name || "Unnamed Item",
    nameAr: body.nameAr || body.name || "صنف جديد",
    category: body.category || "cctv_cameras",
    brand: body.brand || "General",
    model: body.model || "",
    stock: stockNum,
    minStockAlert: minStockNum,
    unitPriceSAR: Number(body.unitPriceSAR) || 0,
    costPriceSAR: Number(body.costPriceSAR) || 0,
    location: body.location || "As Salamah Store, Jeddah",
    warrantyMonths: Number(body.warrantyMonths) || 24,
    description: body.description || "",
    descriptionAr: body.descriptionAr || "",
    specs: Array.isArray(body.specs) ? body.specs : (typeof body.specs === 'string' ? body.specs.split(',').map((s: string) => s.trim()) : []),
    imageUrl: body.imageUrl || "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80",
    status,
    lastUpdated: new Date().toISOString()
  };

  items.unshift(newItem);
  writeDataFile("inventory.json", items);

  // Log initial stock
  if (stockNum > 0) {
    const logs = readDataFile<StockLog[]>("stock_logs.json", initialStockLogs);
    logs.unshift({
      id: `log-${Date.now()}`,
      itemId: newItem.id,
      itemName: newItem.name,
      change: stockNum,
      previousStock: 0,
      newStock: stockNum,
      reason: "restock",
      notes: "Initial inventory registration",
      date: new Date().toISOString()
    });
    writeDataFile("stock_logs.json", logs);
  }

  res.status(201).json(newItem);
});

app.put("/api/inventory/:id", (req, res) => {
  const items = readDataFile<InventoryItem[]>("inventory.json", initialInventory);
  const index = items.findIndex((i) => i.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Item not found" });
  }

  const existing = items[index];
  const stockNum = req.body.stock !== undefined ? Number(req.body.stock) : existing.stock;
  const minStockNum = req.body.minStockAlert !== undefined ? Number(req.body.minStockAlert) : existing.minStockAlert;

  let status: 'in_stock' | 'low_stock' | 'out_of_stock' = 'in_stock';
  if (stockNum <= 0) status = 'out_of_stock';
  else if (stockNum <= minStockNum) status = 'low_stock';

  const updated: InventoryItem = {
    ...existing,
    ...req.body,
    stock: stockNum,
    minStockAlert: minStockNum,
    unitPriceSAR: req.body.unitPriceSAR !== undefined ? Number(req.body.unitPriceSAR) : existing.unitPriceSAR,
    costPriceSAR: req.body.costPriceSAR !== undefined ? Number(req.body.costPriceSAR) : existing.costPriceSAR,
    warrantyMonths: req.body.warrantyMonths !== undefined ? Number(req.body.warrantyMonths) : existing.warrantyMonths,
    status,
    lastUpdated: new Date().toISOString()
  };

  items[index] = updated;
  writeDataFile("inventory.json", items);
  res.json(updated);
});

app.delete("/api/inventory/clear-all", (req, res) => {
  writeDataFile("inventory.json", []);
  writeDataFile("stock_logs.json", []);
  res.json({ success: true, message: "All inventory items cleared successfully" });
});

app.delete("/api/inventory/:id", (req, res) => {
  const items = readDataFile<InventoryItem[]>("inventory.json", initialInventory);
  const filtered = items.filter((i) => i.id !== req.params.id);
  if (filtered.length === items.length) {
    return res.status(404).json({ error: "Item not found" });
  }
  writeDataFile("inventory.json", filtered);
  res.json({ success: true, message: "Item deleted successfully" });
});

// Quick Stock Adjustment with audit log
app.post("/api/inventory/:id/adjust-stock", (req, res) => {
  const items = readDataFile<InventoryItem[]>("inventory.json", initialInventory);
  const index = items.findIndex((i) => i.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Item not found" });
  }

  const { delta, reason, notes } = req.body;
  const change = Number(delta) || 0;
  if (change === 0) {
    return res.status(400).json({ error: "Delta cannot be zero" });
  }

  const item = items[index];
  const prevStock = item.stock;
  const newStock = Math.max(0, prevStock + change);

  let status: 'in_stock' | 'low_stock' | 'out_of_stock' = 'in_stock';
  if (newStock <= 0) status = 'out_of_stock';
  else if (newStock <= item.minStockAlert) status = 'low_stock';

  item.stock = newStock;
  item.status = status;
  item.lastUpdated = new Date().toISOString();
  items[index] = item;
  writeDataFile("inventory.json", items);

  // Add stock log
  const logs = readDataFile<StockLog[]>("stock_logs.json", initialStockLogs);
  const newLog: StockLog = {
    id: `log-${Date.now()}`,
    itemId: item.id,
    itemName: item.name,
    change,
    previousStock: prevStock,
    newStock,
    reason: reason || (change > 0 ? "restock" : "sale_installation"),
    notes: notes || "",
    date: new Date().toISOString()
  };
  logs.unshift(newLog);
  writeDataFile("stock_logs.json", logs);

  res.json({ item, log: newLog });
});

// Stock Logs
app.get("/api/stock-logs", (req, res) => {
  const logs = readDataFile<StockLog[]>("stock_logs.json", initialStockLogs);
  res.json(logs);
});

// Security Packages
app.get("/api/packages", (req, res) => {
  const packages = readDataFile<SecurityPackage[]>("packages.json", initialPackages);
  res.json(packages);
});

app.post("/api/packages", (req, res) => {
  const packages = readDataFile<SecurityPackage[]>("packages.json", initialPackages);
  const newPkg: SecurityPackage = {
    id: `pkg-${Date.now()}`,
    title: req.body.title || "Custom Package",
    titleAr: req.body.titleAr || "باقة مخصصة",
    category: req.body.category || "residential",
    priceSAR: Number(req.body.priceSAR) || 1000,
    description: req.body.description || "",
    descriptionAr: req.body.descriptionAr || "",
    features: Array.isArray(req.body.features) ? req.body.features : [],
    featuresAr: Array.isArray(req.body.featuresAr) ? req.body.featuresAr : [],
    includesInstallation: req.body.includesInstallation !== false,
    warrantyYears: Number(req.body.warrantyYears) || 2,
    badge: req.body.badge || "",
    badgeAr: req.body.badgeAr || ""
  };
  packages.unshift(newPkg);
  writeDataFile("packages.json", packages);
  res.status(201).json(newPkg);
});

app.put("/api/packages/:id", (req, res) => {
  const packages = readDataFile<SecurityPackage[]>("packages.json", initialPackages);
  const idx = packages.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Package not found" });
  packages[idx] = { ...packages[idx], ...req.body };
  writeDataFile("packages.json", packages);
  res.json(packages[idx]);
});

app.delete("/api/packages/:id", (req, res) => {
  const packages = readDataFile<SecurityPackage[]>("packages.json", initialPackages);
  const filtered = packages.filter(p => p.id !== req.params.id);
  writeDataFile("packages.json", filtered);
  res.json({ success: true });
});

// Invoices / Quotations
app.get("/api/invoices", (req, res) => {
  const invoices = readDataFile<Invoice[]>("invoices.json", initialInvoices);
  res.json(invoices);
});

app.post("/api/invoices", (req, res) => {
  const invoices = readDataFile<Invoice[]>("invoices.json", initialInvoices);
  const body = req.body;

  const items = Array.isArray(body.items) ? body.items : [];
  const subtotal = items.reduce((sum: number, it: any) => sum + (Number(it.totalSAR) || (Number(it.quantity) * Number(it.unitPriceSAR)) || 0), 0);
  const vatRate = 0.15;
  const vatAmount = subtotal * vatRate;
  const total = subtotal + vatAmount;

  const count = invoices.length + 1;
  const prefix = body.type === "tax_invoice" ? "INV" : "QUO";
  const invoiceNumber = body.invoiceNumber || `${prefix}-2026-${count.toString().padStart(4, "0")}`;

  const newInvoice: Invoice = {
    id: `inv-${Date.now()}`,
    invoiceNumber,
    type: body.type || "quotation",
    clientName: body.clientName || "Client",
    clientPhone: body.clientPhone || "",
    clientAddress: body.clientAddress || "Jeddah, Saudi Arabia",
    district: body.district || "Jeddah",
    date: body.date || new Date().toISOString().split("T")[0],
    validUntil: body.validUntil || new Date(Date.now() + 15 * 86400000).toISOString().split("T")[0],
    items,
    subtotalSAR: Math.round(subtotal * 100) / 100,
    vatRate,
    vatAmountSAR: Math.round(vatAmount * 100) / 100,
    totalSAR: Math.round(total * 100) / 100,
    status: body.status || "draft",
    paymentMethod: body.paymentMethod || "mada",
    notes: body.notes || "Abu Bandar Electronics - Jeddah. All equipment guaranteed with authorized distributor warranty."
  };

  invoices.unshift(newInvoice);
  writeDataFile("invoices.json", invoices);
  res.status(201).json(newInvoice);
});

app.put("/api/invoices/:id", (req, res) => {
  const invoices = readDataFile<Invoice[]>("invoices.json", initialInvoices);
  const idx = invoices.findIndex((i) => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Invoice not found" });

  const existing = invoices[idx];
  const items = req.body.items ? req.body.items : existing.items;
  const subtotal = items.reduce((sum: number, it: any) => sum + (Number(it.totalSAR) || (Number(it.quantity) * Number(it.unitPriceSAR)) || 0), 0);
  const vatRate = 0.15;
  const vatAmount = subtotal * vatRate;
  const total = subtotal + vatAmount;

  const updated: Invoice = {
    ...existing,
    ...req.body,
    items,
    subtotalSAR: Math.round(subtotal * 100) / 100,
    vatAmountSAR: Math.round(vatAmount * 100) / 100,
    totalSAR: Math.round(total * 100) / 100
  };

  invoices[idx] = updated;
  writeDataFile("invoices.json", invoices);
  res.json(updated);
});

app.delete("/api/invoices/:id", (req, res) => {
  const invoices = readDataFile<Invoice[]>("invoices.json", initialInvoices);
  const filtered = invoices.filter((i) => i.id !== req.params.id);
  writeDataFile("invoices.json", filtered);
  res.json({ success: true });
});

// Service Inquiries
app.get("/api/inquiries", (req, res) => {
  const inquiries = readDataFile<ServiceInquiry[]>("inquiries.json", initialInquiries);
  res.json(inquiries);
});

app.post("/api/inquiries", (req, res) => {
  const inquiries = readDataFile<ServiceInquiry[]>("inquiries.json", initialInquiries);
  const body = req.body;

  const newInquiry: ServiceInquiry = {
    id: `inq-${Date.now()}`,
    customerName: body.customerName || "Customer",
    phone: body.phone || "",
    district: body.district || "Jeddah",
    propertyType: body.propertyType || "villa",
    serviceType: body.serviceType || "cctv_installation",
    preferredDate: body.preferredDate || "",
    notes: body.notes || "",
    status: "new",
    createdAt: new Date().toISOString()
  };

  inquiries.unshift(newInquiry);
  writeDataFile("inquiries.json", inquiries);
  res.status(201).json(newInquiry);
});

app.put("/api/inquiries/:id", (req, res) => {
  const inquiries = readDataFile<ServiceInquiry[]>("inquiries.json", initialInquiries);
  const idx = inquiries.findIndex((i) => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Inquiry not found" });

  inquiries[idx] = { ...inquiries[idx], ...req.body };
  writeDataFile("inquiries.json", inquiries);
  res.json(inquiries[idx]);
});

app.delete("/api/inquiries/:id", (req, res) => {
  const inquiries = readDataFile<ServiceInquiry[]>("inquiries.json", initialInquiries);
  const filtered = inquiries.filter((i) => i.id !== req.params.id);
  writeDataFile("inquiries.json", filtered);
  res.json({ success: true });
});

// AI Security Advisor & System Calculator
app.post("/api/ai/estimate", async (req, res) => {
  const { propertyType, areaSquareMeters, entrancesCount, outdoorAreas, priority, budgetLevel, notes } = req.body;

  const ai = getGeminiClient();
  if (!ai) {
    // Graceful smart rule-based fallback if no Gemini API key configured
    const estCameras = Math.max(4, Math.ceil((Number(areaSquareMeters) || 200) / 50) + (Number(entrancesCount) || 2));
    const hddTB = estCameras <= 4 ? 2 : estCameras <= 8 ? 4 : 8;
    const estCost = estCameras * 450 + 800 + (hddTB * 100);

    return res.json({
      success: true,
      aiPowered: false,
      summary: `Recommended setup for ${propertyType || "property"} (${areaSquareMeters || "approx"} sqm) in Jeddah: ${estCameras} cameras with ${hddTB}TB surveillance storage.`,
      summaryAr: `التوصية المقترحة لموقعكم في جدة: عدد ${estCameras} كاميرات مراقبة مع قرص صلب بسعة ${hddTB} تيرابايت لتغطية المداخل والمحيط الخارجي.`,
      recommendedCameras: estCameras,
      nvrChannels: estCameras <= 4 ? 4 : estCameras <= 8 ? 8 : 16,
      storageTB: hddTB,
      retentionDaysEstimate: 30,
      keyRecommendations: [
        "Use 4MP ColorVu for main entrance & perimeter for 24/7 color visibility under Jeddah night street lighting.",
        "Install AcuSense smart filtering to prevent false alarms from stray animals and wind.",
        "Ensure UV-resistant outdoor conduit pipes to withstand Jeddah humidity and summer heat.",
        "Equip central UPS backup for continuous operation during power fluctuations."
      ],
      keyRecommendationsAr: [
        "استخدام كاميرات 4K كولورفيو للمداخل الرئيسية والمحيط لتوفير تصوير ملون ليلي واضح.",
        "تفعيل الذكاء الاصطناعي AcuSense لتفادي الإنذارات الكاذبة الناتجة عن الرياح أو الحيوانات.",
        "استخدام مواسير وتمديدات معزولة ضد حرارة ورطوبة جدة العالية لضمان استدامة الكابلات.",
        "توفير جهاز تزويد طاقة UPS لحماية المسجل من تذبذب التيار الكهربائي."
      ],
      estimatedCostRangeSAR: {
        min: Math.round(estCost * 0.85),
        max: Math.round(estCost * 1.15)
      }
    });
  }

  try {
    const prompt = `You are the chief security systems consultant at 'Abu Bandar Electronics' (ابو بندر إلكترونيات) in Jeddah, Saudi Arabia.
A customer has requested an intelligent security system consultation for their property.
Details:
- Property Type: ${propertyType || "Villa"}
- Area: ${areaSquareMeters || "350"} sqm
- Entrances / Gates: ${entrancesCount || "2"}
- Outdoor perimeter: ${outdoorAreas || "Front yard, side passage, parking"}
- Customer Priority: ${priority || "High quality night color recording and mobile app view"}
- Budget Level: ${budgetLevel || "Standard"}
- Customer Notes: ${notes || "None"}

Please analyze and return a JSON object ONLY with the following schema:
{
  "summary": "English summary of recommendations",
  "summaryAr": "Arabic professional summary of recommendations for Saudi client",
  "recommendedCameras": 4,
  "nvrChannels": 8,
  "storageTB": 4,
  "retentionDaysEstimate": 35,
  "keyRecommendations": ["string", "string", "string", "string"],
  "keyRecommendationsAr": ["نص عربي", "نص عربي", "نص عربي", "نص عربي"],
  "estimatedCostRangeSAR": { "min": 2400, "max": 3200 }
}
Consider Jeddah weather (heat and high humidity, requiring IP67 and UV protection), Saudi Civil Defense (SAPHCA/MOI) CCTV regulations, and best practices.
Return valid JSON only.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    const parsed = JSON.parse(text);
    res.json({
      success: true,
      aiPowered: true,
      ...parsed
    });
  } catch (err: any) {
    console.error("AI estimation error:", err);
    res.status(500).json({
      error: "Failed to generate AI estimate",
      details: err?.message || String(err)
    });
  }
});

// Vite & Static file handling
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Abu Bandar Electronics server running on port ${PORT}`);
  });
}

startServer();
