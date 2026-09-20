import React, { useState } from 'react';
import { ShieldCheck, Check, Phone, MessageCircle, Wrench, Star, Plus, Edit, Trash2, Clock, Sparkles } from 'lucide-react';
import { SecurityPackage, BusinessInfo } from '../types.ts';

interface PackageShowcaseProps {
  packages: SecurityPackage[];
  business: BusinessInfo;
  onSelectPackageForQuote: (pkg: SecurityPackage) => void;
  onAddPackage?: (pkg: Partial<SecurityPackage>) => Promise<void>;
  onDeletePackage?: (id: string) => Promise<void>;
  lang: 'ar' | 'en';
}

export const PackageShowcase: React.FC<PackageShowcaseProps> = ({
  packages,
  business,
  onSelectPackageForQuote,
  lang,
}) => {
  const isAr = lang === 'ar';
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'residential' | 'commercial' | 'access_intercom' | 'maintenance'>('all');

  const filtered = selectedFilter === 'all' 
    ? packages 
    : packages.filter(p => p.category === selectedFilter);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAr ? 'عروض وباقات تركيب متكاملة بجدة' : 'Complete Turnkey Security Packages - Jeddah'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {isAr ? 'باقات الأنظمة الأمنية وكاميرات المراقبة المعتمدة' : 'Certified Security & CCTV Installation Packages'}
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              {isAr
                ? 'تشمل الباقات التوريد، التمديد بمواسير حماية ضد حرارة جدة، البرمجة على الهواتف الذكية، وضمان حقيقي لمدة سنتين مع صيانة دورية مجانية.'
                : 'All packages include supply, heat-resistant outdoor conduit cabling, smartphone app setup, and a full 2-year warranty with 24/7 technical support.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <a
              href={`https://wa.me/${business.whatsapp.replace('+', '')}?text=${encodeURIComponent(
                isAr
                  ? 'السلام عليكم ابو بندر إلكترونيات، أرغب في طلب معاينة مجانية وتركيب كاميرات أمنية بجدة'
                  : 'Hello Abu Bandar Electronics, I would like to schedule a security system installation survey in Jeddah.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{isAr ? 'حجز معاينة فنية مجانية' : 'Book Free Site Survey'}</span>
            </a>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800/80 overflow-x-auto scrollbar-none text-xs">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer whitespace-nowrap ${
              selectedFilter === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            {isAr ? 'كافة الباقات' : 'All Packages'}
          </button>
          <button
            onClick={() => setSelectedFilter('residential')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer whitespace-nowrap ${
              selectedFilter === 'residential'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            {isAr ? 'الفلل والمنازل السكنية' : 'Residential & Villas'}
          </button>
          <button
            onClick={() => setSelectedFilter('commercial')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer whitespace-nowrap ${
              selectedFilter === 'commercial'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            {isAr ? 'المحلات والمؤسسات (معتمد)' : 'Commercial & Baladiya'}
          </button>
          <button
            onClick={() => setSelectedFilter('access_intercom')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer whitespace-nowrap ${
              selectedFilter === 'access_intercom'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            {isAr ? 'الأقفال والانتركم الذكي' : 'Smart Access & Intercom'}
          </button>
          <button
            onClick={() => setSelectedFilter('maintenance')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer whitespace-nowrap ${
              selectedFilter === 'maintenance'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            {isAr ? 'عقود الصيانة والطوارئ' : '24/7 Maintenance Contracts'}
          </button>
        </div>
      </div>

      {/* Package Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((pkg) => {
          const features = isAr ? pkg.featuresAr : pkg.features;

          return (
            <div
              key={pkg.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 shadow-xl group relative overflow-hidden"
            >
              {pkg.badge && (
                <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 bg-amber-500 text-slate-950 text-[11px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md shadow-amber-500/20">
                  {isAr ? pkg.badgeAr || pkg.badge : pkg.badge}
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    {pkg.category === 'residential' && (isAr ? 'سكني خاص' : 'Residential')}
                    {pkg.category === 'commercial' && (isAr ? 'تجاري ومؤسسي' : 'Commercial')}
                    {pkg.category === 'access_intercom' && (isAr ? 'دخول ذكي' : 'Smart Access')}
                    {pkg.category === 'maintenance' && (isAr ? 'صيانة وضمان' : 'Maintenance')}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span>{pkg.warrantyYears} {isAr ? 'سنوات ضمان' : 'yrs warranty'}</span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                  {isAr ? pkg.titleAr : pkg.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                  {isAr ? pkg.descriptionAr : pkg.description}
                </p>

                {/* Price Display */}
                <div className="my-5 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl sm:text-3xl font-black text-amber-400">
                      {pkg.priceSAR.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-300 font-semibold mx-1.5">{isAr ? 'ريال سعودي' : 'SAR'}</span>
                  </div>
                  <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>{isAr ? 'شامل التركيب والبرمجة بجدة' : 'Includes Installation in Jeddah'}</span>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-2.5">
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    {isAr ? 'المميزات والتجهيزات المشمولة:' : 'Package Inclusions:'}
                  </p>
                  <ul className="space-y-2">
                    {features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                        <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center gap-2.5">
                <button
                  onClick={() => onSelectPackageForQuote(pkg)}
                  className="w-full sm:flex-1 py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Wrench className="w-4 h-4" />
                  <span>{isAr ? 'إنشاء عرض سعر رسمي بهذه الباقة' : 'Create Official Quote'}</span>
                </button>

                <a
                  href={`https://wa.me/${business.whatsapp.replace('+', '')}?text=${encodeURIComponent(
                    isAr
                      ? `السلام عليكم ابو بندر إلكترونيات، أرغب في حجز: ${pkg.titleAr} بسعر ${pkg.priceSAR} ريال في جدة`
                      : `Hello Abu Bandar Electronics, I would like to order: ${pkg.title} (${pkg.priceSAR} SAR) in Jeddah`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 border border-slate-700 rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{isAr ? 'طلب عبر الواتساب' : 'Order via WhatsApp'}</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Why Choose Abu Bandar Electronics */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-8">
        <h3 className="text-base sm:text-lg font-bold text-white mb-4 text-center">
          {isAr ? 'لماذا تختار مؤسسة ابو بندر إلكترونيات للأنظمة الأمنية بجدة؟' : 'Why Choose Abu Bandar Electronics in Jeddah?'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-2">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">{isAr ? 'خدمة ودعم فني 24 ساعة' : '24/7 Service & Support'}</h4>
            <p className="text-xs text-slate-400 mt-1">
              {isAr ? 'فريق فني متخصص للاستجابة السريعة لأي طارئ في كافة أحياء جدة' : 'Rapid dispatch technical team available 24 hours across Jeddah'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-2">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">{isAr ? 'أجهزة أصلية بضمان سنتين' : '100% Genuine Hardware'}</h4>
            <p className="text-xs text-slate-400 mt-1">
              {isAr ? 'وكيل وموزع معتمد لأكبر الشركات العالمية (Hikvision, Dahua, ZKTeco)' : 'Certified distributor of Hikvision, Dahua, ZKTeco with official warranty'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="w-10 h-10 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto mb-2">
              <Star className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">{isAr ? 'مطابق لاشتراطات الأمن العام' : 'Civil Defense & Baladiya Ready'}</h4>
            <p className="text-xs text-slate-400 mt-1">
              {isAr ? 'إصدار شهادات تركيب معتمدة لإصدار وتجديد الرخص التجارية والبلدية' : 'Full issuance of compliant installation certificates for commercial licenses'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
