import { Participant, RegistrationFormData, ParticipantStatus } from '../types';
import * as XLSX from 'xlsx';

const STORAGE_KEY = 'nnskhs2131_reunion_participants_v1';
const ADMIN_AUTH_KEY = 'nnskhs2131_admin_logged_in';

// Mock slip placeholder SVG data URL
const DEFAULT_SLIP_SAMPLE = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600"><rect width="100%" height="100%" fill="%23f8fafc"/><rect x="20" y="20" width="360" height="560" rx="16" fill="%23ffffff" stroke="%23cbd5e1" stroke-width="2"/><circle cx="200" cy="90" r="32" fill="%230284c7"/><path d="M190 90l7 7 15-15" stroke="%23ffffff" stroke-width="3" fill="none"/><text x="200" y="150" font-family="sans-serif" font-size="18" font-weight="bold" fill="%230f172a" text-anchor="middle">โอนเงินสำเร็จ</text><text x="200" y="175" font-family="sans-serif" font-size="12" fill="%2364748b" text-anchor="middle">ttb bank - Slip Verification</text><line x1="40" y1="200" x2="360" y2="200" stroke="%23e2e8f0" stroke-width="1" stroke-dasharray="4"/><text x="50" y="240" font-family="sans-serif" font-size="13" fill="%2364748b">จำนวนเงิน</text><text x="350" y="240" font-family="sans-serif" font-size="18" font-weight="bold" fill="%230284c7" text-anchor="end">1,000.00 บาท</text><text x="50" y="280" font-family="sans-serif" font-size="13" fill="%2364748b">วันที่ทำรายการ</text><text x="350" y="280" font-family="sans-serif" font-size="13" fill="%230f172a" text-anchor="end">26 ต.ค. 2569 - 10:45 น.</text><text x="50" y="320" font-family="sans-serif" font-size="13" fill="%2364748b">ไปยังบัญชี</text><text x="350" y="320" font-family="sans-serif" font-size="13" fill="%230f172a" text-anchor="end">นนส.เหล่าทหารขนส่ง 21/31</text><line x1="40" y1="350" x2="360" y2="350" stroke="%23e2e8f0" stroke-width="1"/><rect x="140" y="380" width="120" height="120" fill="%23f1f5f9" rx="8"/><text x="200" y="445" font-family="sans-serif" font-size="11" fill="%2364748b" text-anchor="middle">E-Slip QR Code</text><text x="200" y="540" font-family="sans-serif" font-size="11" fill="%2394a3b8" text-anchor="middle">รหัสอ้างอิง: TTB-NNS2131-88941</text></svg>';

export function generateQrToken(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let token = 'NNS2131-';
  for (let i = 0; i < 6; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// Initial seed data so the system is immediately alive and functional
const INITIAL_PARTICIPANTS: Participant[] = [
  {
    id: 'p-1',
    fullName: 'นิยม สมาคม',
    nickname: 'ยม',
    classYear: 'นนส.เหล่าทหารขนส่ง 21/31',
    phone: '081-998-2131',
    lineId: 'niyom2131',
    province: 'ลพบุรี',
    guestCount: 1,
    totalCount: 2,
    foodType: 'general',
    shirtSize: 'L',
    message: 'คิดถึงเพื่อนๆ ทุกคน เจอกันวันงานครับ!',
    paymentAmount: 2000,
    paymentDate: '2026-10-24 10:30',
    slipUrl: DEFAULT_SLIP_SAMPLE,
    status: 'approved',
    adminNote: 'ตรวจสอบยอดเงิน 2,000 บาท เรียบร้อยแล้ว (2 ที่นั่ง)',
    qrToken: 'NNS2131-NYM99',
    checkedIn: false,
    checkedInAt: null,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'p-2',
    fullName: 'ปรีชากูล คูณทรัพย์',
    nickname: 'ปรีชา',
    classYear: 'นนส.เหล่าทหารขนส่ง 21/31',
    phone: '089-112-3456',
    lineId: 'preechakool',
    province: 'กรุงเทพมหานคร',
    guestCount: 0,
    totalCount: 1,
    foodType: 'general',
    shirtSize: 'XL',
    message: 'พร้อมร่วมงานครับ ขอให้จัดงานสำเร็จลุล่วง',
    paymentAmount: 1000,
    paymentDate: '2026-10-25 14:15',
    slipUrl: DEFAULT_SLIP_SAMPLE,
    status: 'pending',
    qrToken: 'NNS2131-PRC45',
    checkedIn: false,
    checkedInAt: null,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'p-3',
    fullName: 'ชวลิต บุษยมณี',
    nickname: 'ชว',
    classYear: 'นนส.เหล่าทหารขนส่ง 21/31',
    phone: '086-778-9900',
    lineId: 'chawalit_b',
    province: 'สระบุรี',
    guestCount: 1,
    totalCount: 2,
    foodType: 'general',
    shirtSize: 'M',
    message: 'เดินทางจากสระบุรีครับ',
    paymentAmount: 2000,
    paymentDate: '2026-10-25 16:50',
    slipUrl: DEFAULT_SLIP_SAMPLE,
    status: 'approved',
    adminNote: 'อนุมัติเรียบร้อย',
    qrToken: 'NNS2131-CHW88',
    checkedIn: true,
    checkedInAt: new Date(Date.now() - 3600000).toISOString(),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'p-4',
    fullName: 'สมาน ชุมศรี',
    nickname: 'หมาน',
    classYear: 'นนส.เหล่าทหารขนส่ง 21/31',
    phone: '085-334-4556',
    lineId: '',
    province: 'นครราชสีมา',
    guestCount: 0,
    totalCount: 1,
    foodType: 'muslim',
    shirtSize: 'XXL',
    message: 'ขออาหารฮาลาลครับ',
    paymentAmount: 1000,
    paymentDate: '2026-10-26 09:20',
    slipUrl: DEFAULT_SLIP_SAMPLE,
    status: 'pending',
    qrToken: 'NNS2131-SMN12',
    checkedIn: false,
    checkedInAt: null,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'p-5',
    fullName: 'พัชรินทร์ ไชยโย',
    nickname: 'รินทร์',
    classYear: 'นนส.เหล่าทหารขนส่ง 21/31',
    phone: '082-555-8899',
    lineId: 'patcharin',
    province: 'ชลบุรี',
    guestCount: 0,
    totalCount: 1,
    foodType: 'general',
    shirtSize: 'L',
    message: 'โอนยอดผิด รบกวนตรวจสอบครับ',
    paymentAmount: 500,
    paymentDate: '2026-10-20 11:00',
    slipUrl: DEFAULT_SLIP_SAMPLE,
    status: 'rejected',
    adminNote: 'ยอดเงินไม่ครบตามอัตราลงทะเบียน 1,000 บาท กรุณาโอนเพิ่มอีก 500 บาทและแจ้งกรรมการ',
    qrToken: 'NNS2131-PCR09',
    checkedIn: false,
    checkedInAt: null,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  }
];

export function getParticipants(): Participant[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PARTICIPANTS));
      return INITIAL_PARTICIPANTS;
    }
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : INITIAL_PARTICIPANTS;
  } catch (err) {
    console.error('Failed to load participants from localStorage:', err);
    return INITIAL_PARTICIPANTS;
  }
}

export function saveParticipants(participants: Participant[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(participants));
  } catch (err) {
    console.error('Failed to save participants to localStorage:', err);
  }
}

export function createParticipant(formData: RegistrationFormData): Participant {
  const participants = getParticipants();
  const id = `p-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const guestCount = Number(formData.guestCount) || 0;
  const now = new Date().toISOString();

  const newParticipant: Participant = {
    id,
    fullName: formData.fullName.trim(),
    nickname: formData.nickname.trim(),
    classYear: 'นนส.เหล่าทหารขนส่ง 21/31',
    phone: formData.phone.trim(),
    lineId: formData.lineId.trim(),
    province: formData.province.trim(),
    guestCount,
    totalCount: 1 + guestCount,
    foodType: formData.foodType,
    shirtSize: formData.shirtSize,
    message: formData.message.trim(),
    paymentAmount: Number(formData.paymentAmount) || 1000,
    paymentDate: formData.paymentDate || new Date().toISOString(),
    slipUrl: formData.slipUrl || DEFAULT_SLIP_SAMPLE,
    status: 'pending',
    qrToken: generateQrToken(),
    checkedIn: false,
    checkedInAt: null,
    createdAt: now,
    updatedAt: now,
  };

  participants.unshift(newParticipant);
  saveParticipants(participants);
  return newParticipant;
}

export function updateParticipant(id: string, updates: Partial<Participant>): Participant | null {
  const participants = getParticipants();
  const index = participants.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const current = participants[index];
  const updated: Participant = {
    ...current,
    ...updates,
    totalCount: updates.guestCount !== undefined ? 1 + Number(updates.guestCount) : current.totalCount,
    updatedAt: new Date().toISOString(),
  };

  participants[index] = updated;
  saveParticipants(participants);
  return updated;
}

export function deleteParticipant(id: string): boolean {
  const participants = getParticipants();
  const filtered = participants.filter((p) => p.id !== id);
  if (filtered.length === participants.length) return false;
  saveParticipants(filtered);
  return true;
}

export function approveParticipant(id: string, adminNote?: string): Participant | null {
  return updateParticipant(id, {
    status: 'approved',
    adminNote: adminNote || 'อนุมัติการลงทะเบียนและยอดเงินเรียบร้อยแล้ว',
  });
}

export function rejectParticipant(id: string, reason: string): Participant | null {
  return updateParticipant(id, {
    status: 'rejected',
    adminNote: reason || 'ไม่ผ่านการอนุมัติ กรุณาติดต่อกรรมการ',
  });
}

export function checkInParticipant(tokenOrId: string): { success: boolean; message: string; participant?: Participant } {
  const participants = getParticipants();
  const clean = tokenOrId.trim().toUpperCase();

  const participant = participants.find(
    (p) => p.qrToken.toUpperCase() === clean || p.id === tokenOrId || p.phone.replace(/[^0-9]/g, '') === clean.replace(/[^0-9]/g, '')
  );

  if (!participant) {
    return { success: false, message: 'ไม่พบข้อมูลผู้ลงทะเบียนในระบบ หรือรหัสบัตรไม่ถูกต้อง' };
  }

  if (participant.status !== 'approved') {
    return {
      success: false,
      message: `ผู้ลงทะเบียนสถานะ "${participant.status === 'pending' ? 'รอตรวจสอบสลิป' : 'ถูกปฏิเสธ'}" ไม่สามารถเช็คชื่อได้`,
      participant,
    };
  }

  if (participant.checkedIn) {
    const timeStr = participant.checkedInAt
      ? new Date(participant.checkedInAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
      : '';
    return {
      success: false,
      message: `เช็คชื่อเข้างานไปแล้วเมื่อเวลา ${timeStr} น.`,
      participant,
    };
  }

  const updated = updateParticipant(participant.id, {
    checkedIn: true,
    checkedInAt: new Date().toISOString(),
  });

  return {
    success: true,
    message: `เช็คชื่อสำเร็จ! ยินดีต้อนรับ ${participant.fullName} (รวม ${participant.totalCount} ท่าน)`,
    participant: updated || participant,
  };
}

export function undoCheckIn(id: string): Participant | null {
  return updateParticipant(id, {
    checkedIn: false,
    checkedInAt: null,
  });
}

export function findParticipantByPhone(phone: string): Participant | null {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  if (!cleanPhone) return null;
  const participants = getParticipants();
  return participants.find((p) => p.phone.replace(/[^0-9]/g, '') === cleanPhone) || null;
}

export function findParticipantByToken(token: string): Participant | null {
  const cleanToken = token.trim().toUpperCase();
  if (!cleanToken) return null;
  const participants = getParticipants();
  return participants.find((p) => p.qrToken.toUpperCase() === cleanToken) || null;
}

export function findParticipantById(id: string): Participant | null {
  const participants = getParticipants();
  return participants.find((p) => p.id === id) || null;
}

// Admin Authentication State
export function isAdminLoggedIn(): boolean {
  return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
}

export function setAdminLoggedIn(loggedIn: boolean): void {
  if (loggedIn) {
    localStorage.setItem(ADMIN_AUTH_KEY, 'true');
  } else {
    localStorage.removeItem(ADMIN_AUTH_KEY);
  }
}

// Export to Excel with Thai Headers & Summary Sheet
export function exportToExcel(): void {
  const participants = getParticipants();
  
  // Sheet 1: รายชื่อผู้ลงทะเบียน
  const rows = participants.map((p, idx) => ({
    'ลำดับ': idx + 1,
    'รหัส QR': p.qrToken,
    'ชื่อ-นามสกุล': p.fullName,
    'ชื่อเล่น': p.nickname || '-',
    'เบอร์โทรศัพท์': p.phone,
    'LINE ID': p.lineId || '-',
    'จังหวัด': p.province || '-',
    'ผู้ติดตาม (คน)': p.guestCount,
    'จำนวนรวม (คน)': p.totalCount,
    'ขนาดเสื้อ': p.shirtSize,
    'ประเภทอาหาร': p.foodType === 'general' ? 'ทั่วไป' : p.foodType === 'muslim' ? 'อิสลาม' : 'มังสวิรัติ',
    'ยอดเงิน (บาท)': p.paymentAmount,
    'สถานะสลิป': p.status === 'approved' ? 'อนุมัติแล้ว' : p.status === 'pending' ? 'รอตรวจสอบ' : 'ปฏิเสธ',
    'หมายเหตุแอดมิน': p.adminNote || '-',
    'เช็คชื่อเข้างาน': p.checkedIn ? 'เช็คชื่อแล้ว' : 'ยังไม่เช็คชื่อ',
    'เวลาเช็คชื่อ': p.checkedInAt ? new Date(p.checkedInAt).toLocaleString('th-TH') : '-',
    'วันที่ลงทะเบียน': new Date(p.createdAt).toLocaleString('th-TH'),
  }));

  const worksheet1 = XLSX.utils.json_to_sheet(rows);

  // Set column widths for better readability
  worksheet1['!cols'] = [
    { wch: 6 },
    { wch: 16 },
    { wch: 25 },
    { wch: 12 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 14 },
    { wch: 14 },
    { wch: 10 },
    { wch: 14 },
    { wch: 14 },
    { wch: 14 },
    { wch: 30 },
    { wch: 16 },
    { wch: 20 },
    { wch: 20 },
  ];

  // Sheet 2: สรุปสถิติภาพรวม
  const approved = participants.filter((p) => p.status === 'approved');
  const pending = participants.filter((p) => p.status === 'pending');
  const rejected = participants.filter((p) => p.status === 'rejected');
  const checkedIn = participants.filter((p) => p.checkedIn);
  const totalGuests = participants.reduce((acc, p) => acc + p.guestCount, 0);
  const totalPeople = participants.reduce((acc, p) => acc + p.totalCount, 0);
  const totalApprovedMoney = approved.reduce((acc, p) => acc + (p.paymentAmount || 0), 0);

  // Shirt size counts
  const shirtCounts: Record<string, number> = { S: 0, M: 0, L: 0, XL: 0, XXL: 0, '3XL': 0 };
  participants.forEach((p) => {
    if (shirtCounts[p.shirtSize] !== undefined) {
      shirtCounts[p.shirtSize]++;
    }
  });

  // Food counts
  const foodCounts = {
    general: participants.filter((p) => p.foodType === 'general').length,
    muslim: participants.filter((p) => p.foodType === 'muslim').length,
    vegetarian: participants.filter((p) => p.foodType === 'vegetarian').length,
  };

  const summaryRows = [
    { 'รายการ': 'ผู้ลงทะเบียนทั้งหมด (คน)', 'จำนวน': participants.length, 'หน่วย': 'คน' },
    { 'รายการ': 'ผู้ติดตามทั้งหมด', 'จำนวน': totalGuests, 'หน่วย': 'คน' },
    { 'รายการ': 'ยอดผู้เข้าร่วมงานรวมสุทธิ', 'จำนวน': totalPeople, 'หน่วย': 'คน' },
    { 'รายการ': 'สถานะ: อนุมัติแล้ว', 'จำนวน': approved.length, 'หน่วย': 'คน' },
    { 'รายการ': 'สถานะ: รอตรวจสอบสลิป', 'จำนวน': pending.length, 'หน่วย': 'คน' },
    { 'รายการ': 'สถานะ: ปฏิเสธ', 'จำนวน': rejected.length, 'หน่วย': 'คน' },
    { 'รายการ': 'เช็คชื่อเข้างานหน้างานแล้ว', 'จำนวน': checkedIn.length, 'หน่วย': 'คน' },
    { 'รายการ': 'ยอดเงินที่อนุมัติแล้วรวม', 'จำนวน': totalApprovedMoney, 'หน่วย': 'บาท' },
    { 'รายการ': '', 'จำนวน': '', 'หน่วย': '' },
    { 'รายการ': '--- สรุปขนาดเสื้อ ---', 'จำนวน': '', 'หน่วย': '' },
    { 'รายการ': 'เสื้อขนาด S', 'จำนวน': shirtCounts.S, 'หน่วย': 'ตัว' },
    { 'รายการ': 'เสื้อขนาด M', 'จำนวน': shirtCounts.M, 'หน่วย': 'ตัว' },
    { 'รายการ': 'เสื้อขนาด L', 'จำนวน': shirtCounts.L, 'หน่วย': 'ตัว' },
    { 'รายการ': 'เสื้อขนาด XL', 'จำนวน': shirtCounts.XL, 'หน่วย': 'ตัว' },
    { 'รายการ': 'เสื้อขนาด XXL', 'จำนวน': shirtCounts.XXL, 'หน่วย': 'ตัว' },
    { 'รายการ': 'เสื้อขนาด 3XL', 'จำนวน': shirtCounts['3XL'], 'หน่วย': 'ตัว' },
    { 'รายการ': '', 'จำนวน': '', 'หน่วย': '' },
    { 'รายการ': '--- สรุปประเภทอาหาร ---', 'จำนวน': '', 'หน่วย': '' },
    { 'รายการ': 'อาหารทั่วไป', 'จำนวน': foodCounts.general, 'หน่วย': 'ชุด' },
    { 'รายการ': 'อาหารอิสลาม (ฮาลาล)', 'จำนวน': foodCounts.muslim, 'หน่วย': 'ชุด' },
    { 'รายการ': 'อาหารมังสวิรัติ / เจ', 'จำนวน': foodCounts.vegetarian, 'หน่วย': 'ชุด' },
  ];

  const worksheet2 = XLSX.utils.json_to_sheet(summaryRows);
  worksheet2['!cols'] = [{ wch: 30 }, { wch: 15 }, { wch: 10 }];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet1, 'รายชื่อผู้ลงทะเบียน');
  XLSX.utils.book_append_sheet(workbook, worksheet2, 'สรุปสถิติงานเลี้ยง');

  const now = new Date();
  const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  XLSX.writeFile(workbook, `รายชื่อผู้ลงทะเบียน_นนส2131_${dateStr}.xlsx`);
}

// Backup & Restore JSON
export function exportBackupJSON(): string {
  const data = getParticipants();
  return JSON.stringify(data, null, 2);
}

export function importBackupJSON(jsonStr: string): { success: boolean; count: number; error?: string } {
  try {
    const parsed = JSON.parse(jsonStr);
    if (!Array.isArray(parsed)) {
      return { success: false, count: 0, error: 'รูปแบบไฟล์ไม่ถูกต้อง (ต้องเป็นรายการข้อมูลผู้ลงทะเบียน)' };
    }
    saveParticipants(parsed);
    return { success: true, count: parsed.length };
  } catch (err: any) {
    return { success: false, count: 0, error: err?.message || 'ไม่สามารถแปลงข้อมูล JSON ได้' };
  }
}
