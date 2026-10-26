import React, { useState, useEffect, useMemo } from 'react';
import {
  getParticipants,
  updateParticipant,
  deleteParticipant,
  checkInParticipant,
  undoCheckIn,
  exportToExcel,
} from '../lib/storage';
import { Participant, ShirtSize, FoodType } from '../types';
import { SlipLightbox } from '../components/SlipLightbox';
import {
  Users,
  Search,
  Filter,
  FileSpreadsheet,
  QrCode,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Check,
  X,
  UserPlus,
  ArrowLeft,
  ChevronDown,
} from 'lucide-react';

interface AdminParticipantsProps {
  onNavigate: (tab: string, param?: string) => void;
}

export const AdminParticipants: React.FC<AdminParticipantsProps> = ({ onNavigate }) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [checkInFilter, setCheckInFilter] = useState<string>('all');

  const [selectedSlip, setSelectedSlip] = useState<Participant | null>(null);
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const refreshData = () => {
    setParticipants(getParticipants());
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Filtered List
  const filteredList = useMemo(() => {
    return participants.filter((p) => {
      // Search term match
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.fullName.toLowerCase().includes(q) ||
        (p.nickname && p.nickname.toLowerCase().includes(q)) ||
        p.phone.includes(q) ||
        p.qrToken.toLowerCase().includes(q) ||
        (p.province && p.province.toLowerCase().includes(q));

      // Status match
      const matchStatus = statusFilter === 'all' || p.status === statusFilter;

      // Check-in match
      const matchCheckIn =
        checkInFilter === 'all' ||
        (checkInFilter === 'checkedIn' && p.checkedIn) ||
        (checkInFilter === 'notCheckedIn' && !p.checkedIn);

      return matchSearch && matchStatus && matchCheckIn;
    });
  }, [participants, search, statusFilter, checkInFilter]);

  const handleToggleCheckIn = (p: Participant) => {
    if (p.checkedIn) {
      undoCheckIn(p.id);
    } else {
      checkInParticipant(p.id);
    }
    refreshData();
  };

  const handleDelete = (id: string) => {
    deleteParticipant(id);
    setDeleteConfirmId(null);
    refreshData();
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingParticipant) return;
    updateParticipant(editingParticipant.id, editingParticipant);
    setEditingParticipant(null);
    refreshData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <button
            onClick={() => onNavigate('admin-dashboard')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>กลับสู่แดชบอร์ด</span>
          </button>
          <h1 className="text-2xl font-bold text-slate-900">
            ทะเบียนรายชื่อผู้ลงทะเบียน ({participants.length} รายชื่อ)
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('admin-register')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span>ลงทะเบียนแทน</span>
          </button>
          <button
            onClick={exportToExcel}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>ส่งออก Excel</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาด้วยชื่อ, ชื่อเล่น, เบอร์โทร, จังหวัด หรือ Token..."
            className="w-full text-xs pl-9 pr-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status selector */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-3 py-2.5 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">สถานะ: ทั้งหมด</option>
            <option value="approved">อนุมัติแล้ว</option>
            <option value="pending">รอตรวจสอบ</option>
            <option value="rejected">ถูกปฏิเสธ</option>
          </select>

          {/* Check-in selector */}
          <select
            value={checkInFilter}
            onChange={(e) => setCheckInFilter(e.target.value)}
            className="text-xs px-3 py-2.5 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">เข้างาน: ทั้งหมด</option>
            <option value="checkedIn">เช็คชื่อแล้ว</option>
            <option value="notCheckedIn">ยังไม่เข้างาน</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4">ชื่อ-นามสกุล</th>
                <th className="py-3.5 px-4 font-mono">เบอร์โทรศัพท์</th>
                <th className="py-3.5 px-4">จังหวัด</th>
                <th className="py-3.5 px-4 text-center">จำนวนคน</th>
                <th className="py-3.5 px-4 text-center">เสื้อ / อาหาร</th>
                <th className="py-3.5 px-4 text-right">ยอดเงิน</th>
                <th className="py-3.5 px-4 text-center">สถานะ</th>
                <th className="py-3.5 px-4 text-center">เข้างาน</th>
                <th className="py-3.5 px-4 text-center">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.length > 0 ? (
                filteredList.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-center text-slate-400 font-mono">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{p.fullName}</div>
                      {p.nickname && (
                        <div className="text-[11px] text-slate-400">ชื่อเล่น: {p.nickname}</div>
                      )}
                      <div className="text-[10px] text-blue-900 font-mono">{p.qrToken}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700 whitespace-nowrap">
                      {p.phone}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {p.province || '-'}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className="font-bold text-slate-900">{p.totalCount}</span>
                      {p.guestCount > 0 && (
                        <span className="text-[10px] text-slate-400 block">
                          (+{p.guestCount} ผู้ติดตาม)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className="font-semibold text-slate-800">ไซส์ {p.shirtSize}</span>
                      <span className="text-[10px] text-slate-500 block">
                        {p.foodType === 'general' ? 'ทั่วไป' : p.foodType === 'muslim' ? 'อิสลาม' : 'มังสวิรัติ'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-blue-900 whitespace-nowrap">
                      {p.paymentAmount.toLocaleString()} บ.
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                          p.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700'
                            : p.status === 'pending'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {p.status === 'approved'
                          ? 'อนุมัติแล้ว'
                          : p.status === 'pending'
                          ? 'รอตรวจสอบ'
                          : 'ถูกปฏิเสธ'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleToggleCheckIn(p)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                          p.checkedIn
                            ? 'bg-sky-100 text-sky-800 hover:bg-sky-200'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                        title={p.checkedIn ? 'คลิกเพื่อยกเลิกการเช็คชื่อ' : 'คลิกเพื่อเช็คชื่อเข้างาน'}
                      >
                        <Check className="w-3 h-3" />
                        <span>{p.checkedIn ? 'เข้างานแล้ว' : 'ยังไม่เข้า'}</span>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedSlip(p)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                          title="ดูสลิป"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {p.status === 'approved' && (
                          <button
                            type="button"
                            onClick={() => onNavigate('my-qr', p.id)}
                            className="p-1.5 rounded-lg text-blue-600 hover:text-blue-900 hover:bg-blue-50"
                            title="ดูบัตร QR"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setEditingParticipant(p)}
                          className="p-1.5 rounded-lg text-amber-600 hover:text-amber-900 hover:bg-amber-50"
                          title="แก้ไขข้อมูล"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(p.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-800 hover:bg-rose-50"
                          title="ลบข้อมูล"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slip Lightbox */}
      <SlipLightbox
        participant={selectedSlip}
        onClose={() => setSelectedSlip(null)}
        onApprove={(id, note) => {
          updateParticipant(id, { status: 'approved', adminNote: note || 'อนุมัติเรียบร้อย' });
          refreshData();
        }}
        onReject={(id, reason) => {
          updateParticipant(id, { status: 'rejected', adminNote: reason });
          refreshData();
        }}
      />

      {/* Edit Participant Modal */}
      {editingParticipant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                แก้ไขข้อมูลผู้ลงทะเบียน
              </h3>
              <button
                onClick={() => setEditingParticipant(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  ชื่อ-นามสกุล
                </label>
                <input
                  type="text"
                  value={editingParticipant.fullName}
                  onChange={(e) =>
                    setEditingParticipant({ ...editingParticipant, fullName: e.target.value })
                  }
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    ชื่อเล่น
                  </label>
                  <input
                    type="text"
                    value={editingParticipant.nickname || ''}
                    onChange={(e) =>
                      setEditingParticipant({ ...editingParticipant, nickname: e.target.value })
                    }
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    เบอร์โทรศัพท์
                  </label>
                  <input
                    type="text"
                    value={editingParticipant.phone}
                    onChange={(e) =>
                      setEditingParticipant({ ...editingParticipant, phone: e.target.value })
                    }
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    ผู้ติดตาม (คน)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={editingParticipant.guestCount}
                    onChange={(e) =>
                      setEditingParticipant({
                        ...editingParticipant,
                        guestCount: Number(e.target.value),
                      })
                    }
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    ยอดเงินชำระ (บาท)
                  </label>
                  <input
                    type="number"
                    value={editingParticipant.paymentAmount}
                    onChange={(e) =>
                      setEditingParticipant({
                        ...editingParticipant,
                        paymentAmount: Number(e.target.value),
                      })
                    }
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    ขนาดเสื้อ
                  </label>
                  <select
                    value={editingParticipant.shirtSize}
                    onChange={(e) =>
                      setEditingParticipant({
                        ...editingParticipant,
                        shirtSize: e.target.value as ShirtSize,
                      })
                    }
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white"
                  >
                    {['S', 'M', 'L', 'XL', 'XXL', '3XL'].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    ประเภทอาหาร
                  </label>
                  <select
                    value={editingParticipant.foodType}
                    onChange={(e) =>
                      setEditingParticipant({
                        ...editingParticipant,
                        foodType: e.target.value as FoodType,
                      })
                    }
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="general">ทั่วไป</option>
                    <option value="muslim">อิสลาม</option>
                    <option value="vegetarian">มังสวิรัติ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  หมายเหตุของคณะกรรมการ
                </label>
                <input
                  type="text"
                  value={editingParticipant.adminNote || ''}
                  onChange={(e) =>
                    setEditingParticipant({
                      ...editingParticipant,
                      adminNote: e.target.value,
                    })
                  }
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                  placeholder="เช่น ตรวจสอบยอดแล้ว, รับเสื้อแล้ว..."
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingParticipant(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold rounded-xl text-white bg-blue-900 hover:bg-blue-800"
                >
                  บันทึกการแก้ไข
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              ยืนยันการลบข้อมูลผู้ลงทะเบียน?
            </h3>
            <p className="text-xs text-slate-500">
              การดำเนินการนี้ไม่สามารถยกเลิกได้ ข้อมูลผู้ลงทะเบียนจะถูกลบออกจากระบบทันที
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-5 py-2 text-xs font-semibold rounded-xl text-white bg-rose-600 hover:bg-rose-700"
              >
                ยืนยันลบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
