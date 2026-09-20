import React, { useState } from 'react';
import { 
  Search, Plus, Filter, AlertTriangle, CheckCircle, XCircle, 
  Edit, Trash2, ArrowUpDown, History, Shield, Tag, MapPin, 
  TrendingUp, Layers, RefreshCw
} from 'lucide-react';
import { InventoryItem, InventoryCategory, StockLog } from '../types.ts';
import { ItemModal } from './ItemModal.tsx';

interface InventoryManagerProps {
  items: InventoryItem[];
  stockLogs: StockLog[];
  onAddItem: (item: Partial<InventoryItem>) => Promise<void>;
  onUpdateItem: (id: string, item: Partial<InventoryItem>) => Promise<void>;
  onDeleteItem: (id: string) => Promise<void>;
  onClearAll?: () => Promise<void>;
  onAdjustStock: (id: string, delta: number, reason: string, notes?: string) => Promise<void>;
  onRefresh: () => void;
  lang: 'ar' | 'en';
}

const CATEGORY_NAMES: Record<InventoryCategory, { ar: string; en: string }> = {
  cctv_cameras: { ar: 'كاميرات المراقبة', en: 'CCTV Cameras' },
  nvrs_dvrs: { ar: 'أجهزة التسجيل NVR/DVR', en: 'Recorders (NVR/DVR)' },
  access_control: { ar: 'أنظمة البصمة والتحكم', en: 'Access Control' },
  smart_locks: { ar: 'الأقفال الذكية', en: 'Smart Locks' },
  video_intercom: { ar: 'الانتركم المرئي', en: 'Video Intercom' },
  storage_hdd: { ar: 'أقراص التخزين المراقبة', en: 'Storage (HDD)' },
  networking_cables: { ar: 'كيابل وشبكات', en: 'Cables & Network' },
  power_supplies: { ar: 'وحدات الطاقة', en: 'Power Supplies' },
  accessories: { ar: 'المستلزمات والقواعد', en: 'Accessories' },
};

export const InventoryManager: React.FC<InventoryManagerProps> = ({
  items,
  stockLogs,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onClearAll,
  onAdjustStock,
  onRefresh,
  lang,
}) => {
  const isAr = lang === 'ar';

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [adjustingItem, setAdjustingItem] = useState<InventoryItem | null>(null);
  const [adjustDelta, setAdjustDelta] = useState<number>(1);
  const [adjustReason, setAdjustReason] = useState<string>('sale_installation');
  const [adjustNotes, setAdjustNotes] = useState<string>('');
  const [showLogs, setShowLogs] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearing, setClearing] = useState(false);

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.nameAr.includes(search) ||
      item.sku.toLowerCase().includes(search.toLowerCase()) ||
      item.brand.toLowerCase().includes(search.toLowerCase()) ||
      item.model.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate stats
  const totalItemsCount = items.length;
  const totalStockUnits = items.reduce((acc, curr) => acc + curr.stock, 0);
  const totalValueSAR = items.reduce((acc, curr) => acc + curr.stock * curr.unitPriceSAR, 0);
  const lowStockCount = items.filter((i) => i.status === 'low_stock' || i.status === 'out_of_stock').length;

  const handleOpenAdd = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleOpenEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleModalSave = async (data: Partial<InventoryItem>) => {
    if (editingItem) {
      await onUpdateItem(editingItem.id, data);
    } else {
      await onAddItem(data);
    }
  };

  const handleStockAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingItem || adjustDelta === 0) return;
    await onAdjustStock(adjustingItem.id, adjustDelta, adjustReason, adjustNotes);
    setAdjustingItem(null);
    setAdjustDelta(1);
    setAdjustNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>{isAr ? 'مستودع ومخزون الأجهزة الأمنية' : 'Security Equipment Inventory'}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
              {isAr ? 'فرع شارع خالد بن الوليد' : 'Khalid Bin Waleed Branch'}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {isAr
              ? 'إدارة فورية وقابلة للتعديل لكميات كاميرات المراقبة، أجهزة التسجيل، الأقفال الذكية والملحقات'
              : 'Real-time editable inventory for CCTV cameras, NVRs, biometric locks, and accessories'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          <button
            onClick={() => setShowLogs(!showLogs)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
              showLogs
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            <History className="w-4 h-4" />
            <span>{isAr ? 'سجل حركات المخزون' : 'Stock Audit Logs'}</span>
          </button>

          <button
            onClick={onRefresh}
            title={isAr ? 'تحديث البيانات' : 'Refresh Data'}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {items.length > 0 && onClearAll && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>{isAr ? 'مسح كافة الأصناف' : 'Clear All'}</span>
            </button>
          )}

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'إضافة صنف جديد' : 'Add New Item'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">{isAr ? 'إجمالي الأصناف' : 'Total Items'}</p>
            <p className="text-xl sm:text-2xl font-black text-white mt-1">{totalItemsCount}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">{isAr ? 'إجمالي الوحدات بالمستودع' : 'Stock Units'}</p>
            <p className="text-xl sm:text-2xl font-black text-white mt-1">{totalStockUnits}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">{isAr ? 'قيمة المخزون الإجمالية' : 'Inventory Value'}</p>
            <p className="text-xl sm:text-2xl font-black text-amber-400 mt-1">
              {totalValueSAR.toLocaleString()} <span className="text-xs font-normal text-slate-400">{isAr ? 'ر.س' : 'SAR'}</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">{isAr ? 'تنبيهات نقص المخزون' : 'Low Stock Alerts'}</p>
            <p className={`text-xl sm:text-2xl font-black mt-1 ${lowStockCount > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
              {lowStockCount}
            </p>
          </div>
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
            lowStockCount > 0 
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse' 
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 sm:p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute top-3 left-3 rtl:right-3 rtl:left-auto text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                isAr
                  ? 'بحث بالاسم، رقم الموديل، الماركة (Hikvision, Dahua) أو الكود SKU...'
                  : 'Search by name, model, brand (Hikvision, Dahua), or SKU...'
              }
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-4 rtl:pr-9 rtl:pl-4 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 focus:outline-none focus:border-amber-500"
            >
              <option value="all">{isAr ? 'كافة حالات المخزون' : 'All Stock Status'}</option>
              <option value="in_stock">{isAr ? 'متوفر بالمستودع' : 'In Stock'}</option>
              <option value="low_stock">{isAr ? 'منخفض (قريب من النفاد)' : 'Low Stock Alert'}</option>
              <option value="out_of_stock">{isAr ? 'نفذت الكمية' : 'Out of Stock'}</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            {isAr ? 'جميع الأقسام' : 'All Categories'} ({items.length})
          </button>
          {Object.entries(CATEGORY_NAMES).map(([catKey, label]) => {
            const count = items.filter((i) => i.category === catKey).length;
            return (
              <button
                key={catKey}
                onClick={() => setSelectedCategory(catKey)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  selectedCategory === catKey
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                {isAr ? label.ar : label.en} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Stock Logs Drawer if open */}
      {showLogs && (
        <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-4 shadow-xl">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
            <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
              <History className="w-4 h-4" />
              <span>{isAr ? 'سجل الحركات والتعديلات الأخيرة في المخزون' : 'Recent Stock Movements & Adjustments'}</span>
            </h3>
            <button
              onClick={() => setShowLogs(false)}
              className="text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              {isAr ? 'إغلاق السجل' : 'Close'}
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {stockLogs.length === 0 ? (
              <p className="text-xs text-slate-500 py-2">{isAr ? 'لا توجد حركات مسجلة بعد' : 'No movements logged yet'}</p>
            ) : (
              stockLogs.slice(0, 15).map((log) => (
                <div key={log.id} className="flex items-center justify-between bg-slate-800/60 p-2.5 rounded-lg text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono font-bold px-1.5 py-0.5 rounded text-[11px] ${
                        log.change > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {log.change > 0 ? `+${log.change}` : log.change}
                    </span>
                    <span className="font-semibold text-white">{log.itemName}</span>
                    <span className="text-slate-400">({log.notes || log.reason})</span>
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    <span>
                      {log.previousStock} → <strong className="text-white">{log.newStock}</strong>
                    </span>
                    <span className="mx-2">•</span>
                    <span>{new Date(log.date).toLocaleDateString(isAr ? 'ar-SA' : 'en-US')}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Inventory Table / Cards */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right rtl:text-right ltr:text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="py-3 px-4">{isAr ? 'الصنف والموديل' : 'Item & Model'}</th>
                <th className="py-3 px-3">{isAr ? 'القسم' : 'Category'}</th>
                <th className="py-3 px-3">{isAr ? 'الماركة' : 'Brand'}</th>
                <th className="py-3 px-3 text-center">{isAr ? 'الكمية المتوفرة' : 'Stock Level'}</th>
                <th className="py-3 px-3 text-center">{isAr ? 'تعديل سريع' : 'Quick Stock'}</th>
                <th className="py-3 px-3">{isAr ? 'سعر البيع' : 'Selling Price'}</th>
                <th className="py-3 px-3">{isAr ? 'الموقع' : 'Location'}</th>
                <th className="py-3 px-4 text-center">{isAr ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs sm:text-sm">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-400">
                    <div className="max-w-md mx-auto space-y-3">
                      <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
                        <Layers className="w-7 h-7" />
                      </div>
                      <p className="text-base font-bold text-white">
                        {items.length === 0
                          ? (isAr ? 'المخزون الداخلي فارغ حالياً' : 'Internal Inventory is Currently Empty')
                          : (isAr ? 'لم يتم العثور على أصناف مطابقة للبحث' : 'No matching items found')}
                      </p>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {items.length === 0
                          ? (isAr
                              ? 'تم تفريغ كافة الأصناف السابقة وتعيين الموقع العام للعملاء. يمكنك كمدير إضافة معداتك وكاميراتك الأصلية متى شئت.'
                              : 'All previous items have been cleared. As manager, you can add your custom equipment and camera stock anytime.')
                          : (isAr ? 'جرب تغيير كلمة البحث أو تصفية الفئات' : 'Try adjusting your search criteria or category filter')}
                      </p>
                      <button
                        onClick={handleOpenAdd}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{isAr ? 'إضافة الصنف الأول إلى المخزون' : 'Add First Inventory Item'}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isLow = item.status === 'low_stock';
                  const isOut = item.status === 'out_of_stock';

                  return (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 overflow-hidden text-amber-400">
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <Shield className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-white line-clamp-1">
                              {isAr ? item.nameAr : item.name}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                              <span className="font-mono bg-slate-800 px-1.5 py-0.2 rounded text-[11px] text-amber-300">
                                {item.sku}
                              </span>
                              {item.model && <span>{item.model}</span>}
                              <span className="text-slate-600">•</span>
                              <span className="text-slate-400">{item.warrantyMonths} {isAr ? 'شهر ضمان' : 'm warranty'}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="inline-block bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded text-xs">
                          {isAr ? CATEGORY_NAMES[item.category]?.ar : CATEGORY_NAMES[item.category]?.en}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-200">{item.brand}</span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                              isOut
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                : isLow
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            }`}
                          >
                            {item.stock} {isAr ? 'قطعة' : 'pcs'}
                          </span>
                          {isLow && (
                            <span className="text-[10px] text-amber-400 font-bold mt-0.5 flex items-center gap-0.5">
                              <AlertTriangle className="w-2.5 h-2.5" />
                              {isAr ? 'نقص مخزون' : 'Low stock'}
                            </span>
                          )}
                          {isOut && (
                            <span className="text-[10px] text-rose-400 font-bold mt-0.5">
                              {isAr ? 'نفذ بالكامل' : 'Out of stock'}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Quick Adjust +/- Buttons */}
                      <td className="py-3 px-3 text-center">
                        <div className="inline-flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700">
                          <button
                            onClick={() => onAdjustStock(item.id, -1, 'sale_installation', 'Direct sale decrement')}
                            disabled={item.stock <= 0}
                            title={isAr ? 'خصم قطعة واحدة (تركيب/بيع)' : 'Decrease 1'}
                            className="w-6 h-6 rounded bg-slate-700 hover:bg-rose-600 text-white font-bold flex items-center justify-center transition-colors cursor-pointer disabled:opacity-30"
                          >
                            -
                          </button>
                          <button
                            onClick={() => {
                              setAdjustingItem(item);
                              setAdjustDelta(1);
                            }}
                            title={isAr ? 'تعديل كمية مخصصة' : 'Custom adjustment'}
                            className="px-2 text-[11px] text-slate-300 hover:text-amber-400 font-semibold cursor-pointer"
                          >
                            ±
                          </button>
                          <button
                            onClick={() => onAdjustStock(item.id, 1, 'restock', 'Direct restock increment')}
                            title={isAr ? 'إضافة قطعة واحدة (توريد)' : 'Increase 1'}
                            className="w-6 h-6 rounded bg-slate-700 hover:bg-emerald-600 text-white font-bold flex items-center justify-center transition-colors cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-bold text-amber-400 text-sm">
                          {item.unitPriceSAR} <span className="text-xs font-normal text-slate-400">{isAr ? 'ر.س' : 'SAR'}</span>
                        </span>
                        {item.costPriceSAR > 0 && (
                          <p className="text-[10px] text-slate-500">
                            {isAr ? 'التكلفة:' : 'Cost:'} {item.costPriceSAR} {isAr ? 'ر.س' : 'SAR'}
                          </p>
                        )}
                      </td>

                      <td className="py-3 px-3 text-slate-400 text-xs">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="truncate max-w-[120px]">{item.location}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            title={isAr ? 'تعديل الصنف' : 'Edit item'}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 transition-colors cursor-pointer"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {deleteConfirmId === item.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  onDeleteItem(item.id);
                                  setDeleteConfirmId(null);
                                }}
                                className="px-2 py-1 bg-rose-600 text-white font-bold text-xs rounded hover:bg-rose-500 cursor-pointer"
                              >
                                {isAr ? 'تأكيد' : 'Yes'}
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded hover:bg-slate-600 cursor-pointer"
                              >
                                {isAr ? 'إلغاء' : 'No'}
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(item.id)}
                              title={isAr ? 'حذف الصنف' : 'Delete item'}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-400 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Adjust Modal */}
      {adjustingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ArrowUpDown className="w-5 h-5 text-amber-400" />
              <span>
                {isAr ? 'تعديل كمية المخزون:' : 'Adjust Stock:'} {isAr ? adjustingItem.nameAr : adjustingItem.name}
              </span>
            </h3>

            <p className="text-xs text-slate-400">
              {isAr ? 'الكمية الحالية:' : 'Current Stock:'}{' '}
              <strong className="text-white text-sm">{adjustingItem.stock}</strong> {isAr ? 'وحدة' : 'units'}
            </p>

            <form onSubmit={handleStockAdjustSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isAr ? 'الكمية المراد تغييرها (موجب للإضافة، سالب للخصم)' : 'Change Amount (+ for restock, - for sale)'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={adjustDelta}
                    onChange={(e) => setAdjustDelta(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-amber-500"
                    required
                  />
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setAdjustDelta((prev) => (prev > 0 ? -prev : prev))}
                      className="px-2.5 py-2 bg-rose-600/30 text-rose-300 text-xs font-bold rounded-lg border border-rose-500/30 cursor-pointer"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdjustDelta((prev) => Math.abs(prev))}
                      className="px-2.5 py-2 bg-emerald-600/30 text-emerald-300 text-xs font-bold rounded-lg border border-emerald-500/30 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  {isAr ? 'الكمية الجديدة بعد التعديل:' : 'New stock after update:'}{' '}
                  <strong className="text-amber-400">{Math.max(0, adjustingItem.stock + adjustDelta)}</strong>
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isAr ? 'سبب التعديل' : 'Reason'}
                </label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="sale_installation">{isAr ? 'تركيب موقع أو بيع مباشر' : 'Sale & Installation'}</option>
                  <option value="restock">{isAr ? 'توريد واستلام شحنة جديدة' : 'New Shipment Restock'}</option>
                  <option value="return">{isAr ? 'إرجاع من عميل' : 'Customer Return'}</option>
                  <option value="damaged">{isAr ? 'تالف أو معطوب أثناء الفحص' : 'Damaged / Faulty'}</option>
                  <option value="audit_adjustment">{isAr ? 'تسوية جرد دوري' : 'Periodic Audit'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isAr ? 'ملاحظات إضافية (رقم فاتورة أو اسم العميل)' : 'Notes / Invoice Ref'}
                </label>
                <input
                  type="text"
                  value={adjustNotes}
                  onChange={(e) => setAdjustNotes(e.target.value)}
                  placeholder={isAr ? 'مثال: تركيب فيلا حي الروضة' : 'e.g. Installed at Villa Al Rawdah'}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAdjustingItem(null)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white bg-slate-800 rounded-lg cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg cursor-pointer shadow-md shadow-amber-500/20"
                >
                  {isAr ? 'تأكيد التعديل' : 'Apply Adjustment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Clear All Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-rose-500/40 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {isAr ? 'مسح كافة أصناف المخزون؟' : 'Clear All Inventory Items?'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isAr
                    ? 'سيتم حذف جميع الأصناف المسجلة في المستودع وسجلات حركات المخزون نهائياً.'
                    : 'This will permanently delete all inventory items and stock logs.'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                disabled={clearing}
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 text-xs text-slate-300 hover:text-white bg-slate-800 rounded-xl cursor-pointer"
              >
                {isAr ? 'إلغاء وتراجع' : 'Cancel'}
              </button>
              <button
                type="button"
                disabled={clearing}
                onClick={async () => {
                  if (onClearAll) {
                    setClearing(true);
                    try {
                      await onClearAll();
                      setShowClearConfirm(false);
                    } catch (e) {
                      console.error(e);
                    } finally {
                      setClearing(false);
                    }
                  }
                }}
                className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-xl cursor-pointer shadow-md disabled:opacity-50"
              >
                {clearing ? (isAr ? 'جاري المسح...' : 'Clearing...') : (isAr ? 'نعم، مسح الكل' : 'Yes, Clear All')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Item Modal for Add / Edit */}
      <ItemModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleModalSave}
        initialItem={editingItem}
        lang={lang}
      />
    </div>
  );
};
