import MusicManager from '@/components/admin/MusicManager';
import { Radio, Music, Volume2 } from 'lucide-react';

export default function MusicManagerPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans selection:bg-[#BDE8F5] selection:text-[#0F2854]">
      
      {/* 1. HERO SECTION */}
      <div className="relative pt-8 bg-[#0F2854] pb-32 sm:pb-40 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-[#1C4D8D]/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-[#4988C4]/20 rounded-full blur-[80px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C4D8D]/30 border border-[#4988C4]/30 backdrop-blur-md">
                <Radio className="w-3 h-3 text-[#BDE8F5] animate-pulse" />
                <span className="text-[10px] font-bold text-[#BDE8F5] tracking-widest uppercase">Audio Controller</span>
              </div>
              
              <div>
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                  Music <span className="text-[#4988C4]">Manager</span>
                </h1>
                <p className="mt-4 text-lg text-[#BDE8F5]/80 font-light leading-relaxed max-w-xl">
                  Orkestrasi suasana pernikahan klien Anda. Atur musik latar belakang untuk menciptakan momen yang tak terlupakan.
                </p>
              </div>
            </div>

            {/* Vinyl Animation */}
            <div className="hidden md:flex items-center justify-center relative group">
              <div className="absolute inset-0 bg-[#4988C4] rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
              <div className="relative w-32 h-32 rounded-full bg-gradient-to-tr from-[#0F2854] to-[#1C4D8D] border-4 border-[#1C4D8D] shadow-2xl flex items-center justify-center animate-[spin_10s_linear_infinite]">
                <div className="absolute inset-2 border border-white/5 rounded-full"></div>
                <div className="absolute inset-6 border border-white/5 rounded-full"></div>
                <div className="absolute inset-10 border border-white/5 rounded-full"></div>
                <Music className="w-12 h-12 text-[#BDE8F5]" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white text-[#0F2854] p-2 rounded-xl shadow-lg transform rotate-12">
                <Volume2 className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT WRAPPER - Floating Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
        
        {/* Container Putih Premium */}
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-[#0F2854]/10 border border-slate-100 overflow-hidden">
           {/* Component Injection */}
           <MusicManager />
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center px-4">
          <p className="text-xs sm:text-sm text-[#1C4D8D]/60 font-medium bg-white/50 inline-block px-4 py-2 rounded-full border border-[#1C4D8D]/10">
            Supported Formats: MP3, YouTube Audio • Max Size: 10MB (Local)
          </p>
        </div>

      </div>
    </div>
  );
}