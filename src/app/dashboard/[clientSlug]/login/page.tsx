"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Lock, Eye, EyeOff, Heart, AlertCircle, User, Loader2, ShieldCheck, ArrowRight } from 'lucide-react';

// Color Palette Reference
// deepNavy: '#0F2854'
// mediumDarkBlue: '#1C4D8D'
// mediumLightBlue: '#4988C4'
// veryLightBlue: '#BDE8F5'

export default function ClientLoginPage() {
  const params = useParams();
  const clientSlug = params?.clientSlug as string;

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [clientExists, setClientExists] = useState<boolean | null>(null);
  const [checkingClient, setCheckingClient] = useState(true);

  // Check if client exists on mount
  useEffect(() => {
    const checkClient = async () => {
      try {
        const res = await fetch(`/api/client-auth?slug=${clientSlug}`);
        const data = await res.json();
        setClientExists(data.exists === true);
      } catch {
        setClientExists(false);
      } finally {
        setCheckingClient(false);
      }
    };

    if (clientSlug) {
      checkClient();
    }
  }, [clientSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/client-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: clientSlug, password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem(`client_auth_${clientSlug}`, JSON.stringify({
          isAuthenticated: true,
          slug: clientSlug,
          loginTime: new Date().toISOString()
        }));
        window.location.href = `/dashboard/${clientSlug}`;
      } else {
        setError(data.message || 'Kata sandi tidak valid');
      }
    } catch {
      setError('Terjadi kesalahan koneksi. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // Loading State
  if (checkingClient) {
    return (
      <div className="min-h-screen bg-[#0F2854] flex items-center justify-center relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        
        <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500 relative z-10">
          <div className="w-20 h-20 rounded-[2rem] bg-white flex items-center justify-center shadow-[0_0_40px_rgba(189,232,245,0.2)]">
             <Loader2 className="w-10 h-10 text-[#1C4D8D] animate-spin" />
          </div>
          <p className="text-white/80 text-sm font-medium tracking-[0.2em] uppercase">Memverifikasi...</p>
        </div>
      </div>
    );
  }

  // Client Not Found
  if (clientExists === false) {
    return (
      <div className="min-h-screen bg-[#0F2854] flex items-center justify-center p-4 relative overflow-hidden font-sans">
        <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full text-center shadow-2xl relative z-10 animate-in slide-in-from-bottom-4 duration-500">
          <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-12 h-12 text-rose-500" />
          </div>
          <h1 className="text-2xl font-black text-[#0F2854] mb-3">Klien Tidak Ditemukan</h1>
          <p className="text-slate-500 leading-relaxed mb-6">
            Kami tidak dapat menemukan data untuk slug <br/>
            <span className="font-bold text-[#1C4D8D] bg-blue-50 px-3 py-1 rounded-full text-sm mt-2 inline-block">{clientSlug}</span>
          </p>
          <div className="border-t border-slate-100 pt-6">
             <p className="text-xs text-slate-400">Silakan periksa kembali URL Anda.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F2854] flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-[#BDE8F5] selection:text-[#0F2854]">
      
      {/* 1. Animated Background Elements (Abstract Premium) */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#1C4D8D] rounded-full blur-[150px] opacity-40 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#4988C4] rounded-full blur-[120px] opacity-30" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05]"></div>

      <div className="relative z-10 w-full max-w-[420px] animate-in zoom-in-95 duration-500">
        
        {/* 2. Login Card - Bright & Clean */}
        <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_70px_-10px_rgba(0,0,0,0.3)] border border-white/20 overflow-hidden">
          
          {/* Header Image/Icon */}
          <div className="pt-10 pb-2 text-center relative">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#F8FAFC] to-white rounded-3xl mb-4 shadow-lg shadow-slate-200 border border-slate-100 group transform transition-transform hover:scale-105 duration-300">
              <Heart className="w-10 h-10 text-[#1C4D8D] fill-[#1C4D8D]/10 drop-shadow-sm" />
              <div className="absolute -bottom-2 -right-2 bg-[#0F2854] rounded-xl p-2 shadow-md border-2 border-white">
                 <ShieldCheck className="w-4 h-4 text-[#BDE8F5]" />
              </div>
            </div>
            <h1 className="text-2xl font-black text-[#0F2854] tracking-tight">Selamat Datang</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Masuk ke Dashboard Klien</p>
          </div>

          <div className="p-8 pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Error Alert */}
              {error && (
                <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 animate-in slide-in-from-top-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-xs font-bold">{error}</span>
                </div>
              )}

              {/* Username Field (Read-only) */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#1C4D8D] uppercase tracking-widest ml-1">ID Klien</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-slate-400 group-focus-within:text-[#1C4D8D] transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={clientSlug}
                    readOnly
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-500 font-mono text-sm cursor-not-allowed focus:outline-none shadow-inner"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-100/50 rounded-lg border border-emerald-100">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-[10px] font-bold text-emerald-600 uppercase">Aktif</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#1C4D8D] uppercase tracking-widest ml-1">Kata Sandi</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
                    <Lock className="w-5 h-5 text-slate-400 group-focus-within:text-[#1C4D8D] transition-colors" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kode akses..."
                    className="w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-2xl text-[#0F2854] placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#1C4D8D] focus:ring-4 focus:ring-[#BDE8F5]/40 transition-all font-medium shadow-sm hover:border-[#4988C4]/50"
                    required
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-[#1C4D8D] transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-4 bg-[#0F2854] hover:bg-[#1C4D8D] text-white font-bold rounded-2xl shadow-lg shadow-[#0F2854]/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group relative overflow-hidden"
              >
                {/* Button Shine Effect */}
                <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] group-hover:animate-[shine_1.5s_infinite]"></div>
                
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk Dashboard</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

            </form>
          </div>
          
          {/* Bottom Decor */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#0F2854] via-[#1C4D8D] to-[#4988C4]"></div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-[#BDE8F5]/40 text-xs font-medium tracking-widest uppercase">
            Protected by MyWeddBlue Security
          </p>
        </div>
      </div>
    </div>
  );
}