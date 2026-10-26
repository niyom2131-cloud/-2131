import React, { useState } from 'react';
import { Participant } from '../types';
import { X, Check, AlertCircle, Eye, Download, User, Calendar, DollarSign } from 'lucide-react';

interface SlipLightboxProps {
  participant: Participant | null;
  onClose: () => void;
  onApprove: (id: string, note?: string) => void;
  onReject: (id: string, reason: string) => void;
}

export const SlipLightbox: React.FC<SlipLightboxProps> = ({
  participant,
  onClose,
  onApprove,
  onReject,
}) => {
  const [note, setNote] = useState('');
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  if (!participant) return null;

  const handleApprove = () => {
    onApprove(participant.id, note.trim() || undefined);
    onClose();
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert('กรุณาระบุเหตุผลการปฏิเสธเพื่อให้ผู้ลงทะเบียนทราบ');
      return;
    }
    onReject(participant.id, rejectReason.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col md:flex-row">
        {/* Left: Slip Image */}
        <div className="md:w-1/2 bg-slate-100 p-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-200 max-h-[50vh] md:max-h-[92vh] overflow-y-auto">
          <div className="relative w-full max-w-sm rounded-xl overflow-hidden shadow-md border border-slate-300 bg-white">
            <img
              src={participant.slipUrl}
              alt={`สลิปโอนเงิน ${participant.fullName}`}
              className="w-full h-auto object-contain max-h-[70vh]"
            />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <a
              href={participant.slipUrl}
              download={`slip_${participant.fullName}.png`}
              className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ดาวน์โหลดภาพสลิป</span>
            </a>
          </div>
        </div>

        {/* Right: Info & Actions */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto max-h-[42vh] md:max-h-[92vh]">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-900">
                  ตรวจสอบหลักฐานการชำระเงิน
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                  {participant.fullName}
                  {participant.nickname && (
                    <span className="text-slate-500 font-normal text-base ml-2">
                      ({participant.nickname})
                    </span>
                  )}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Detail Grid */}
            <div className="grid grid-cols-2 gap-3 my-4 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-slate-400 block mb-0.5">เบอร์โทรศัพท์</span>
                <span className="font-mono font-semibold text-slate-800 text-sm">{participant.phone}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-slate-400 block mb-0.5">ยอดแจ้งโอน</span>
                <span className="font-mono font-bold text-blue-700 text-sm">
                  {participant.paymentAmount.toLocaleString()} บาท
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-slate-400 block mb-0.5">จำนวนผู้เข้าร่วม</span>
                <span className="font-semibold text-slate-800">
                  {participant.totalCount} คน (ผู้ติดตาม {participant.guestCount} คน)
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-slate-400 block mb-0.5">ขนาดเสื้อ / อาหาร</span>
                <span className="font-semibold text-slate-800">
                  เสื้อ {participant.shirtSize} · {participant.foodType === 'general' ? 'ทั่วไป' : participant.foodType === 'muslim' ? 'อิสลาม' : 'มังสวิรัติ'}
                </span>
              </div>
            </div>

            {participant.message && (
              <div className="mb-4 bg-amber-50/70 border border-amber-200/60 p-3 rounded-lg text-xs text-amber-900">
                <span className="font-semibold block mb-0.5">ข้อความถึงเพื่อน:</span>
                "{participant.message}"
              </div>
            )}

            {/* Current Status */}
            <div className="mb-4 text-xs flex items-center gap-2">
              <span className="text-slate-500">สถานะปัจจุบัน:</span>
              <span
                className={`font-semibold ${
                  participant.status === 'approved'
                    ? 'text-emerald-700'
                    : participant.status === 'pending'
                    ? 'text-amber-700'
                    : 'text-rose-700'
                }`}
              >
                {participant.status === 'approved'
                  ? 'อนุมัติแล้ว'
                  : participant.status === 'pending'
                  ? 'รอการตรวจสอบ'
                  : 'ถูกปฏิเสธ'}
              </span>
            </div>

            {/* Note input */}
            {!rejectMode ? (
              <div className="space-y-2 mb-4">
                <label className="block text-xs font-medium text-slate-700">
                  หมายเหตุเพิ่มเติม (แสดงให้ผู้ลงทะเบียนเห็น):
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="เช่น ยอดเงิน 2,000 บาท ถูกต้องครบถ้วน (2 ท่าน)"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ) : (
              <div className="space-y-2 mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg">
                <label className="block text-xs font-semibold text-rose-800">
                  ระบุเหตุผลการปฏิเสธ *:
                </label>
                <textarea
                  rows={2}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="เช่น สลิปไม่ชัดเจน, ยอดเงินไม่ครบ 1,000 บาท, วันที่ไม่ตรง"
                  className="w-full text-xs px-3 py-2 border border-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            {!rejectMode ? (
              <>
                <button
                  type="button"
                  onClick={() => setRejectMode(true)}
                  className="px-3 py-2 text-xs font-medium text-rose-700 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors"
                >
                  ปฏิเสธสลิป...
                </button>
                <button
                  type="button"
                  onClick={handleApprove}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>อนุมัติยอดและออกบัตร QR</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setRejectMode(false)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={handleReject}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>ยืนยันปฏิเสธ</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
