import React, { useState, useEffect } from 'react';
import { findParticipantByPhone, findParticipantByToken, getParticipants } from '../lib/storage';
import { Participant } from '../types';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  QrCode,
  ArrowRight,
  User,
  Phone,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

interface CheckStatusProps {
  initialPhone?: string;
  onNavigate: (tab: string, param?: string) => void;
}

export const CheckStatus: React.FC<CheckStatusProps> = ({ initialPhone, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState(initialPhone || '');
  const [result, setResult] = useState<Participant | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (initialPhone) {
      handleSearch(initialPhone);
    }
  }, [initialPhone]);

  const handleSearch = (termToSearch?: string) => {
    const term = (termToSearch || searchTerm).trim();
    if (!term) return;

    setHasSearched(true);
    // Try phone search
    let found = findParticipantByPhone(term);
    if (!found) {
      // Try token
      found = findParticipantByToken(term);
    }
    if (!found) {
      // Try name match
      const all = getParticipants();
      found = all.find((p) => p.fullName.includes(term)) || null;
    }
    setResult(found);
  };

  const handleQuickTest = (phone: string) => {
    setSearchTerm(phone);
    handleSearch(phone);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-8">
        <span className="text-xs font-semibold text-blue-900 tracking-wider uppercase">
          ระบบตรวจสอบสถานะ
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
          ตรวจสอบสถานะการลงทะเบียน & รับบัตร QR
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          กรอกเบอร์โทรศัพท์ที่ใช้ลงทะเบียนเพื่อดูสถานะและดาวน์โหลดบัตรเข้างาน
        </p>
      </div>

      {/* Search Input Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="กรอกเบอร์โทรศัพท์ เช่น 081-998-2131 หรือชื่อ..."
              className="w-full text-sm pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 shadow-sm transition-colors whitespace-nowrap"
          >
            <span>ค้นหาข้อมูล</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick test suggestion tags */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span>ทดลองคลิกค้นหาตัวอย่าง:</span>
          <button
            type="button"
            onClick={() => handleQuickTest('081-998-2131')}
            className="text-blue-700 hover:underline font-medium"
          >
            นิยม สมาคม (อนุมัติแล้ว)
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => handleQuickTest('089-112-3456')}
            className="text-amber-700 hover:underline font-medium"
          >
            ปรีชากูล (รอตรวจ)
          </button>
        </div>
      </div>

      {/* Result Card */}
      {hasSearched && (
        <>
          {result ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-md space-y-6 animate-in fade-in duration-200">
              {/* Header with status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
                <div>
                  <span className="text-xs text-slate-400 block font-mono">
                    รหัสอ้างอิง: {result.qrToken}
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 mt-0.5">
                    {result.fullName}
                    {result.nickname && (
                      <span className="text-slate-500 font-normal text-lg ml-2">
                        ({result.nickname})
                      </span>
                    )}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {result.classYear} · จังหวัด{result.province || 'ไม่ระบุ'}
                  </p>
                </div>

                <div>
                  {result.status === 'approved' && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>อนุมัติเรียบร้อยแล้ว</span>
                    </div>
                  )}
                  {result.status === 'pending' && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span>รอตรวจสอบสลิป</span>
                    </div>
                  )}
                  {result.status === 'rejected' && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      <span>ไม่ผ่านการอนุมัติ</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Detail list */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block mb-0.5">เบอร์โทรศัพท์</span>
                  <span className="font-mono font-semibold text-slate-800 text-sm">{result.phone}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block mb-0.5">จำนวนรวม</span>
                  <span className="font-semibold text-slate-800 text-sm">{result.totalCount} ท่าน</span>
                  <span className="text-slate-500 text-[11px] block">(ผู้ติดตาม {result.guestCount} คน)</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block mb-0.5">ยอดชำระ</span>
                  <span className="font-mono font-bold text-blue-900 text-sm">
                    {result.paymentAmount.toLocaleString()} บาท
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block mb-0.5">ขนาดเสื้อที่ระลึก</span>
                  <span className="font-bold text-slate-800 text-sm">ไซส์ {result.shirtSize}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block mb-0.5">ประเภทอาหาร</span>
                  <span className="font-semibold text-slate-800 text-sm">
                    {result.foodType === 'general' ? 'อาหารทั่วไป' : result.foodType === 'muslim' ? 'อาหารอิสลาม' : 'มังสวิรัติ'}
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block mb-0.5">สถานะเข้างาน</span>
                  <span
                    className={`font-semibold text-sm ${
                      result.checkedIn ? 'text-emerald-700' : 'text-slate-500'
                    }`}
                  >
                    {result.checkedIn ? 'เช็คชื่อเข้างานแล้ว' : 'ยังไม่เข้างาน'}
                  </span>
                </div>
              </div>

              {/* Admin Note if any */}
              {result.adminNote && (
                <div
                  className={`p-4 rounded-xl text-xs border ${
                    result.status === 'approved'
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                      : result.status === 'rejected'
                      ? 'bg-rose-50/70 border-rose-200 text-rose-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="font-semibold block mb-0.5">ข้อความจากคณะกรรมการ:</span>
                  {result.adminNote}
                </div>
              )}

              {/* Action Button */}
              {result.status === 'approved' ? (
                <div className="pt-2">
                  <button
                    onClick={() => onNavigate('my-qr', result.id)}
                    className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-blue-900 hover:bg-blue-800 shadow-md transition-colors active:scale-98"
                  >
                    <QrCode className="w-5 h-5 text-amber-300" />
                    <span>เปิดบัตรประจำตัว QR Code สำหรับเข้างาน</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-center text-xs text-slate-400 mt-2">
                    แสดงบัตร QR Code นี้ที่จุดลงทะเบียนหน้างานในวันงาน
                  </p>
                </div>
              ) : result.status === 'pending' ? (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 text-center">
                  คณะกรรมการกำลังตรวจสอบสลิปโอนเงิน เมื่ออนุมัติแล้วระบบจะเปิดให้ท่านดาวน์โหลดบัตร QR Code ได้ทันที
                </div>
              ) : (
                <div className="text-center pt-2">
                  <button
                    onClick={() => onNavigate('register')}
                    className="text-xs font-semibold text-blue-900 hover:underline"
                  >
                    คลิกที่นี่เพื่อแก้ไขข้อมูลและลงทะเบียนใหม่
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                ไม่พบข้อมูลการลงทะเบียน
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                ไม่พบข้อมูลที่ตรงกับ "{searchTerm}" กรุณาตรวจสอบเบอร์โทรศัพท์ที่ระบุตอนลงทะเบียน หรือติดต่อคณะกรรมการ
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('register')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl text-white bg-blue-900 hover:bg-blue-800"
                >
                  <span>ลงทะเบียนร่วมงานใหม่</span>
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
