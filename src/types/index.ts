export type FoodType = 'general' | 'muslim' | 'vegetarian';
export type ShirtSize = 'S' | 'M' | 'L' | 'XL' | 'XXL' | '3XL';
export type ParticipantStatus = 'pending' | 'approved' | 'rejected';

export interface Participant {
  id: string;
  fullName: string;
  nickname: string;
  classYear: string; // e.g. "นนส.เหล่าทหารขนส่ง 21/31"
  phone: string;
  lineId: string;
  province: string;
  guestCount: number;
  totalCount: number;
  foodType: FoodType;
  shirtSize: ShirtSize;
  message: string;
  paymentAmount: number;
  paymentDate: string; // ISO string or human string
  slipUrl: string; // Base64 data URL or image path
  status: ParticipantStatus;
  adminNote?: string;
  qrToken: string;
  checkedIn: boolean;
  checkedInAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RegistrationFormData {
  fullName: string;
  nickname: string;
  phone: string;
  lineId: string;
  province: string;
  guestCount: number;
  foodType: FoodType;
  shirtSize: ShirtSize;
  message: string;
  paymentAmount: number;
  paymentDate: string;
  slipFile?: File | null;
  slipUrl?: string;
}

export interface EventInfo {
  title: string;
  subTitle: string;
  generation: string;
  date: string;
  time: string;
  venue: string;
  locationDetails: string;
  feePerPerson: number;
  bankName: string;
  bankAccountNo: string;
  bankAccountName: string;
  contactPerson: string;
  contactPhone: string;
}
