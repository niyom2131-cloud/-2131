import React, { useState } from 'react';
import { Shield, Menu, X, Users, CheckCircle, Calendar, PlusCircle, ArrowRight } from 'lucide-react';
import { isAdminLoggedIn } from '../lib/storage';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string, param?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const loggedIn = isAdminLoggedIn();

  const handleNav = (tab: string) => {
    onNavigate(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 text-left focus:outline-none group shrink-0"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-900 text-amber-400 flex items-center justify-center font-bold text-base shadow-sm ring-1 ring-blue-950/10 group-hover:scale-105 transition-transform">
              <span className="tracking-tight">ขส.</span>
            </div>
            <div>
              <div className="font-bold text-slate-900 text-base leading-snug group-hover:text-blue-900 transition-colors whitespace-nowrap">
                นนส.เหล่าทหารขนส่ง 21/31
              </div>
              <div className="text-xs text-slate-500 font-medium whitespace-nowrap">
                งานคืนสู่เหย้า ประจำปี 2569
              </div>
            </div>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => handleNav('home')}
              className={`hover:text-blue-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentTab === 'home' ? 'text-blue-900 font-semibold border-b-2 border-blue-900' : ''
              }`}
            >
              หน้าแรก
            </button>
            <button
              onClick={() => handleNav('register')}
              className={`hover:text-blue-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentTab === 'register' ? 'text-blue-900 font-semibold border-b-2 border-blue-900' : ''
              }`}
            >
              ลงทะเบียนร่วมงาน
            </button>
            <button
              onClick={() => handleNav('status')}
              className={`hover:text-blue-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentTab === 'status' ? 'text-blue-900 font-semibold border-b-2 border-blue-900' : ''
              }`}
            >
              ตรวจสอบสถานะ / บัตร QR
            </button>
            <button
              onClick={() => handleNav('schedule')}
              className={`hover:text-blue-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentTab === 'schedule' ? 'text-blue-900 font-semibold border-b-2 border-blue-900' : ''
              }`}
            >
              กำหนดการ & สถานที่
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleNav(loggedIn ? 'admin-dashboard' : 'admin-login')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                currentTab.startsWith('admin')
                  ? 'bg-blue-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{loggedIn ? 'แดชบอร์ดผู้ดูแล' : 'เข้าสู่ระบบผู้ดูแล'}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="เมนูหลัก"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          <button
            onClick={() => handleNav('home')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
              currentTab === 'home' ? 'bg-blue-50 text-blue-900 font-semibold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            หน้าแรก
          </button>
          <button
            onClick={() => handleNav('register')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
              currentTab === 'register' ? 'bg-blue-50 text-blue-900 font-semibold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            ลงทะเบียนร่วมงาน
          </button>
          <button
            onClick={() => handleNav('status')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
              currentTab === 'status' ? 'bg-blue-50 text-blue-900 font-semibold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            ตรวจสอบสถานะ / บัตร QR
          </button>
          <button
            onClick={() => handleNav('schedule')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
              currentTab === 'schedule' ? 'bg-blue-50 text-blue-900 font-semibold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            กำหนดการ & สถานที่
          </button>
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => handleNav(loggedIn ? 'admin-dashboard' : 'admin-login')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-900 text-white"
            >
              <Shield className="w-4 h-4" />
              <span>{loggedIn ? 'เข้าสู่แดชบอร์ดผู้ดูแล' : 'เข้าสู่ระบบผู้ดูแล'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
