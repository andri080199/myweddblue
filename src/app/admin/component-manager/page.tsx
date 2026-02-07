import ComponentManager from '@/components/admin/ComponentManager';
import { Layers, Settings, Sparkles, ShieldCheck, ToggleLeft, Box } from 'lucide-react';

export default function ComponentManagerPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans selection:bg-[#BDE8F5] selection:text-[#0F2854]">
      
      {/* 1. HERO SECTION - Deep Navy Background */}
      <div className="relative pt-8 bg-[#0F2854] pb-32 sm:pb-40 overflow-hidden">
        
        {/* Abstract Background Shapes (Glows) */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-[#1C4D8D]/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-[#4988C4]/20 rounded-full blur-[80px]" />
        
        {/* Animated Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            
            {/* Title & Description */}
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C4D8D]/30 border border-[#4988C4]/30 backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5 text-[#BDE8F5]" />
                <span className="text-[10px] font-bold text-[#BDE8F5] tracking-widest uppercase">Admin Control Center</span>
              </div>
              
              <div>
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                  Component <span className="text-[#4988C4]">Manager</span>
                </h1>
                <p className="mt-4 text-lg text-[#BDE8F5]/80 font-light leading-relaxed max-w-xl">
                  Kontrol visibilitas dan konfigurasi fitur undangan untuk setiap klien secara presisi dan eksklusif.
                </p>
              </div>
            </div>

            {/* Visual Decoration (Floating Layers) */}
            <div className="hidden md:flex items-center justify-center relative group">
              <div className="absolute inset-0 bg-[#4988C4] rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 rotate-6"></div>
              
              {/* Main Icon Box */}
              <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-br from-[#0F2854] to-[#1C4D8D] border border-[#4988C4]/30 shadow-2xl flex items-center justify-center transform -rotate-6 transition-transform group-hover:-rotate-3 duration-500">
                
                {/* Inner Decor */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 rounded-3xl"></div>
                
                <Layers className="w-12 h-12 text-[#BDE8F5] drop-shadow-[0_0_15px_rgba(189,232,245,0.5)]" />
                
                {/* Floating Elements */}
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#4988C4] rounded-xl flex items-center justify-center shadow-lg animate-bounce delay-700">
                   <Settings className="w-4 h-4 text-white" />
                </div>
                <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-white text-[#0F2854] rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                   <ToggleLeft className="w-5 h-5" />
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
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white rounded-xl shadow-sm border border-[#1C4D8D]/10 text-[#1C4D8D]">
                <Box className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0F2854]">Konfigurasi Aktif</h3>
                <p className="text-xs text-[#1C4D8D]/70 font-medium">Manage modules & features</p>
              </div>
            </div>

            {/* Feature Badges */}
            <div className="flex gap-2">
              <div className="px-3 py-1.5 bg-[#0F2854]/5 rounded-lg border border-[#0F2854]/5 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#1C4D8D]" />
                <span className="text-xs font-semibold text-[#0F2854]">Auto-save Enabled</span>
              </div>
            </div>
          </div>

          {/* 3. COMPONENT INJECTION */}
          <div className="p-6 sm:p-10 min-h-[500px]">
            {/* Wrapper agar ComponentManager punya context yang bersih */}
            <div className="component-manager-wrapper">
               <ComponentManager />
            </div>
          </div>

        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center pb-8">
          <p className="text-sm text-[#1C4D8D]/60 font-medium">
            System Visibility Control • Updates reflect immediately on client side
          </p>
        </div>

      </div>
    </div>
  );
}