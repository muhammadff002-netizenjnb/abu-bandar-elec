import React, { useState } from 'react';
import { Lock, X, ArrowRight, ArrowLeft, KeyRound, ShieldAlert } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  lang: 'ar' | 'en';
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  lang,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const isAr = lang === 'ar';

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Strictly verify password: abubandar2026
    if (pin.trim() === 'abubandar2026') {
      setError(false);
      setPin('');
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5 relative">
        <button
          onClick={() => {
            setError(false);
            setPin('');
            onClose();
          }}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <img
            src="/logo.jpg"
            alt="Abu Bandar Electronics"
            referrerPolicy="no-referrer"
            className="w-12 h-12 rounded-xl object-contain bg-white p-0.5 border border-slate-700 shadow-md shrink-0"
          />
          <div>
            <h3 className="text-base font-bold text-white">
              {isAr ? 'بوابة دخول الموظفين والإدارة' : 'Staff & Management Portal'}
            </h3>
            <p className="text-xs text-slate-400">
              {isAr ? 'منطقة مخصصة للموظفين المصرح لهم فقط' : 'Restricted to authorized personnel only'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              {isAr ? 'كلمة مرور بوابة الموظفين:' : 'Staff Portal Password:'}
            </label>
            <div className="relative">
              <input
                type="password"
                autoFocus
                placeholder="••••••••••••"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(false);
                }}
                className={`w-full bg-slate-800 border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none tracking-widest text-center font-mono ${
                  error ? 'border-rose-500 text-rose-300 ring-1 ring-rose-500' : 'border-slate-700 focus:border-amber-500'
                }`}
              />
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 rtl:left-auto rtl:right-3 top-3 pointer-events-none" />
            </div>
            {error && (
              <div className="flex items-center gap-1.5 text-[11px] text-rose-400 mt-2 bg-rose-500/10 border border-rose-500/20 p-2 rounded-lg">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>
                  {isAr
                    ? 'كلمة المرور غير صحيحة. يرجى إعادة المحاولة أو التواصل مع إدارة المنشأة.'
                    : 'Incorrect password. Please try again or contact management.'}
                </span>
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isAr ? 'تسجيل الدخول إلى النظام' : 'Sign In to Portal'}</span>
              {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
