import React from 'react';
import { 
  Phone, 
  MessageCircle, 
  MapPin, 
  Clock, 
  Star, 
  ShieldCheck, 
  Languages, 
  Wrench, 
  Package, 
  FileText, 
  Bot, 
  PhoneCall,
  LockKeyhole,
  Globe,
  Sparkles,
  Calendar,
  Layers,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { BusinessInfo } from '../types.ts';

interface HeaderProps {
  business: BusinessInfo;
  viewMode: 'public' | 'admin';
  setViewMode: (mode: 'public' | 'admin') => void;
  adminTab: 'inventory' | 'packages' | 'invoices' | 'ai_advisor' | 'inquiries' | 'profile';
  setAdminTab: (tab: 'inventory' | 'packages' | 'invoices' | 'ai_advisor' | 'inquiries' | 'profile') => void;
  lang: 'ar' | 'en';
  setLang: (lang: 'ar' | 'en') => void;
  lowStockCount: number;
  inquiryCount: number;
  onOpenAdminLogin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  business,
  viewMode,
  setViewMode,
  adminTab,
  setAdminTab,
  lang,
  setLang,
  lowStockCount,
  inquiryCount,
  onOpenAdminLogin,
}) => {
  const isAr = lang === 'ar';

  const scrollToSection = (id: string) => {
    if (viewMode !== 'public') {
      setViewMode('public');
    }
    setTimeout(() => {
      const elem = document.getElementById(id);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur sticky top-0 z-40">
      {/* Admin Mode Top Status Bar if active */}
      {viewMode === 'admin' ? (
        <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-slate-950 font-bold text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-2 shadow-inner">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-white text-xs sm:text-sm font-black flex items-center gap-1.5">
              <LockKeyhole className="w-4 h-4 text-amber-300" />
              {isAr
                ? 'لوحة تحكم الإدارة والمخزون الداخلي (غير مرئية للعملاء)'
                : 'Staff Management & Private Inventory Portal (Hidden from Customers)'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('public')}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-950 hover:bg-slate-900 text-amber-400 hover:text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-md border border-amber-400/40"
            >
              <Globe className="w-3.5 h-3.5 text-amber-300" />
              <span>{isAr ? 'عرض الموقع العام للعملاء' : 'View Public Customer Website'}</span>
              {isAr ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => setLang(isAr ? 'en' : 'ar')}
              className="flex items-center gap-1 px-2.5 py-1 bg-amber-950/50 text-amber-100 hover:text-white rounded-lg text-xs font-bold cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{isAr ? 'English' : 'العربية'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Standard Public Website Top Bar */
        <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-amber-950 font-medium text-xs sm:text-sm px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 shadow-inner">
          <div className="flex items-center gap-3 overflow-x-auto py-0.5">
            <span className="inline-flex items-center gap-1 font-bold bg-amber-900/20 text-white px-2 py-0.5 rounded-full text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              {isAr ? 'مؤسسة معتمدة للأنظمة الأمنية بجدة' : 'Certified Security Systems - Jeddah'}
            </span>
            <span className="text-amber-100 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              {isAr ? 'مفتوح 24 ساعة لخدمات التركيب والصيانة الطارئة' : 'Open 24 Hours for Installation & Support'}
            </span>
            <a
              href={business.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-100 hover:text-white flex items-center gap-1 underline underline-offset-2 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-300" />
              {isAr ? 'شارع خالد بن الوليد، حي السلامة، جدة' : 'Khalid Bin Waleed, As Salamah, Jeddah'}
            </a>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(isAr ? 'en' : 'ar')}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-950/40 text-amber-100 hover:text-white rounded-lg border border-amber-500/40 text-xs font-bold cursor-pointer transition-all hover:bg-amber-900/60 shadow-sm"
              title={isAr ? 'Switch to English' : 'التحويل إلى اللغة العربية'}
            >
              <Languages className="w-3.5 h-3.5 text-amber-300" />
              <span>{isAr ? '🇬🇧 English' : '🇸🇦 العربية'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div 
          onClick={() => {
            if (viewMode === 'admin') setViewMode('public');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-white p-1 shadow-lg shadow-amber-500/10 border border-slate-700/80 group-hover:scale-105 transition-transform flex items-center justify-center overflow-hidden shrink-0">
            <img
              src={business.logoUrl || '/logo.jpg'}
              alt={isAr ? business.nameAr : business.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
              onError={(e) => {
                // Fallback to text initials if image fails
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl font-black text-white tracking-tight group-hover:text-amber-400 transition-colors">
                {isAr ? business.nameAr : business.name}
              </span>
              <span className="text-xs text-amber-400 font-semibold px-2 py-0.5 bg-amber-400/10 border border-amber-400/20 rounded">
                {isAr ? 'جدة' : 'Jeddah'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <div className="flex items-center gap-1 text-amber-400 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>5.0</span>
                <span className="text-slate-400 font-normal">
                  ({isAr ? 'تقييمان على خرائط جوجل' : '2 Google reviews'})
                </span>
              </div>
              <span className="text-slate-600">•</span>
              <span>{isAr ? business.categoryAr : business.category}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions for Direct Customer Contact & Language */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-start md:justify-end">
          {/* Direct Phone Call */}
          <a
            href={`tel:${business.phone}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
            <span dir="ltr">{business.phone}</span>
          </a>

          {/* Direct WhatsApp */}
          <a
            href={`https://wa.me/${business.whatsapp.replace('+', '')}?text=${encodeURIComponent(
              isAr
                ? 'السلام عليكم ابو بندر إلكترونيات، أحتاج استفسار عن تركيب كاميرات وأنظمة أمنية بجدة'
                : 'Hello Abu Bandar Electronics, I would like to inquire about camera installation in Jeddah.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-md shadow-emerald-600/20"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>{isAr ? 'واتساب مباشر' : 'WhatsApp'}</span>
          </a>

          {/* Portal Switcher Button */}
          {viewMode === 'public' ? (
            <button
              onClick={onOpenAdminLogin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-700 text-xs font-semibold cursor-pointer transition-all"
              title={isAr ? 'دخول لوحة تحكم الإدارة والمخزون' : 'Staff & Inventory Management'}
            >
              <LockKeyhole className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{isAr ? 'بوابة الموظفين' : 'Staff Portal'}</span>
              <span className="sm:hidden">{isAr ? 'الإدارة' : 'Staff'}</span>
            </button>
          ) : (
            <button
              onClick={() => setViewMode('public')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold cursor-pointer transition-all shadow-md shadow-amber-500/20"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{isAr ? 'الموقع العام' : 'Public Site'}</span>
            </button>
          )}
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 overflow-x-auto scrollbar-none border-t border-slate-800/80">
        {viewMode === 'public' ? (
          /* PUBLIC WEBSITE NAVIGATION (Customer Friendly - Inventory NEVER shown) */
          <nav className="flex space-x-1 sm:space-x-3 py-2" aria-label="Public Navigation">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-slate-200 hover:text-white hover:bg-slate-800/60 cursor-pointer whitespace-nowrap"
            >
              <span>{isAr ? 'الرئيسية' : 'Home'}</span>
            </button>

            <button
              onClick={() => scrollToSection('packages-section')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-slate-200 hover:text-white hover:bg-slate-800/60 cursor-pointer whitespace-nowrap"
            >
              <Wrench className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAr ? 'باقات التركيب والعروض' : 'Packages & Offers'}</span>
            </button>

            <button
              onClick={() => scrollToSection('booking-section')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-slate-200 hover:text-white hover:bg-slate-800/60 cursor-pointer whitespace-nowrap"
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isAr ? 'طلب معاينة مجانية بجدة' : 'Book Free Survey'}</span>
            </button>

            <button
              onClick={() => scrollToSection('packages-section')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-slate-200 hover:text-white hover:bg-slate-800/60 cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isAr ? 'حاسبة التكلفة الذكية' : 'AI Cost Calculator'}</span>
            </button>

            <a
              href={business.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-slate-200 hover:text-white hover:bg-slate-800/60 cursor-pointer whitespace-nowrap"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAr ? 'موقع المعرض بجدة' : 'Jeddah Showroom'}</span>
            </a>
          </nav>
        ) : (
          /* ADMIN / STAFF PORTAL NAVIGATION (Private - Inventory, Invoices, Inquiries) */
          <nav className="flex space-x-1 sm:space-x-2 py-2" aria-label="Admin Tabs">
            <button
              onClick={() => setAdminTab('inventory')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                adminTab === 'inventory'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>{isAr ? 'إدارة المخزون والمعدات (داخلي)' : 'Internal Inventory & Stock'}</span>
              {lowStockCount > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    adminTab === 'inventory'
                      ? 'bg-slate-950 text-amber-400'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {lowStockCount} {isAr ? 'تنبيه' : 'low'}
                </span>
              )}
            </button>

            <button
              onClick={() => setAdminTab('invoices')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                adminTab === 'invoices'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{isAr ? 'الفواتير وعروض الأسعار' : 'Quotations & Invoices'}</span>
            </button>

            <button
              onClick={() => setAdminTab('inquiries')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                adminTab === 'inquiries'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Phone className="w-4 h-4" />
              <span>{isAr ? 'طلبات المعاينة من الموقع' : 'Website Inquiries & Leads'}</span>
              {inquiryCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {inquiryCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setAdminTab('packages')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                adminTab === 'packages'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>{isAr ? 'تعديل الباقات والعروض' : 'Manage Packages'}</span>
            </button>

            <button
              onClick={() => setAdminTab('ai_advisor')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                adminTab === 'ai_advisor'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>{isAr ? 'المستشار التقني الداخلي' : 'Internal Tech Advisor'}</span>
            </button>

            <button
              onClick={() => setAdminTab('profile')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                adminTab === 'profile'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>{isAr ? 'بيانات المنشأة والمعرض' : 'Business Profile'}</span>
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};
