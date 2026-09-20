/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { PublicWebsite } from './components/PublicWebsite.tsx';
import { AdminLoginModal } from './components/AdminLoginModal.tsx';
import { InventoryManager } from './components/InventoryManager.tsx';
import { PackageShowcase } from './components/PackageShowcase.tsx';
import { InvoiceBuilder } from './components/InvoiceBuilder.tsx';
import { AISecurityAdvisor } from './components/AISecurityAdvisor.tsx';
import { InquiryManager } from './components/InquiryManager.tsx';
import { BusinessProfileView } from './components/BusinessProfileView.tsx';
import { 
  InventoryItem, SecurityPackage, Invoice, ServiceInquiry, BusinessInfo, StockLog 
} from './types.ts';
import { Phone, MessageCircle, RefreshCw, AlertCircle, Shield } from 'lucide-react';

const DEFAULT_BUSINESS: BusinessInfo = {
  name: 'Abu Bandar Electronics',
  nameAr: 'ابو بندر إلكترونيات',
  tagline: 'Specialized Security System Installation & Smart Electronics in Jeddah',
  taglineAr: 'خدمات توريد وتركيب الأنظمة الأمنية وكاميرات المراقبة المعتمدة في جدة',
  rating: 5.0,
  reviewCount: 2,
  category: 'Security system installation service',
  categoryAr: 'خدمة تركيب وتوريد أنظمة المراقبة والحماية الأمنية',
  address: 'Khalid Bin Waleed St, As Salamah, Jeddah 23525, Saudi Arabia',
  addressAr: 'شارع خالد بن الوليد، حي السلامة، جدة 23525، المملكة العربية السعودية',
  city: 'Jeddah',
  cityAr: 'جدة',
  phone: '+966 59 229 4435',
  whatsapp: '+966592294435',
  hours: 'Open 24 hours',
  hoursAr: 'مفتوح على مدار 24 ساعة',
  crNumber: '4030198421',
  vatNumber: '310492837100003',
  googleMapsUrl: 'https://maps.google.com/?q=Abu+Bandar+Electronics+ابو+بندر+إلكترونيات+Khalid+Bin+Waleed+As+Salamah+Jeddah',
  logoUrl: '/logo.jpg',
};

export default function App() {
  const [lang, setLangState] = useState<'ar' | 'en'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('abu_bandar_lang');
      if (saved === 'ar' || saved === 'en') return saved;
    }
    return 'ar';
  });

  const setLang = (newLang: 'ar' | 'en') => {
    setLangState(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('abu_bandar_lang', newLang);
    }
  };

  // View mode: 'public' for public customers (inventory hidden), 'admin' for staff/owner
  const [viewMode, setViewMode] = useState<'public' | 'admin'>('public');
  const [adminTab, setAdminTab] = useState<'inventory' | 'packages' | 'invoices' | 'ai_advisor' | 'inquiries' | 'profile'>('inventory');
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  const [business, setBusiness] = useState<BusinessInfo>(DEFAULT_BUSINESS);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [packages, setPackages] = useState<SecurityPackage[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [inquiries, setInquiries] = useState<ServiceInquiry[]>([]);
  const [stockLogs, setStockLogs] = useState<StockLog[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prefilledInvoice, setPrefilledInvoice] = useState<Partial<Invoice> | null>(null);

  const isAr = lang === 'ar';

  // Sync document direction
  useEffect(() => {
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';
    document.documentElement.lang = isAr ? 'ar' : 'en';
  }, [lang, isAr]);

  // Initial Data Fetch
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [bizRes, invRes, pkgRes, invcRes, inqRes, logsRes] = await Promise.all([
        fetch('/api/business'),
        fetch('/api/inventory'),
        fetch('/api/packages'),
        fetch('/api/invoices'),
        fetch('/api/inquiries'),
        fetch('/api/stock-logs'),
      ]);

      if (bizRes.ok) setBusiness(await bizRes.json());
      if (invRes.ok) setInventory(await invRes.json());
      if (pkgRes.ok) setPackages(await pkgRes.json());
      if (invcRes.ok) setInvoices(await invcRes.json());
      if (inqRes.ok) setInquiries(await inqRes.json());
      if (logsRes.ok) setStockLogs(await logsRes.json());
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(isAr ? 'تعذر الاتصال بالخادم، جاري استخدام البيانات المحلية' : 'Failed to connect to backend server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Inventory CRUD handlers
  const handleAddItem = async (newItem: Partial<InventoryItem>) => {
    const res = await fetch('/api/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem),
    });
    if (!res.ok) throw new Error('Failed to create inventory item');
    const created = await res.json();
    setInventory((prev) => [created, ...prev]);

    // Refresh stock logs
    const logsRes = await fetch('/api/stock-logs');
    if (logsRes.ok) setStockLogs(await logsRes.json());
  };

  const handleUpdateItem = async (id: string, updated: Partial<InventoryItem>) => {
    const res = await fetch(`/api/inventory/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
    if (!res.ok) throw new Error('Failed to update inventory item');
    const saved = await res.json();
    setInventory((prev) => prev.map((item) => (item.id === id ? saved : item)));
  };

  const handleDeleteItem = async (id: string) => {
    const res = await fetch(`/api/inventory/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete item');
    setInventory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAllInventory = async () => {
    const res = await fetch('/api/inventory/clear-all', { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to clear inventory');
    setInventory([]);
    setStockLogs([]);
  };

  const handleAdjustStock = async (id: string, delta: number, reason: string, notes?: string) => {
    const res = await fetch(`/api/inventory/${id}/adjust-stock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ delta, reason, notes }),
    });
    if (!res.ok) throw new Error('Failed to adjust stock');
    const updatedItem = await res.json();
    setInventory((prev) => prev.map((item) => (item.id === id ? updatedItem : item)));

    // Refresh logs
    const logsRes = await fetch('/api/stock-logs');
    if (logsRes.ok) setStockLogs(await logsRes.json());
  };

  // Invoice handlers
  const handleCreateInvoice = async (invoiceData: Partial<Invoice>) => {
    const res = await fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoiceData),
    });
    if (!res.ok) throw new Error('Failed to create invoice');
    const newInvoice = await res.json();
    setInvoices((prev) => [newInvoice, ...prev]);

    // Refresh inventory and logs
    fetchData();
  };

  const handleUpdateInvoiceStatus = async (id: string, status: Invoice['status'], paymentMethod?: Invoice['paymentMethod']) => {
    const res = await fetch(`/api/invoices/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, paymentMethod }),
    });
    if (!res.ok) throw new Error('Failed to update invoice status');
    const updated = await res.json();
    setInvoices((prev) => prev.map((inv) => (inv.id === id ? updated : inv)));
  };

  const handleDeleteInvoice = async (id: string) => {
    const res = await fetch(`/api/invoices/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete invoice');
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
  };

  // Inquiry handlers
  const handleCreateInquiry = async (inquiryData: Partial<ServiceInquiry>) => {
    const res = await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiryData),
    });
    if (!res.ok) throw new Error('Failed to submit inquiry');
    const created = await res.json();
    setInquiries((prev) => [created, ...prev]);
  };

  const handleUpdateInquiryStatus = async (id: string, status: ServiceInquiry['status'], scheduledVisitDate?: string) => {
    const res = await fetch(`/api/inquiries/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, scheduledVisitDate }),
    });
    if (!res.ok) throw new Error('Failed to update inquiry status');
    const updated = await res.json();
    setInquiries((prev) => prev.map((inq) => (inq.id === id ? updated : inq)));
  };

  const handleDeleteInquiry = async (id: string) => {
    const res = await fetch(`/api/inquiries/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete inquiry');
    setInquiries((prev) => prev.filter((inq) => inq.id !== id));
  };

  // Business profile update
  const handleUpdateBusiness = async (updated: Partial<BusinessInfo>) => {
    const res = await fetch('/api/business', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
    if (!res.ok) throw new Error('Failed to update business profile');
    const saved = await res.json();
    setBusiness(saved);
  };

  // Action helpers to bridge packages/AI into invoice builder
  const handleSelectPackageForQuote = (pkg: SecurityPackage) => {
    const items = pkg.features.map((feat, idx) => ({
      itemId: `pkg-item-${idx}`,
      description: feat,
      quantity: 1,
      unitPriceSAR: Math.round(pkg.priceSAR / (pkg.features.length || 1)),
      totalSAR: Math.round(pkg.priceSAR / (pkg.features.length || 1)),
    }));

    setPrefilledInvoice({
      clientName: '',
      clientPhone: '',
      notes: isAr ? `طلب عرض سعر خاص بباقة: ${pkg.titleAr}` : `Quotation request for package: ${pkg.title}`,
      items,
      type: 'quotation',
    });
    setViewMode('admin');
    setAdminTab('invoices');
  };

  const handleApplyEstimateToQuote = (estimateData: {
    clientType: string;
    totalCameras: number;
    estimatedCostSAR: number;
    recommendations: string[];
  }) => {
    const items = [
      {
        itemId: 'ai-cctv-sys',
        description: isAr 
          ? `نظام كاميرات مراقبة متكامل (${estimateData.totalCameras} كاميرات)`
          : `Complete CCTV System (${estimateData.totalCameras} cameras)`,
        quantity: 1,
        unitPriceSAR: estimateData.estimatedCostSAR,
        totalSAR: estimateData.estimatedCostSAR,
      },
    ];

    setPrefilledInvoice({
      clientName: '',
      clientPhone: '',
      notes: isAr
        ? `تقدير المستشار الذكي: ${estimateData.recommendations.join(' | ')}`
        : `AI Estimate notes: ${estimateData.recommendations.join(' | ')}`,
      items,
      type: 'quotation',
    });
    setViewMode('admin');
    setAdminTab('invoices');
  };

  const lowStockCount = inventory.filter((i) => i.status === 'low_stock' || i.status === 'out_of_stock').length;
  const newInquiryCount = inquiries.filter((i) => i.status === 'new').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        business={business}
        viewMode={viewMode}
        setViewMode={setViewMode}
        adminTab={adminTab}
        setAdminTab={setAdminTab}
        lang={lang}
        setLang={setLang}
        lowStockCount={lowStockCount}
        inquiryCount={newInquiryCount}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchData}
              className="text-amber-400 hover:underline text-xs font-semibold cursor-pointer"
            >
              {isAr ? 'إعادة المحاولة' : 'Retry'}
            </button>
          </div>
        )}

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-8 h-8 text-amber-500 animate-spin" />
            <p className="text-sm font-semibold text-slate-400">
              {isAr ? 'جاري تحميل موقع ابو بندر إلكترونيات...' : 'Loading Abu Bandar Electronics...'}
            </p>
          </div>
        ) : (
          <>
            {/* PUBLIC WEBSITE VIEW: Default for all visitors. Inventory is completely hidden! */}
            {viewMode === 'public' && (
              <PublicWebsite
                business={business}
                packages={packages}
                lang={lang}
                onBookSurvey={handleCreateInquiry}
                onOpenAdmin={() => setIsAdminLoginOpen(true)}
              />
            )}

            {/* ADMIN / STAFF PORTAL VIEW: Accessible only to staff/owner */}
            {viewMode === 'admin' && (
              <div className="space-y-6 animate-in fade-in">
                {adminTab === 'inventory' && (
                  <InventoryManager
                    items={inventory}
                    stockLogs={stockLogs}
                    onAddItem={handleAddItem}
                    onUpdateItem={handleUpdateItem}
                    onDeleteItem={handleDeleteItem}
                    onClearAll={handleClearAllInventory}
                    onAdjustStock={handleAdjustStock}
                    onRefresh={fetchData}
                    lang={lang}
                  />
                )}

                {adminTab === 'packages' && (
                  <PackageShowcase
                    packages={packages}
                    business={business}
                    onSelectPackageForQuote={handleSelectPackageForQuote}
                    lang={lang}
                  />
                )}

                {adminTab === 'invoices' && (
                  <InvoiceBuilder
                    invoices={invoices}
                    inventory={inventory}
                    business={business}
                    onCreateInvoice={handleCreateInvoice}
                    onUpdateInvoiceStatus={handleUpdateInvoiceStatus}
                    onDeleteInvoice={handleDeleteInvoice}
                    prefilledInvoiceData={prefilledInvoice}
                    onClearPrefilled={() => setPrefilledInvoice(null)}
                    lang={lang}
                  />
                )}

                {adminTab === 'ai_advisor' && (
                  <AISecurityAdvisor
                    business={business}
                    onApplyEstimateToQuote={handleApplyEstimateToQuote}
                    lang={lang}
                  />
                )}

                {adminTab === 'inquiries' && (
                  <InquiryManager
                    inquiries={inquiries}
                    business={business}
                    onCreateInquiry={handleCreateInquiry}
                    onUpdateStatus={handleUpdateInquiryStatus}
                    onDeleteInquiry={handleDeleteInquiry}
                    lang={lang}
                  />
                )}

                {adminTab === 'profile' && (
                  <BusinessProfileView
                    business={business}
                    onUpdateBusiness={handleUpdateBusiness}
                    lang={lang}
                  />
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => {
          setIsAdminLoginOpen(false);
          setViewMode('admin');
        }}
        lang={lang}
      />

      {/* Floating 24/7 Support & Quick Contact Widget */}
      <div className="fixed bottom-4 right-4 rtl:right-auto rtl:left-4 z-40 flex flex-col items-end rtl:items-start gap-2 no-print">
        <a
          href={`https://wa.me/${business.whatsapp.replace('+', '')}?text=${encodeURIComponent(
            isAr
              ? 'السلام عليكم ابو بندر إلكترونيات، أحتاج استشارة فورية لتركيب أنظمة أمنية وكاميرات في جدة'
              : 'Hello Abu Bandar Electronics, I need immediate security assistance in Jeddah.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-2xl shadow-emerald-600/40 hover:scale-105 transition-all cursor-pointer border border-emerald-400/30"
          title="WhatsApp 24/7"
        >
          <MessageCircle className="w-5 h-5 fill-white" />
          <span className="hidden sm:inline">{isAr ? 'واتساب مباشر 24 ساعة' : 'WhatsApp 24/7'}</span>
        </a>

        <a
          href={`tel:${business.phone}`}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-amber-400 font-bold text-xs shadow-xl border border-amber-500/30 hover:scale-105 transition-all cursor-pointer backdrop-blur"
          title="Call Technician"
        >
          <Phone className="w-4 h-4" />
          <span dir="ltr">{business.phone}</span>
        </a>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-6 text-xs text-slate-500 no-print mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-500" />
            <span className="text-slate-400 font-semibold">
              {isAr ? 'مؤسسة ابو بندر إلكترونيات - جدة' : 'Abu Bandar Electronics - Jeddah'}
            </span>
            <span>•</span>
            <span>{isAr ? 'س.ت:' : 'CR:'} {business.crNumber}</span>
            <span>•</span>
            <span>{isAr ? 'الرقم الضريبي:' : 'VAT:'} {business.vatNumber}</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>{isAr ? 'شارع خالد بن الوليد، حي السلامة، جدة 23525' : 'Khalid Bin Waleed, As Salamah, Jeddah'}</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">{isAr ? 'خدمة 24 ساعة' : 'Open 24 Hours'}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
