import React, { useState } from 'react';
import { Phone, Calendar, MapPin, CheckCircle, Clock, Plus, Trash2, Send, MessageCircle, AlertCircle } from 'lucide-react';
import { ServiceInquiry, BusinessInfo } from '../types.ts';

interface InquiryManagerProps {
  inquiries: ServiceInquiry[];
  business: BusinessInfo;
  onCreateInquiry: (inquiry: Partial<ServiceInquiry>) => Promise<void>;
  onUpdateStatus: (id: string, status: ServiceInquiry['status']) => Promise<void>;
  onDeleteInquiry: (id: string) => Promise<void>;
  lang: 'ar' | 'en';
}

const DISTRICTS_JEDDAH = [
  'حي السلامة (As Salamah)',
  'شارع خالد بن الوليد (Khalid Bin Waleed)',
  'حي الروضة (Al Rawdah)',
  'حي الزهراء (Al Zahra)',
  'حي الحمراء (Al Hamra)',
  'حي الشاطئ (Al Shati)',
  'حي النعيم (Al Naeem)',
  'حي المروة (Al Marwah)',
  'حي الصفا (Al Safa)',
  'حي المحمدية (Al Mohammadiyyah)',
  'حي البساتين (Al Basateen)',
  'حي أبحر الشمالية (Obhur Al Shamaliyah)',
  'حي البلد والوسط التجاري (Al Balad)',
  'أحياء أخرى بجدة (Other Jeddah District)',
];

export const InquiryManager: React.FC<InquiryManagerProps> = ({
  inquiries,
  business,
  onCreateInquiry,
  onUpdateStatus,
  onDeleteInquiry,
  lang,
}) => {
  const isAr = lang === 'ar';
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState<Partial<ServiceInquiry>>({
    customerName: '',
    phone: '',
    district: 'حي السلامة (As Salamah)',
    propertyType: 'villa',
    serviceType: 'cctv_installation',
    preferredDate: '',
    notes: '',
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName?.trim() || !formData.phone?.trim()) {
      alert(isAr ? 'يرجى إدخال اسم العميل ورقم الجوال' : 'Please provide customer name and phone');
      return;
    }
    setSaving(true);
    try {
      await onCreateInquiry(formData);
      setShowAddModal(false);
      setFormData({
        customerName: '',
        phone: '',
        district: 'حي السلامة (As Salamah)',
        propertyType: 'villa',
        serviceType: 'cctv_installation',
        preferredDate: '',
        notes: '',
      });
    } catch (err: any) {
      alert(err?.message || 'Error saving request');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-amber-400" />
            <span>{isAr ? 'طلبات المعاينة الفنية وحجوزات التركيب' : 'Site Surveys & Installation Bookings'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            {isAr
              ? 'متابعة مواعيد المعاينات الميدانية للفلل والمحلات في كافة أحياء جدة على مدار 24 ساعة'
              : 'Track and schedule on-site technician inspections for properties across Jeddah 24/7'}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold shadow-md shadow-amber-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isAr ? 'تسجيل طلب معاينة جديد' : 'New Survey Booking'}</span>
        </button>
      </div>

      {/* Inquiries Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {inquiries.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 bg-slate-900/60 rounded-2xl border border-slate-800">
            <Clock className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-base font-bold">{isAr ? 'لا توجد طلبات معاينة مسجلة' : 'No survey requests yet'}</p>
            <p className="text-xs text-slate-500 mt-1">
              {isAr ? 'سجل أول طلب معاينة لخدمة عملاء جدة' : 'Record your first customer booking'}
            </p>
          </div>
        ) : (
          inquiries.map((inq) => {
            const isNew = inq.status === 'new';
            const isSched = inq.status === 'scheduled';
            const isDone = inq.status === 'completed';

            return (
              <div
                key={inq.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 shadow-xl flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[11px] font-black px-2.5 py-0.5 rounded-full ${
                        isNew
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
                          : isSched
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : isDone
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {inq.status === 'new' && (isAr ? 'طلب جديد' : 'New Lead')}
                      {inq.status === 'scheduled' && (isAr ? 'موعد محدد' : 'Scheduled')}
                      {inq.status === 'contacted' && (isAr ? 'تم التواصل' : 'Contacted')}
                      {inq.status === 'completed' && (isAr ? 'اكتملت المعاينة والتركيب' : 'Completed')}
                      {inq.status === 'cancelled' && (isAr ? 'ملغي' : 'Cancelled')}
                    </span>

                    <span className="text-[10px] text-slate-500">
                      {new Date(inq.createdAt).toLocaleDateString(isAr ? 'ar-SA' : 'en-US')}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white">{inq.customerName}</h4>

                  <div className="space-y-1.5 my-3 text-xs text-slate-300">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Phone className="w-3.5 h-3.5 text-amber-400" />
                      <span dir="ltr" className="font-mono font-bold text-white">{inq.phone}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{inq.district}</span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <span className="bg-slate-800 text-amber-400 px-2 py-0.5 rounded text-[11px] font-semibold">
                        {inq.propertyType === 'villa' && (isAr ? 'فيلا سكنية' : 'Villa')}
                        {inq.propertyType === 'commercial_shop' && (isAr ? 'محل تجاري' : 'Shop')}
                        {inq.propertyType === 'building' && (isAr ? 'عمارة سكنية' : 'Building')}
                        {inq.propertyType === 'office' && (isAr ? 'مكتب' : 'Office')}
                        {inq.propertyType === 'warehouse' && (isAr ? 'مستودع' : 'Warehouse')}
                      </span>
                      <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[11px]">
                        {inq.serviceType === 'cctv_installation' && (isAr ? 'تركيب كاميرات' : 'CCTV')}
                        {inq.serviceType === 'smart_lock' && (isAr ? 'أقفال ذكية' : 'Smart Lock')}
                        {inq.serviceType === 'access_control' && (isAr ? 'تحكم بالدخول' : 'Access Control')}
                        {inq.serviceType === 'intercom' && (isAr ? 'انتركم مرئي' : 'Intercom')}
                        {inq.serviceType === 'maintenance_repair' && (isAr ? 'صيانة وإصلاح' : 'Maintenance')}
                      </span>
                    </div>

                    {inq.notes && (
                      <p className="bg-slate-800/40 p-2 rounded-lg text-slate-400 text-xs mt-2 italic">
                        "{inq.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <a
                      href={`tel:${inq.phone}`}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg border border-slate-700 cursor-pointer"
                      title="Call Client"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        isAr
                          ? `السلام عليكم ${inq.customerName}، معكم مؤسسة ابو بندر إلكترونيات بخصوص طلب المعاينة والتركيب في ${inq.district} بجدة.`
                          : `Hello ${inq.customerName}, this is Abu Bandar Electronics regarding your site survey in ${inq.district}, Jeddah.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 rounded-lg border border-emerald-500/30 cursor-pointer"
                      title="WhatsApp Client"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="flex items-center gap-1">
                    <select
                      value={inq.status}
                      onChange={(e) => onUpdateStatus(inq.id, e.target.value as any)}
                      className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-slate-300 focus:outline-none focus:border-amber-500"
                    >
                      <option value="new">{isAr ? 'جديد' : 'New'}</option>
                      <option value="scheduled">{isAr ? 'مجدول' : 'Scheduled'}</option>
                      <option value="contacted">{isAr ? 'تم التواصل' : 'Contacted'}</option>
                      <option value="completed">{isAr ? 'مكتمل' : 'Completed'}</option>
                      <option value="cancelled">{isAr ? 'ملغي' : 'Cancelled'}</option>
                    </select>

                    <button
                      onClick={() => onDeleteInquiry(inq.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 rounded cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-400" />
              <span>{isAr ? 'تسجيل طلب معاينة فنية جديدة بجدة' : 'Schedule New Jeddah Site Survey'}</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isAr ? 'اسم العميل' : 'Customer Name'} *
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="مثال: فيصل الغامدي"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isAr ? 'رقم الجوال' : 'Phone Number'} *
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+966 5X XXX XXXX"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isAr ? 'الحي بجدة' : 'District in Jeddah'}
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    {DISTRICTS_JEDDAH.map((d, i) => (
                      <option key={i} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isAr ? 'نوع العقار' : 'Property Type'}
                  </label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="villa">{isAr ? 'فيلا خاصة' : 'Villa'}</option>
                    <option value="commercial_shop">{isAr ? 'محل تجاري' : 'Shop'}</option>
                    <option value="building">{isAr ? 'عمارة / مجمع' : 'Building'}</option>
                    <option value="office">{isAr ? 'مكتب' : 'Office'}</option>
                    <option value="warehouse">{isAr ? 'مستودع' : 'Warehouse'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isAr ? 'الخدمة المطلوبة' : 'Requested Service'}
                </label>
                <select
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value as any })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="cctv_installation">{isAr ? 'توريد وتركيب كاميرات مراقبة' : 'CCTV System Installation'}</option>
                  <option value="smart_lock">{isAr ? 'تركيب أقفال إلكترونية ذكية' : 'Smart Lock Installation'}</option>
                  <option value="access_control">{isAr ? 'أنظمة الحضور والانصراف والبصمة' : 'Access Control & Biometrics'}</option>
                  <option value="intercom">{isAr ? 'انتركم مرئي IP وشاشات' : 'Video Intercom Kit'}</option>
                  <option value="maintenance_repair">{isAr ? 'صيانة طارئة وفحص كاميرات قديمة' : 'Emergency Repair & Maintenance'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isAr ? 'ملاحظات وتفاصيل المعاينة' : 'Survey Notes'}
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder={isAr ? 'تفاصيل الموقع والمواعيد المناسبة للعميل...' : 'Notes...'}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white bg-slate-800 rounded-lg cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg cursor-pointer shadow-md shadow-amber-500/20 disabled:opacity-50"
                >
                  {saving ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'تأكيد الحجز' : 'Confirm Booking')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
