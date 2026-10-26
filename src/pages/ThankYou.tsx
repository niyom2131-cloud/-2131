import React from 'react';
import { findParticipantById } from '../lib/storage';
import { CheckCircle2, QrCode, ArrowRight, Home as HomeIcon, Clock, Phone, AlertCircle } from 'lucide-react';

interface ThankYouProps {
  participantId: string;
  onNavigate: (tab: string, param?: string) => void;
}

export const ThankYou: React.FC<ThankYouProps> = ({ participantId, onNavigate }) => {
  const participant = findParticipantById(participantId);

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-lg space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            บันทึกการลงทะเบียนสำเร็จ
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            ขอบคุณครับ {participant?.fullName || 'เพื่อนร่วมรุ่น'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            ระบบได้รับข้อมูลและหลักฐานการโอนเงินของท่านเรียบร้อยแล้ว คณะกรรมการจะตรวจสอบยอดเงินและอนุมัติบัตรเข้างาน
          </p>
        </div>

        {/* Participant detail receipt box */}
        {participant && (
          <div className="bg-slate-50 rounded-2xl p-4 text-xs text-left border border-slate-200 space-y-2">
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">รหัสอ้างอิง:</span>
              <span className="font-mono font-bold text-slate-900">{participant.qrToken}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">ชื่อ-นามสกุล:</span>
              <span className="font-semibold text-slate-900">{participant.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">เบอร์โทรศัพท์:</span>
              <span className="font-mono text-slate-900">{participant.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">จำนวนผู้เข้าร่วม:</span>
              <span className="font-semibold text-slate-900">{participant.totalCount} ท่าน (ตนเอง + ผู้ติดตาม {participant.guestCount})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">ยอดที่ชำระ:</span>
              <span className="font-mono font-bold text-blue-900">{participant.paymentAmount.toLocaleString()} บาท</span>
            </div>
          </div>
        )}

        <div className="bg-amber-50 rounded-xl p-3.5 border border-amber-200/70 text-xs text-amber-900 text-left flex items-start gap-2.5">
          <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p>
            <strong>ขั้นตอนถัดไป:</strong> ท่านสามารถใช้เบอร์โทรศัพท์ที่ลงทะเบียน ตรวจสอบสถานะการอนุมัติและดาวน์โหลดบัตร QR Code สำหรับแสดงหน้างานได้ตลอดเวลา
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => onNavigate('status', participant?.phone)}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 shadow-sm transition-colors"
          >
            <QrCode className="w-4 h-4 text-amber-300" />
            <span>ไปที่หน้าตรวจสอบสถานะ</span>
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
          >
            <HomeIcon className="w-4 h-4" />
            <span>กลับหน้าหลัก</span>
          </button>
        </div>
      </div>
    </div>
  );
};
