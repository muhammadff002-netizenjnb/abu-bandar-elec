import React, { useState } from 'react';
import { 
  Shield, 
  ShieldCheck, 
  Phone, 
  MessageCircle, 
  MapPin, 
  Clock, 
  Star, 
  CheckCircle2, 
  Camera, 
  Lock, 
  Bell, 
  Wrench, 
  Cable, 
  FileCheck, 
  Sparkles, 
  Send, 
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  Building,
  Home,
  Store,
  Warehouse,
  Award,
  Calendar,
  LockKeyhole,
  Navigation,
  ExternalLink
} from 'lucide-react';
import { BusinessInfo, SecurityPackage, ServiceInquiry } from '../types.ts';

interface PublicWebsiteProps {
  business: BusinessInfo;
  packages: SecurityPackage[];
  lang: 'ar' | 'en';
  onBookSurvey: (inquiry: Partial<ServiceInquiry>) => Promise<void>;
  onOpenAdmin: () => void;
}

export const PublicWebsite: React.FC<PublicWebsiteProps> = ({
  business,
  packages,
  lang,
  onBookSurvey,
  onOpenAdmin,
}) => {
  const isAr = lang === 'ar';

  // Booking Form State
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [district, setDistrict] = useState('حي السلامة');
  const [propertyType, setPropertyType] = useState<ServiceInquiry['propertyType']>('villa');
  const [serviceType, setServiceType] = useState<ServiceInquiry['serviceType']>('cctv_installation');
  const [preferredTime, setPreferredTime] = useState('anytime');
  const [notes, setNotes] = useState('');
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Interactive AI Estimator State
  const [estimatorProperty, setEstimatorProperty] = useState<'villa' | 'commercial' | 'building' | 'warehouse'>('villa');
  const [outdoorCams, setOutdoorCams] = useState(4);
  const [indoorCams, setIndoorCams] = useState(2);
  const [resolution, setResolution] = useState<'4k' | '4mp' | '5mp'>('4k');
  const [needColorVu, setNeedColorVu] = useState(true);
  const [needIntercom, setNeedIntercom] = useState(false);
  const [needSmartLock, setNeedSmartLock] = useState(false);

  // Calculate quick estimate
  const camCost = resolution === '4k' ? 380 : resolution === '5mp' ? 290 : 220;
  const colorVuAddon = needColorVu ? 40 : 0;
  const totalCams = outdoorCams + indoorCams;
  const camsSubtotal = totalCams * (camCost + colorVuAddon);
  const nvrCost = totalCams <= 4 ? 450 : totalCams <= 8 ? 750 : 1200;
  const hddCost = totalCams <= 4 ? 320 : totalCams <= 8 ? 420 : 680;
  const installAndCables = totalCams * 120;
  const intercomCost = needIntercom ? 1150 : 0;
  const lockCost = needSmartLock ? 680 : 0;

  const estimatedTotal = camsSubtotal + nvrCost + hddCost + installAndCables + intercomCost + lockCost;

  const jeddahDistricts = isAr
    ? [
        'حي السلامة',
        'شارع خالد بن الوليد',
        'حي الروضة',
        'حي الزهراء',
        'حي النعيم',
        'حي الحمراء',
        'حي الصفا',
        'حي المروة',
        'حي البوادي',
        'أبحر الشمالية',
        'أبحر الجنوبية',
        'حي الشاطئ',
        'حي الاندلس',
        'حي النسيم',
        'حي الفيصلية',
      ]
    : [
        'As Salamah',
        'Khalid Bin Waleed St',
        'Al Rawdah',
        'Al Zahra',
        'Al Naeem',
        'Al Hamra',
        'Al Safa',
        'Al Marwah',
        'Al Bawadi',
        'North Obhur',
        'South Obhur',
        'Al Shate’a',
        'Al Andalus',
        'Al Naseem',
        'Al Faisaliyah',
      ];

  const handlePackageSelect = (pkg: SecurityPackage) => {
    setSelectedPackageId(pkg.id);
    setNotes(
      isAr
        ? `طلب استفسار عن: ${pkg.titleAr} (بسعر تقريبي ${pkg.priceSAR} ر.س)`
        : `Interested in: ${pkg.title} (approx ${pkg.priceSAR} SAR)`
    );
    // Smooth scroll to booking form
    const bookingElem = document.getElementById('booking-section');
    if (bookingElem) {
      bookingElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleApplyEstimate = () => {
    setNotes(
      isAr
        ? `تقدير مبدئي ذكي: ${totalCams} كاميرات (${outdoorCams} خارجي، ${indoorCams} داخلي) بدقة ${resolution.toUpperCase()} ${needColorVu ? '+ تصوير ملون ليلي' : ''} ${needIntercom ? '+ انتركم' : ''} ${needSmartLock ? '+ قفل ذكي' : ''}. التكلفة التقديرية: ${estimatedTotal} ر.س`
        : `AI Estimate: ${totalCams} cameras (${outdoorCams} outdoor, ${indoorCams} indoor) ${resolution.toUpperCase()} ${needColorVu ? '+ Night Color' : ''} ${needIntercom ? '+ Intercom' : ''} ${needSmartLock ? '+ Smart Lock' : ''}. Est: ${estimatedTotal} SAR`
    );
    const bookingElem = document.getElementById('booking-section');
    if (bookingElem) {
      bookingElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim()) return;

    setSubmitting(true);
    try {
      await onBookSurvey({
        customerName: clientName.trim(),
        phone: clientPhone.trim(),
        district,
        propertyType,
        serviceType,
        notes: notes.trim()
          ? `${notes.trim()} (الوقت المفضل: ${preferredTime})`
          : `طلب معاينة عبر الموقع العام (الوقت المفضل: ${preferredTime})${selectedPackageId ? ` - باقة: ${selectedPackageId}` : ''}`,
        status: 'new',
      });
      setSubmittedSuccess(true);
    } catch (err) {
      console.error('Booking submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 pb-12">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-10 lg:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* Company Brand Logo Emblem */}
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-3xl p-2 shadow-2xl border border-slate-700/80 flex items-center justify-center transform hover:scale-105 transition-transform">
              <img
                src={business.logoUrl || '/logo.jpg'}
                alt={isAr ? business.nameAr : business.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-bold shadow-sm">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>
                {isAr
                  ? 'مؤسسة معتمدة للأنظمة الأمنية وكاميرات المراقبة في جدة'
                  : 'Certified CCTV & Security Systems Specialist in Jeddah'}
              </span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {isAr ? (
              <>
                حماية متكاملة لمنزلك ومنشأتك في <span className="text-amber-400">جدة</span> بأحدث كاميرات المراقبة المعتمدة
              </>
            ) : (
              <>
                Advanced CCTV & Security Protection for Your Property in{' '}
                <span className="text-amber-400">Jeddah</span>
              </>
            )}
          </h1>

          {/* Subtitle / Value proposition */}
          <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
            {isAr
              ? 'توريد وتركيب وبرمجة أنظمة المراقبة الذكية، الانتركم، والأقفال الإلكترونية بمواصفات الدفاع المدني والبلدية. ضمان شامل سنتين ودعم فني على مدار 24 ساعة.'
              : 'Full supply, professional installation, and 24/7 technical support for smart CCTV, video intercoms, and biometric access control. Compliant with Civil Defense & Baladiya regulations.'}
          </p>

          {/* Highlights / Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs font-semibold text-slate-200">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{isAr ? 'تقييم 5.0 نجوم على خرائط جوجل' : '5.0 Star Google Rating'}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs font-semibold text-slate-200">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>{isAr ? 'مفتوح 24 ساعة لخدمة كافة أحياء جدة' : '24/7 Service Across Jeddah'}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs font-semibold text-slate-200">
              <Award className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'ضمان سنتان استبدال فوري' : '2-Year Hardware Warranty'}</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <a
              href="#booking-section"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>{isAr ? 'طلب معاينة ميدانية مجانية بجدة' : 'Book Free Site Survey in Jeddah'}</span>
            </a>

            <a
              href={`https://wa.me/${business.whatsapp.replace('+', '')}?text=${encodeURIComponent(
                isAr
                  ? 'السلام عليكم ابو بندر إلكترونيات، أرغب بحجز استشارة وتركيب كاميرات مراقبة في جدة'
                  : 'Hello Abu Bandar Electronics, I would like to inquire about camera installation in Jeddah.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{isAr ? 'محادثة واتساب فورية' : 'Instant WhatsApp Chat'}</span>
            </a>

            <a
              href={`tel:${business.phone}`}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span dir="ltr">{business.phone}</span>
            </a>
          </div>

          {/* Physical Address Footnote */}
          <p className="text-xs text-slate-400 pt-2 flex items-center justify-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {isAr
                ? 'المقر والمعرض: شارع خالد بن الوليد، حي السلامة، جدة | س.ت: 4030198421'
                : 'Showroom: Khalid Bin Waleed St, As Salamah, Jeddah | CR: 4030198421'}
            </span>
          </p>
        </div>
      </section>

      {/* CORE SERVICES SECTION */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {isAr ? 'خدماتنا المتخصصة في الأنظمة الأمنية' : 'Our Professional Security Services'}
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            {isAr
              ? 'حلول متكاملة تغطي كافة متطلبات الحماية للمنازل، الفلل، المحلات التجارية، والمستودعات في جدة'
              : 'End-to-end security solutions for residential villas, retail shops, and commercial facilities in Jeddah.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Service 1 */}
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl hover:border-amber-500/40 transition-all group space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">
              {isAr ? 'تركيب كاميرات المراقبة (CCTV & IP)' : 'CCTV & IP Camera Installation'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isAr
                ? 'تركيب أحدث كاميرات 4K والرؤية الليلية الملونة بالذكاء الاصطناعي، مع كشف الأشخاص والسيارات والربط المباشر بتطبيق الجوال لمشاهدة البث المباشر والتسجيلات 24 ساعة.'
                : 'Ultra HD 4K, full night-color ColorVu, and AI perimeter cameras with smartphone app live-view and cloud alerts.'}
            </p>
            <div className="pt-2 flex flex-wrap gap-1.5 text-[11px] text-slate-400">
              <span className="bg-slate-800 px-2 py-0.5 rounded text-amber-300">Hikvision & Dahua</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded">4K Ultra HD</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded">ColorVu 24/7</span>
            </div>
          </div>

          {/* Service 2 */}
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl hover:border-amber-500/40 transition-all group space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">
              {isAr ? 'الانتركم المرئي الذكي للفلل والمباني' : 'Video Intercom Systems'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isAr
                ? 'أنظمة انتركم شبكية بشاشات لمس ملونة وكاميرات عريضة الزاوية تتيح لك التحدث مع الزوار وفتح الأبواب عن بعد من أي مكان عبر هاتفك الذكي.'
                : 'High-definition touchscreen intercoms with remote door release and visitor video calls via mobile application.'}
            </p>
            <div className="pt-2 flex flex-wrap gap-1.5 text-[11px] text-slate-400">
              <span className="bg-slate-800 px-2 py-0.5 rounded text-amber-300">Hik-Connect</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded">7" Touchscreens</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded">Remote Door Open</span>
            </div>
          </div>

          {/* Service 3 */}
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl hover:border-amber-500/40 transition-all group space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">
              {isAr ? 'أقفال الأبواب الذكية وأجهزة البصمة' : 'Smart Locks & Biometric Access'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isAr
                ? 'أقفال ذكية متطورة تفتح بالبصمة، والرمز السري، وبطاقات RFID، والتطبيق، بالإضافة لأجهزة الحضور والانصراف بالتعرف على الوجه للمؤسسات.'
                : 'Smart digital door locks and facial recognition access control terminals with multi-factor authentication.'}
            </p>
            <div className="pt-2 flex flex-wrap gap-1.5 text-[11px] text-slate-400">
              <span className="bg-slate-800 px-2 py-0.5 rounded text-amber-300">Biometric & Face ID</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded">ZKTeco & Tuya</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded">Keyless Living</span>
            </div>
          </div>

          {/* Service 4 */}
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl hover:border-amber-500/40 transition-all group space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
              <Wrench className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">
              {isAr ? 'صيانة طارئة وفحص الكاميرات 24 ساعة' : '24/7 CCTV Maintenance & Repairs'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isAr
                ? 'إصلاح أعطال أجهزة التسجيل NVR/DVR، تنظيف وتوجيه العدسات، استرجاع التسجيلات المفقودة، واستبدال الكابلات التالفة بجدة على مدار الساعة.'
                : 'Emergency technician visits across Jeddah for NVR troubleshooting, HDD recording recovery, and lens maintenance.'}
            </p>
            <div className="pt-2 flex flex-wrap gap-1.5 text-[11px] text-slate-400">
              <span className="bg-slate-800 px-2 py-0.5 rounded text-emerald-400">24/7 Response</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded">NVR Repair</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded">Video Recovery</span>
            </div>
          </div>

          {/* Service 5 */}
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl hover:border-amber-500/40 transition-all group space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
              <Cable className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">
              {isAr ? 'تمديد الشبكات والكوابل الخارجية المعتمدة' : 'Structured Cabling & Rack Setup'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isAr
                ? 'تمديدات احترافية بكوابل Cat6 نحاس نقي مقاومة للحرارة وأشعة الشمس في جدة، داخل مواسير وحلقات حماية مع كبائن سويتشات منظمة.'
                : '100% Pure Copper outdoor Cat6 cabling with heavy duty UV-resistant conduits and server rack organization.'}
            </p>
            <div className="pt-2 flex flex-wrap gap-1.5 text-[11px] text-slate-400">
              <span className="bg-slate-800 px-2 py-0.5 rounded text-amber-300">Cat6 Pure Copper</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded">Sun Protection</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded">Server Racks</span>
            </div>
          </div>

          {/* Service 6 */}
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl hover:border-amber-500/40 transition-all group space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">
              {isAr ? 'شهادات اعتماد الدفاع المدني والبلدية' : 'Civil Defense & Baladiya Compliance'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isAr
                ? 'تركيب وتوريد الأنظمة الأمنية المتوافقة تماماً مع اشتراطات الضبط الأمني والدفاع المدني بجدة لإصدار وتجديد الرخص التجارية دون تأخير.'
                : 'Certified CCTV installation fully adhering to MOI & Civil Defense standards for fast commercial licensing.'}
            </p>
            <div className="pt-2 flex flex-wrap gap-1.5 text-[11px] text-slate-400">
              <span className="bg-slate-800 px-2 py-0.5 rounded text-amber-300">ZATCA Ready</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded">MOI Specs</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded">Official Certificates</span>
            </div>
          </div>
        </div>
      </section>

      {/* READY PACKAGES SHOWCASE */}
      <section className="space-y-6" id="packages-section">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
            <Award className="w-3.5 h-3.5" />
            <span>{isAr ? 'عروض وباقات التركيب الشاملة' : 'Turnkey Security Packages'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {isAr ? 'باقات متكاملة جاهزة مع التوريد والتركيب والضمان' : 'Ready-to-Install Security Packages'}
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            {isAr
              ? 'أسعار شفافة تشمل كافة الأجهزة الأصلية، كوابل التمديد، أجور الفنيين المعتمدين، والبرمجة بالكامل في جدة'
              : 'Transparent pricing including hardware, pure copper cabling, expert installation, and mobile app configuration.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`bg-slate-900/90 border rounded-2xl p-5 flex flex-col justify-between transition-all relative ${
                selectedPackageId === pkg.id
                  ? 'border-amber-500 ring-2 ring-amber-500/30 shadow-xl'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {pkg.badge && (
                <div className="absolute -top-3 right-4 rtl:right-auto rtl:left-4 bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                  {isAr ? pkg.badgeAr : pkg.badge}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white line-clamp-2">
                    {isAr ? pkg.titleAr : pkg.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {isAr ? pkg.descriptionAr : pkg.description}
                  </p>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-xs text-slate-400 block">{isAr ? 'السعر الشامل للتركيب:' : 'Total Price (Supply & Fit):'}</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-black text-amber-400">{pkg.priceSAR}</span>
                    <span className="text-xs font-bold text-slate-400">{isAr ? 'ر.س' : 'SAR'}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 block mt-0.5">
                    {isAr ? '✓ شامل التركيب والبرمجة وضمان سنتين' : '✓ Includes fit & 2-year warranty'}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  {(isAr ? pkg.featuresAr : pkg.features).slice(0, 4).map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-800/80">
                <button
                  onClick={() => handlePackageSelect(pkg)}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700 hover:border-amber-500"
                >
                  <span>{isAr ? 'طلب هذه الباقة الآن' : 'Order This Package'}</span>
                  {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* INTERACTIVE AI ESTIMATOR & COST CALCULATOR */}
      <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-bold bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAr ? 'حاسبة التكلفة والمستشار الذكي للعملاء' : 'Customer AI Security System Cost Estimator'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {isAr ? 'احسب تكلفة نظامك الأمني فوراً حسب متطلبات موقعك' : 'Calculate Your Security System Cost Instantly'}
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-sm">
            {isAr
              ? 'اختر نوع المبنى وعدد الكاميرات للحصول على تقدير فوري تقريبي ومطابق للمواصفات في جدة'
              : 'Configure your building and camera requirements for an immediate tailored estimate in Jeddah.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="lg:col-span-2 space-y-5">
            {/* Property Type Selector */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2">
                {isAr ? 'نوع العقار / المنشأة:' : 'Property Type:'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'villa', labelAr: 'فيلا سكنية', labelEn: 'Private Villa', icon: Home },
                  { id: 'commercial', labelAr: 'محل / معرض', labelEn: 'Retail Store', icon: Store },
                  { id: 'building', labelAr: 'عمارة سكنية', labelEn: 'Building', icon: Building },
                  { id: 'warehouse', labelAr: 'مستودع / مصنع', labelEn: 'Warehouse', icon: Warehouse },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setEstimatorProperty(item.id as any)}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-semibold cursor-pointer ${
                        estimatorProperty === item.id
                          ? 'bg-amber-500/15 border-amber-500 text-amber-300'
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{isAr ? item.labelAr : item.labelEn}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Camera Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-300">{isAr ? 'كاميرات خارجية (مقاومة للماء والحرارة):' : 'Outdoor Weatherproof Cameras:'}</span>
                  <span className="text-amber-400 font-mono text-sm">{outdoorCams}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={16}
                  value={outdoorCams}
                  onChange={(e) => setOutdoorCams(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-300">{isAr ? 'كاميرات داخلية (مداخل وممرات ومكاتب):' : 'Indoor Cameras (Entrances & Rooms):'}</span>
                  <span className="text-amber-400 font-mono text-sm">{indoorCams}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={12}
                  value={indoorCams}
                  onChange={(e) => setIndoorCams(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Resolution and Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  {isAr ? 'دقة وضوح الكاميرا:' : 'Resolution:'}
                </label>
                <select
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                >
                  <option value="4k">4K Ultra HD (8MP) - الأوضح</option>
                  <option value="5mp">5MP Super HD</option>
                  <option value="4mp">4MP HD (Standard)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="colorvu-check"
                  checked={needColorVu}
                  onChange={(e) => setNeedColorVu(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-slate-800 border-slate-700"
                />
                <label htmlFor="colorvu-check" className="text-xs font-semibold text-slate-300 cursor-pointer">
                  {isAr ? 'تصوير ملون ليلي 24 ساعة (ColorVu)' : '24/7 Color Night Vision'}
                </label>
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="intercom-check"
                  checked={needIntercom}
                  onChange={(e) => setNeedIntercom(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-slate-800 border-slate-700"
                />
                <label htmlFor="intercom-check" className="text-xs font-semibold text-slate-300 cursor-pointer">
                  {isAr ? 'إضافة انتركم مرئي ذكي' : 'Add Smart Video Intercom'}
                </label>
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-amber-500/30 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                {isAr ? 'ملخص التقدير المبدئي' : 'Instant System Estimate'}
              </span>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-white">{estimatedTotal}</span>
                <span className="text-sm font-bold text-amber-400">{isAr ? 'ر.س تقريباً' : 'SAR Approx'}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {isAr
                  ? 'يشمل الكاميرات وجهاز التسجيل NVR والقرص الصلب والكيابل النحاسية وأجور التركيب والضمان سنتين.'
                  : 'Includes cameras, NVR, hard disk, copper wiring, professional fitting, and 2-year warranty.'}
              </p>
            </div>

            <div className="space-y-2 text-xs border-t border-slate-800 pt-3 text-slate-300">
              <div className="flex justify-between">
                <span>{isAr ? 'عدد الكاميرات الإجمالي:' : 'Total Cameras:'}</span>
                <span className="font-bold text-white">{totalCams} {isAr ? 'كاميرات' : 'cameras'}</span>
              </div>
              <div className="flex justify-between">
                <span>{isAr ? 'جهاز التسجيل الموصى به:' : 'Recommended NVR:'}</span>
                <span className="font-bold text-white">{totalCams <= 4 ? '4-Channel 4K' : totalCams <= 8 ? '8-Channel 4K' : '16-Channel 4K'}</span>
              </div>
              <div className="flex justify-between">
                <span>{isAr ? 'مدة حفظ التسجيلات:' : 'Recording Retention:'}</span>
                <span className="font-bold text-emerald-400">30+ {isAr ? 'يوماً مستمر' : 'days'}</span>
              </div>
            </div>

            <button
              onClick={handleApplyEstimate}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <span>{isAr ? 'تأكيد وحجز موعد معاينة لهذا المخطط' : 'Book Free Survey for this Plan'}</span>
              {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </section>

      {/* BOOKING & FREE SITE SURVEY SECTION */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8" id="booking-section">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isAr ? 'معاينة مجانية بدون أي التزام' : '100% Free Site Visit & Consultation'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {isAr ? 'احجز موعد معاينة ميدانية مجانية لمنزلك أو مشروعك بجدة' : 'Schedule Your Free Security Site Inspection in Jeddah'}
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            {isAr
              ? 'يقوم مهندس وفني مختص بزيارة موقعك لفحص الزوايا وتحديد أفضل أماكن الكاميرات وتقديم عرض سعر دقيق ومفصل'
              : 'Our certified security engineer will inspect your premises, evaluate camera angles, and provide an accurate official quotation.'}
          </p>
        </div>

        {submittedSuccess ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-8 rounded-2xl text-center space-y-4 max-w-xl mx-auto">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-white">
              {isAr ? 'تم استلام طلب المعاينة بنجاح!' : 'Your Request Was Received Successfully!'}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isAr
                ? 'شكراً لك. سيتواصل معك فني مؤسسة ابو بندر إلكترونيات هاتفياً خلال أقل من 30 دقيقة لتأكيد الموعد المناسب لزيارتك في جدة.'
                : 'Thank you! An Abu Bandar Electronics technician will call you within 30 minutes to confirm your visit time in Jeddah.'}
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`https://wa.me/${business.whatsapp.replace('+', '')}?text=${encodeURIComponent(
                  isAr
                    ? `السلام عليكم، رفعت طلب معاينة عبر الموقع باسم ${clientName} - هاتف: ${clientPhone} - حي: ${district}`
                    : `Hello, I submitted a site inspection request for ${clientName} - Phone: ${clientPhone} - District: ${district}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{isAr ? 'تأكيد فوري عبر الواتساب' : 'Instant WhatsApp Confirmation'}</span>
              </a>

              <button
                onClick={() => {
                  setSubmittedSuccess(false);
                  setClientName('');
                  setClientPhone('');
                  setNotes('');
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
              >
                {isAr ? 'طلب معاينة أخرى' : 'Submit Another Request'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitBooking} className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                {isAr ? 'الاسم الكريم / اسم المنشأة *' : 'Client / Company Name *'}
              </label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder={isAr ? 'مثال: أبو فهد الغامدي أو مؤسسة الأمل' : 'e.g. Fahad Al-Ghamdi or Al-Amal Est.'}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                {isAr ? 'رقم الجوال للتواصل وتأكيد الموعد *' : 'Mobile Phone Number *'}
              </label>
              <input
                type="tel"
                required
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="05XXXXXXXX / +9665XXXXXXXX"
                dir="ltr"
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 text-left"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                {isAr ? 'الحي في جدة *' : 'Jeddah District *'}
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
              >
                {jeddahDistricts.map((d, i) => (
                  <option key={i} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                {isAr ? 'نوع العقار:' : 'Property Type:'}
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value as any)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
              >
                <option value="villa">{isAr ? 'فيلا خاصة / قصر' : 'Private Villa'}</option>
                <option value="apartment">{isAr ? 'شقة سكنية' : 'Apartment'}</option>
                <option value="commercial_shop">{isAr ? 'محل تجاري / معرض' : 'Commercial Store'}</option>
                <option value="building">{isAr ? 'عمارة سكنية / برج' : 'Residential Building'}</option>
                <option value="warehouse">{isAr ? 'مستودع / حوش' : 'Warehouse / Yard'}</option>
                <option value="office">{isAr ? 'مكتب أو شركة' : 'Office'}</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                {isAr ? 'نوع الخدمة المطلوبة:' : 'Service Requested:'}
              </label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value as any)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
              >
                <option value="cctv_installation">{isAr ? 'تركيب وتوريد كاميرات مراقبة' : 'CCTV System Installation'}</option>
                <option value="maintenance_repair">{isAr ? 'صيانة وإصلاح أنظمة مراقبة' : 'CCTV Maintenance & Repair'}</option>
                <option value="intercom">{isAr ? 'انتركم مرئي ذكي' : 'Video Intercom System'}</option>
                <option value="smart_lock">{isAr ? 'أقفال أبواب ذكية وبصمة' : 'Smart Door Locks'}</option>
                <option value="access_control">{isAr ? 'أنظمة تحكم بالدخول والأبواب' : 'Access Control Systems'}</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                {isAr ? 'الوقت المفضل للمعاينة:' : 'Preferred Visit Time:'}
              </label>
              <select
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
              >
                <option value="anytime">{isAr ? 'في أي وقت متاح اليوم' : 'Anytime Today'}</option>
                <option value="morning">{isAr ? 'صباحاً (9 ص - 1 م)' : 'Morning (9 AM - 1 PM)'}</option>
                <option value="afternoon">{isAr ? 'عصراً (4 م - 7 م)' : 'Afternoon (4 PM - 7 PM)'}</option>
                <option value="evening">{isAr ? 'مساءً (7 م - 11 م)' : 'Evening (7 PM - 11 PM)'}</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-300 block mb-1">
                {isAr ? 'ملاحظات أو مواصفات خاصة ترغب بها:' : 'Special Requirements / Notes:'}
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={
                  isAr
                    ? 'مثال: أحتاج 4 كاميرات تصوير ليلي ملون مع شاشة انتركم للباب الخارجي، وتركيب مواسير حماية...'
                    : 'e.g. Need 4 cameras with night color vision and video intercom...'
                }
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="sm:col-span-2 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? (isAr ? 'جاري إرسال الطلب...' : 'Submitting...') : (isAr ? 'تأكيد حجز المعاينة المجانية الآن' : 'Confirm Free Site Survey Request')}</span>
              </button>
            </div>
          </form>
        )}
      </section>

      {/* LOCATION & GOOGLE MAPS SHOWROOM SECTION */}
      <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white p-1 shadow-lg border border-slate-700/80 flex items-center justify-center shrink-0">
              <img
                src={business.logoUrl || '/logo.jpg'}
                alt={isAr ? business.nameAr : business.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{isAr ? 'موقع المعرض في مدينة جدة' : 'Jeddah Showroom & Service Center'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {isAr ? 'معرض ومقر ابو بندر إلكترونيات' : 'Abu Bandar Electronics Showroom'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                {isAr
                  ? 'تفضل بزيارة معرضنا الرئيسي في جدة لمعاينة كاميرات المراقبة، أجهزة التسجيل، شاشات الانتركم، والأقفال الذكية مع فريق هندسي متخصص.'
                  : 'Visit our flagship showroom in Jeddah to explore the latest CCTV cameras, NVRs, smart intercoms, and access control hardware.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={business.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              <span>{isAr ? 'فتح في خرائط Google' : 'Open in Google Maps'}</span>
            </a>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=Abu+Bandar+Electronics+ابو+بندر+إلكترونيات+Khalid+Bin+Waleed+As+Salamah+Jeddah`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all"
            >
              <Navigation className="w-4 h-4" />
              <span>{isAr ? 'مسار الاتجاهات' : 'Get Directions'}</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Interactive Google Map Embed */}
          <div className="lg:col-span-7 space-y-3">
            <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 shadow-inner group">
              <iframe
                title="Abu Bandar Electronics Jeddah Showroom Google Maps"
                src="https://maps.google.com/maps?q=Abu+Bandar+Electronics+Khalid+Bin+Waleed+As+Salamah+Jeddah+Saudi+Arabia&t=&z=16&ie=UTF8&iwloc=&output=embed"
                className="w-full h-80 sm:h-96 border-0 filter contrast-105"
                loading="lazy"
                allowFullScreen
              />
              <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3 bg-slate-950/90 backdrop-blur border border-amber-500/40 px-3 py-1.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold text-amber-300">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{isAr ? 'ابو بندر إلكترونيات - حي السلامة، جدة' : 'Abu Bandar Electronics - As Salamah, Jeddah'}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs">
              <span className="text-slate-400">
                {isAr ? 'الإحداثيات والموقع مثبت ومعتمد على خرائط Google' : 'Location verified & pinned on Google Maps'}
              </span>
              <a
                href={business.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:underline font-semibold flex items-center gap-1"
              >
                <span>{isAr ? 'عرض الموقع الكبير في تطبيق الخرائط' : 'View Full Map in App'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Showroom Details & Reviews Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Store className="w-4 h-4 text-amber-400" />
                <span>{isAr ? 'بيانات زيارة المعرض' : 'Showroom Visit Details'}</span>
              </h3>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-start gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800/60">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">{isAr ? 'عنوان المعرض' : 'Showroom Address'}</p>
                    <p className="text-slate-300 mt-0.5">{isAr ? business.addressAr : business.address}</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">{isAr ? 'الرمز البريدي: 23525 - جدة' : 'Postal Code: 23525 - Jeddah'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800/60">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">{isAr ? 'ساعات العمل والاستقبال' : 'Working Hours'}</p>
                    <p className="text-emerald-400 font-bold mt-0.5">{isAr ? business.hoursAr : business.hours}</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      {isAr ? 'خدمة الطوارئ والصيانة متوفرة طوال الأسبوع' : 'Emergency service & site visits 24/7'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800/60">
                  <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">{isAr ? 'التواصل المباشر مع المعرض' : 'Direct Showroom Contact'}</p>
                    <p className="text-amber-400 font-mono font-bold mt-0.5" dir="ltr">{business.phone}</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">{isAr ? 'هاتف الفني وخدمة العملاء' : 'Technician & customer service'}</p>
                  </div>
                </div>
              </div>

              {/* Verified Google Review Summary */}
              <div className="pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-amber-400">5.0</span>
                    <div>
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {isAr ? 'تقييم 5.0 نجوم على خرائط Google' : '5.0 Star Rating on Google Maps'}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    100% {isAr ? 'رضا العملاء' : 'Satisfaction'}
                  </span>
                </div>

                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{isAr ? 'عبدالله الحربي' : 'Abdullah Al-Harbi'}</span>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {isAr
                      ? 'تعامل راقي جداً وسرعة في تركيب كاميرات 4K للفيلا في حي الروضة. التمديدات نظيفة وتطبيق الجوال شغال ممتاز.'
                      : 'Very professional service. Installed 4K cameras for my villa in Al Rawdah. Clean work and reliable mobile app.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CALLOUT WITH DISCRETE STAFF ACCESS */}
      <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-amber-400" />
          <span>
            {isAr
              ? 'مؤسسة ابو بندر إلكترونيات - جميع الحقوق محفوظة © 2026'
              : 'Abu Bandar Electronics Est. - All rights reserved © 2026'}
          </span>
        </div>

        {/* Staff / Admin Portal Access Button */}
        <button
          onClick={onOpenAdmin}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-700/80 transition-colors text-xs font-semibold cursor-pointer"
          title={isAr ? 'دخول لوحة تحكم الإدارة والمخزون' : 'Staff & Admin Portal'}
        >
          <LockKeyhole className="w-3.5 h-3.5 text-amber-400" />
          <span>{isAr ? 'بوابة إدارة المخزون والموظفين' : 'Staff & Inventory Portal'}</span>
        </button>
      </section>
    </div>
  );
};
