import React, { useState } from 'react';
import { 
  FileText, Plus, Trash2, Printer, CheckCircle, Clock, 
  Send, DollarSign, Shield, X, Eye, Download, Phone, MapPin, Building
} from 'lucide-react';
import { Invoice, InvoiceItem, InventoryItem, BusinessInfo } from '../types.ts';

interface InvoiceBuilderProps {
  invoices: Invoice[];
  inventory: InventoryItem[];
  business: BusinessInfo;
  onCreateInvoice: (inv: Partial<Invoice>) => Promise<void>;
  onUpdateInvoiceStatus: (id: string, status: Invoice['status']) => Promise<void>;
  onDeleteInvoice: (id: string) => Promise<void>;
  prefilledInvoiceData?: Partial<Invoice> | null;
  onClearPrefilled?: () => void;
  lang: 'ar' | 'en';
}

export const InvoiceBuilder: React.FC<InvoiceBuilderProps> = ({
  invoices,
  inventory,
  business,
  onCreateInvoice,
  onUpdateInvoiceStatus,
  onDeleteInvoice,
  prefilledInvoiceData,
  onClearPrefilled,
  lang,
}) => {
  const isAr = lang === 'ar';

  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState<Invoice | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Invoice>>({
    type: 'quotation',
    clientName: '',
    clientPhone: '',
    clientAddress: 'Jeddah, Saudi Arabia',
    district: 'As Salamah',
    date: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
    paymentMethod: 'mada',
    notes: 'Abu Bandar Electronics - All equipment guaranteed with 2-year authorized agent warranty.',
    items: [
      {
        description: 'Hikvision 4K CCTV Camera + High Quality Installation',
        quantity: 4,
        unitPriceSAR: 350,
        totalSAR: 1400,
      },
    ],
  });

  const [saving, setSaving] = useState(false);

  // Handle prefilled data from packages
  React.useEffect(() => {
    if (prefilledInvoiceData) {
      setFormData({
        ...formData,
        ...prefilledInvoiceData,
      });
      setActiveTab('create');
      if (onClearPrefilled) onClearPrefilled();
    }
  }, [prefilledInvoiceData]);

  // Calculations
  const calculateSubtotal = (items: InvoiceItem[] = []) => {
    return items.reduce((sum, item) => sum + (Number(item.totalSAR) || 0), 0);
  };

  const handleAddItemFromInventory = (itemId: string) => {
    const invItem = inventory.find((i) => i.id === itemId);
    if (!invItem) return;

    const newItem: InvoiceItem = {
      itemId: invItem.id,
      description: `${isAr ? invItem.nameAr : invItem.name} (${invItem.brand} ${invItem.model})`,
      quantity: 1,
      unitPriceSAR: invItem.unitPriceSAR,
      totalSAR: invItem.unitPriceSAR,
    };

    const currentItems = formData.items || [];
    setFormData({
      ...formData,
      items: [...currentItems, newItem],
    });
  };

  const handleAddCustomLine = () => {
    const newItem: InvoiceItem = {
      description: '',
      quantity: 1,
      unitPriceSAR: 100,
      totalSAR: 100,
    };
    const currentItems = formData.items || [];
    setFormData({
      ...formData,
      items: [...currentItems, newItem],
    });
  };

  const handleUpdateItemLine = (index: number, field: keyof InvoiceItem, value: any) => {
    const currentItems = [...(formData.items || [])];
    const target = { ...currentItems[index] };

    if (field === 'quantity') {
      target.quantity = Number(value) || 1;
      target.totalSAR = target.quantity * target.unitPriceSAR;
    } else if (field === 'unitPriceSAR') {
      target.unitPriceSAR = Number(value) || 0;
      target.totalSAR = target.quantity * target.unitPriceSAR;
    } else if (field === 'description') {
      target.description = value;
    }

    currentItems[index] = target;
    setFormData({ ...formData, items: currentItems });
  };

  const handleRemoveLine = (index: number) => {
    const currentItems = (formData.items || []).filter((_, i) => i !== index);
    setFormData({ ...formData, items: currentItems });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName?.trim()) {
      alert(isAr ? 'يرجى كتابة اسم العميل' : 'Please enter client name');
      return;
    }
    if (!formData.items || formData.items.length === 0) {
      alert(isAr ? 'يرجى إضافة بند واحد على الأقل' : 'Please add at least one line item');
      return;
    }

    setSaving(true);
    try {
      await onCreateInvoice(formData);
      setActiveTab('list');
      setFormData({
        type: 'quotation',
        clientName: '',
        clientPhone: '',
        clientAddress: 'Jeddah, Saudi Arabia',
        district: 'As Salamah',
        date: new Date().toISOString().split('T')[0],
        validUntil: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
        paymentMethod: 'mada',
        notes: 'Abu Bandar Electronics - All equipment guaranteed with 2-year authorized agent warranty.',
        items: [],
      });
    } catch (err: any) {
      alert(err?.message || 'Failed to create invoice');
    } finally {
      setSaving(false);
    }
  };

  const currentSubtotal = calculateSubtotal(formData.items);
  const currentVat = currentSubtotal * 0.15;
  const currentTotal = currentSubtotal + currentVat;

  return (
    <div className="space-y-6">
      {/* Top Bar Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-amber-400" />
            <span>{isAr ? 'عروض الأسعار والفواتير الضريبية' : 'Quotations & Tax Invoices'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            {isAr
              ? 'إنشاء وطباعة عروض أسعار وفواتير معتمدة لضريبة القيمة المضافة 15% باسم مؤسسة ابو بندر إلكترونيات'
              : 'Create and print official 15% VAT quotations & tax invoices for Abu Bandar Electronics clients in Jeddah'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'list'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            {isAr ? 'قائمة الفواتير والعروض' : 'Invoice Archive'} ({invoices.length})
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'create'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'إنشاء فاتورة / عرض جديد' : 'New Quote / Invoice'}</span>
          </button>
        </div>
      </div>

      {/* CREATE TAB */}
      {activeTab === 'create' && (
        <form onSubmit={handleSubmit} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="border-b border-slate-800 pb-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="invType"
                  value="quotation"
                  checked={formData.type === 'quotation'}
                  onChange={() => setFormData({ ...formData, type: 'quotation' })}
                  className="accent-amber-500"
                />
                <span className="text-sm font-bold text-white">
                  {isAr ? 'عرض سعر رسمي (Quotation)' : 'Quotation'}
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="invType"
                  value="tax_invoice"
                  checked={formData.type === 'tax_invoice'}
                  onChange={() => setFormData({ ...formData, type: 'tax_invoice' })}
                  className="accent-amber-500"
                />
                <span className="text-sm font-bold text-white">
                  {isAr ? 'فاتورة ضريبية معتمدة (Tax Invoice)' : 'Tax Invoice'}
                </span>
              </label>
            </div>

            <div className="text-xs text-slate-400">
              <span>{isAr ? 'الرقم الضريبي:' : 'VAT ID:'} </span>
              <strong className="text-amber-400 font-mono">{business.vatNumber}</strong>
            </div>
          </div>

          {/* Client & Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isAr ? 'اسم العميل / المنشأة' : 'Client / Company Name'} *
              </label>
              <input
                type="text"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                placeholder={isAr ? 'مثال: عبدالمجيد السلمي أو مؤسسة الروابي' : 'e.g. Abdulmajeed Al-Salmi or Al-Rawabi Est.'}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isAr ? 'رقم جوال العميل' : 'Client Phone'}
              </label>
              <input
                type="text"
                value={formData.clientPhone}
                onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                placeholder="+966 5X XXX XXXX"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isAr ? 'الحي / العنوان بجدة' : 'District / Address in Jeddah'}
              </label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                placeholder={isAr ? 'حي السلامة، شارع خالد بن الوليد' : 'As Salamah, Khalid Bin Waleed St'}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isAr ? 'تاريخ الإصدار' : 'Issue Date'}
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isAr ? 'صلاحية العرض حتى' : 'Valid Until'}
              </label>
              <input
                type="date"
                value={formData.validUntil}
                onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isAr ? 'طريقة السداد المقترحة' : 'Payment Method'}
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              >
                <option value="mada">{isAr ? 'مدى / بطاقة بنكية' : 'Mada Card'}</option>
                <option value="bank_transfer">{isAr ? 'تحويل بنكي رسمي' : 'Bank Transfer'}</option>
                <option value="cash">{isAr ? 'نقداً عند اكتمال التركيب' : 'Cash upon completion'}</option>
              </select>
            </div>
          </div>

          {/* Quick Insert from Current Inventory */}
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400">
                {isAr ? 'إدراج سريع من مستودع الأجهزة الحالي:' : 'Quick Add Item From Inventory:'}
              </span>
              <span className="text-[11px] text-slate-400">
                {inventory.length} {isAr ? 'أصناف متوفرة' : 'items available'}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {inventory.slice(0, 8).map((inv) => (
                <button
                  key={inv.id}
                  type="button"
                  onClick={() => handleAddItemFromInventory(inv.id)}
                  className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3 h-3 text-amber-400" />
                  <span>{isAr ? inv.nameAr : inv.name}</span>
                  <span className="text-amber-400 font-bold">({inv.unitPriceSAR} ر.س)</span>
                </button>
              ))}
            </div>
          </div>

          {/* Line Items Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">
                {isAr ? 'بنود ومواصفات العرض / الفاتورة' : 'Quotation Line Items'}
              </h3>
              <button
                type="button"
                onClick={handleAddCustomLine}
                className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-bold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAr ? 'إضافة بند مخصص' : 'Add Custom Line'}</span>
              </button>
            </div>

            <div className="space-y-2">
              {(formData.items || []).map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 gap-2 bg-slate-800/80 p-3 rounded-xl border border-slate-700 items-center"
                >
                  <div className="col-span-12 sm:col-span-6">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleUpdateItemLine(idx, 'description', e.target.value)}
                      placeholder={isAr ? 'وصف الصنف أو الخدمة (مثل: كاميرا، تمديد، برمجة)' : 'Description'}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleUpdateItemLine(idx, 'quantity', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white text-center font-bold focus:outline-none focus:border-amber-500"
                      placeholder={isAr ? 'الكمية' : 'Qty'}
                      required
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={item.unitPriceSAR}
                      onChange={(e) => handleUpdateItemLine(idx, 'unitPriceSAR', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-amber-400 text-center font-bold focus:outline-none focus:border-amber-500"
                      placeholder={isAr ? 'السعر' : 'Price'}
                      required
                    />
                  </div>
                  <div className="col-span-3 sm:col-span-1 text-center font-black text-amber-400 text-xs">
                    {item.totalSAR} <span className="text-[10px] text-slate-400">{isAr ? 'ر.س' : 'SAR'}</span>
                  </div>
                  <div className="col-span-1 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveLine(idx)}
                      className="p-1 text-slate-400 hover:text-rose-400 rounded cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals Summary */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-xs text-slate-400 max-w-md">
              <p className="font-semibold text-slate-300">
                {isAr ? 'شروط وضمان ابو بندر إلكترونيات:' : 'Terms & Warranty:'}
              </p>
              <p className="mt-0.5">
                {isAr
                  ? 'يشمل العرض ضمان سنتين على الكاميرات والمسجلات، وتوفير زيارة فنية طارئة مجانية خلال فترة الضمان بجدة.'
                  : 'Includes 2-year full hardware warranty and complimentary emergency technician visits in Jeddah.'}
              </p>
            </div>

            <div className="space-y-1 text-xs w-full sm:w-64 text-right rtl:text-right ltr:text-left">
              <div className="flex justify-between text-slate-400">
                <span>{isAr ? 'المجموع قبل الضريبة:' : 'Subtotal:'}</span>
                <span className="font-bold text-white">{currentSubtotal.toFixed(2)} ر.س</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{isAr ? 'ضريبة القيمة المضافة (15%):' : 'VAT (15%):'}</span>
                <span className="font-bold text-amber-400">{currentVat.toFixed(2)} ر.س</span>
              </div>
              <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-800">
                <span>{isAr ? 'الإجمالي النهائي:' : 'Total Amount:'}</span>
                <span className="text-amber-400">{currentTotal.toFixed(2)} ر.س</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setActiveTab('list')}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-xl cursor-pointer"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>
                {saving
                  ? isAr ? 'جاري الحفظ...' : 'Saving...'
                  : isAr ? 'حفظ وإصدار المستند' : 'Issue Document'}
              </span>
            </button>
          </div>
        </form>
      )}

      {/* ARCHIVE LIST TAB */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {invoices.map((inv) => {
              const isTaxInv = inv.type === 'tax_invoice';

              return (
                <div
                  key={inv.id}
                  className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 shadow-xl flex flex-col justify-between transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded">
                        {inv.invoiceNumber}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          inv.status === 'paid'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : inv.status === 'approved'
                            ? 'bg-cyan-500/20 text-cyan-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {inv.status === 'paid' && (isAr ? 'مدفوعة بالكامل' : 'Paid')}
                        {inv.status === 'approved' && (isAr ? 'معتمد من العميل' : 'Approved')}
                        {inv.status === 'sent' && (isAr ? 'مرسل للعميل' : 'Sent')}
                        {inv.status === 'draft' && (isAr ? 'مسودة' : 'Draft')}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white">{inv.clientName}</h4>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span>{inv.district}, {inv.clientAddress}</span>
                    </p>

                    <div className="my-3 py-2 border-y border-slate-800/80 text-xs space-y-1 text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-500">{isAr ? 'عدد البنود:' : 'Items count:'}</span>
                        <span>{inv.items.length} {isAr ? 'بنود' : 'items'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">{isAr ? 'التاريخ:' : 'Date:'}</span>
                        <span>{inv.date}</span>
                      </div>
                      <div className="flex justify-between font-bold text-amber-400 pt-1 text-sm">
                        <span>{isAr ? 'المبلغ الإجمالي شامل الضريبة:' : 'Total Amount (inc. VAT):'}</span>
                        <span>{inv.totalSAR.toLocaleString()} ر.س</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setSelectedInvoiceForPrint(inv)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold rounded-lg border border-slate-700 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{isAr ? 'عرض وطباعة' : 'View & Print'}</span>
                      </button>

                      {inv.clientPhone && (
                        <a
                          href={`https://wa.me/${inv.clientPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            isAr
                              ? `السلام عليكم ${inv.clientName}، مرفق لكم عرض السعر رقم ${inv.invoiceNumber} من مؤسسة ابو بندر إلكترونيات بجدة بقيمة ${inv.totalSAR} ر.س`
                              : `Hello ${inv.clientName}, attached is quotation ${inv.invoiceNumber} from Abu Bandar Electronics Jeddah for ${inv.totalSAR} SAR.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 rounded-lg border border-emerald-500/30 cursor-pointer"
                          title="Share on WhatsApp"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {inv.status !== 'paid' && (
                        <button
                          onClick={() => onUpdateInvoiceStatus(inv.id, 'paid')}
                          className="px-2 py-1 text-[11px] font-bold bg-emerald-600/30 text-emerald-300 rounded border border-emerald-500/30 hover:bg-emerald-600/50 cursor-pointer"
                        >
                          {isAr ? 'تعيين كمدفوعة' : 'Mark Paid'}
                        </button>
                      )}
                      <button
                        onClick={() => onDeleteInvoice(inv.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PRINT / PREVIEW MODAL */}
      {selectedInvoiceForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-2xl w-full max-w-3xl p-8 shadow-2xl space-y-6 my-8 border border-slate-200">
            {/* Action buttons (hidden when printed) */}
            <div className="flex items-center justify-between no-print border-b border-slate-200 pb-4">
              <span className="text-xs font-bold text-slate-500">
                {isAr ? 'معاينة المستند الرسمي للطباعة أو الحفظ كـ PDF' : 'Official Document Preview'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-md cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>{isAr ? 'طباعة / حفظ PDF' : 'Print / Save PDF'}</span>
                </button>
                <button
                  onClick={() => setSelectedInvoiceForPrint(null)}
                  className="p-2 text-slate-500 hover:text-slate-900 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Official Invoice Content */}
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between border-b-2 border-amber-600 pb-4">
                <div className="flex items-center gap-4">
                  <img
                    src={business.logoUrl || '/logo.jpg'}
                    alt={business.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 object-contain rounded-xl border border-slate-200 bg-white p-1 shadow-sm shrink-0"
                  />
                  <div>
                    <h2 className="text-xl font-black text-slate-950">
                      {isAr ? 'مؤسسة ابو بندر إلكترونيات' : 'Abu Bandar Electronics Est.'}
                    </h2>
                    <p className="text-sm font-bold text-slate-600">
                      {isAr ? 'ABU BANDAR ELECTRONICS' : 'مؤسسة ابو بندر إلكترونيات'}
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      {isAr
                        ? 'تركيب وتوريد وصيانة الأنظمة الأمنية وكاميرات المراقبة المعتمدة'
                        : 'Certified Security Systems & CCTV Installation & Maintenance'}
                    </p>
                    <p className="text-xs text-slate-600">
                      {isAr
                        ? `جدة - حي السلامة - شارع خالد بن الوليد | هاتف: ${business.phone}`
                        : `Jeddah - As Salamah - Khalid Bin Waleed St | Phone: ${business.phone}`}
                    </p>
                  </div>
                </div>

                <div className="text-left rtl:text-left ltr:text-right">
                  <div className="inline-block bg-amber-100 text-amber-900 px-3 py-1 rounded text-sm font-black mb-1">
                    {selectedInvoiceForPrint.type === 'tax_invoice'
                      ? (isAr ? 'فاتورة ضريبية' : 'TAX INVOICE')
                      : (isAr ? 'عرض سعر رسمي' : 'OFFICIAL QUOTATION')}
                  </div>
                  <p className="text-xs font-mono font-bold text-slate-700">
                    {selectedInvoiceForPrint.invoiceNumber}
                  </p>
                  <p className="text-xs text-slate-500">
                    {isAr ? 'التاريخ:' : 'Date:'} {selectedInvoiceForPrint.date}
                  </p>
                  <p className="text-xs text-slate-500">
                    {isAr ? 'الرقم الضريبي:' : 'VAT ID:'} {business.vatNumber}
                  </p>
                </div>
              </div>

              {/* Client Box */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-slate-500 font-semibold">{isAr ? 'السادة العميل:' : 'Customer / Company:'}</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{selectedInvoiceForPrint.clientName}</p>
                  {selectedInvoiceForPrint.clientPhone && (
                    <p className="text-slate-600 mt-0.5">{isAr ? 'الهاتف:' : 'Phone:'} {selectedInvoiceForPrint.clientPhone}</p>
                  )}
                </div>
                <div>
                  <p className="text-slate-500 font-semibold">{isAr ? 'موقع التركيب / العنوان:' : 'Site Location / Address:'}</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">
                    {selectedInvoiceForPrint.district} - {selectedInvoiceForPrint.clientAddress}
                  </p>
                  <p className="text-slate-600 mt-0.5">
                    {isAr ? 'صالح حتى:' : 'Valid Until:'} {selectedInvoiceForPrint.validUntil}
                  </p>
                </div>
              </div>

              {/* Table */}
              <table className="w-full text-right rtl:text-right ltr:text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 border-b border-slate-300">
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">{isAr ? 'بيان الصنف والمواصفات' : 'Item Description & Technical Specs'}</th>
                    <th className="py-2.5 px-3 text-center">{isAr ? 'الكمية' : 'Qty'}</th>
                    <th className="py-2.5 px-3 text-center">{isAr ? 'سعر الوحدة' : 'Unit Price (SAR)'}</th>
                    <th className="py-2.5 px-3 text-center">{isAr ? 'الإجمالي (ر.س)' : 'Total (SAR)'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {selectedInvoiceForPrint.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="py-2 px-3 text-slate-500">{idx + 1}</td>
                      <td className="py-2 px-3 font-semibold text-slate-900">{it.description}</td>
                      <td className="py-2 px-3 text-center">{it.quantity}</td>
                      <td className="py-2 px-3 text-center">{it.unitPriceSAR.toFixed(2)}</td>
                      <td className="py-2 px-3 text-center font-bold">{it.totalSAR.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals & ZATCA QR Code Preview */}
              <div className="flex items-start justify-between pt-4 border-t border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-20 h-20 bg-slate-100 border border-slate-300 rounded p-1 flex flex-col items-center justify-center text-[9px] text-slate-500 text-center">
                    <Shield className="w-6 h-6 text-amber-600 mb-1" />
                    <span className="font-bold">ZATCA Ready</span>
                    <span>{isAr ? 'فاتورة إلكترونية' : 'E-Invoice'}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 space-y-0.5">
                    <p>{isAr ? '• الضمان سنتان على كافة الأجهزة ضد العيوب المصنعية.' : '• 2-year full hardware warranty against manufacturer defects.'}</p>
                    <p>{isAr ? '• التركيب بمواصفات الدفاع المدني والأمن العام بجدة.' : '• Compliant with Civil Defense & MOI regulations in Jeddah.'}</p>
                    <p>{isAr ? '• الدعم الفني وخدمات الصيانة متاحة 24 ساعة.' : '• 24/7 technical assistance and emergency support.'}</p>
                  </div>
                </div>

                <div className="w-60 text-xs space-y-1.5 text-right rtl:text-right ltr:text-left">
                  <div className="flex justify-between text-slate-600">
                    <span>{isAr ? 'المجموع الخاضع للضريبة:' : 'Taxable Subtotal:'}</span>
                    <span>{selectedInvoiceForPrint.subtotalSAR.toFixed(2)} {isAr ? 'ر.س' : 'SAR'}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>{isAr ? 'ضريبة القيمة المضافة (15%):' : 'VAT (15%):'}</span>
                    <span>{selectedInvoiceForPrint.vatAmountSAR.toFixed(2)} {isAr ? 'ر.س' : 'SAR'}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-slate-950 pt-1.5 border-t-2 border-slate-900">
                    <span>{isAr ? 'المجموع الكلي:' : 'Total Amount Due:'}</span>
                    <span>{selectedInvoiceForPrint.totalSAR.toFixed(2)} {isAr ? 'ر.س' : 'SAR'}</span>
                  </div>
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200 text-xs">
                <div className="text-center">
                  <p className="font-bold text-slate-700">
                    {isAr ? 'الختم والاعتماد (مؤسسة ابو بندر إلكترونيات)' : 'Authorized Signature & Stamp (Abu Bandar Electronics)'}
                  </p>
                  <div className="mt-8 border-b border-dashed border-slate-400 w-40 mx-auto"></div>
                </div>
                <div className="text-center">
                  <p className="font-bold text-slate-700">
                    {isAr ? 'توقيع العميل المستلم' : 'Client Acceptance Signature'}
                  </p>
                  <div className="mt-8 border-b border-dashed border-slate-400 w-40 mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
