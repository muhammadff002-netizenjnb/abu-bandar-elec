import React, { useState } from 'react';
import { Bot, Sparkles, Check, Send, AlertCircle, HardDrive, Video, ShieldCheck, ChevronRight, Calculator } from 'lucide-react';
import { BusinessInfo } from '../types.ts';

interface AISecurityAdvisorProps {
  business: BusinessInfo;
  onApplyEstimateToQuote: (estimate: any) => void;
  lang: 'ar' | 'en';
}

export const AISecurityAdvisor: React.FC<AISecurityAdvisorProps> = ({
  business,
  onApplyEstimateToQuote,
  lang,
}) => {
  const isAr = lang === 'ar';

  const [propertyType, setPropertyType] = useState('villa');
  const [areaSquareMeters, setAreaSquareMeters] = useState(350);
  const [entrancesCount, setEntrancesCount] = useState(2);
  const [outdoorAreas, setOutdoorAreas] = useState('Front yard, parking, main gate');
  const [priority, setPriority] = useState('Night Color 24/7 & Mobile App');
  const [budgetLevel, setBudgetLevel] = useState('standard');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyType,
          areaSquareMeters,
          entrancesCount,
          outdoorAreas,
          priority,
          budgetLevel,
          notes,
        }),
      });
      if (!res.ok) {
        throw new Error('Failed to get security system estimate');
      }
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err?.message || 'Error generating AI assessment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold mb-3">
            <Bot className="w-4 h-4" />
            <span>{isAr ? 'مستشار الذكاء الاصطناعي الأمني - ابو بندر إلكترونيات' : 'AI Security Engineer - Abu Bandar Electronics'}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">
            {isAr ? 'حاسبة وتخطيط الأنظمة الأمنية الذكية بجدة' : 'Intelligent Security System Planner & Cost Estimator'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1 leading-relaxed">
            {isAr
              ? 'يقوم النموذج الذكي بتحليل مساحة ومواصفات موقعك واحتساب العدد المثالي للكاميرات وسعة التخزين المطلوبة طبقاً لاشتراطات الأمن العام والدفاع المدني بجدة.'
              : 'Our intelligent assistant analyzes your property specifications to estimate ideal camera count, storage, and civil defense compliance in Jeddah.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Inputs */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Calculator className="w-4 h-4 text-amber-400" />
            <span>{isAr ? 'بيانات ومواصفات الموقع' : 'Property Parameters'}</span>
          </h3>

          <form onSubmit={handleCalculate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isAr ? 'نوع العقار / المنشأة' : 'Property Type'}
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="villa">{isAr ? 'فيلا سكنية خاصة' : 'Private Villa'}</option>
                <option value="commercial_shop">{isAr ? 'محل تجاري / معرض (معتمد للبلدية)' : 'Commercial Retail Shop'}</option>
                <option value="apartment_building">{isAr ? 'عمارة سكنية / مجمع شقق' : 'Residential Apartment Building'}</option>
                <option value="office">{isAr ? 'مقر شركة أو مكتب إداري' : 'Corporate Office'}</option>
                <option value="warehouse">{isAr ? 'مستودع أو هنجر تخزين' : 'Warehouse / Industrial Yard'}</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isAr ? 'المساحة التقريبية (م²)' : 'Approx Area (sqm)'}
                </label>
                <input
                  type="number"
                  min="20"
                  max="10000"
                  value={areaSquareMeters}
                  onChange={(e) => setAreaSquareMeters(parseInt(e.target.value) || 100)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-white font-bold focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isAr ? 'عدد المداخل والبوابات' : 'Gates / Entrances'}
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={entrancesCount}
                  onChange={(e) => setEntrancesCount(parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-white font-bold focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isAr ? 'الأولوية الرئيسية' : 'Primary Priority'}
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Night Color 24/7 & Mobile App">{isAr ? 'تصوير ملون ليلي 24 ساعة ومشاهدة بالجوال' : 'Night Color 24/7 & Mobile App'}</option>
                <option value="Civil Defense & Baladiya Compliance">{isAr ? 'مطابقة اشتراطات البلدية والدفاع المدني' : 'Civil Defense / MOI Compliance'}</option>
                <option value="Smart Access & Facial Recognition">{isAr ? 'دخول ذكي بالبصمة والوجه وانتركم' : 'Biometric Access & Intercom'}</option>
                <option value="Maximum Storage (60+ Days Retention)">{isAr ? 'فترة تخزين تسجيلات طويلة (60 يوم فما فوق)' : 'Extended 60+ Days Storage'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isAr ? 'مستوى الميزانية التقديرية' : 'Budget Preference'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['economy', 'standard', 'premium'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setBudgetLevel(lvl)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer border ${
                      budgetLevel === lvl
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {lvl === 'economy' && (isAr ? 'اقتصادي' : 'Economy')}
                    {lvl === 'standard' && (isAr ? 'متوسط' : 'Standard')}
                    {lvl === 'premium' && (isAr ? 'فائق (4K AI)' : 'Premium 4K')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isAr ? 'ملاحظات إضافية عن الموقع' : 'Additional Notes'}
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={isAr ? 'مثال: يوجد مواقف سيارات خلفية، أبواب زجاجية' : 'e.g. Backyard parking, glass doors'}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>
                {loading
                  ? isAr ? 'جاري التحليل الأمني...' : 'Analyzing Security Parameters...'
                  : isAr ? 'احسب النظام والتكلفة المقترحة' : 'Calculate Custom Estimate'}
              </span>
            </button>
          </form>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-7 space-y-4">
          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {!result && !loading && (
            <div className="h-full min-h-[350px] bg-slate-900/60 border border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center p-8 text-center text-slate-500">
              <Bot className="w-12 h-12 text-slate-600 mb-3" />
              <h4 className="text-base font-bold text-slate-400">
                {isAr ? 'بانتظار إدخال مواصفات العقار' : 'Awaiting Property Specifications'}
              </h4>
              <p className="text-xs max-w-sm mt-1 text-slate-500">
                {isAr
                  ? 'حدد نوع العقار ومساحته واضغط "احسب النظام" للحصول على توصية فنية معتمدة من مهندسي ابو بندر إلكترونيات بجدة.'
                  : 'Enter your property size and priority to get a technical recommendation tailored to Jeddah standards.'}
              </p>
            </div>
          )}

          {result && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {isAr ? 'التوصية الفنية المعتمدة للموقع' : 'Certified Engineering Recommendation'}
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      {isAr ? 'حسب معايير الأمن العام ومناخ مدينة جدة' : 'Optimized for Jeddah environment & Civil Defense'}
                    </span>
                  </div>
                </div>

                {result.estimatedCostRangeSAR && (
                  <div className="text-right rtl:text-right ltr:text-left">
                    <p className="text-[10px] text-slate-400">{isAr ? 'التكلفة التقديرية (شاملة التركيب)' : 'Estimated Turnkey Cost'}</p>
                    <p className="text-base font-black text-amber-400">
                      {result.estimatedCostRangeSAR.min} - {result.estimatedCostRangeSAR.max} <span className="text-xs">ر.س</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Summary text */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                {isAr ? result.summaryAr || result.summary : result.summary}
              </p>

              {/* Hardware Spec Badges */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 text-center">
                  <div className="text-cyan-400 mx-auto mb-1 flex justify-center">
                    <Video className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] text-slate-400 block">{isAr ? 'الكاميرات المقترحة' : 'Cameras'}</span>
                  <span className="text-base font-black text-white">{result.recommendedCameras} {isAr ? 'كاميرا' : 'Cams'}</span>
                </div>

                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 text-center">
                  <div className="text-amber-400 mx-auto mb-1 flex justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] text-slate-400 block">{isAr ? 'مخارج جهاز NVR' : 'NVR Channels'}</span>
                  <span className="text-base font-black text-white">{result.nvrChannels} {isAr ? 'قنوات' : 'Channels'}</span>
                </div>

                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 text-center">
                  <div className="text-emerald-400 mx-auto mb-1 flex justify-center">
                    <HardDrive className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] text-slate-400 block">{isAr ? 'سعة التخزين (HDD)' : 'Storage HDD'}</span>
                  <span className="text-base font-black text-white">{result.storageTB} TB</span>
                </div>
              </div>

              {/* Recommendations bullets */}
              <div>
                <h5 className="text-xs font-bold text-slate-300 uppercase mb-2">
                  {isAr ? 'المواصفات الفنية الموصى بها لمناخ جدة:' : 'Specific Recommendations for Jeddah:'}
                </h5>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {((isAr && result.keyRecommendationsAr) ? result.keyRecommendationsAr : result.keyRecommendations || []).map((rec: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 bg-slate-800/40 p-2 rounded-lg">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Direct Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                <button
                  onClick={() =>
                    onApplyEstimateToQuote({
                      clientName: '',
                      district: 'Jeddah',
                      items: [
                        {
                          description: `AI Certified Security Package: ${result.recommendedCameras}x Hikvision 4K Cameras + ${result.nvrChannels}CH NVR + ${result.storageTB}TB Surveillance HDD + Conduits & Installation`,
                          quantity: 1,
                          unitPriceSAR: result.estimatedCostRangeSAR?.min || 2500,
                          totalSAR: result.estimatedCostRangeSAR?.min || 2500,
                        },
                      ],
                    })
                  }
                  className="w-full sm:flex-1 py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>{isAr ? 'تحويل التوصية لعرض سعر رسمي' : 'Convert to Official Quote'}</span>
                </button>

                <a
                  href={`https://wa.me/${business.whatsapp.replace('+', '')}?text=${encodeURIComponent(
                    isAr
                      ? `السلام عليكم ابو بندر إلكترونيات، قمت بحساب تكلفة نظام أمني لموقعي في جدة: ${result.recommendedCameras} كاميرات، مساحة ${areaSquareMeters}م²، وأرغب في استشارة فنية وزيارة معاينة.`
                      : `Hello Abu Bandar Electronics, I used the AI system planner for ${result.recommendedCameras} cameras in Jeddah and would like a site survey.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isAr ? 'إرسال للمهندس عبر واتساب' : 'Send to Tech on WhatsApp'}</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
