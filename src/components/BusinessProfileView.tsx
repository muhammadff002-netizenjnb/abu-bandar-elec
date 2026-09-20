import React, { useState } from 'react';
import { 
  Building2, MapPin, Phone, Clock, Star, ShieldCheck, 
  ExternalLink, Edit, CheckCircle, Navigation, MessageCircle, 
  Share2, Award, Sparkles, Check
} from 'lucide-react';
import { BusinessInfo } from '../types.ts';

interface BusinessProfileViewProps {
  business: BusinessInfo;
  onUpdateBusiness: (updated: Partial<BusinessInfo>) => Promise<void>;
  lang: 'ar' | 'en';
}

export const BusinessProfileView: React.FC<BusinessProfileViewProps> = ({
  business,
  onUpdateBusiness,
  lang,
}) => {
  const isAr = lang === 'ar';
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<BusinessInfo>(business);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onUpdateBusiness(formData);
      setIsEditing(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert('Error updating business profile');
    } finally {
      setSaving(false);
    }
  };

  const reviews = [
    {
      id: 'rev-1',
      author: 'Abdullah Al-Harbi (عبدالله الحربي)',
      rating: 5,
      relativeTime: 'قبل أسبوع',
      relativeTimeEn: '1 week ago',
      comment:
        'ما شاء الله تبارك الله، تعامل راقي جداً من ابو بندر وسرعة في التجاوب. ركبوا لي نظام 4 كاميرات 4K هيكفيجن بالفيلا في حي الروضة شغلهم نظيف جداً والأسلاك مخفية بمواسير ممتازة، والتطبيق يشتغل بكل سلاسة. أنصح بالتعامل معهم وبشدة.',
      commentEn:
        'Excellent service from Abu Bandar. Fast response, neat installation for 4x 4K Hikvision cameras at my villa with concealed conduit pipes. Highly recommended.',
    },
    {
      id: 'rev-2',
      author: 'Eng. Tariq Al-Ghamdi (م. طارق الغامدي)',
      rating: 5,
      relativeTime: 'قبل شهر',
      relativeTimeEn: '1 month ago',
      comment:
        'مؤسسة ممتازة ومطابقة لاشتراطات الأمن العام والدفاع المدني. ركبوا لمحلنا التجاري في شارع صاري كاميرات مراقبة وأصدروا لنا شهادة إنجاز فورية لاستخراج رخصة البلدية. خدمة 24 ساعة متواجدين في أي وقت.',
      commentEn:
        'Outstanding security company, fully compliant with Civil Defense standards. Installed commercial CCTV for our retail shop and provided certified completion documentation immediately.',
    },
  ];

  return (
    <div className="space-y-6">
      {savedSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{isAr ? 'تم حفظ وتحديث بيانات المنشأة بنجاح!' : 'Business profile updated successfully!'}</span>
        </div>
      )}

      {/* Google Business Profile Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Banner Area */}
        <div className="h-36 bg-gradient-to-r from-amber-600 via-amber-700 to-slate-900 relative p-6 flex items-end">
          <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 flex items-center gap-2">
            <span className="bg-slate-950/70 backdrop-blur text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isAr ? 'أنت تدير هذا الملف التجاري' : 'You manage this Business Profile'}</span>
            </span>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-slate-950/70 hover:bg-slate-950 backdrop-blur text-white text-xs font-semibold px-3 py-1 rounded-full border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5 text-amber-400" />
              <span>{isEditing ? (isAr ? 'إلغاء' : 'Cancel') : (isAr ? 'تعديل البيانات' : 'Edit Profile')}</span>
            </button>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-1.5 shadow-xl border border-slate-700 shrink-0 flex items-center justify-center">
                <img
                  src={business.logoUrl || '/logo.jpg'}
                  alt={isAr ? business.nameAr : business.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {isAr ? business.nameAr : business.name}
                  </h2>
                  <span className="bg-amber-500/20 text-amber-400 text-[11px] font-bold px-2 py-0.5 rounded border border-amber-500/30">
                    {isAr ? 'معتمد' : 'Verified'}
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-300 mt-1">
                  {isAr ? business.categoryAr : business.category}
                </p>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-base font-black text-amber-400">5.0</span>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400">
                    ({isAr ? 'تقييمان 5.0 Google reviews' : '5.0 Google reviews'})
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{isAr ? 'مفتوح 24 ساعة' : 'Open 24 hours'}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Google Profile Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={business.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-md shadow-blue-600/20"
              >
                <Navigation className="w-4 h-4" />
                <span>{isAr ? 'الاتجاهات (Directions)' : 'Directions'}</span>
              </a>

              <a
                href={`tel:${business.phone}`}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>{isAr ? 'اتصال مباشر' : 'Call'}</span>
              </a>

              <a
                href={`https://wa.me/${business.whatsapp.replace('+', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-md shadow-emerald-600/20"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{isAr ? 'واتساب' : 'WhatsApp'}</span>
              </a>
            </div>
          </div>

          {/* Business Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
                {isAr ? 'معلومات الاتصال والمقر' : 'Location & Contacts'}
              </h3>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
                  <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 text-xs block">{isAr ? 'العنوان المعتمد:' : 'Address:'}</span>
                    <strong className="text-white">
                      {isAr ? business.addressAr : business.address}
                    </strong>
                    <p className="text-xs text-amber-400/80 mt-0.5">
                      {isAr ? 'شارع خالد بن الوليد، حي السلامة، جدة 23525، المملكة العربية السعودية' : 'Khalid Bin Waleed, As Salamah, Jeddah 23525, Saudi Arabia'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
                  <Phone className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 text-xs block">{isAr ? 'رقم الهاتف المباشر:' : 'Direct Phone:'}</span>
                    <span dir="ltr" className="text-white font-mono font-bold text-sm">
                      {business.phone}
                    </span>
                    <span className="text-xs text-slate-400 block mt-0.5">
                      {isAr ? 'متاح للرد والاستشارات على مدار 24 ساعة' : 'Available for inquiries 24/7'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
                  <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 text-xs block">{isAr ? 'ساعات العمل الرسمية:' : 'Operating Hours:'}</span>
                    <strong className="text-emerald-400 font-bold">
                      {isAr ? business.hoursAr : business.hours}
                    </strong>
                    <span className="text-xs text-slate-400 block mt-0.5">
                      {isAr ? 'استجابة طوارئ وتركيب فوري بكافة أحياء جدة' : 'Emergency dispatch 24/7 across all Jeddah districts'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
                {isAr ? 'التراخيص والاعتمادات الرسمية' : 'Licenses & Accreditations'}
              </h3>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 text-xs block">{isAr ? 'السجل التجاري (CR Number):' : 'CR Number:'}</span>
                    <strong className="text-white font-mono">{business.crNumber}</strong>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                    {isAr ? 'ساري ومعتمد' : 'Active'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 text-xs block">{isAr ? 'الرقم الضريبي (ZATCA VAT):' : 'VAT Number:'}</span>
                    <strong className="text-amber-400 font-mono">{business.vatNumber}</strong>
                  </div>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-500/30">
                    {isAr ? 'ضريبة 15% مسجلة' : '15% Registered'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
                  <span className="text-slate-400 text-xs block mb-1">{isAr ? 'نطاق الخدمة في جدة:' : 'Coverage in Jeddah:'}</span>
                  <div className="flex flex-wrap gap-1 text-[11px]">
                    {(isAr
                      ? ['حي السلامة', 'شارع خالد بن الوليد', 'حي الروضة', 'حي الزهراء', 'حي الحمراء', 'أبحر الشمالية']
                      : ['As Salamah', 'Khalid Bin Waleed St', 'Al Rawdah', 'Al Zahra', 'Al Hamra', 'North Obhur']
                    ).map((dist, i) => (
                      <span key={i} className="bg-slate-800 px-2 py-0.5 rounded text-slate-300 border border-slate-700/50">
                        {dist}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* EDIT FORM IF TOGGLED */}
          {isEditing && (
            <form onSubmit={handleSave} className="bg-slate-950/80 p-6 rounded-2xl border border-amber-500/40 space-y-4">
              <h4 className="text-sm font-bold text-amber-400">
                {isAr ? 'تعديل بيانات المنشأة ومواعيد العمل' : 'Update Business Profile Data'}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isAr ? 'اسم المنشأة بالعربية' : 'Business Name (AR)'}
                  </label>
                  <input
                    type="text"
                    value={formData.nameAr}
                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isAr ? 'رقم الهاتف' : 'Phone'}
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isAr ? 'العنوان التفصيلي' : 'Address'}
                  </label>
                  <input
                    type="text"
                    value={formData.addressAr}
                    onChange={(e) => setFormData({ ...formData, addressAr: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isAr ? 'أوقات العمل' : 'Hours'}
                  </label>
                  <input
                    type="text"
                    value={formData.hoursAr}
                    onChange={(e) => setFormData({ ...formData, hoursAr: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs text-slate-400 bg-slate-800 rounded-lg cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg cursor-pointer shadow-md shadow-amber-500/20"
                >
                  {saving ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'حفظ التعديلات' : 'Save Changes')}
                </button>
              </div>
            </form>
          )}

          {/* Google Reviews Showcase */}
          <div className="space-y-4 pt-6 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span>{isAr ? 'تقييمات وآراء العملاء على خرائط جوجل (5.0)' : 'Google Maps Client Reviews (5.0)'}</span>
              </h3>
              <span className="text-xs text-slate-400">
                {isAr ? 'تقييمان معتمدان' : '2 verified reviews'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{rev.author}</span>
                    <span className="text-slate-500">{isAr ? rev.relativeTime : rev.relativeTimeEn}</span>
                  </div>

                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>

                  <p className="text-slate-300 leading-relaxed">
                    "{isAr ? rev.comment : rev.commentEn}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
