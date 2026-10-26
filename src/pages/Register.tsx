import React, { useState, useMemo } from 'react';
import { NNSKHS2131_NAMES } from '../data/names';
import { EVENT_INFO, SHIRT_SIZE_GUIDE } from '../data/event';
import { FoodType, ShirtSize, RegistrationFormData } from '../types';
import { createParticipant } from '../lib/storage';
import {
  User,
  Phone,
  MessageSquare,
  Users,
  CreditCard,
  Upload,
  Check,
  AlertCircle,
  HelpCircle,
  Search,
  X,
  FileImage,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface RegisterProps {
  onSuccess: (id: string) => void;
  onNavigate: (tab: string) => void;
}

export const Register: React.FC<RegisterProps> = ({ onSuccess, onNavigate }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [fullName, setFullName] = useState('');
  const [nameSearch, setNameSearch] = useState('');
  const [showNameDropdown, setShowNameDropdown] = useState(false);
  const [isCustomName, setIsCustomName] = useState(false);

  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');
  const [lineId, setLineId] = useState('');
  const [province, setProvince] = useState('');

  const [guestCount, setGuestCount] = useState<number>(0);
  const [foodType, setFoodType] = useState<FoodType>('general');
  const [shirtSize, setShirtSize] = useState<ShirtSize>('L');
  const [message, setMessage] = useState('');

  const [paymentAmount, setPaymentAmount] = useState<number>(EVENT_INFO.feePerPerson);
  const [paymentDate, setPaymentDate] = useState<string>(
    new Date().toISOString().slice(0, 16)
  );
  const [slipUrl, setSlipUrl] = useState<string>('');
  const [slipFileName, setSlipFileName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // Dynamic fee calculation
  const totalPeople = 1 + guestCount;
  const calculatedFee = totalPeople * EVENT_INFO.feePerPerson;

  // Filtered names for autocomplete
  const filteredNames = useMemo(() => {
    if (!nameSearch) return NNSKHS2131_NAMES.slice(0, 10);
    return NNSKHS2131_NAMES.filter((name) =>
      name.toLowerCase().includes(nameSearch.toLowerCase())
    );
  }, [nameSearch]);

  const handleSelectName = (name: string) => {
    setFullName(name);
    setNameSearch(name);
    setShowNameDropdown(false);
    setIsCustomName(false);
  };

  const handleCustomNameToggle = () => {
    setIsCustomName(true);
    setFullName(nameSearch);
    setShowNameDropdown(false);
  };

  // Image Upload with Canvas compression to base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('กรุณาเลือกไฟล์รูปภาพ (JPG, PNG, WEBP)');
      return;
    }

    setSlipFileName(file.name);
    setErrorMsg('');

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Compress image using canvas
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const scaleSize = MAX_WIDTH / img.width;
        const width = img.width > MAX_WIDTH ? MAX_WIDTH : img.width;
        const height = img.width > MAX_WIDTH ? img.height * scaleSize : img.height;

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.75);
          setSlipUrl(compressedDataUrl);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Quick Demo Slip Generator
  const handleUseMockSlip = () => {
    const mockSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600"><rect width="100%" height="100%" fill="%23f8fafc"/><rect x="20" y="20" width="360" height="560" rx="16" fill="%23ffffff" stroke="%23cbd5e1" stroke-width="2"/><circle cx="200" cy="90" r="32" fill="%230284c7"/><path d="M190 90l7 7 15-15" stroke="%23ffffff" stroke-width="3" fill="none"/><text x="200" y="150" font-family="sans-serif" font-size="18" font-weight="bold" fill="%230f172a" text-anchor="middle">โอนเงินสำเร็จ</text><text x="200" y="175" font-family="sans-serif" font-size="12" fill="%2364748b" text-anchor="middle">ttb bank - โอนให้ ${encodeURIComponent(fullName || 'กองทุนรุ่น')}</text><line x1="40" y1="200" x2="360" y2="200" stroke="%23e2e8f0" stroke-width="1" stroke-dasharray="4"/><text x="50" y="240" font-family="sans-serif" font-size="13" fill="%2364748b">จำนวนเงิน</text><text x="350" y="240" font-family="sans-serif" font-size="18" font-weight="bold" fill="%230284c7" text-anchor="end">${calculatedFee.toLocaleString()}.00 บาท</text><text x="50" y="280" font-family="sans-serif" font-size="13" fill="%2364748b">ไปยังบัญชี</text><text x="350" y="280" font-family="sans-serif" font-size="13" fill="%230f172a" text-anchor="end">นนส.เหล่าทหารขนส่ง 21/31</text><line x1="40" y1="350" x2="360" y2="350" stroke="%23e2e8f0" stroke-width="1"/><rect x="140" y="380" width="120" height="120" fill="%23f1f5f9" rx="8"/><text x="200" y="445" font-family="sans-serif" font-size="11" fill="%2364748b" text-anchor="middle">E-Slip Demo</text><text x="200" y="540" font-family="sans-serif" font-size="11" fill="%2394a3b8" text-anchor="middle">รหัสอ้างอิง: TTB-${Date.now().toString().slice(-6)}</text></svg>`;
    setSlipUrl(mockSvg);
    setSlipFileName('สลิปจำลอง_ทดสอบระบบ.jpg');
    setErrorMsg('');
  };

  // Step 1 Validation
  const handleNextStep1 = () => {
    if (!fullName.trim()) {
      setErrorMsg('กรุณาเลือกหรือระบุชื่อ-นามสกุล');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('กรุณาระบุเบอร์โทรศัพท์สำหรับติดต่อและตรวจสถานะ');
      return;
    }
    setErrorMsg('');
    setStep(2);
  };

  // Step 2 Validation
  const handleNextStep2 = () => {
    setErrorMsg('');
    setPaymentAmount(calculatedFee);
    setStep(3);
  };

  // Final Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slipUrl) {
      setErrorMsg('กรุณาแนบภาพสลิปการโอนเงินเพื่อประกอบการตรวจสอบ');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

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
        message: message.trim(),
        paymentAmount: Number(paymentAmount) || calculatedFee,
        paymentDate,
        slipUrl,
      };

      const newParticipant = createParticipant(payload);
      setIsSubmitting(false);
      onSuccess(newParticipant.id);
    } catch (err) {
      console.error(err);
      setErrorMsg('เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-xs font-semibold text-blue-900 tracking-wider uppercase">
          แบบฟอร์มลงทะเบียน
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
          ลงทะเบียนร่วมงานคืนสู่เหย้า นนส.21/31
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          กรอกข้อมูลและแนบหลักฐานการโอนเงินเพื่อรับบัตร QR Code เข้างาน
        </p>
      </div>

      {/* Stepper Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step >= 1 ? 'bg-blue-900 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              1
            </div>
            <span className="text-xs font-medium text-slate-600 mt-1.5">ข้อมูลส่วนตัว</span>
          </div>
          <div className={`flex-1 h-0.5 mx-2 ${step >= 2 ? 'bg-blue-900' : 'bg-slate-200'}`} />
          <div className="flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step >= 2 ? 'bg-blue-900 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              2
            </div>
            <span className="text-xs font-medium text-slate-600 mt-1.5">การเข้าร่วม</span>
          </div>
          <div className={`flex-1 h-0.5 mx-2 ${step >= 3 ? 'bg-blue-900' : 'bg-slate-200'}`} />
          <div className="flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step === 3 ? 'bg-blue-900 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              3
            </div>
            <span className="text-xs font-medium text-slate-600 mt-1.5">ชำระเงิน</span>
          </div>
        </div>
      </div>

      {/* Error alert */}
      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        {/* STEP 1: Personal Information */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-900" />
              <span>ข้อมูลศิษย์เก่า นนส.เหล่าทหารขนส่ง 21/31</span>
            </h2>

            {/* Name search & selection */}
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ชื่อ-นามสกุล (ค้นหาจากทำเนียบรุ่น 79 นาย) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={nameSearch}
                  onChange={(e) => {
                    setNameSearch(e.target.value);
                    setFullName(e.target.value);
                    setShowNameDropdown(true);
                  }}
                  onFocus={() => setShowNameDropdown(true)}
                  placeholder="พิมพ์เพื่อค้นหา เช่น ปรีชา, นิยม หรือพิมพ์ชื่อใหม่..."
                  className="w-full text-sm pl-9 pr-8 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                {nameSearch && (
                  <button
                    type="button"
                    onClick={() => {
                      setNameSearch('');
                      setFullName('');
                    }}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Autocomplete Dropdown */}
              {showNameDropdown && (
                <div className="absolute z-30 left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl py-1 text-xs">
                  <div className="px-3 py-1.5 text-slate-400 font-medium bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <span>เลือกจากรายชื่อ นนส.21/31</span>
                    <button
                      type="button"
                      onClick={() => setShowNameDropdown(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      ปิด
                    </button>
                  </div>
                  {filteredNames.length > 0 ? (
                    filteredNames.map((name, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectName(name)}
                        className="w-full text-left px-3.5 py-2 hover:bg-blue-50 hover:text-blue-900 transition-colors flex items-center justify-between"
                      >
                        <span className="font-medium text-slate-800">{name}</span>
                        {fullName === name && (
                          <Check className="w-3.5 h-3.5 text-blue-900" />
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="p-3 text-center text-slate-500">
                      ไม่พบชื่อในระบบ 79 นาย
                    </div>
                  )}
                  {nameSearch && (
                    <div className="border-t border-slate-100 p-2 bg-slate-50">
                      <button
                        type="button"
                        onClick={handleCustomNameToggle}
                        className="w-full text-center py-1.5 px-3 rounded-lg text-xs font-semibold bg-blue-900 text-white hover:bg-blue-800"
                      >
                        ใช้ชื่อ "{nameSearch}" (กรณีนอกทำเนียบ)
                      </button>
                    </div>
                  )}
                </div>
              )}

              {fullName && (
                <div className="mt-2 text-xs text-emerald-700 flex items-center gap-1.5 font-medium">
                  <Check className="w-3.5 h-3.5" />
                  <span>ชื่อที่เลือก: <strong>{fullName}</strong></span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ชื่อเล่น
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="เช่น ยม, โต้ง, ชา"
                  className="w-full text-sm px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  เบอร์โทรศัพท์ (สำหรับค้นหาสถานะ) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08X-XXX-XXXX"
                  className="w-full text-sm px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  LINE ID (ถ้ามี)
                </label>
                <input
                  type="text"
                  value={lineId}
                  onChange={(e) => setLineId(e.target.value)}
                  placeholder="สำหรับรับการติดต่อจากคณะกรรมการ"
                  className="w-full text-sm px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  จังหวัดที่พำนักปัจจุบัน
                </label>
                <input
                  type="text"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  placeholder="เช่น ลพบุรี, สระบุรี, กรุงเทพฯ"
                  className="w-full text-sm px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleNextStep1}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold rounded-xl text-white bg-blue-900 hover:bg-blue-800 transition-colors shadow-sm"
              >
                <span>ถัดไป: ข้อมูลการเข้าร่วม</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Attendance & Preferences */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-900" />
              <span>การเข้าร่วมและของที่ระลึก</span>
            </h2>

            {/* Guest Count */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                จำนวนผู้ติดตาม (ครอบครัว / ญาติ)
              </label>
              <div className="flex items-center gap-3">
                {[0, 1, 2, 3, 4].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setGuestCount(count)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      guestCount === count
                        ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {count === 0 ? 'ไม่มี (1 ท่าน)' : `+${count} คน (${1 + count} ท่าน)`}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                รวมผู้เข้าร่วมงานทั้งหมด: <strong className="text-blue-900">{totalPeople} ท่าน</strong> (ค่าลงทะเบียน {calculatedFee.toLocaleString()} บาท)
              </p>
            </div>

            {/* Shirt Size */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  ขนาดเสื้อโปโลที่ระลึก นนส.21/31 (1 ตัว)
                </label>
                <button
                  type="button"
                  onClick={() => setShowSizeGuide(!showSizeGuide)}
                  className="text-xs text-blue-700 hover:underline inline-flex items-center gap-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>ดูตารางขนาดเสื้อ</span>
                </button>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {(['S', 'M', 'L', 'XL', 'XXL', '3XL'] as ShirtSize[]).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setShirtSize(size)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      shirtSize === size
                        ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {/* Size guide popup */}
              {showSizeGuide && (
                <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div className="font-semibold text-slate-800 mb-2">ตารางขนาดเสื้อโปโล (นิ้ว)</div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-slate-600">
                    {SHIRT_SIZE_GUIDE.map((g) => (
                      <div key={g.size} className="bg-white p-1.5 rounded border border-slate-200">
                        <div className="font-bold text-slate-900">{g.size}</div>
                        <div>อก {g.chest}</div>
                        <div>ยาว {g.length}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Food Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                ประเภทอาหารที่ต้องการ
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'general', label: 'อาหารทั่วไป' },
                  { id: 'muslim', label: 'อาหารอิสลาม (ฮาลาล)' },
                  { id: 'vegetarian', label: 'มังสวิรัติ / เจ' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFoodType(item.id as FoodType)}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                      foodType === item.id
                        ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Message to friends */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ข้อความถึงเพื่อนร่วมรุ่น (แสดงในงาน)
              </label>
              <textarea
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="เช่น คิดถึงเพื่อนๆ ทุกคนครับ, เดินทางจากเชียงใหม่พร้อมลุย..."
                className="w-full text-sm px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200"
              >
                ย้อนกลับ
              </button>
              <button
                type="button"
                onClick={handleNextStep2}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold rounded-xl text-white bg-blue-900 hover:bg-blue-800 transition-colors shadow-sm"
              >
                <span>ถัดไป: ชำระเงิน & แนบสลิป</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Payment & Slip Upload */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-900" />
              <span>การชำระเงินและหลักฐานการโอน</span>
            </h2>

            {/* Bank Card Info */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-slate-500 block">โอนเข้าบัญชี:</span>
                  <span className="font-bold text-slate-900 text-sm">{EVENT_INFO.bankName}</span>
                  <div className="font-mono text-base font-bold text-blue-800 mt-0.5">
                    {EVENT_INFO.bankAccountNo}
                  </div>
                  <span className="text-slate-600">{EVENT_INFO.bankAccountName}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">ยอดที่ต้องชำระ:</span>
                  <span className="font-mono text-xl font-bold text-blue-900">
                    {calculatedFee.toLocaleString()} บาท
                  </span>
                  <span className="text-slate-500 block text-[11px] mt-0.5">
                    ({totalPeople} ท่าน × 1,000 บาท)
                  </span>
                </div>
              </div>
            </div>

            {/* Amount & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ยอดเงินที่โอนจริง (บาท) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full text-sm px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  วัน-เวลาที่โอนเงิน
                </label>
                <input
                  type="datetime-local"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono text-xs"
                />
              </div>
            </div>

            {/* Slip Uploader */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                แนบสลิปการโอนเงิน <span className="text-rose-500">*</span>
              </label>

              {!slipUrl ? (
                <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 text-center transition-colors bg-slate-50/50">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-medium text-slate-700">
                    คลิกเพื่อเลือกไฟล์รูปภาพสลิป หรือลากไฟล์มาวางที่นี่
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    รองรับ JPG, PNG, WEBP (บีบอัดอัตโนมัติ)
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="slip-upload"
                  />
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                    <label
                      htmlFor="slip-upload"
                      className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl text-white bg-blue-900 hover:bg-blue-800 shadow-sm transition-colors"
                    >
                      <FileImage className="w-4 h-4" />
                      <span>เลือกไฟล์ภาพสลิป</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleUseMockSlip}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>ใช้สลิปจำลอง (เพื่อทดสอบระบบ)</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-24 h-32 rounded-xl overflow-hidden border border-slate-300 bg-white shrink-0 shadow-sm">
                    <img
                      src={slipUrl}
                      alt="สลิปที่แนบ"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 text-xs space-y-1 text-center sm:text-left">
                    <div className="font-semibold text-slate-900 flex items-center justify-center sm:justify-start gap-1.5 text-emerald-700">
                      <Check className="w-4 h-4" />
                      <span>แนบภาพสลิปเรียบร้อยแล้ว</span>
                    </div>
                    <p className="text-slate-500 truncate max-w-xs">
                      {slipFileName || 'slip_image.jpg'}
                    </p>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSlipUrl('');
                          setSlipFileName('');
                        }}
                        className="text-xs text-rose-600 hover:underline"
                      >
                        เปลี่ยนรูปภาพสลิป
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Summary Box */}
            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100 text-xs space-y-1.5">
              <div className="font-bold text-blue-950">สรุปข้อมูลการลงทะเบียน:</div>
              <div className="text-slate-700">
                ผู้ลงทะเบียน: <strong>{fullName}</strong> {nickname ? `(${nickname})` : ''} · โทร {phone}
              </div>
              <div className="text-slate-700">
                ผู้ติดตาม: {guestCount} ท่าน (รวมเป็น {totalPeople} ท่าน) · เสื้อไซส์ {shirtSize} · อาหาร {foodType === 'general' ? 'ทั่วไป' : foodType === 'muslim' ? 'อิสลาม' : 'มังสวิรัติ'}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2.5 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200"
              >
                ย้อนกลับ
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-7 py-3 text-sm font-semibold rounded-xl text-white bg-blue-900 hover:bg-blue-800 disabled:opacity-50 transition-colors shadow-md active:scale-95"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isSubmitting ? 'กำลังบันทึกข้อมูล...' : 'ยืนยันการลงทะเบียน'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
