import React, { useState, useEffect, useRef } from 'react';
import { checkInParticipant, getParticipants } from '../lib/storage';
import { Participant } from '../types';
import { Html5Qrcode } from 'html5-qrcode';
import {
  QrCode,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Search,
  Camera,
  CameraOff,
  User,
  Users,
  Shirt,
  Volume2,
  VolumeX,
  History,
} from 'lucide-react';

interface AdminQrScannerProps {
  onNavigate: (tab: string) => void;
}

// Web Audio synthesizer for pleasant real-time sound feedback
function playSound(type: 'success' | 'warning' | 'error') {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'success') {
      // Happy ascending double beep
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === 'warning') {
      // Low tone warning
      osc.frequency.setValueAtTime(329.63, ctx.currentTime); // E4
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } else {
      // Error buzz
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    }
  } catch (e) {
    // AudioContext might be blocked until user gesture, ignore
  }
}

export const AdminQrScanner: React.FC<AdminQrScannerProps> = ({ onNavigate }) => {
  const [manualToken, setManualToken] = useState('');
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    message: string;
    participant?: Participant;
  } | null>(null);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [recentScans, setRecentScans] = useState<Participant[]>([]);

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const isScanningLocked = useRef<boolean>(false);

  useEffect(() => {
    // Load recently checked-in attendees
    const all = getParticipants();
    const checked = all
      .filter((p) => p.checkedIn && p.checkedInAt)
      .sort((a, b) => new Date(b.checkedInAt!).getTime() - new Date(a.checkedInAt!).getTime())
      .slice(0, 5);
    setRecentScans(checked);

    return () => {
      stopCamera();
    };
  }, []);

  const handleProcessScan = (token: string) => {
    if (isScanningLocked.current) return;
    isScanningLocked.current = true;

    const res = checkInParticipant(token);
    setScanResult(res);

    if (res.success) {
      if (soundEnabled) playSound('success');
      if (res.participant) {
        setRecentScans((prev) => [res.participant!, ...prev.filter((p) => p.id !== res.participant!.id).slice(0, 4)]);
      }
    } else {
      if (soundEnabled) {
        if (res.message.includes('ไปแล้ว')) {
          playSound('warning');
        } else {
          playSound('error');
        }
      }
    }

    // Unlock scanner after 2.5 seconds
    setTimeout(() => {
      isScanningLocked.current = false;
    }, 2500);
  };

  const startCamera = async () => {
    setCameraError('');
    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode('qr-reader');
      }

      const qrCode = html5QrCodeRef.current;
      await qrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          handleProcessScan(decodedText);
        },
        () => {
          // Frame scan error - ignore to keep loop running
        }
      );
      setIsCameraActive(true);
    } catch (err: any) {
      console.error('Camera start error', err);
      setCameraError('ไม่สามารถเข้าถึงกล้องได้ กรุณาอนุญาตการใช้งานกล้อง หรือใช้การกรอก Token / เบอร์โทรแทน');
      setIsCameraActive(false);
    }
  };

  const stopCamera = async () => {
    if (html5QrCodeRef.current && isCameraActive) {
      try {
        await html5QrCodeRef.current.stop();
        setIsCameraActive(false);
      } catch (err) {
        console.error('Camera stop error', err);
      }
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualToken.trim()) return;
    handleProcessScan(manualToken.trim());
    setManualToken('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <button
            onClick={() => onNavigate('admin-dashboard')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>กลับสู่แดชบอร์ด</span>
          </button>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <QrCode className="w-6 h-6 text-blue-900" />
            <span>ระบบสแกน QR Code เช็คชื่อหน้างาน</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            สแกนบัตรดิจิทัล ตรวจสอบจำนวนผู้ติดตาม และส่งมอบเสื้อที่ระลึก
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border shadow-sm transition-colors ${
              soundEnabled
                ? 'bg-blue-50 text-blue-900 border-blue-200'
                : 'bg-slate-100 text-slate-400 border-slate-200'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-blue-600" /> : <VolumeX className="w-4 h-4" />}
            <span>{soundEnabled ? 'เปิดเสียงเตือน' : 'ปิดเสียง'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Camera Viewport */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-blue-900" />
              <span>กล้องสแกนบัตร QR</span>
            </span>

            {isCameraActive ? (
              <button
                onClick={stopCamera}
                className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg text-rose-700 bg-rose-50 border border-rose-200"
              >
                <CameraOff className="w-3.5 h-3.5" />
                <span>ปิดกล้อง</span>
              </button>
            ) : (
              <button
                onClick={startCamera}
                className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold rounded-lg text-white bg-blue-900 hover:bg-blue-800 shadow-sm"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>เปิดกล้องสแกน</span>
              </button>
            )}
          </div>

          {/* Camera Frame */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-900 min-h-[300px] flex items-center justify-center text-center p-4">
            <div id="qr-reader" className="w-full max-w-sm" />

            {!isCameraActive && (
              <div className="space-y-3 p-6 text-slate-300">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto text-amber-300">
                  <QrCode className="w-8 h-8" />
                </div>
                <div className="text-sm font-semibold text-white">กล้องยังไม่ได้เปิดทำงาน</div>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  กดปุ่ม "เปิดกล้องสแกน" ด้านบน หรือใช้ช่องกรอกรหัส Token ด้านล่าง
                </p>
                <button
                  onClick={startCamera}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-blue-950 bg-amber-400 hover:bg-amber-300 shadow-md transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  <span>เริ่มเปิดกล้องสแกน</span>
                </button>
              </div>
            )}
          </div>

          {cameraError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{cameraError}</span>
            </div>
          )}

          {/* Manual Input Fallback */}
          <div className="pt-2">
            <span className="block text-xs font-semibold text-slate-700 mb-1.5">
              หรือระบุรหัส Token / เบอร์โทรศัพท์ (กรณีกล้องไม่พร้อม):
            </span>
            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <input
                type="text"
                value={manualToken}
                onChange={(e) => setManualToken(e.target.value)}
                placeholder="เช่น NNS2131-NYM99 หรือ 081-998-2131"
                className="flex-1 text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold rounded-xl text-white bg-blue-900 hover:bg-blue-800 shadow-sm"
              >
                เช็คชื่อ
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Scan Result & Quick Action Card */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Scan Pop-up Card */}
          {scanResult ? (
            <div
              className={`rounded-2xl p-6 border shadow-lg space-y-4 animate-in fade-in zoom-in-95 duration-200 ${
                scanResult.success
                  ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                  : scanResult.message.includes('ไปแล้ว')
                  ? 'bg-amber-50/90 border-amber-300 text-amber-950'
                  : 'bg-rose-50/90 border-rose-300 text-rose-950'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    scanResult.success
                      ? 'bg-emerald-600 text-white'
                      : scanResult.message.includes('ไปแล้ว')
                      ? 'bg-amber-500 text-white'
                      : 'bg-rose-600 text-white'
                  }`}
                >
                  {scanResult.success ? (
                    <CheckCircle2 className="w-7 h-7" />
                  ) : (
                    <AlertCircle className="w-7 h-7" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-base leading-tight">
                    {scanResult.success
                      ? 'เช็คชื่อสำเร็จ!'
                      : scanResult.message.includes('ไปแล้ว')
                      ? 'เช็คชื่อซ้ำ'
                      : 'ไม่สามารถเช็คชื่อได้'}
                  </h3>
                  <p className="text-xs opacity-90 mt-0.5">{scanResult.message}</p>
                </div>
              </div>

              {scanResult.participant && (
                <div className="bg-white rounded-xl p-4 border border-slate-200 text-xs text-slate-800 space-y-2.5 shadow-sm">
                  <div className="flex justify-between items-baseline border-b border-slate-100 pb-2">
                    <span className="text-lg font-bold text-slate-900">
                      {scanResult.participant.fullName}
                      {scanResult.participant.nickname && (
                        <span className="text-sm font-normal text-slate-500 ml-1.5">
                          ({scanResult.participant.nickname})
                        </span>
                      )}
                    </span>
                    <span className="font-mono text-xs text-blue-900 font-bold">
                      {scanResult.participant.qrToken}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <span className="text-slate-400 block text-[11px]">ผู้เข้าร่วม</span>
                      <strong className="text-sm text-slate-900">
                        {scanResult.participant.totalCount} ท่าน
                      </strong>
                      <span className="text-[10px] text-slate-500 block">
                        (+{scanResult.participant.guestCount} ผู้ติดตาม)
                      </span>
                    </div>

                    <div className="p-2 bg-slate-50 rounded-lg">
                      <span className="text-slate-400 block text-[11px]">เสื้อที่ต้องส่งมอบ</span>
                      <strong className="text-sm text-blue-900">
                        ไซส์ {scanResult.participant.shirtSize}
                      </strong>
                      <span className="text-[10px] text-slate-500 block">จำนวน 1 ตัว</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-600 pt-1">
                    อาหาร: <strong>{scanResult.participant.foodType === 'general' ? 'ทั่วไป' : scanResult.participant.foodType === 'muslim' ? 'อิสลาม' : 'มังสวิรัติ'}</strong> · โทร {scanResult.participant.phone}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-slate-400 text-xs shadow-sm">
              <QrCode className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="font-medium text-slate-600">พร้อมรับการสแกนบัตร</p>
              <p className="mt-1 text-slate-400">
                เมื่อผู้เข้าร่วมงานยื่นบัตร QR Code สแกนผ่านกล้อง ระบบจะแสดงข้อมูลและจำนวนคนทันที
              </p>
            </div>
          )}

          {/* Recent Checked-in Log */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <History className="w-4 h-4 text-blue-900" />
              <span>รายชื่อที่เพิ่งเช็คชื่อล่าสุด</span>
            </div>

            {recentScans.length > 0 ? (
              <div className="divide-y divide-slate-100 text-xs">
                {recentScans.map((p) => (
                  <div key={p.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-900">{p.fullName}</div>
                      <div className="text-[11px] text-slate-400">
                        เสื้อ {p.shirtSize} · รวม {p.totalCount} ท่าน
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                        เข้างานแล้ว
                      </span>
                      <span className="block font-mono text-[10px] text-slate-400 mt-0.5">
                        {p.checkedInAt
                          ? new Date(p.checkedInAt).toLocaleTimeString('th-TH', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-slate-400 text-xs">
                ยังไม่มีการเช็คชื่อเข้างาน
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
