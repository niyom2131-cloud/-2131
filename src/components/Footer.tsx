import React from 'react';
import { EVENT_INFO } from '../data/event';
import { Phone, MapPin, Calendar } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-700 text-amber-300 flex items-center justify-center font-bold text-sm">
                ขส.
              </div>
              <span className="font-bold text-white text-base">
                นนส.เหล่าทหารขนส่ง รุ่น 21/31
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              ระบบอำนวยความสะดวกลงทะเบียนและบริหารจัดการงานคืนสู่เหย้า นนส.เหล่าทหารขนส่ง 2569 เพื่อความสะดวก รวดเร็ว และกระชับสายสัมพันธ์เพื่อนร่วมรุ่น
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-4">
              ข้อมูลงานคืนสู่เหย้า
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{EVENT_INFO.date} ({EVENT_INFO.time})</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{EVENT_INFO.venue}</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>ติดต่อสอบถาม: {EVENT_INFO.contactPhone} ({EVENT_INFO.contactPerson})</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-4">
              เมนูลัด
            </h4>
            <div className="flex flex-col space-y-2 text-xs">
              <button
                onClick={() => onNavigate('home')}
                className="text-left text-slate-400 hover:text-white transition-colors"
              >
                หน้าแรก & กำหนดการ
              </button>
              <button
                onClick={() => onNavigate('register')}
                className="text-left text-slate-400 hover:text-white transition-colors"
              >
                แบบฟอร์มลงทะเบียน
              </button>
              <button
                onClick={() => onNavigate('status')}
                className="text-left text-slate-400 hover:text-white transition-colors"
              >
                ตรวจสอบสถานะ / รับบัตร QR
              </button>
              <button
                onClick={() => onNavigate('admin-login')}
                className="text-left text-slate-400 hover:text-white transition-colors"
              >
                ระบบจัดการสำหรับคณะกรรมการ
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2569 คณะกรรมการนักเรียนนายสิบทหารบก เหล่าทหารขนส่ง รุ่น 21/31. สงวนลิขสิทธิ์.</p>
          <div className="mt-2 sm:mt-0 flex gap-4 text-slate-400">
            <span>รุ่น 21/31</span>
            <span>·</span>
            <span>กรมการขนส่งทหารบก</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
