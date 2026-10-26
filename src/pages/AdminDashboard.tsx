import React, { useState, useEffect } from 'react';
import {
  getParticipants,
  approveParticipant,
  rejectParticipant,
  exportToExcel,
  setAdminLoggedIn,
  exportBackupJSON,
  importBackupJSON,
} from '../lib/storage';
import { Participant } from '../types';
import { SlipLightbox } from '../components/SlipLightbox';
import {
  Users,
  CheckCircle2,
  Clock,
  DollarSign,
  FileSpreadsheet,
  QrCode,
  UserPlus,
  Eye,
  Check,
  X,
  LogOut,
  RefreshCw,
  Database,
  Search,
  ArrowRight,
  Shield,
  Download,
  Upload,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (tab: string, param?: string) => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate, onLogout }) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selectedSlipParticipant, setSelectedSlipParticipant] = useState<Participant | null>(null);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [backupJsonInput, setBackupJsonInput] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const refreshData = () => {
    const list = getParticipants();
    setParticipants(list);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleApprove = (id: string, note?: string) => {
    approveParticipant(id, note);
    refreshData();
    showToast('อนุมัติการลงทะเบียนและยอดเงินเรียบร้อยแล้ว');
  };

  const handleReject = (id: string, reason: string) => {
    rejectParticipant(id, reason);
    refreshData();
    showToast('ปฏิเสธการลงทะเบียนเรียบร้อยแล้ว');
  };

  // KPIs
  const totalCount = participants.length;
  const approvedList = participants.filter((p) => p.status === 'approved');
  const pendingList = participants.filter((p) => p.status === 'pending');
  const rejectedList = participants.filter((p) => p.status === 'rejected');
  const checkedInList = participants.filter((p) => p.checkedIn);

  const totalPeopleNet = participants.reduce((sum, p) => sum + p.totalCount, 0);
  const totalApprovedMoney = approvedList.reduce((sum, p) => sum + (p.paymentAmount || 0), 0);

  const handleExportBackup = () => {
    const json = exportBackupJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_nnskhs2131_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showToast('ดาวน์โหลดไฟล์สำรองข้อมูลเรียบร้อยแล้ว');
  };

  const handleImportBackup = () => {
    if (!backupJsonInput.trim()) return;
    const res = importBackupJSON(backupJsonInput.trim());
    if (res.success) {
      refreshData();
      setShowBackupModal(false);
      setBackupJsonInput('');
      showToast(`กู้คืนข้อมูลสำเร็จ ${res.count} รายชื่อ`);
    } else {
      alert(res.error || 'ไม่สามารถกู้คืนข้อมูลได้');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Header with Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>ระบบบริหารจัดการคณะกรรมการ</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            แดชบอร์ดงานคืนสู่เหย้า นนส.21/31
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            ภาพรวมการลงทะเบียน คิวตรวจสอบสลิป และระบบเช็คชื่อหน้างาน
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigate('admin-scanner')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 shadow-sm transition-colors"
          >
            <QrCode className="w-4 h-4 text-amber-300" />
            <span>สแกน QR หน้างาน</span>
          </button>
          <button
            onClick={() => onNavigate('admin-participants')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm transition-colors"
          >
            <Users className="w-4 h-4 text-blue-700" />
            <span>ทะเบียนรายชื่อ</span>
          </button>
          <button
            onClick={() => onNavigate('admin-register')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm transition-colors"
          >
            <UserPlus className="w-4 h-4 text-emerald-600" />
            <span>ลงทะเบียนแทน</span>
          </button>
          <button
            onClick={exportToExcel}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 shadow-sm transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>ส่งออก Excel</span>
          </button>
          <button
            onClick={() => setShowBackupModal(true)}
            className="p-2 rounded-xl text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm"
            title="สำรอง & กู้คืนข้อมูล"
          >
            <Database className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setAdminLoggedIn(false);
              onLogout();
            }}
            className="p-2 rounded-xl text-rose-600 bg-white border border-slate-200 hover:bg-rose-50 shadow-sm"
            title="ออกจากระบบ"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Registered */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">ผู้ลงทะเบียนทั้งหมด</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">
            {totalCount} <span className="text-xs font-sans font-normal text-slate-500">คน</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            รอตรวจสอบ {pendingList.length} · อนุมัติ {approvedList.length}
          </div>
        </div>

        {/* Total People (with guests) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">รวมผู้เข้าร่วมงานสุทธิ</span>
            <Users className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">
            {totalPeopleNet} <span className="text-xs font-sans font-normal text-slate-500">ท่าน</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            รวมผู้ติดตาม {participants.reduce((a, b) => a + b.guestCount, 0)} ท่าน
          </div>
        </div>

        {/* Total Money Approved */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">ยอดเงินที่อนุมัติแล้ว</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-700">
            {totalApprovedMoney.toLocaleString()}{' '}
            <span className="text-xs font-sans font-normal text-slate-500">บาท</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            จาก {approvedList.length} รายการที่ยืนยัน
          </div>
        </div>

        {/* Checked In */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">เช็คชื่อเข้างานแล้ว</span>
            <CheckCircle2 className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-sky-700">
            {checkedInList.length}{' '}
            <span className="text-xs font-sans font-normal text-slate-500">
              / {approvedList.length} นาย
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            สแกนเข้างานหน้างาน
          </div>
        </div>
      </div>

      {/* Pending Queue Section (คิวรอตรวจสลิป) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-slate-900">
              คิวรอตรวจสอบสลิปโอนเงิน ({pendingList.length} รายการ)
            </h2>
          </div>
          <button
            onClick={refreshData}
            className="text-xs text-slate-500 hover:text-slate-800 inline-flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>รีเฟรช</span>
          </button>
        </div>

        {pendingList.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {pendingList.map((p) => (
              <div
                key={p.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Slip thumbnail */}
                  <button
                    onClick={() => setSelectedSlipParticipant(p)}
                    className="w-16 h-20 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 relative group shrink-0 shadow-sm"
                    title="คลิกเพื่อดูสลิปเต็มจอ"
                  >
                    <img
                      src={p.slipUrl}
                      alt="สลิป"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <Eye className="w-4 h-4" />
                    </div>
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{p.fullName}</span>
                      {p.nickname && (
                        <span className="text-xs text-slate-500 font-normal">
                          ({p.nickname})
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 flex flex-wrap gap-2">
                      <span className="font-mono">{p.phone}</span>
                      <span>·</span>
                      <span>{p.province || 'ไม่ระบุจังหวัด'}</span>
                      <span>·</span>
                      <span>รวม {p.totalCount} ท่าน</span>
                      <span>·</span>
                      <span>เสื้อ {p.shirtSize}</span>
                    </div>
                    {p.message && (
                      <p className="text-xs text-slate-600 italic">
                        "{p.message}"
                      </p>
                    )}
                    <div className="text-[11px] text-slate-400">
                      ลงทะเบียน: {new Date(p.createdAt).toLocaleString('th-TH')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="text-right sm:mr-3">
                    <div className="font-mono text-sm font-bold text-blue-900">
                      {p.paymentAmount.toLocaleString()} บาท
                    </div>
                    <span className="text-[10px] text-slate-400 block">ยอดแจ้งโอน</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setSelectedSlipParticipant(p)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 shadow-sm"
                    >
                      ตรวจสลิป
                    </button>
                    <button
                      onClick={() => handleApprove(p.id)}
                      className="p-1.5 text-xs font-semibold rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm"
                      title="อนุมัติทันที"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p>ไม่มีสลิปที่รอการตรวจสอบ ทุกรายการได้รับการจัดการแล้ว</p>
          </div>
        )}
      </div>

      {/* Quick Access to Participants and Scanner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
              <QrCode className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold">สแกน QR Code เช็คชื่อหน้างาน</h3>
            <p className="text-xs text-blue-200 leading-relaxed">
              เปิดกล้องสมาร์ตโฟนหรือโน้ตบุ๊กเพื่อสแกนบัตรดิจิทัลของผู้เข้าร่วมงาน ระบบจะแจ้งเตือนพร้อมเสียงและบันทึกเวลาเข้างานแบบเรียลไทม์
            </p>
          </div>
          <div className="pt-6">
            <button
              onClick={() => onNavigate('admin-scanner')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-amber-400 text-blue-950 hover:bg-amber-300 shadow-md transition-colors"
            >
              <span>เปิดระบบสแกนหน้างาน</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-900">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">จัดการทะเบียนรายชื่อทั้งหมด</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              ค้นหารายชื่อ แก้ไขข้อมูลผู้ลงทะเบียน ตรวจสอบขนาดเสื้อที่ต้องสั่งตัด และส่งออกรายงานสรุปสถิติสำหรับคณะกรรมการ
            </p>
          </div>
          <div className="pt-6">
            <button
              onClick={() => onNavigate('admin-participants')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 shadow-sm transition-colors"
            >
              <span>ไปที่ทะเบียนรายชื่อ</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Slip Lightbox */}
      <SlipLightbox
        participant={selectedSlipParticipant}
        onClose={() => setSelectedSlipParticipant(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      {/* Backup & Restore Modal */}
      {showBackupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-900" />
                <span>สำรองและกู้คืนข้อมูล</span>
              </h3>
              <button
                onClick={() => setShowBackupModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <p>
                ท่านสามารถดาวน์โหลดไฟล์ JSON สำรองข้อมูลทั้งหมดเก็บไว้ในเครื่อง หรือนำเข้าเพื่อกู้คืนข้อมูล
              </p>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800">ส่งออกข้อมูลสำรอง (Export)</div>
                  <div className="text-[11px] text-slate-500">บันทึกเป็นไฟล์ .json</div>
                </div>
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-900 text-white"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>ดาวน์โหลด</span>
                </button>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  กู้คืนข้อมูล (Import JSON Paste):
                </label>
                <textarea
                  rows={4}
                  value={backupJsonInput}
                  onChange={(e) => setBackupJsonInput(e.target.value)}
                  placeholder="วางข้อความ JSON ที่นี่เพื่อกู้คืน..."
                  className="w-full text-xs font-mono p-2.5 border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowBackupModal(false)}
                className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                ปิด
              </button>
              <button
                type="button"
                onClick={handleImportBackup}
                disabled={!backupJsonInput.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-blue-900 text-white rounded-lg disabled:opacity-50"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>ยืนยันการกู้คืน</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
