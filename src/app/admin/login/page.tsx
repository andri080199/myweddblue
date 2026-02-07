"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, Eye, EyeOff, ShieldCheck, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';

// Hardcoded credentials
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'adminadmin';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate a small delay for UX
    await new Promise(resolve => setTimeout(resolve, 800));

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Set auth in localStorage
      localStorage.setItem('admin_auth', JSON.stringify({
        isAuthenticated: true,
        username: username,
        loginTime: new Date().toISOString()
      }));

      // Use window.location for full page reload to trigger layout auth check
      window.location.href = '/admin';
      return;
    } else {
      setError('Username atau password salah');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0F2854] flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-[#BDE8F5] selection:text-[#0F2854]">
      
      {/* Animated Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#1C4D8D] rounded-full blur-[150px] opacity-40 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#4988C4] rounded-full blur-[120px] opacity-30" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05]"></div>

      <div className="relative z-10 w-full max-w-[420px] animate-in zoom-in-95 duration-500">
        
        {/* Header Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#1C4D8D] to-[#0F2854] rounded-[2rem] mb-6 shadow-[0_20px_50px_-20px_rgba(28,77,141,0.5)] border border-[#4988C4]/30 relative group transform transition-transform hover:scale-105 duration-300">
            <div className="absolute inset-0 rounded-[2rem] bg-[#4988C4] opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
            <ShieldCheck className="w-12 h-12 text-[#BDE8F5] drop-shadow-[0_0_15px_rgba(189,232,245,0.4)]" />
            <div className="absolute -top-2 -right-2 bg-[#BDE8F5] rounded-xl p-1.5 shadow-lg border-2 border-[#0F2854]">
               <Lock className="w-4 h-4 text-[#0F2854]" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Admin Portal</h1>
          <p className="text-[#BDE8F5]/60 mt-2 font-medium tracking-wide">
            Akses Terbatas - MyWeddBlue
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_70px_-10px_rgba(0,0,0,0.3)] border border-white/20 overflow-hidden">
          <div className="p-8 pt-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Error Alert */}
              {error && (
                <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 animate-in slide-in-from-top-2 shadow-sm">
                  <div className="bg-rose-100 p-1 rounded-full">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  </div>
                  <span className="text-xs font-bold">{error}</span>
                </div>
              )}

              {/* Username Field */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#1C4D8D] uppercase tracking-widest ml-1">Username</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
                    <User className="w-5 h-5 text-slate-400 group-focus-within:text-[#1C4D8D] transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan ID Admin"
                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-[#0F2854] placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#1C4D8D] focus:ring-4 focus:ring-[#BDE8F5]/40 transition-all font-medium shadow-sm hover:border-[#4988C4]/50"
                    required
                    autoFocus
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#1C4D8D] uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
                    <Lock className="w-5 h-5 text-slate-400 group-focus-within:text-[#1C4D8D] transition-colors" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi"
                    className="w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-2xl text-[#0F2854] placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#1C4D8D] focus:ring-4 focus:ring-[#BDE8F5]/40 transition-all font-medium shadow-sm hover:border-[#4988C4]/50"
                    required
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
                className="w-full py-4 mt-6 bg-[#0F2854] hover:bg-[#1C4D8D] text-white font-bold rounded-2xl shadow-lg shadow-[#0F2854]/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group relative overflow-hidden"
              >
                <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] group-hover:animate-[shine_1.5s_infinite]"></div>
                
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Memverifikasi...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk sebagai Admin</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

            </form>
          </div>
          
          {/* Bottom Decor */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#4988C4] via-[#1C4D8D] to-[#0F2854]"></div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-[#BDE8F5]/40 text-[10px] font-bold tracking-[0.2em] uppercase">
            Sistem Manajemen Pusat
          </p>
          <p className="text-[#BDE8F5]/20 text-[10px]">
            v2.5.0 Build 2024
          </p>
        </div>
      </div>
    </div>
  );
}