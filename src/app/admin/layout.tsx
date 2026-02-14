"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Import Image
import { usePathname, useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

// Palet Warna: Deep Navy Premium
const adminRoutes = [
  {
    name: 'Dashboard',
    path: '/admin',
    icon: '🏠',
    description: 'Overview',
    gradient: 'from-[#1C4D8D] to-[#4988C4]'
  },
  {
    name: 'Create Client',
    path: '/admin/create-client',
    icon: '➕',
    description: 'New Client',
    gradient: 'from-[#1C4D8D] to-[#4988C4]'
  },
  {
    name: 'Component Manager',
    path: '/admin/component-manager',
    icon: '🧩',
    description: 'Visibility',
    gradient: 'from-[#1C4D8D] to-[#4988C4]'
  },
  {
    name: 'Music Manager',
    path: '/admin/music-manager',
    icon: '🎵',
    description: 'Music',
    gradient: 'from-[#1C4D8D] to-[#4988C4]'
  },
  {
    name: 'Bank Logos',
    path: '/admin/bank-logos',
    icon: '🏦',
    description: 'Logos',
    gradient: 'from-[#1C4D8D] to-[#4988C4]'
  },
  {
    name: 'Theme Backgrounds',
    path: '/admin/theme-backgrounds',
    icon: '🎨',
    description: 'Themes',
    gradient: 'from-[#1C4D8D] to-[#4988C4]'
  },
  {
    name: 'Catalog Templates',
    path: '/admin/catalog-templates',
    icon: '📋',
    description: 'Templates',
    gradient: 'from-[#1C4D8D] to-[#4988C4]'
  }
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        // Check if window is defined (client-side only)
        if (typeof window !== 'undefined') {
          const authData = localStorage.getItem('admin_auth');
          if (authData) {
            const parsed = JSON.parse(authData);
            if (parsed.isAuthenticated) {
              setIsAuthenticated(true);
            }
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Redirect logic
  useEffect(() => {
    if (!isLoading) {
      const isLoginPage = pathname === '/admin/login';

      if (!isAuthenticated && !isLoginPage) {
        router.push('/admin/login');
      } else if (isAuthenticated && isLoginPage) {
        router.push('/admin');
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setSidebarOpen(!mobile); // Desktop: Open, Mobile: Closed
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_auth');
      // Use window.location for full page reload to ensure clean state
      window.location.href = '/admin/login';
    }
  };

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F2854] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#4988C4] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#BDE8F5]/70 text-sm">Memuat...</p>
        </div>
      </div>
    );
  }

  // If on login page, just render children without sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // If not authenticated, don't render anything (redirect will happen)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0F2854] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#4988C4] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#BDE8F5]/70 text-sm">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-[#4988C4] selection:text-white relative">

      {/* --- MOBILE OVERLAY --- */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-[#0F2854]/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* --- SIDEBAR (FIXED LEFT) --- */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 h-screen transition-all duration-300 ease-out
          bg-[#0F2854] text-white shadow-2xl flex flex-col border-r border-[#BDE8F5]/10 overflow-hidden
          ${isMobile
            ? `${sidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full w-72'}`
            : `${sidebarOpen ? 'w-72' : 'w-20'}`
          }
        `}
      >
        {/* Glow Effect */}
        <div className="absolute top-0 left-0 w-full h-64 bg-[#1C4D8D]/20 rounded-full blur-3xl -translate-y-1/2 pointer-events-none"></div>

        {/* HEADER SIDEBAR - UPDATED WITH LOGO IMAGE */}
        <div className="relative h-20 flex items-center justify-center border-b border-[#BDE8F5]/10 z-10 flex-shrink-0">
          {sidebarOpen || isMobile ? (
            <div className="flex items-center justify-between w-full px-6 animate-in fade-in duration-300">
              <div className="flex items-center gap-3">
                {/* Logo Container */}
                <div className="relative w-32 h-10">
                  <Image
                    src="/icons/logo_putih_nobg.png"
                    alt="Admin Logo"
                    fill
                    sizes="128px"
                    className="object-contain object-left"
                    priority
                  />
                </div>
              </div>

              {/* Mobile Close Button */}
              {isMobile && (
                <button onClick={() => setSidebarOpen(false)} className="text-[#BDE8F5]/70 hover:text-white">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>
          ) : (
            // Collapsed State Logo (Icon Only / Small)
            <button onClick={() => setSidebarOpen(true)} className="relative w-10 h-10 flex items-center justify-center transition-transform hover:scale-110">
              <Image
                src="/icons/logo_putih_nobg.png"
                alt="Icon"
                fill
                sizes="40px"
                className="object-contain"
              />
            </button>
          )}
        </div>

        {/* NAVIGATION LIST */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-3 space-y-2 sidebar-scrollbar">
          {adminRoutes.map((route) => {
            const isActive = pathname === route.path;
            return (
              <Link
                key={route.path}
                href={route.path}
                onClick={() => {
                  if (isMobile) setSidebarOpen(false);
                }}
                className={`group relative w-full flex items-center rounded-xl transition-all duration-300 ease-out overflow-hidden
                   ${sidebarOpen ? 'px-4 py-3' : 'justify-center py-3'}
                   ${isActive
                    ? 'bg-gradient-to-r from-[#1C4D8D] to-[#4988C4] shadow-lg shadow-[#0F2854]/40 text-white border border-[#BDE8F5]/20'
                    : 'text-[#BDE8F5]/70 hover:bg-white/5 hover:text-white border border-transparent'
                  }
                 `}
                title={!sidebarOpen ? route.name : ''}
              >
                <div className={`relative z-10 flex-shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                  <span className="text-xl filter drop-shadow-sm">{route.icon}</span>
                </div>

                {sidebarOpen && (
                  <div className="ml-3.5 text-left whitespace-nowrap animate-in fade-in duration-300 flex-1">
                    <div className={`text-sm font-medium tracking-wide ${isActive ? 'font-semibold' : ''}`}>
                      {route.name}
                    </div>
                  </div>
                )}

                {sidebarOpen && isActive && (
                  <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-[#BDE8F5] shadow-[0_0_8px_#BDE8F5] animate-pulse"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* FOOTER SIDEBAR */}
        <div className="p-4 bg-[#0a1b3b] border-t border-[#BDE8F5]/10 flex-shrink-0">
          {!sidebarOpen && !isMobile && (
            <div className="flex flex-col gap-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center p-2 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
              <button
                onClick={() => setSidebarOpen(true)}
                className="w-full flex items-center justify-center p-2 rounded-lg text-[#BDE8F5]/50 hover:text-white hover:bg-white/5 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
              </button>
            </div>
          )}

          {(sidebarOpen || isMobile) && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-xs text-[#BDE8F5]/70 font-medium">Admin Online</span>
                </div>
                {!isMobile && (
                  <button onClick={() => setSidebarOpen(false)} className="text-[#BDE8F5]/50 hover:text-white">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
                  </button>
                )}
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-rose-400 hover:text-white hover:bg-rose-500/20 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* 4. MAIN CONTENT WRAPPER */}
      <main
        className={`
          flex-1 min-h-screen flex flex-col bg-[#F8FAFC] transition-all duration-300
          /* LOGIC MARGIN */
          ${isMobile
            ? 'ml-0' // Mobile: Full width (sidebar overlay)
            : (sidebarOpen ? 'ml-72' : 'ml-20') // Desktop: Pushed by sidebar width
          }
        `}
      >
        {/* HEADER (MOBILE ONLY) */}
        {/* Di Desktop (lg:hidden), header ini hilang TOTAL sehingga konten naik ke paling atas */}
        <header className="lg:hidden h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Toggle Button Mobile */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 hover:text-[#1C4D8D] rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Header Title / Logo for Mobile */}
            <div className="relative w-24 h-8">
              <Image
                src="/icons/logo_putih_nobg.png"
                alt="Mobile Logo"
                fill
                sizes="96px"
                className="object-contain object-left"
              />
            </div>
          </div>
        </header>

        {/* CONTENT AREA */}
        {/* Padding dihapus total agar children bisa full-width/height */}
        <div className="w-full h-full">
          {children}
        </div>
      </main>

    </div>
  );
}