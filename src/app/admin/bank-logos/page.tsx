import BankLogoManager from '@/components/admin/BankLogoManager';
import { Landmark, CreditCard, ShieldCheck, Wallet, ArrowUpRight } from 'lucide-react';

export default function BankLogosPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans selection:bg-[#BDE8F5] selection:text-[#0F2854]">
      
      {/* 1. HERO SECTION - Deep Navy Background */}
      <div className="relative bg-[#0F2854] pt-12 pb-32 sm:pt-20 sm:pb-48 overflow-hidden">
        
        {/* Abstract Background Shapes (Glows) */}
        <div className="absolute top-0 left-0 -mt-20 -ml-20 w-96 h-96 bg-[#1C4D8D]/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 -mb-20 -mr-20 w-80 h-80 bg-[#4988C4]/20 rounded-full blur-[80px]" />
        
        {/* Animated Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            
            {/* Title & Description */}
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C4D8D]/30 border border-[#4988C4]/30 backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5 text-[#BDE8F5]" />
                <span className="text-[10px] font-bold text-[#BDE8F5] tracking-widest uppercase">System Configuration</span>
              </div>
              
              <div>
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                  Bank <span className="text-[#4988C4]">Logos</span>
                </h1>
                <p className="mt-4 text-lg text-[#BDE8F5]/80 font-light leading-relaxed max-w-xl">
                  Pusat pengelolaan aset identitas bank & e-wallet. Pastikan logo tampil tajam dan profesional untuk fitur Wedding Gift.
                </p>
              </div>
            </div>

            {/* Visual Decoration (Floating Cards) */}
            <div className="hidden md:block relative group">
              <div className="absolute inset-0 bg-[#4988C4] rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
              
              {/* Main Icon Box */}
              <div className="relative w-32 h-32 bg-gradient-to-br from-[#1C4D8D] to-[#0F2854] rounded-3xl shadow-2xl border border-[#4988C4]/20 flex items-center justify-center transform transition-transform duration-500 hover:scale-105 hover:rotate-3">
                <Landmark className="w-14 h-14 text-white drop-shadow-lg" />
                
                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 bg-white p-2.5 rounded-xl shadow-lg animate-bounce duration-[3000ms]">
                  <CreditCard className="w-6 h-6 text-[#1C4D8D]" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-[#4988C4] p-2.5 rounded-xl shadow-lg animate-bounce duration-[4000ms]">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT WRAPPER - Floating Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
        
        {/* The Card */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(28,77,141,0.15)] border border-[#1C4D8D]/10 backdrop-blur-sm overflow-hidden">
          
          {/* Inner Header / Toolbar */}
          <div className="px-8 py-6 border-b border-[#1C4D8D]/10 bg-[#BDE8F5]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-white rounded-xl shadow-sm border border-[#1C4D8D]/10 text-[#1C4D8D]">
                <ArrowUpRight className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0F2854]">Logo Repository</h3>
                <p className="text-xs text-[#1C4D8D]/70 font-medium">Manage master assets</p>
              </div>
            </div>

            {/* Quick Stats or Badges */}
            <div className="flex gap-2">
              <div className="px-3 py-1.5 bg-[#0F2854]/5 rounded-lg border border-[#0F2854]/5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-semibold text-[#0F2854]">Assets Active</span>
              </div>
            </div>
          </div>

          {/* 3. COMPONENT INJECTION */}
          <div className="p-6 sm:p-10 min-h-[400px]">
            {/* Wrapper ini memastikan BankLogoManager di dalamnya 
                mendapatkan context styling yang bersih. 
            */}
            <div className="bank-manager-wrapper">
               <BankLogoManager />
            </div>
          </div>

        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center flex flex-col items-center gap-1">
          <p className="text-sm text-[#1C4D8D]/60 font-medium">
            Recommended: PNG Transparent • Max Height: 100px
          </p>
          <div className="h-1 w-12 bg-[#BDE8F5] rounded-full mt-2"></div>
        </div>

      </div>
    </div>
  );
}