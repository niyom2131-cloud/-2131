import React, { useEffect, useState, useRef } from 'react';
import { findParticipantById, findParticipantByToken } from '../lib/storage';
import { EVENT_INFO } from '../data/event';
import { Participant } from '../types';
import QRCode from 'qrcode';
import {
  Printer,
  Download,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  MapPin,
  Users,
  ShieldCheck,
  Share2,
} from 'lucide-react';

interface MyQrCodeProps {
  participantId: string;
  onNavigate: (tab: string, param?: string) => void;
}

export const MyQrCode: React.FC<MyQrCodeProps> = ({ participantId, onNavigate }) => {
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let p = findParticipantById(participantId);
    if (!p) {
      p = findParticipantByToken(participantId);
    }
    setParticipant(p);

    if (p) {
      // Generate QR Code with QR Token
      QRCode.toDataURL(p.qrToken, {
        width: 300,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('QR Gen error', err));
    }
  }, [participantId]);

  if (!participant) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-lg font-bold text-slate-800">ไม่พบบัตรประจำตัว</h2>
        <p className="text-xs text-slate-500 mt-1">กรุณากลับไปตรวจสอบสถานะใหม่อีกครั้ง</p>
        <button
          onClick={() => onNavigate('status')}
          className="mt-4 px-4 py-2 text-xs font-semibold rounded-xl bg-blue-900 text-white"
        >
          กลับหน้าตรวจสอบสถานะ
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `QR_Pass_${participant.fullName}_${participant.qrToken}.png`;
    a.click();
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      {/* Top back navigation - hide when printing */}
      <div className="no-print mb-6 flex items-center justify-between">
        <button
          onClick={() => onNavigate('status', participant.phone)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ย้อนกลับ</span>
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>บันทึก QR</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-white bg-blue-900 hover:bg-blue-800 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>พิมพ์บัตรเข้างาน</span>
          </button>
        </div>
      </div>

      {/* The Printable Digital Pass Badge */}
      <div
        ref={badgeRef}
        className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-xl text-slate-900 print:shadow-none print:border-slate-800 print:m-0"
      >
        {/* Card Header Ribbon */}
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white p-6 text-center relative">
          <div className="inline-block px-3 py-1 rounded-full bg-amber-400 text-blue-950 font-bold text-[11px] uppercase tracking-wider mb-2">
            บัตรประจำตัวผู้เข้าร่วมงาน (E-PASS)
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            งานคืนสู่เหย้า นนส.เหล่าทหารขนส่ง 2569
          </h1>
          <p className="text-xs text-blue-200 mt-1 font-light">
            รุ่น 21/31 กรมการขนส่งทหารบก
          </p>
        </div>

        {/* Card Body */}
        <div className="p-6 text-center space-y-5">
          {/* Attendee Name & Badge */}
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">
              {participant.fullName}
            </div>
            {participant.nickname && (
              <div className="text-base text-slate-500 font-medium mt-0.5">
                (ชื่อเล่น: {participant.nickname})
              </div>
            )}
            <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>ผ่านการอนุมัติการลงทะเบียนแล้ว</span>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 inline-block mx-auto shadow-inner">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`QR Code ${participant.qrToken}`}
                className="w-48 h-48 sm:w-56 sm:h-56 mx-auto object-contain"
              />
            ) : (
              <div className="w-48 h-48 bg-slate-200 animate-pulse rounded-xl" />
            )}
            <div className="font-mono text-xs font-bold text-slate-700 tracking-wider mt-2">
              TOKEN: {participant.qrToken}
            </div>
          </div>

          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            โปรดแสดง QR Code นี้แก่เจ้าหน้าที่หน้างาน ณ จุดลงทะเบียนเพื่อรับเสื้อที่ระลึกและเข้างาน
          </p>

          {/* Attendee Metadata Strip */}
          <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-slate-100">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[11px]">ผู้เข้าร่วม</span>
              <span className="font-bold text-slate-800 text-sm">
                {participant.totalCount} ท่าน
              </span>
              <span className="text-[10px] text-slate-500 block">
                (ตนเอง + {participant.guestCount})
              </span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[11px]">เสื้อที่ระลึก</span>
              <span className="font-bold text-slate-800 text-sm">
                ไซส์ {participant.shirtSize}
              </span>
              <span className="text-[10px] text-slate-500 block">1 ตัว</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[11px]">ประเภทอาหาร</span>
              <span className="font-bold text-slate-800 text-sm truncate block">
                {participant.foodType === 'general'
                  ? 'ทั่วไป'
                  : participant.foodType === 'muslim'
                  ? 'อิสลาม'
                  : 'มังสวิรัติ'}
              </span>
              <span className="text-[10px] text-slate-500 block">โต๊ะจีน</span>
            </div>
          </div>

          {/* Event Quick Location */}
          <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-100 text-left text-xs text-blue-950 space-y-1">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-blue-800 shrink-0" />
              <span>{EVENT_INFO.date} ({EVENT_INFO.time})</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-blue-800 shrink-0" />
              <span>{EVENT_INFO.venue}</span>
            </div>
          </div>
        </div>

        {/* Card Footer Bar */}
        <div className="bg-slate-900 text-white px-6 py-3 text-center text-[11px] font-mono flex items-center justify-between">
          <span className="text-slate-400">กองทุน นนส.เหล่าทหารขนส่ง 21/31</span>
          <span className="text-amber-400 font-bold">NNS-TRANSPORT 2569</span>
        </div>
      </div>
    </div>
  );
};
