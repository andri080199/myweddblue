'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  ChevronDown, Check, Settings2, Save, 
  Search, Sliders, Layers, Power, RefreshCw 
} from 'lucide-react';

interface Client {
  id: number;
  name: string;
  slug: string;
  email: string;
}

interface ComponentSettings {
  clientSlug: string;
  components: {
    [key: string]: boolean;
  };
}

const defaultComponents = {
  showFullScreenImage: true,
  showKutipanAyat: true,
  showWelcome: true,
  showLoveStory: true,
  showTimeline: true,
  showWeddingEvent: true,
  showAkadInfo: true,
  showResepsiInfo: true,
  showWeddingGift: true,
  showBankCards: true,
  showGiftAddress: true,
  showGallery: true,
  showRSVP: true,
  showGuestBook: true,
  showFooter: true,
  showNavbar: true,
  showMusic: true,
};

const componentLabels: Record<string, { label: string; description: string }> = {
  showFullScreenImage: { label: 'Hero Cover', description: 'Gambar layar penuh saat undangan dibuka' },
  showKutipanAyat: { label: 'Kutipan Ayat', description: 'Ayat suci atau quotes pembuka' },
  showWelcome: { label: 'Welcome Section', description: 'Salam pembuka dan profil singkat' },
  showLoveStory: { label: 'Love Story', description: 'Cerita perjalanan cinta pasangan' },
  showTimeline: { label: 'Timeline', description: 'Urutan waktu momen penting' },
  showWeddingEvent: { label: 'Wedding Event', description: 'Informasi utama acara pernikahan' },
  showAkadInfo: { label: 'Akad Nikah', description: 'Detail waktu dan lokasi akad' },
  showResepsiInfo: { label: 'Resepsi', description: 'Detail waktu dan lokasi resepsi' },
  showWeddingGift: { label: 'Wedding Gift', description: 'Bagian amplop digital dan kado' },
  showBankCards: { label: 'Bank Info', description: 'Nomor rekening bank/e-wallet' },
  showGiftAddress: { label: 'Gift Address', description: 'Alamat pengiriman kado fisik' },
  showGallery: { label: 'Photo Gallery', description: 'Koleksi foto prewedding/momen' },
  showRSVP: { label: 'RSVP Form', description: 'Formulir konfirmasi kehadiran' },
  showGuestBook: { label: 'Guest Book', description: 'Ucapan dan doa dari tamu' },
  showFooter: { label: 'Footer Area', description: 'Bagian penutup halaman' },
  showNavbar: { label: 'Navigation Bar', description: 'Menu navigasi (floating/fixed)' },
  showMusic: { label: 'Backsound', description: 'Musik latar otomatis' },
};

const ComponentManager: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [settings, setSettings] = useState<ComponentSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [clientDropdownOpen, setClientDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const clientDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchClients();
  }, []);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (clientDropdownRef.current && !clientDropdownRef.current.contains(event.target as Node)) {
        setClientDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (selectedClient) {
      fetchComponentSettings(selectedClient);
    }
  }, [selectedClient]);

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients');
      if (response.ok) {
        const data = await response.json();
        setClients(data);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleSelectClient = (clientSlug: string) => {
    setSelectedClient(clientSlug);
    setClientDropdownOpen(false);
    setSearchTerm('');
  };

  const fetchComponentSettings = async (clientSlug: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/client-content?clientSlug=${clientSlug}&contentType=component_settings`);
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0 && data[0].content_data) {
          const savedSettings = data[0].content_data;
          const convertedComponents: any = {};
          Object.keys(defaultComponents).forEach(key => {
            const value = savedSettings[key];
            convertedComponents[key] = value === 'true' || value === true;
          });
          setSettings({
            clientSlug,
            components: { ...defaultComponents, ...convertedComponents }
          });
        } else {
          setSettings({ clientSlug, components: defaultComponents });
        }
      }
    } catch (error) {
      console.error('Error fetching component settings:', error);
      setSettings({ clientSlug, components: defaultComponents });
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (componentKey: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      components: {
        ...settings.components,
        [componentKey]: !settings.components[componentKey]
      }
    });
  };

  const handleSaveSettings = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const response = await fetch('/api/client-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientSlug: settings.clientSlug,
          contentType: 'component_settings',
          contentData: settings.components
        }),
      });
      if (response.ok) {
        alert('Pengaturan berhasil disimpan!'); 
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const toggleAllComponents = (enable: boolean) => {
    if (!settings) return;
    const updatedComponents: any = {};
    Object.keys(settings.components).forEach(key => {
      updatedComponents[key] = enable;
    });
    setSettings({ ...settings, components: updatedComponents });
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    // Wrapper dengan shadow halus warna Medium Dark Blue
    <div className="bg-white rounded-[2rem] shadow-xl shadow-[#1C4D8D]/10 border border-[#1C4D8D]/10 overflow-hidden">
      
      {/* 1. Header Section - Background Deep Navy sangat transparan */}
      <div className="bg-[#0F2854]/5 p-6 sm:p-8 border-b border-[#1C4D8D]/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            {/* Icon Box */}
            <div className="p-3 bg-white rounded-2xl shadow-sm border border-[#1C4D8D]/20 text-[#1C4D8D]">
              <Settings2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#0F2854] tracking-tight">Component Settings</h3>
              <p className="text-sm text-[#1C4D8D]/80 font-medium">Configure visibility per client</p>
            </div>
          </div>
        </div>

        {/* Client Selector Dropdown */}
        <div className="relative z-20" ref={clientDropdownRef}>
          <button
            type="button"
            onClick={() => setClientDropdownOpen(!clientDropdownOpen)}
            className="w-full sm:max-w-md p-2 pl-4 pr-3 bg-white border border-[#1C4D8D]/20 rounded-xl shadow-sm hover:border-[#4988C4] focus:ring-4 focus:ring-[#BDE8F5] transition-all flex items-center justify-between group outline-none"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                selectedClient 
                  ? 'bg-[#1C4D8D] text-white' 
                  : 'bg-[#4988C4]/20 text-[#1C4D8D]'
              }`}>
                {selectedClient ? clients.find(c => c.slug === selectedClient)?.name.charAt(0).toUpperCase() : '?'}
              </div>
              <div className="text-left truncate">
                <div className={`text-sm font-semibold truncate ${selectedClient ? 'text-[#0F2854]' : 'text-[#4988C4]'}`}>
                  {selectedClient ? clients.find(c => c.slug === selectedClient)?.name : 'Select Client...'}
                </div>
                {selectedClient && <div className="text-xs text-[#1C4D8D]/70 font-mono">@{selectedClient}</div>}
              </div>
            </div>
            <div className="p-1.5 bg-[#0F2854]/5 rounded-lg group-hover:bg-[#1C4D8D] group-hover:text-white transition-colors text-[#1C4D8D]">
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${clientDropdownOpen ? 'rotate-180' : ''}`} />
            </div>
          </button>

          {/* Dropdown Menu */}
          {clientDropdownOpen && (
            <div className="absolute top-full left-0 w-full sm:w-[400px] mt-2 bg-white border border-[#1C4D8D]/10 rounded-2xl shadow-2xl shadow-[#1C4D8D]/20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-3 border-b border-[#1C4D8D]/10 sticky top-0 bg-white z-10">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4988C4]" />
                  <input
                    type="text"
                    placeholder="Search client..."
                    className="w-full pl-9 pr-4 py-2 bg-[#0F2854]/5 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#4988C4]/30 text-[#0F2854] placeholder:text-[#1C4D8D]/50"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>
              <div className="max-h-[300px] overflow-y-auto p-2 space-y-1 custom-scrollbar">
                {filteredClients.map((client) => (
                  <button
                    key={client.slug}
                    onClick={() => handleSelectClient(client.slug)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                      selectedClient === client.slug 
                        ? 'bg-[#BDE8F5]/50 text-[#0F2854]' 
                        : 'hover:bg-[#0F2854]/5 text-[#1C4D8D]'
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                        selectedClient === client.slug 
                          ? 'bg-[#1C4D8D] text-white' 
                          : 'bg-[#4988C4]/20 text-[#1C4D8D]'
                      }`}>
                        {client.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="truncate">
                        <div className="text-sm font-semibold truncate">{client.name}</div>
                        <div className="text-xs opacity-70 truncate">@{client.slug}</div>
                      </div>
                    </div>
                    {selectedClient === client.slug && <Check className="w-4 h-4 text-[#1C4D8D]" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Content Area */}
      <div className="bg-white min-h-[400px]">
        {selectedClient ? (
          <>
            {loading ? (
              <div className="h-[400px] flex flex-col items-center justify-center gap-3">
                <RefreshCw className="w-8 h-8 animate-spin text-[#4988C4]" />
                <p className="text-sm font-medium animate-pulse text-[#1C4D8D]">Loading configuration...</p>
              </div>
            ) : settings ? (
              <div className="p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-300">
                
                {/* Bulk Actions Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8 p-4 bg-[#0F2854]/5 rounded-2xl border border-[#1C4D8D]/10">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#0F2854]">
                    <Sliders className="w-4 h-4 text-[#4988C4]" />
                    <span>Quick Actions</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleAllComponents(true)}
                      className="px-4 py-2 bg-white border border-emerald-200 hover:bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg shadow-sm transition-all active:scale-95"
                    >
                      Enable All
                    </button>
                    <button
                      onClick={() => toggleAllComponents(false)}
                      className="px-4 py-2 bg-white border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-bold rounded-lg shadow-sm transition-all active:scale-95"
                    >
                      Disable All
                    </button>
                  </div>
                </div>

                {/* Grid Components - THE MAIN CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(componentLabels).map(([key, config]) => {
                    const isActive = (settings.components as any)[key];
                    return (
                      <div 
                        key={key} 
                        onClick={() => handleToggle(key)}
                        className={`group relative p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer overflow-hidden ${
                          isActive 
                            ? 'border-[#4988C4] bg-[#BDE8F5]/30 hover:border-[#1C4D8D] hover:shadow-md shadow-[#4988C4]/10' 
                            : 'border-[#1C4D8D]/10 bg-white hover:border-[#4988C4]/50 hover:bg-[#0F2854]/5'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3 relative z-10">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Layers className={`w-3.5 h-3.5 ${isActive ? 'text-[#1C4D8D]' : 'text-[#4988C4]'}`} />
                              <h4 className={`text-sm font-bold ${isActive ? 'text-[#0F2854]' : 'text-[#1C4D8D]'}`}>
                                {config.label}
                              </h4>
                            </div>
                            <p className={`text-xs font-medium leading-relaxed ${isActive ? 'text-[#1C4D8D]/80' : 'text-[#1C4D8D]/70'}`}>
                              {config.description}
                            </p>
                          </div>
                          
                          {/* Custom Toggle using new colors */}
                          <div className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 flex items-center ${
                            isActive ? 'bg-[#1C4D8D]' : 'bg-[#4988C4]/30'
                          }`}>
                            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${
                              isActive ? 'translate-x-4' : 'translate-x-0'
                            }`} />
                          </div>
                        </div>
                        
                        {/* Status Indicator Bar at bottom */}
                        <div className={`absolute bottom-0 left-0 right-0 h-1 transition-colors duration-300 ${
                          isActive ? 'bg-[#1C4D8D]' : 'bg-transparent'
                        }`} />
                      </div>
                    );
                  })}
                </div>

                {/* Save Footer */}
                <div className="sticky bottom-0 mt-8 pt-4 pb-0 bg-white/80 backdrop-blur-sm border-t border-[#1C4D8D]/10 flex justify-end z-10">
                  <button
                    onClick={handleSaveSettings}
                    disabled={saving}
                    className="flex items-center gap-2 px-8 py-3 bg-[#1C4D8D] hover:bg-[#0F2854] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#1C4D8D]/30 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? 'Saving Changes...' : 'Save Configuration'}
                  </button>
                </div>

              </div>
            ) : null}
          </>
        ) : (
          // Empty State
          <div className="h-[400px] flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 bg-[#BDE8F5]/30 rounded-3xl flex items-center justify-center mb-4">
              <Power className="w-10 h-10 text-[#1C4D8D]" />
            </div>
            <h4 className="text-lg font-bold text-[#0F2854]">No Client Selected</h4>
            <p className="text-sm max-w-xs mt-2 text-[#1C4D8D]/70">Please select a client from the dropdown above to start managing their components.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComponentManager;