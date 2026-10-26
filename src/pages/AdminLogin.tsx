import React, { useState } from 'react';
import { setAdminLoggedIn } from '../lib/storage';
import { Shield, Lock, ArrowRight, KeyRound, Sparkles } from 'lucide-react';

interface AdminLoginProps {
  onSuccess: () => void;
  onNavigate: (tab: string) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onNavigate }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin2569' || password === 'nnskhs2131' || password === 'admin') {
      setAdminLoggedIn(true);
      onSuccess();
    } else {
      setError('รหัสผ่านไม่ถูกต้อง (รหัสผ่านเริ่มต้น: admin2569)');
    }
  };

  const handleQuickDemo = () => {
    setPassword('admin2569');
    setAdminLoggedIn(true);
    onSuccess();
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl text-center space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-blue-900 text-amber-400 flex items-center justify-center mx-auto shadow-md">
          <Shield className="w-7 h-7" />
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-900">
            ระบบบริหารจัดการ
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            เข้าสู่ระบบคณะกรรมการ
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            สำหรับตรวจอนุมัติสลิป สแกน QR Code หน้างาน และออกรายงาน
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 text-left">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              รหัสผ่านผู้ดูแลระบบ (Admin PIN)
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="ระบุรหัสผ่าน (เช่น admin2569)"
                className="w-full text-sm pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              รหัสผ่านเริ่มต้น: <code className="font-mono text-slate-700">admin2569</code> หรือ <code className="font-mono text-slate-700">nnskhs2131</code>
            </p>
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 shadow-md transition-colors"
          >
            <span>เข้าสู่ระบบแดชบอร์ด</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 border-t border-slate-100 space-y-3">
          <button
            type="button"
            onClick={handleQuickDemo}
            className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-medium text-blue-950 bg-amber-300 hover:bg-amber-400 shadow-sm transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>เข้าสู่ระบบทันที (คลิกเดียวเพื่อทดสอบ)</span>
          </button>

          <div>
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              ← กลับสู่หน้าหลัก
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
