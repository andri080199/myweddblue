"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import EnhancedLoading from '@/components/ui/EnhancedLoading';
import { getBackgroundTheme } from '@/themes/backgroundThemes';
import { getColorTheme } from '@/themes/colorThemes';
import { getThemeList } from '@/themes';
import { 
  Users, 
  HeartHandshake, 
  Activity, 
  ExternalLink, 
  Palette, 
  Calendar, 
  ChevronRight,
  TrendingUp,
  LayoutDashboard,
  ShieldCheck,
  Search
} from 'lucide-react';

interface Client {
  id: number;
  slug: string;
  theme: string;
  color_theme: string;
  background_theme: string;
  created_at: string;
}

interface DashboardStats {
  totalClients: number;
  recentClients: Client[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    recentClients: []
  });
  const [loading, setLoading] = useState(true);
  const themes = getThemeList();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/clients');
      if (response.ok) {
        const clients = await response.json();
        setStats({
          totalClients: clients.length,
          recentClients: clients.slice(0, 5) // Get 5 most recent
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getThemeDisplayInfo = (client: Client) => {
    if (client.color_theme && client.background_theme) {
      const colorTheme = getColorTheme(client.color_theme);
      const backgroundTheme = getBackgroundTheme(client.background_theme);
      return {
        display: colorTheme.name,
        subDisplay: backgroundTheme.name,
        color: colorTheme.primary,
        description: `${colorTheme.description}`,
      };
    } else if (client.theme) {
      const legacyTheme = themes.find(t => t.id === client.theme);
      return {
        display: legacyTheme ? legacyTheme.name : client.theme,
        subDisplay: 'Legacy Theme',
        color: '#64748b',
        description: 'Legacy configuration',
      };
    }
    return {
      display: 'No Theme',
      subDisplay: '-',
      color: '#cbd5e1',
      description: 'Not configured',
    };
  };

  if (loading) {
    return (
      <EnhancedLoading 
        message="Memuat Dashboard..." 
        type="admin" 
        size="md"
      />
    );
  }

  // --- STAT CARD COMPONENT ---
  const StatCard = ({ title, value, icon: Icon, trend, trendUp, colorClass, bgClass, iconBgClass }: any) => (
    <div className="bg-white rounded-[2rem] p-6 relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(28,77,141,0.15)] shadow-[0_10px_30px_-10px_rgba(28,77,141,0.05)] border border-[#1C4D8D]/5">
      {/* Decorative Background Blob */}
      <div className={`absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-10 transition-opacity duration-500 transform scale-150 ${colorClass}`}>
        <Icon className="w-24 h-24 -mr-6 -mt-6" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className={`p-3.5 rounded-2xl ${iconBgClass} ${colorClass} shadow-sm`}>
            <Icon className="w-6 h-6" />
          </div>
          {trend && (
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${trendUp ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
              <TrendingUp className={`w-3 h-3 ${!trendUp && 'rotate-180'}`} />
              {trend}
            </div>
          )}
        </div>
        <div>
          <h3 className="text-4xl font-black text-[#0F2854] tracking-tight mb-1">{value}</h3>
          <p className="text-sm font-semibold text-[#1C4D8D]/60 uppercase tracking-wider">{title}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans selection:bg-[#BDE8F5] selection:text-[#0F2854]">
      
      {/* 1. HERO SECTION - Deep Navy Background */}
      <div className="relative bg-[#0F2854] pt-8 pb-32 sm:pb-48 overflow-hidden">
        
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 -mt-20 -ml-20 w-96 h-96 bg-[#1C4D8D]/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 -mb-20 -mr-20 w-80 h-80 bg-[#4988C4]/20 rounded-full blur-[80px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            
            {/* Title & Description */}
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C4D8D]/30 border border-[#4988C4]/30 backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5 text-[#BDE8F5]" />
                <span className="text-[10px] font-bold text-[#BDE8F5] tracking-widest uppercase">Admin Portal</span>
              </div>
              
              <div>
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                  Dashboard <span className="text-[#4988C4]">Overview</span>
                </h1>
                <p className="mt-4 text-lg text-[#BDE8F5]/80 font-light leading-relaxed max-w-xl">
                  Selamat datang kembali. Pantau performa undangan dan kelola klien Anda dari satu pusat kendali yang terintegrasi.
                </p>
              </div>
            </div>

            {/* Quick Action Button (Desktop) */}
            <div className="hidden md:block">
              <Link
                href="/admin/create-client"
                className="group inline-flex items-center justify-center px-8 py-4 bg-white text-[#0F2854] text-sm font-bold rounded-2xl hover:bg-[#BDE8F5] transition-all shadow-xl shadow-[#0F2854]/20 hover:shadow-2xl hover:-translate-y-1"
              >
                Create New Client
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT - Overlapping Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20 space-y-8">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard 
            title="Total Clients" 
            value={stats.totalClients} 
            icon={Users} 
            colorClass="text-[#1C4D8D]"
            iconBgClass="bg-[#BDE8F5]/50"
            trend="+12% Month"
            trendUp={true}
          />
          <StatCard 
            title="Active Invites" 
            value={stats.totalClients} 
            icon={HeartHandshake} 
            colorClass="text-[#4988C4]"
            iconBgClass="bg-[#BDE8F5]/30"
            trend="Stable"
            trendUp={true}
          />
          <StatCard 
            title="System Health" 
            value="100%" 
            icon={Activity} 
            colorClass="text-emerald-600"
            iconBgClass="bg-emerald-50"
            trend="Optimal"
            trendUp={true}
          />
        </div>

        {/* Quick Actions Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-[#0F2854] mb-4 px-2">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/create-client"
              className="bg-white rounded-2xl p-6 border border-[#1C4D8D]/10 hover:border-[#1C4D8D]/30 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0F2854] group-hover:text-blue-600 transition-colors">Create Client</h3>
                  <p className="text-xs text-[#1C4D8D]/60">Buat undangan baru</p>
                </div>
              </div>
            </Link>

            <Link
              href="/admin/theme-backgrounds"
              className="bg-white rounded-2xl p-6 border border-[#1C4D8D]/10 hover:border-[#1C4D8D]/30 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-50 rounded-xl">
                  <Palette className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0F2854] group-hover:text-purple-600 transition-colors">Manage Themes</h3>
                  <p className="text-xs text-[#1C4D8D]/60">Kelola tema undangan</p>
                </div>
              </div>
            </Link>

            <Link
              href="/admin/ornament-library"
              className="bg-white rounded-2xl p-6 border border-[#1C4D8D]/10 hover:border-[#1C4D8D]/30 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-pink-50 rounded-xl">
                  <LayoutDashboard className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0F2854] group-hover:text-pink-600 transition-colors">Ornament Library</h3>
                  <p className="text-xs text-[#1C4D8D]/60">Kelola ornament reusable</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Clients Section */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(28,77,141,0.1)] border border-[#1C4D8D]/10 overflow-hidden">
          
          {/* Section Header */}
          <div className="p-8 border-b border-[#1C4D8D]/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
            <div>
              <h2 className="text-xl font-bold text-[#0F2854]">Recent Clients</h2>
              <p className="text-sm text-[#1C4D8D]/70 mt-1">5 klien terbaru yang mendaftar di sistem.</p>
            </div>
            
            {/* Mobile Create Button */}
            <Link
              href="/admin/create-client"
              className="md:hidden w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-[#0F2854] text-white text-sm font-bold rounded-xl active:scale-95 transition-all"
            >
              Create Client
            </Link>
          </div>

          {stats.recentClients.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center justify-center bg-[#F8FAFC]">
              <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-[#1C4D8D]/10">
                <Users className="w-10 h-10 text-[#4988C4]" />
              </div>
              <h3 className="text-xl font-bold text-[#0F2854]">Belum ada klien</h3>
              <p className="text-[#1C4D8D]/60 max-w-sm mt-2">Data klien akan muncul di sini setelah Anda membuat undangan pertama.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table - Ultra Clean */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#1C4D8D]/5 text-xs uppercase tracking-wider text-[#1C4D8D] font-bold">
                      <th className="px-8 py-5 pl-10 rounded-tl-3xl">Client Info</th>
                      <th className="px-8 py-5">Theme Config</th>
                      <th className="px-8 py-5">Created Date</th>
                      <th className="px-8 py-5 text-right rounded-tr-3xl pr-10">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1C4D8D]/5 bg-white">
                    {stats.recentClients.map((client) => {
                      const themeInfo = getThemeDisplayInfo(client);
                      return (
                        <tr key={client.id} className="group hover:bg-[#BDE8F5]/10 transition-colors duration-200">
                          <td className="px-8 py-5 pl-10">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-[#BDE8F5]/30 text-[#1C4D8D] flex items-center justify-center text-sm font-extrabold border border-[#BDE8F5] shadow-sm group-hover:bg-[#1C4D8D] group-hover:text-white transition-all duration-300">
                                {client.slug.substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-bold text-[#0F2854] capitalize text-base">{client.slug.replace('-', ' ')}</p>
                                <p className="text-xs text-[#1C4D8D]/60 font-mono mt-0.5">/{client.slug}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-10 h-10 rounded-xl shadow-sm ring-1 ring-black/5 flex-shrink-0"
                                style={{ background: `linear-gradient(135deg, ${themeInfo.color} 0%, #ffffff 150%)` }}
                              />
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-[#0F2854]">{themeInfo.display}</span>
                                <span className="text-xs text-[#1C4D8D]/70">{themeInfo.subDisplay}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex items-center text-[#1C4D8D]/80 text-sm font-medium">
                              <Calendar className="w-4 h-4 mr-2 text-[#4988C4]" />
                              {new Date(client.created_at).toLocaleDateString('id-ID', {
                                day: 'numeric', month: 'long', year: 'numeric'
                              })}
                            </div>
                          </td>
                          <td className="px-8 py-5 pr-10 text-right">
                            <Link
                              href={`/undangan/${client.slug}/admin`}
                              target="_blank"
                              className="inline-flex items-center px-5 py-2.5 bg-white border border-[#1C4D8D]/20 text-[#0F2854] text-xs font-bold rounded-xl hover:bg-[#0F2854] hover:text-white hover:border-[#0F2854] transition-all shadow-sm hover:shadow-lg hover:-translate-y-0.5"
                            >
                              Manage
                              <ExternalLink className="w-3 h-3 ml-2" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile List View - Card Style */}
              <div className="md:hidden divide-y divide-[#1C4D8D]/5 bg-[#F8FAFC]">
                {stats.recentClients.map((client) => {
                  const themeInfo = getThemeDisplayInfo(client);
                  return (
                    <div key={client.id} className="p-5">
                      <div className="bg-white rounded-[2rem] p-6 border border-[#1C4D8D]/5 shadow-sm">
                        <div className="flex justify-between items-start mb-5">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-[#BDE8F5]/30 text-[#1C4D8D] flex items-center justify-center text-base font-bold border border-[#BDE8F5]">
                              {client.slug.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="font-bold text-[#0F2854] capitalize text-lg">{client.slug.replace('-', ' ')}</h3>
                              <p className="text-xs text-[#1C4D8D]/60 flex items-center mt-1 font-mono">
                                ID: {client.id}
                              </p>
                            </div>
                          </div>
                          <Link
                            href={`/undangan/${client.slug}/admin`}
                            target="_blank"
                            className="p-3 bg-[#0F2854] rounded-xl text-white shadow-lg shadow-[#0F2854]/20 active:scale-95 transition-transform"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </Link>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#1C4D8D]/5">
                            <div className="flex items-center gap-2 mb-1">
                              <Palette className="w-3.5 h-3.5 text-[#4988C4]" />
                              <span className="text-[10px] font-bold text-[#1C4D8D] uppercase">Theme</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: themeInfo.color }} />
                              <p className="text-xs font-bold text-[#0F2854] truncate">{themeInfo.display}</p>
                            </div>
                          </div>
                          <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#1C4D8D]/5">
                            <div className="flex items-center gap-2 mb-1">
                              <Calendar className="w-3.5 h-3.5 text-[#4988C4]" />
                              <span className="text-[10px] font-bold text-[#1C4D8D] uppercase">Created</span>
                            </div>
                            <p className="text-xs font-bold text-[#0F2854]">
                              {new Date(client.created_at).toLocaleDateString('id-ID')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}