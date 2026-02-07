'use client';

import { useState, useEffect } from 'react';
import { Save, RotateCcw, Eye, Copy, MessageSquare, Sparkles, Check, Info, Loader2 } from 'lucide-react';
import { DEFAULT_WHATSAPP_MESSAGE, formatWhatsAppMessage } from '@/utils/whatsappTemplate';
import Image from 'next/image';

interface WhatsAppMessageEditorProps {
  clientSlug: string;
}

// Color Palette
const colors = {
  deepNavy: '#0F2854',
  mediumDarkBlue: '#1C4D8D',
  mediumLightBlue: '#4988C4',
  veryLightBlue: '#BDE8F5',
};

const WhatsAppMessageEditor = ({ clientSlug }: WhatsAppMessageEditorProps) => {
  const [messageTemplate, setMessageTemplate] = useState(DEFAULT_WHATSAPP_MESSAGE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Load existing template
  useEffect(() => {
    const loadTemplate = async () => {
      try {
        const response = await fetch(`/api/whatsapp-template?clientSlug=${clientSlug}`);
        if (response.ok) {
          const data = await response.json();
          if (data.template) {
            setMessageTemplate(data.template);
          }
        }
      } catch (error) {
        console.error('Error loading WhatsApp template:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTemplate();
  }, [clientSlug]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/whatsapp-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientSlug, template: messageTemplate }),
      });

      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error saving template:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset template ke default? Perubahan Anda akan hilang.')) {
      setMessageTemplate(DEFAULT_WHATSAPP_MESSAGE);
    }
  };

  const handleCopyTemplate = async () => {
    try {
      await navigator.clipboard.writeText(messageTemplate);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy template:', error);
    }
  };

  const previewMessage = formatWhatsAppMessage(
    messageTemplate,
    'John Doe',
    clientSlug,
    `${typeof window !== 'undefined' ? window.location.origin : ''}/undangan/${clientSlug}/john-doe`
  );

  const variables = [
    { label: 'Nama Tamu', code: '[guestName]' },
    { label: 'Slug Klien', code: '[clientSlug]' },
    { label: 'Link Undangan', code: '[invitationUrl]' },
  ];

  if (loading) {
    return (
      <div className="bg-white min-h-screen shadow-xl shadow-[#1C4D8D]/10 border border-[#1C4D8D]/10 p-12 flex flex-col items-center justify-center">
  <Loader2 className="w-10 h-10 text-[#4988C4] animate-spin mb-4" />
  <p className="text-[#1C4D8D] font-medium">Memuat template...</p>
</div>
    );
  }

  return (
    <div className="bg-white shadow-xl shadow-[#1C4D8D]/10 border border-[#1C4D8D]/80 overflow-hidden">
      
      {/* 1. Header Section */}
      <div className="p-6 sm:p-8 border-b border-[#1C4D8D]/10 bg-[#0F2854]">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20">
              <MessageSquare className="w-7 h-7 text-[#0F2854] fill-[#0F2854]" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full">
              <Sparkles className="w-3 h-3 text-[#1C4D8D]" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">WhatsApp Template</h2>
            <p className="text-sm text-white/80 font-medium mt-0.5">Kustomisasi pesan broadcast otomatis</p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-8">
        
        {/* 2. Variable Chips (Documentation) */}
        <div className="bg-[#0F2854]/70 rounded-2xl p-5 border border-[#4988C4]/20">
          <div className="flex items-center gap-2 mb-3 text-sm font-bold text-white">
            <Info className="w-4 h-4 text-white" />
            <span>Smart Variables</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {variables.map((v) => (
              <div key={v.code} className="flex items-center bg-white border border-[#1C4D8D]/10 rounded-lg px-3 py-1.5 shadow-sm group hover:border-[#4988C4] transition-colors cursor-help" title={`Gunakan ${v.code} dalam pesan`}>
                <span className="text-xs text-[#1C4D8D] mr-2 font-medium">{v.label}:</span>
                <code className="text-xs font-mono text-[#0F2854] bg-[#F8FAFC] px-1.5 py-0.5 rounded font-bold group-hover:text-[#4988C4]">
                  {v.code}
                </code>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Editor Toolbar */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-[#1C4D8D] uppercase tracking-wider">Message Content</h3>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyTemplate}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-[#1C4D8D]/10 text-[#1C4D8D] text-xs font-bold rounded-xl hover:bg-[#F8FAFC] hover:text-[#0F2854] transition-all active:scale-95"
              >
                {copySuccess ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copySuccess ? 'Copied' : 'Copy'}
              </button>
              
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-[#1C4D8D]/10 text-[#1C4D8D] text-xs font-bold rounded-xl hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>

              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all active:scale-95 ${
                  showPreview 
                    ? 'bg-[#1C4D8D] text-white shadow-lg shadow-[#1C4D8D]/20' 
                    : 'bg-white border border-[#1C4D8D]/10 text-[#1C4D8D] hover:bg-[#BDE8F5]/30'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                {showPreview ? 'Hide Preview' : 'Preview'}
              </button>
            </div>
          </div>

          {/* 4. Textarea Editor */}
          <div className="relative group">
            <textarea
              value={messageTemplate}
              onChange={(e) => setMessageTemplate(e.target.value)}
              className="w-full h-64 p-5 bg-[#F8FAFC] border-2 border-[#1C4D8D]/10 rounded-2xl focus:outline-none focus:bg-white focus:border-[#4988C4] focus:ring-4 focus:ring-[#BDE8F5]/50 transition-all resize-none font-mono text-sm text-[#0F2854] placeholder:text-[#1C4D8D]/40 leading-relaxed shadow-inner"
              placeholder="Ketik pesan undangan Anda di sini..."
              spellCheck={false}
            />
            <div className="absolute bottom-4 right-4 text-[10px] font-bold text-[#1C4D8D]/30 bg-white/50 px-2 py-1 rounded-md backdrop-blur-sm pointer-events-none">
              MARKDOWN SUPPORTED
            </div>
          </div>
        </div>

        {/* 5. Live Preview (Conditional) */}
        {showPreview && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="relative bg-[#E5DDD5] rounded-2xl p-4 sm:p-6 border border-[#1C4D8D]/10 overflow-hidden">
              {/* WhatsApp Background Pattern (Abstract CSS) */}
              <div className="absolute inset-0 opacity-10 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat" />
              
              <div className="relative max-w-sm ml-auto sm:mr-auto sm:ml-0 bg-white rounded-tr-none rounded-2xl p-3 sm:p-4 shadow-sm border border-[#1C4D8D]/5">
                <div className="text-sm text-[#111B21] whitespace-pre-wrap break-words leading-relaxed font-sans">
                  {previewMessage}
                </div>
                <div className="flex justify-end items-center gap-1 mt-1.5">
                  <span className="text-[10px] text-[#1C4D8D]/40">12:00 PM</span>
                  <Check className="w-3 h-3 text-[#53BDEB]" />
                </div>
              </div>
            </div>
            <p className="text-center text-xs text-[#1C4D8D]/60 mt-2 font-medium">
              *Tampilan simulasi (Guest: John Doe)
            </p>
          </div>
        )}

        {/* 6. Footer Action */}
        <div className="pt-4 border-t border-[#1C4D8D]/10 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm transition-all transform active:scale-95 shadow-lg ${
              saveSuccess
                ? 'bg-emerald-500 text-white shadow-emerald-200'
                : 'bg-[#0F2854] text-white hover:bg-[#1C4D8D] shadow-[#0F2854]/20'
            } ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : saveSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Tersimpan!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Simpan Template</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default WhatsAppMessageEditor;