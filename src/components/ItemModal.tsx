import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { InventoryItem, InventoryCategory } from '../types.ts';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<InventoryItem>) => Promise<void>;
  initialItem?: InventoryItem | null;
  lang: 'ar' | 'en';
}

const CATEGORIES: { id: InventoryCategory; labelEn: string; labelAr: string }[] = [
  { id: 'cctv_cameras', labelEn: 'CCTV Cameras', labelAr: 'كاميرات المراقبة' },
  { id: 'nvrs_dvrs', labelEn: 'NVRs & DVRs Recorders', labelAr: 'أجهزة التسجيل NVR / DVR' },
  { id: 'access_control', labelEn: 'Biometric Access Control', labelAr: 'أنظمة التحكم بالدخول والبصمة' },
  { id: 'smart_locks', labelEn: 'Smart Electronic Locks', labelAr: 'الأقفال الإلكترونية الذكية' },
  { id: 'video_intercom', labelEn: 'Video Intercom Systems', labelAr: 'أجهزة الانتركم المرئي' },
  { id: 'storage_hdd', labelEn: 'Surveillance Hard Drives', labelAr: 'أقراص التخزين المخصصة' },
  { id: 'networking_cables', labelEn: 'Outdoor Cables & Networking', labelAr: 'كيابل الشبكات والتوصيلات' },
  { id: 'power_supplies', labelEn: 'Power Supplies & Boxes', labelAr: 'محولات ووحدات الطاقة المركزية' },
  { id: 'accessories', labelEn: 'Brackets & Accessories', labelAr: 'قواعد ومستلزمات التركيب' },
];

export const ItemModal: React.FC<ItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialItem,
  lang,
}) => {
  const isAr = lang === 'ar';
  const isEditing = Boolean(initialItem);

  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    nameAr: '',
    category: 'cctv_cameras' as InventoryCategory,
    brand: '',
    model: '',
    stock: 10,
    minStockAlert: 3,
    unitPriceSAR: 150,
    costPriceSAR: 100,
    location: 'As Salamah Store, Jeddah',
    warrantyMonths: 24,
    description: '',
    descriptionAr: '',
    specs: [''],
    imageUrl: '',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialItem) {
      setFormData({
        sku: initialItem.sku,
        name: initialItem.name,
        nameAr: initialItem.nameAr,
        category: initialItem.category,
        brand: initialItem.brand,
        model: initialItem.model,
        stock: initialItem.stock,
        minStockAlert: initialItem.minStockAlert,
        unitPriceSAR: initialItem.unitPriceSAR,
        costPriceSAR: initialItem.costPriceSAR,
        location: initialItem.location,
        warrantyMonths: initialItem.warrantyMonths,
        description: initialItem.description,
        descriptionAr: initialItem.descriptionAr,
        specs: initialItem.specs.length > 0 ? initialItem.specs : [''],
        imageUrl: initialItem.imageUrl || '',
      });
    } else {
      setFormData({
        sku: `ABU-${Math.floor(1000 + Math.random() * 9000)}`,
        name: '',
        nameAr: '',
        category: 'cctv_cameras',
        brand: 'Hikvision',
        model: '',
        stock: 10,
        minStockAlert: 3,
        unitPriceSAR: 250,
        costPriceSAR: 180,
        location: 'As Salamah Store, Jeddah',
        warrantyMonths: 24,
        description: '',
        descriptionAr: '',
        specs: [''],
        imageUrl: '',
      });
    }
    setError(null);
  }, [initialItem, isOpen]);

  if (!isOpen) return null;

  const handleSpecChange = (index: number, val: string) => {
    const updated = [...formData.specs];
    updated[index] = val;
    setFormData({ ...formData, specs: updated });
  };

  const addSpec = () => {
    setFormData({ ...formData, specs: [...formData.specs, ''] });
  };

  const removeSpec = (index: number) => {
    const updated = formData.specs.filter((_, i) => i !== index);
    setFormData({ ...formData, specs: updated.length > 0 ? updated : [''] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() && !formData.nameAr.trim()) {
      setError(isAr ? 'يرجى إدخال اسم الصنف' : 'Please enter an item name');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await onSave({
        ...formData,
        specs: formData.specs.filter((s) => s.trim() !== ''),
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || (isAr ? 'حدث خطأ أثناء الحفظ' : 'Failed to save item'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div>
            <h2 className="text-lg font-bold text-white">
              {isEditing
                ? isAr
                  ? 'تعديل بيانات الصنف في المخزون'
                  : 'Edit Inventory Item'
                : isAr
                ? 'إضافة صنف جديد إلى المخزون'
                : 'Add New Inventory Item'}
            </h2>
            <p className="text-xs text-slate-400">
              {isAr ? 'ابو بندر إلكترونيات - فرع جدة' : 'Abu Bandar Electronics - Jeddah Branch'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-xs">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isAr ? 'اسم الصنف (بالعربية)' : 'Item Name (Arabic)'} *
              </label>
              <input
                type="text"
                value={formData.nameAr}
                onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                placeholder="مثال: كاميرا هيكفيجن 4K كولورفيو ملونة"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isAr ? 'اسم الصنف (بالإنجليزية)' : 'Item Name (English)'}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Hikvision 4K ColorVu Camera"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isAr ? 'القسم / التصنيف' : 'Category'}
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as InventoryCategory })}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {isAr ? c.labelAr : c.labelEn}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isAr ? 'العلامة التجارية (الشركة)' : 'Brand'}
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="Hikvision, Dahua, ZKTeco..."
                className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isAr ? 'رقم الموديل' : 'Model'}
              </label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="DS-2CE12DF3T..."
                className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isAr ? 'الكمية المتوفرة' : 'Current Stock'} *
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isAr ? 'تنبيه نقص المخزون' : 'Min Alert Level'}
              </label>
              <input
                type="number"
                min="0"
                value={formData.minStockAlert}
                onChange={(e) => setFormData({ ...formData, minStockAlert: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isAr ? 'سعر البيع (ر.س)' : 'Selling Price (SAR)'} *
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={formData.unitPriceSAR}
                onChange={(e) => setFormData({ ...formData, unitPriceSAR: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-amber-400 font-bold focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isAr ? 'سعر التكلفة (ر.س)' : 'Cost Price (SAR)'}
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={formData.costPriceSAR}
                onChange={(e) => setFormData({ ...formData, costPriceSAR: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isAr ? 'رمز الصنف / الباركود (SKU)' : 'SKU / Barcode'}
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isAr ? 'موقع التخزين في المستودع' : 'Storage Location'}
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder={isAr ? 'رف A1 - فرع السلامة' : 'Shelf A1 - As Salamah Store'}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isAr ? 'مدة الضمان (شهور)' : 'Warranty (Months)'}
              </label>
              <input
                type="number"
                value={formData.warrantyMonths}
                onChange={(e) => setFormData({ ...formData, warrantyMonths: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {isAr ? 'الوصف والمميزات (عربي)' : 'Description (Arabic)'}
            </label>
            <textarea
              rows={2}
              value={formData.descriptionAr}
              onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
              placeholder={isAr ? 'وصف تفصيلي للكاميرا أو الجهاز والمواصفات الفنية...' : 'Detailed description and specifications...'}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {isAr ? 'المواصفات الفنية الرئيسية' : 'Key Specifications'}
            </label>
            <div className="space-y-2">
              {formData.specs.map((spec, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={spec}
                    onChange={(e) => handleSpecChange(i, e.target.value)}
                    placeholder={isAr ? 'مثال: دقة 4K ملونة، رؤية ليلية 40 متر، مقاومة للماء IP67' : 'e.g. 4K ColorVu, 40m Night Vision, IP67 Waterproof'}
                    className="flex-1 bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeSpec(i)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addSpec}
                className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer pt-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAr ? 'إضافة مواصفة إضافية' : 'Add Specification'}</span>
              </button>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors cursor-pointer disabled:opacity-50 shadow-md shadow-amber-500/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {saving
                  ? isAr
                    ? 'جاري الحفظ...'
                    : 'Saving...'
                  : isAr
                  ? 'حفظ الصنف'
                  : 'Save Item'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
