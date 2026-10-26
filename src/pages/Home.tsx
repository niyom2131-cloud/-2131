import React, { useState } from 'react';
import { EVENT_INFO, SCHEDULE_ITEMS } from '../data/event';
import { NNSKHS2131_NAME_COUNT } from '../data/names';
import { getParticipants } from '../lib/storage';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  QrCode,
  ArrowRight,
  CreditCard,
  Copy,
  Check,
  FileCheck2,
  ShieldAlert,
} from 'lucide-react';

interface HomeProps {
  onNavigate: (tab: string, param?: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [copied, setCopied] = useState(false);
  const participants = getParticipants();
  const approvedCount = participants.filter((p) => p.status === 'approved').length;
  const totalAttending = participants
    .filter((p) => p.status === 'approved')
    .reduce((sum, p) => sum + p.totalCount, 0);

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(EVENT_INFO.bankAccountNo.replace(/-/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-950 via-slate-900 to-slate-900 text-white pt-16 pb-20">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Top honor badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-900/60 border border-blue-700/50 text-amber-300 text-xs font-semibold tracking-wide">
              <span>★</span>
              <span>โรงเรียนทหารขนส่ง กรมการขนส่งทหารบก</span>
              <span>★</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              งานคืนสู่เหย้า นนส.เหล่าทหารขนส่ง 2569
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
              ขอเชิญพี่น้องเพื่อนร่วมรุ่น <strong className="text-amber-400 font-semibold">{EVENT_INFO.generation}</strong> ทุกนาย ร่วมรำลึกความหลัง กระชับสายสัมพันธ์ และเฉลิมฉลองมิตรภาพอันเหนียวแน่น
            </p>

            {/* Quick Meta */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-slate-300 pt-2">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>{EVENT_INFO.date}</span>
              </span>
              <span className="text-slate-600 hidden sm:inline">·</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{EVENT_INFO.time}</span>
              </span>
              <span className="text-slate-600 hidden sm:inline">·</span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>สโมสรทหารขนส่ง (ขส.ทบ.)</span>
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onNavigate('register')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-xl text-blue-950 bg-amber-400 hover:bg-amber-300 transition-all shadow-lg shadow-amber-400/20 active:scale-95"
              >
                <span>ลงทะเบียนเข้าร่วมงาน</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('status')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-medium rounded-xl text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-all active:scale-95"
              >
                <QrCode className="w-4 h-4 text-amber-400" />
                <span>ตรวจสถานะ / รับบัตร QR</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live metric summary strip */}
        <div className="max-w-5xl mx-auto px-4 mt-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-800/80 backdrop-blur border border-slate-700/80 rounded-2xl p-4 sm:p-6 text-center">
            <div className="p-2">
              <div className="text-xs text-slate-400 mb-1">เพื่อนร่วมรุ่นในทำเนียบ</div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-white">
                {NNSKHS2131_NAME_COUNT} <span className="text-xs text-slate-400 font-sans font-normal">นาย</span>
              </div>
            </div>
            <div className="p-2 border-l border-slate-700/60">
              <div className="text-xs text-slate-400 mb-1">ลงทะเบียนแล้ว</div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-400">
                {participants.length} <span className="text-xs text-slate-400 font-sans font-normal">นาย</span>
              </div>
            </div>
            <div className="p-2 border-l border-slate-700/60">
              <div className="text-xs text-slate-400 mb-1">อนุมัติเรียบร้อย</div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400">
                {approvedCount} <span className="text-xs text-slate-400 font-sans font-normal">นาย</span>
              </div>
            </div>
            <div className="p-2 border-l border-slate-700/60">
              <div className="text-xs text-slate-400 mb-1">รวมผู้เข้าร่วมสุทธิ</div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-sky-400">
                {totalAttending} <span className="text-xs text-slate-400 font-sans font-normal">ท่าน</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Steps Guide */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            ขั้นตอนการลงทะเบียนและเข้าร่วมงาน
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            ทำรายการสะดวก รวดเร็ว พร้อมรับบัตรประจำตัวดิจิทัลใน 3 ขั้นตอน
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 font-bold flex items-center justify-center mb-4">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              ค้นหาและเลือกชื่อ
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              ค้นหารายชื่อของท่านจากฐานข้อมูลศิษย์เก่า นนส.21/31 ทั้ง 79 นาย หรือพิมพ์ชื่อเอง ระบุจำนวนผู้ติดตาม และขนาดเสื้อที่ระลึก
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 font-bold flex items-center justify-center mb-4">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              โอนเงิน & แนบสลิป
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              โอนเงินค่าลงทะเบียนเข้าบัญชีกองทุนรุ่น และอัปโหลดภาพสลิปโอนเงินผ่านระบบ คณะกรรมการจะตรวจสอบยอดเงินอย่างรวดเร็ว
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center mb-4">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              รับบัตร QR Code เข้างาน
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              เมื่อได้รับการอนุมัติ ท่านสามารถดาวน์โหลดบัตร QR Code และนำมาแสดงต่อจุดลงทะเบียนหน้างานเพื่อสแกนเข้างานได้ทันที
            </p>
          </div>
        </div>
      </section>

      {/* Payment Information Card */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full">
                <CreditCard className="w-3.5 h-3.5" />
                <span>บัญชีสำหรับชำระค่าลงทะเบียน</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold">
                {EVENT_INFO.bankName}
              </h3>
              <div className="space-y-1 text-xs text-blue-200">
                <p>ชื่อบัญชี: <strong className="text-white">{EVENT_INFO.bankAccountName}</strong></p>
                <p>อัตราค่าลงทะเบียน: <strong className="text-amber-300 font-mono text-sm">{EVENT_INFO.feePerPerson.toLocaleString()} บาท/คน</strong> (รวมเสื้อที่ระลึก + อาหารโต๊ะจีน)</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/20 text-center space-y-2">
              <div className="text-xs text-blue-200">เลขที่บัญชี</div>
              <div className="font-mono text-xl sm:text-2xl font-bold tracking-wider text-amber-300">
                {EVENT_INFO.bankAccountNo}
              </div>
              <button
                onClick={handleCopyAccount}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white text-slate-900 hover:bg-amber-300 transition-colors shadow-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'คัดลอกสำเร็จ!' : 'คัดลอกเลขบัญชี'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Event Schedule & Location */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Schedule */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-900">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">กำหนดการจัดงาน</h3>
                <p className="text-xs text-slate-500">{EVENT_INFO.date}</p>
              </div>
            </div>

            <div className="space-y-4">
              {SCHEDULE_ITEMS.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <span className="font-mono text-xs font-semibold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md shrink-0">
                    {item.time}
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Location details */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-900">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">สถานที่จัดงาน</h3>
                  <p className="text-xs text-slate-500">{EVENT_INFO.venue}</p>
                </div>
              </div>

              <div className="space-y-4 text-xs text-slate-600">
                <p className="leading-relaxed">
                  <strong>ที่ตั้ง:</strong> {EVENT_INFO.locationDetails}
                </p>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <p className="font-semibold text-slate-800">การเดินทางและที่จอดรถ:</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    <li>มีลานจอดรถกว้างขวางภายในบริเวณสโมสรทหารขนส่ง</li>
                    <li>ใกล้สถานีรถไฟฟ้า BTS สะพานควาย และ MRT กำแพงเพชร</li>
                    <li>เจ้าหน้าที่สารวัตรทหารคอยอำนวยความสะดวกการจราจรหน้าทางเข้า</li>
                  </ul>
                </div>
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200/60 text-amber-900">
                  <p className="font-semibold mb-1">การแต่งกาย:</p>
                  <p>เสื้อโปโลที่ระลึกรุ่น 21/31 (รับได้ที่จุดลงทะเบียน) หรือชุดสุภาพ</p>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
              <div className="text-xs text-slate-500">
                มีข้อสงสัยเกี่ยวกับงานเลี้ยงรุ่น?
              </div>
              <a
                href={`tel:${EVENT_INFO.contactPhone}`}
                className="text-xs font-semibold text-blue-900 hover:underline"
              >
                โทร {EVENT_INFO.contactPhone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Floating Registration Strip on Mobile */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur border-t border-slate-200 p-3 sm:hidden shadow-lg no-print">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('status')}
            className="flex-1 py-2.5 text-xs font-medium rounded-lg text-slate-700 bg-slate-100 border border-slate-200 text-center"
          >
            ตรวจสถานะ
          </button>
          <button
            onClick={() => onNavigate('register')}
            className="flex-2 py-2.5 text-xs font-semibold rounded-lg text-white bg-blue-900 text-center shadow-md active:scale-95"
          >
            ลงทะเบียนร่วมงาน
          </button>
        </div>
      </div>
    </div>
  );
};
