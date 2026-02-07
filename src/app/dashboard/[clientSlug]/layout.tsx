"use client";

import { useState, useEffect } from 'react';
import { useParams, usePathname } from 'next/navigation';
import Image from 'next/image';
import { LogOut, ChevronLeft, ChevronRight, Menu } from 'lucide-react';

const clientRoutes = [
  {
    name: 'Reservasi',
    id: 'attendance',
    icon: '/images/icons/rsvp.png',
    description: 'Kehadiran Tamu',
  },
  {
    name: 'Ucapan Doa & Pesan',
    id: 'guestbook',
    icon: '/images/icons/guestbook.png',
    description: 'Kelola Ucapan Doa & Pesan',
  },
  {
    name: 'Tamu Undangan',
    id: 'invitation',
    icon: '/images/icons/invitation.png',
    description: 'Kelola Tamu Undangan',
  },
  {
    name: 'Edit Undangan',
    id: 'edit-content',
    icon: '/images/icons/edit.png',
    description: 'Edit Undangan Konten',
  },
  {
    name: 'WhatsApp Template',
    id: 'whatsapp-template',
    icon: '/images/icons/whatsapp.png',
    description: 'Edit Pesan WhatsApp',
  }
];

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeSection, setActiveSection] = useState('attendance');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const params = useParams();
  const pathname = usePathname();
  const clientSlug = params?.clientSlug as string;

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const authData = localStorage.getItem(`client_auth_${clientSlug}`);
        if (authData) {
          const parsed = JSON.parse(authData);
          if (parsed.isAuthenticated && parsed.slug === clientSlug) {
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (clientSlug) {
      checkAuth();
    }
  }, [clientSlug]);

  // Redirect logic
  useEffect(() => {
    if (!isLoading && clientSlug) {
      const isLoginPage = pathname === `/dashboard/${clientSlug}/login`;

      if (!isAuthenticated && !isLoginPage) {
        window.location.href = `/dashboard/${clientSlug}/login`;
      } else if (isAuthenticated && isLoginPage) {
        window.location.href = `/dashboard/${clientSlug}`;
      }
    }
  }, [isAuthenticated, isLoading, pathname, clientSlug]);

  useEffect(() => {
    const handleActiveUpdate = (event: CustomEvent) => {
      setActiveSection(event.detail);
    };

    window.addEventListener('updateActiveSection', handleActiveUpdate as EventListener);
    return () => window.removeEventListener('updateActiveSection', handleActiveUpdate as EventListener);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePreviewUndangan = () => {
    const previewUrl = `/undangan/${clientSlug}/preview-undangan`;
    window.open(previewUrl, '_blank');
  };

  const handleLogout = () => {
    localStorage.removeItem(`client_auth_${clientSlug}`);
    window.location.href = `/dashboard/${clientSlug}/login`;
  };

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F2854] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#BDE8F5]/30 border-t-[#BDE8F5] rounded-full animate-spin" />
          <p className="text-[#BDE8F5]/70 text-sm font-medium tracking-wide">Memuat...</p>
        </div>
      </div>
    );
  }

  // If on login page, just render children without sidebar
  if (pathname === `/dashboard/${clientSlug}/login`) {
    return <>{children}</>;
  }

  // If not authenticated, show redirect loading
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0F2854] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#BDE8F5]/30 border-t-[#BDE8F5] rounded-full animate-spin" />
          <p className="text-[#BDE8F5]/70 text-sm font-medium tracking-wide">Mengalihkan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-[#BDE8F5] selection:text-[#0F2854] relative flex overflow-hidden">

      {/* --- MOBILE OVERLAY --- */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-[#0F2854]/80 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* --- SIDEBAR (Fixed) --- */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 h-screen transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
          bg-[#0F2854] text-white shadow-2xl flex flex-col border-r border-[#BDE8F5]/10 overflow-hidden
          ${isMobile
            ? `${sidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full w-72'}`
            : `${sidebarOpen ? 'w-72' : 'w-20'}`
          }
        `}
      >
        {/* Abstract Background Glow */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#1C4D8D]/20 to-transparent pointer-events-none" />
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#4988C4]/20 rounded-full blur-[80px] pointer-events-none" />

        {/* Header Sidebar */}
        <div className="relative h-24 flex items-center justify-center border-b border-[#BDE8F5]/10 z-10 flex-shrink-0 px-4">
          {sidebarOpen ? (
            <div className="flex items-center gap-4 w-full animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1C4D8D] to-[#0F2854] flex items-center justify-center shadow-lg shadow-[#0F2854]/50 border border-[#BDE8F5]/20 flex-shrink-0 group">
                <Image
                  src="/images/icons/dove.png"
                  alt="Logo"
                  width={24}
                  height={24}
                  className="brightness-0 invert opacity-90 group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="overflow-hidden min-w-0 flex-1">
                <h1 className="font-bold text-lg text-white truncate tracking-tight">{clientSlug}</h1>
                <p className="text-[10px] text-[#BDE8F5]/70 uppercase tracking-widest font-semibold truncate">Dashboard Panel</p>
              </div>
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-xl text-[#BDE8F5]/50 hover:text-white hover:bg-[#BDE8F5]/10 transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-12 h-12 rounded-2xl bg-[#1C4D8D]/20 hover:bg-[#1C4D8D]/40 border border-[#BDE8F5]/10 flex items-center justify-center transition-all group"
            >
              <Image
                src="/images/icons/dove.png"
                alt="Logo"
                width={24}
                height={24}
                className="brightness-0 invert opacity-80 group-hover:scale-110 transition-transform"
              />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-3 space-y-2 sidebar-scrollbar">
          {clientRoutes.map((route) => {
            const isActive = activeSection === route.id;
            return (
              <button
                key={route.id}
                onClick={() => {
                  setActiveSection(route.id);
                  window.dispatchEvent(new CustomEvent('sectionChange', { detail: route.id }));
                  if (isMobile) setSidebarOpen(false);
                }}
                className={`group relative w-full flex items-center rounded-xl transition-all duration-300 ease-out overflow-hidden
                   ${sidebarOpen ? 'px-4 py-3.5' : 'justify-center py-3.5'}
                   ${isActive
                    ? 'bg-gradient-to-r from-[#1C4D8D] to-[#0F2854] text-white shadow-lg shadow-[#0F2854]/40 border border-[#BDE8F5]/20'
                    : 'text-[#BDE8F5]/70 hover:bg-[#BDE8F5]/10 hover:text-white border border-transparent'
                  }
                 `}
                title={!sidebarOpen ? route.name : ''}
              >
                {/* Active Indicator Glow */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#4988C4] shadow-[0_0_10px_#4988C4]"></div>
                )}

                <div className={`relative z-10 flex-shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {route.icon.startsWith('/') ? (
                    <Image
                      src={route.icon} alt={route.name} width={22} height={22}
                      className={`transition-all duration-300 ${isActive ? 'brightness-0 invert opacity-100' : 'brightness-0 invert opacity-60 group-hover:opacity-100'}`}
                    />
                  ) : (
                    <span className="text-xl">{route.icon}</span>
                  )}
                </div>

                {sidebarOpen && (
                  <div className="ml-4 text-left whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">
                    <p className={`text-sm tracking-wide ${isActive ? 'font-bold text-white' : 'font-medium'}`}>{route.name}</p>
                  </div>
                )}

                {/* Right Chevron for Active */}
                {sidebarOpen && isActive && (
                  <ChevronRight className="ml-auto w-4 h-4 text-[#4988C4] animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Sidebar */}
        <div className="p-4 bg-[#0a1b3b]/90 backdrop-blur-md flex-shrink-0 border-t border-[#BDE8F5]/10 space-y-3">
          <button
            onClick={handlePreviewUndangan}
            className={`w-full group relative overflow-hidden rounded-xl bg-[#BDE8F5] text-[#0F2854] shadow-lg transition-all duration-300 hover:shadow-xl hover:bg-white hover:scale-[1.02] active:scale-95 ${sidebarOpen ? 'px-4 py-3' : 'p-3 flex justify-center'}`}
          >
            <div className="flex items-center gap-3 justify-center font-bold">
              <div className="relative">
                <div className="absolute inset-0 bg-[#0F2854]/20 rounded-full animate-ping opacity-20"></div>
                <svg className="w-5 h-5 flex-shrink-0 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              </div>
              {sidebarOpen && <span className="text-sm truncate">Live Preview</span>}
            </div>
          </button>

          {/* Logout Button */}
          {sidebarOpen ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-rose-400 hover:text-white hover:bg-rose-500/20 border border-transparent hover:border-rose-500/30 transition-all group"
            >
              <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Keluar</span>
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center p-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
              title="Keluar"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}

          {!isMobile && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full flex items-center justify-center p-1.5 rounded-lg text-[#BDE8F5]/30 hover:text-[#BDE8F5] hover:bg-[#BDE8F5]/5 transition-all mt-2"
            >
              {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          )}
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main
        className={`
          flex-1 min-h-screen transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col bg-[#F8FAFC]
          ${isMobile
            ? 'ml-0' // Mobile: Full width
            : (sidebarOpen ? 'ml-72' : 'ml-20') // Desktop: Push content
          }
        `}
      >
        {/* MOBILE TOP BAR (Hanya muncul di Mobile) */}
        {isMobile && (
          <header className="h-16 flex items-center justify-between px-4 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 lg:hidden shadow-sm">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 -ml-2 text-[#0F2854] hover:bg-[#F8FAFC] rounded-xl transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h2 className="text-lg font-bold text-[#0F2854] truncate tracking-tight">
                {clientRoutes.find(route => route.id === activeSection)?.name || 'Dashboard'}
              </h2>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1C4D8D] to-[#0F2854] flex items-center justify-center shadow-md">
              <Image src="/images/icons/dove.png" alt="Logo" width={16} height={16} className="brightness-0 invert" />
            </div>
          </header>
        )}

        {/* Content Area - TANPA PADDING/MARGIN TAMBAHAN */}
        <div className="w-full h-full relative">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            {children}
          </div>
        </div>
      </main>

    </div>
  );
}