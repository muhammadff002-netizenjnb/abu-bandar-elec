export type InventoryCategory = 
  | 'cctv_cameras' 
  | 'nvrs_dvrs' 
  | 'access_control' 
  | 'smart_locks' 
  | 'video_intercom' 
  | 'storage_hdd' 
  | 'networking_cables' 
  | 'power_supplies' 
  | 'accessories';

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  nameAr: string;
  category: InventoryCategory;
  brand: string;
  model: string;
  stock: number;
  minStockAlert: number;
  unitPriceSAR: number;
  costPriceSAR: number;
  location: string; // e.g., 'Shelf A-3, As Salamah Store'
  warrantyMonths: number;
  description: string;
  descriptionAr: string;
  specs: string[];
  imageUrl?: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  lastUpdated: string;
}

export interface StockLog {
  id: string;
  itemId: string;
  itemName: string;
  change: number;
  previousStock: number;
  newStock: number;
  reason: 'restock' | 'sale_installation' | 'return' | 'damaged' | 'audit_adjustment';
  notes?: string;
  date: string;
}

export interface SecurityPackage {
  id: string;
  title: string;
  titleAr: string;
  category: 'residential' | 'commercial' | 'access_intercom' | 'maintenance';
  priceSAR: number;
  description: string;
  descriptionAr: string;
  features: string[];
  featuresAr: string[];
  includesInstallation: boolean;
  warrantyYears: number;
  badge?: string;
  badgeAr?: string;
}

export interface InvoiceItem {
  itemId?: string;
  description: string;
  quantity: number;
  unitPriceSAR: number;
  totalSAR: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  type: 'quotation' | 'tax_invoice';
  clientName: string;
  clientPhone: string;
  clientAddress: string;
  district: string; // e.g. 'As Salamah, Jeddah'
  date: string;
  validUntil: string;
  items: InvoiceItem[];
  subtotalSAR: number;
  vatRate: number; // 0.15 for Saudi Arabia 15% VAT
  vatAmountSAR: number;
  totalSAR: number;
  status: 'draft' | 'sent' | 'approved' | 'paid' | 'cancelled';
  paymentMethod?: 'cash' | 'mada' | 'bank_transfer' | 'credit';
  notes?: string;
}

export interface ServiceInquiry {
  id: string;
  customerName: string;
  phone: string;
  district: string;
  propertyType: 'villa' | 'apartment' | 'commercial_shop' | 'office' | 'warehouse' | 'building';
  serviceType: 'cctv_installation' | 'smart_lock' | 'access_control' | 'intercom' | 'maintenance_repair';
  preferredDate?: string;
  notes: string;
  status: 'new' | 'contacted' | 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface BusinessInfo {
  name: string;
  nameAr: string;
  tagline: string;
  taglineAr: string;
  rating: number;
  reviewCount: number;
  category: string;
  categoryAr: string;
  address: string;
  addressAr: string;
  city: string;
  cityAr: string;
  phone: string;
  whatsapp: string;
  hours: string;
  hoursAr: string;
  crNumber: string; // Commercial Registration
  vatNumber: string; // ZATCA Tax ID
  googleMapsUrl: string;
  logoUrl?: string;
}
