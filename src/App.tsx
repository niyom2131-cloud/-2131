import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Register } from './pages/Register';
import { ThankYou } from './pages/ThankYou';
import { CheckStatus } from './pages/CheckStatus';
import { MyQrCode } from './pages/MyQrCode';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminParticipants } from './pages/AdminParticipants';
import { AdminRegistration } from './pages/AdminRegistration';
import { AdminQrScanner } from './pages/AdminQrScanner';
import { isAdminLoggedIn } from './lib/storage';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [targetIdOrPhone, setTargetIdOrPhone] = useState<string>('');

  const handleNavigate = (tab: string, param?: string) => {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (param !== undefined) {
      setTargetIdOrPhone(param);
    }

    // Protection for admin routes
    if (tab.startsWith('admin') && tab !== 'admin-login') {
      if (!isAdminLoggedIn()) {
        setCurrentTab('admin-login');
        return;
      }
    }

    setCurrentTab(tab);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar currentTab={currentTab} onNavigate={handleNavigate} />

      <main className="flex-1">
        {currentTab === 'home' && <Home onNavigate={handleNavigate} />}

        {currentTab === 'register' && (
          <Register
            onSuccess={(id) => {
              setTargetIdOrPhone(id);
              setCurrentTab('thank-you');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'thank-you' && (
          <ThankYou
            participantId={targetIdOrPhone}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'status' && (
          <CheckStatus
            initialPhone={targetIdOrPhone}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'my-qr' && (
          <MyQrCode
            participantId={targetIdOrPhone}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'schedule' && (
          <div className="py-8">
            <Home onNavigate={handleNavigate} />
          </div>
        )}

        {currentTab === 'admin-login' && (
          <AdminLogin
            onSuccess={() => handleNavigate('admin-dashboard')}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'admin-dashboard' && (
          <AdminDashboard
            onNavigate={handleNavigate}
            onLogout={() => handleNavigate('home')}
          />
        )}

        {currentTab === 'admin-participants' && (
          <AdminParticipants onNavigate={handleNavigate} />
        )}

        {currentTab === 'admin-register' && (
          <AdminRegistration onNavigate={handleNavigate} />
        )}

        {currentTab === 'admin-scanner' && (
          <AdminQrScanner onNavigate={handleNavigate} />
        )}
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
