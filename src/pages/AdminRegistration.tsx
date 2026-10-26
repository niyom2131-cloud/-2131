import React, { useState, useMemo } from 'react';
import { NNSKHS2131_NAMES } from '../data/names';
import { EVENT_INFO } from '../data/event';
import { FoodType, ShirtSize, RegistrationFormData } from '../types';
import { createParticipant, approveParticipant } from '../lib/storage';
import {
  UserPlus,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Search,
  Check,
  X,
  CreditCard,
} from 'lucide-react';

interface AdminRegistrationProps {
  onNavigate: (tab: string, param?: string) => void;
}

export const AdminRegistration: React.FC<AdminRegistrationProps> = ({ onNavigate }) => {
  const [nameSearch, setNameSearch] = useState('');
  const [fullName, setFullName] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');
  const [lineId, setLineId] = useState('');
  const [province, setProvince] = useState('');
  const [guestCount, setGuestCount] = useState<number>(0);
  const [shirtSize, setShirtSize] = useState<ShirtSize>('L');
  const [foodType, setFoodType] = useState<FoodType>('general');
  const [paymentAmount, setPaymentAmount] = useState<number>(EVENT_INFO.feePerPerson);
  const [autoApprove, setAutoApprove] = useState<boolean>(true);
  const [adminNote, setAdminNote] = useState<string>('ลงทะเบียนโดยคณะกรรมการ (ชำระเงินเรียบร้อย)');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const filteredNames = useMemo(() => {
    if (!nameSearch) return NNSKHS2131_NAMES.slice(0, 10);
    return NNSKHS2131_NAMES.filter((name) =>
      name.toLowerCase().includes(nameSearch.toLowerCase())
    );
  }, [nameSearch]);

  const handleSelectName = (name: string) => {
    setFullName(name);
    setNameSearch(name);
    setShowDropdown(false);
  };

  const handleGuestChange = (count: number) => {
    setGuestCount(count);
    setPaymentAmount((1 + count) * EVENT_INFO.feePerPerson);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('กรุณาระบุชื่อ-นามสกุล');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('กรุณาระบุเบอร์โทรศัพท์');
      return;
    }

    try {
      const payload: RegistrationFormData = {
        fullName: fullName.trim(),
        nickname: nickname.trim(),
        phone: phone.trim(),
        lineId: lineId.trim(),
        province: province.trim(),
        guestCount,
        foodType,
        shirtSize,
        message: 'ลงทะเบียนโดยคณะกรรมการ',
        paymentAmount,
        paymentDate: new Date().toISOString(),
      };

      const p = createParticipant(payload);
      if (autoApprove) {
        approveParticipant(p.id, adminNote);
      }

      setSuccessMsg(`ลงทะเบียนให้ "${p.fullName}" สำเร็จเรียบร้อยแล้ว!`);
      setErrorMsg('');

      // Reset form
      setFullName('');
      setNameSearch('');
      setNickname('');
      setPhone('');
      setLineId('');
      setProvince('');
      setGuestCount(0);
      setPaymentAmount(EVENT_INFO.feePerPerson);
    } catch (err) {
      console.error(err);
      setErrorMsg('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <button
        onClick={() => onNavigate('admin-dashboard')}
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>กลับสู่แดชบอร์ด</span>
      </button>

      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <UserPlus className="w-6 h-6 text-blue-900" />
          <span>ลงทะเบียนแทนโดยคณะกรรมการ</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          สำหรับเพิ่มรายชื่อเพื่อนที่แจ้งข้อมูลผ่านทางโทรศัพท์หรือ LINE โดยตรง
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5 text-xs">
        {/* Name with autocomplete */}
        <div className="relative">
          <label className="block font-semibold text-slate-700 mb-1">
            ชื่อ-นามสกุล <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={nameSearch}
              onChange={(e) => {
                setNameSearch(e.target.value);
                setFullName(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="พิมพ์เพื่อค้นหาจาก 79 รายชื่อ หรือพิมพ์ชื่อใหม่..."
              className="w-full text-xs pl-9 pr-8 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>

          {showDropdown && (
            <div className="absolute z-20 left-0 right-0 mt-1 max-h-56 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl py-1">
              <div className="px-3 py-1.5 text-slate-400 text-[11px] bg-slate-50 border-b border-slate-100 flex justify-between">
                <span>เลือกจาก 79 เพื่อนร่วมรุ่น</span>
                <button type="button" onClick={() => setShowDropdown(false)}>ปิด</button>
              </div>
              {filteredNames.map((name, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectName(name)}
                  className="w-full text-left px-3.5 py-1.5 hover:bg-blue-50 text-slate-800 text-xs"
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">ชื่อเล่น</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
              placeholder="เช่น ยม"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              เบอร์โทรศัพท์ <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-xl font-mono"
              placeholder="08X-XXX-XXXX"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">LINE ID</label>
            <input
              type="text"
              value={lineId}
              onChange={(e) => setLineId(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">จังหวัด</label>
            <input
              type="text"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">ผู้ติดตาม</label>
            <select
              value={guestCount}
              onChange={(e) => handleGuestChange(Number(e.target.value))}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white"
            >
              {[0, 1, 2, 3, 4].map((c) => (
                <option key={c} value={c}>
                  {c === 0 ? 'ไม่มี' : `${c} คน`}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">ขนาดเสื้อ</label>
            <select
              value={shirtSize}
              onChange={(e) => setShirtSize(e.target.value as ShirtSize)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white"
            >
              {['S', 'M', 'L', 'XL', 'XXL', '3XL'].map((s) => (
                <option key={s} value={s}>
                  ไซส์ {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">อาหาร</label>
            <select
              value={foodType}
              onChange={(e) => setFoodType(e.target.value as FoodType)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white"
            >
              <option value="general">ทั่วไป</option>
              <option value="muslim">อิสลาม</option>
              <option value="vegetarian">มังสวิรัติ</option>
            </select>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700">ยอดเงินลงทะเบียน:</span>
            <div className="font-mono text-base font-bold text-blue-900">
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                className="w-28 text-right px-2 py-1 border border-slate-300 rounded-lg text-sm"
              />{' '}
              บาท
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
            <input
              type="checkbox"
              id="auto-approve"
              checked={autoApprove}
              onChange={(e) => setAutoApprove(e.target.checked)}
              className="w-4 h-4 text-blue-900 rounded"
            />
            <label htmlFor="auto-approve" className="font-medium text-slate-700 cursor-pointer">
              อนุมัติการชำระเงินและออกบัตร QR Code ทันที
            </label>
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => onNavigate('admin-participants')}
            className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-semibold rounded-xl text-white bg-blue-900 hover:bg-blue-800 shadow-sm"
          >
            บันทึกการลงทะเบียน
          </button>
        </div>
      </form>
    </div>
  );
};
