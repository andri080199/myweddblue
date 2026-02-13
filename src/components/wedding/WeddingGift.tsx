import React, { useState, useEffect } from "react";
import DynamicBankCard from "../cards/DynamicBankCard";
import Image from "next/image";
import ScrollReveal from "../ui/ScrollReveal";
import Gift from "../interactive/Gift";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useUnifiedTheme } from "@/hooks/useUnifiedTheme";
import OrnamentLayer from "./OrnamentLayer";

interface WeddingGiftProps {
  clientSlug: string;
  themeId?: string;
}

const WeddingGift: React.FC<WeddingGiftProps> = ({ clientSlug, themeId }) => {
  const { theme } = useThemeContext();
  const { getOrnaments, getBackground } = useUnifiedTheme(themeId);
  const backgroundImage = getBackground('gift') || theme.images.background;
  const [giftData, setGiftData] = useState<any>(null);
  const [addressData, setAddressData] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [giftVisibility, setGiftVisibility] = useState<any>({
    showSecondBank: true,
    showGiftAddress: true
  });
  const [loading, setLoading] = useState(true);

  // --- DATA FETCHING (SAMA SEPERTI SEBELUMNYA) ---
  useEffect(() => {
    // For preview mode or no clientSlug, use default data
    if (!clientSlug || clientSlug === 'preview') {
      setGiftData({
        bankType1: 'BRI',
        accountNumber: '2838131',
        accountName: 'Mempelai Pria',
        bankType2: 'Dana',
        accountNumber2: '0852-7960-0131',
        accountName2: 'Mempelai Wanita'
      });
      setAddressData({
        address: 'Jl. DR. Sumarno No 1 (Sentra Primer), Penggilingan, Cakung, Jakarta Timur.'
      });
      setSettings({
        showWeddingGift: true,
        showBankCards: true,
        showGiftAddress: true
      });
      setGiftVisibility({
        showSecondBank: true,
        showGiftAddress: true
      });
      setLoading(false);
    } else {
      fetchGiftData();
      fetchAddressData();
      fetchSettings();
      fetchGiftVisibility();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientSlug]);

  const fetchGiftData = async () => {
    try {
      const response = await fetch(`/api/client-content?clientSlug=${clientSlug}&contentType=wedding_gift`);
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0 && data[0].content_data) {
          setGiftData(data[0].content_data);
        } else {
          setGiftData({
            bankType1: 'BRI',
            accountNumber: '2838131',
            accountName: 'Mempelai Pria',
            bankType2: 'Dana',
            accountNumber2: '0852-7960-0131',
            accountName2: 'Mempelai Wanita'
          });
        }
      }
    } catch (error) {
      console.error('Error fetching gift data:', error);
      setGiftData({
        bankType1: 'BRI',
        accountNumber: '2838131',
        accountName: 'Mempelai Pria',
        bankType2: 'Dana',
        accountNumber2: '0852-7960-0131',
        accountName2: 'Mempelai Wanita'
      });
    }
  };

  const fetchAddressData = async () => {
    try {
      const response = await fetch(`/api/client-content?clientSlug=${clientSlug}&contentType=gift_address`);
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0 && data[0].content_data) {
          setAddressData(data[0].content_data);
        } else {
          setAddressData({
            title: 'Kirim Hadiah Langsung',
            address: 'Jl. DR. Sumarno No 1 (Sentra Primer), Penggilingan, Cakung, Jakarta Timur.',
            recipientName: 'Keluarga Mempelai',
            phoneNumber: '081234567890',
            note: 'Harap hubungi nomor telepon terlebih dahulu'
          });
        }
      }
    } catch (error) {
      console.error('Error fetching address data:', error);
      setAddressData({
        address: 'Jl. DR. Sumarno No 1 (Sentra Primer), Penggilingan, Cakung, Jakarta Timur.'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch(`/api/client-content?clientSlug=${clientSlug}&contentType=component_settings`);
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0 && data[0].content_data) {
          const settingsData = data[0].content_data;
          setSettings({
            showWeddingGift: settingsData.showWeddingGift === 'true' || settingsData.showWeddingGift === true,
            showBankCards: settingsData.showBankCards === 'true' || settingsData.showBankCards === true,
            showGiftAddress: settingsData.showGiftAddress === 'true' || settingsData.showGiftAddress === true
          });
        } else {
          setSettings({
            showWeddingGift: true,
            showBankCards: true,
            showGiftAddress: true
          });
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      setSettings({
        showWeddingGift: true,
        showBankCards: true,
        showGiftAddress: true
      });
    }
  };

  const fetchGiftVisibility = async () => {
    try {
      const response = await fetch(`/api/client-content?clientSlug=${clientSlug}&contentType=gift_visibility`);
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0 && data[0].content_data) {
          const visibilityData = data[0].content_data;
          setGiftVisibility({
            showSecondBank: visibilityData.showSecondBank !== false,
            showGiftAddress: visibilityData.showGiftAddress !== false
          });
        }
      }
    } catch (error) {
      console.error('Error fetching gift visibility:', error);
    }
  };

  if (loading) {
    return (
      <div id="wedding-gift" className="relative px-8 bg-primarylight z-10 overflow-hidden pb-12 h-screen flex items-center justify-center">
        <div className="bg-gradient-to-r from-gold to-accent bg-clip-text text-transparent">Loading...</div>
      </div>
    );
  }

  if (!settings?.showWeddingGift) {
    return null;
  }

  return (
    // FIX BACKGROUND: Hapus 'bg-primarylight' solid di sini. Gunakan relative.
    <div id="wedding-gift" className="relative px-8 py-16 z-10 overflow-hidden min-h-screen flex flex-col items-center">
      
      {/* LAYER 1: BACKGROUND IMAGE */}
      <div className="absolute inset-0 -z-20">
        <Image
          src={backgroundImage}
          alt="Wedding Background"
          fill
          style={{ objectFit: 'cover' }}
          quality={100}
          priority
          unoptimized={backgroundImage?.startsWith('data:')}
        />
      </div>

      {/* LAYER 2: COLOR OVERLAY (Dengan Opacity agar gambar belakang terlihat) */}
      {/* bg-primarylight/90 artinya background color dengan opacity 90% */}
      <div className="absolute inset-0 bg-primarylight/90 -z-10"></div>

      {/* --- CONTENT SECTION --- */}
      
      {/* 1. JUDUL & DESKRIPSI (Satu ScrollReveal Group) */}
      <ScrollReveal>
        <div className="text-center mx-auto max-w-2xl relative mb-10">
          
          {/* BRUSH BACKGROUND (Absolute di belakang teks) */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[160%] z-0 pointer-events-none opacity-90"
            style={{
              backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`
                <svg viewBox="0 0 400 150" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="brushGradientGiftFinal" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stop-color="white" stop-opacity="0.95" />
                      <stop offset="50%" stop-color="white" stop-opacity="1" />
                      <stop offset="100%" stop-color="white" stop-opacity="0.95" />
                    </linearGradient>
                    <filter id="roughPaperGiftFinal">
                      <feTurbulence baseFrequency="0.02" numOctaves="3" result="noise" type="fractalNoise" />
                      <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" />
                    </filter>
                  </defs>
                  <path 
                    d="M10,60 Q50,10 150,20 Q250,30 380,50 Q410,90 350,130 Q250,140 150,130 Q50,120 -10,90 Z" 
                    fill="url(#brushGradientGiftFinal)"
                    filter="url(#roughPaperGiftFinal)"
                  />
                </svg>
              `)}")`,
              backgroundSize: '100% 100%',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.05))'
            }}
          ></div>

          {/* TEKS (Di atas brush) */}
          <div className="relative z-10 px-4">
            <h1 className="font-fleur text-5xl md:text-6xl bg-gradient-to-r from-gold to-accent bg-clip-text text-transparent font-bold mb-4 leading-relaxed drop-shadow-sm pb-2">
              Wedding Gift
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-gold/50 via-gold to-gold/50 mx-auto rounded-full mb-6"></div>
            
            <p className="text-center font-merienda text-textprimary text-sm md:text-base leading-loose">
              Doa Restu Anda merupakan karunia yang sangat berarti bagi kami. Dan jika
              memberi adalah ungkapan tanda kasih, Anda dapat memberi kado secara cashless.
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* 2. BANK CARDS (Satu ScrollReveal Group untuk container kartu) */}
      {settings?.showBankCards && (
        <ScrollReveal>
          <div className="w-full flex flex-col items-center space-y-6 mb-10">
            {/* First Bank */}
            {giftData?.bankType1 && giftData?.accountNumber && (
              <DynamicBankCard
                bankType={giftData.bankType1}
                accountNumber={giftData.accountNumber}
                accountName={giftData.accountName || ''}
              />
            )}

            {/* Second Bank */}
            {giftVisibility.showSecondBank && giftData?.bankType2 && giftData?.accountNumber2 && (
              <DynamicBankCard
                bankType={giftData.bankType2}
                accountNumber={giftData.accountNumber2}
                accountName={giftData.accountName2 || ''}
              />
            )}
          </div>
        </ScrollReveal>
      )}

      {/* 3. GIFT ADDRESS (Satu ScrollReveal Group) */}
      {settings?.showGiftAddress && giftVisibility.showGiftAddress && (
        <ScrollReveal>
          <div className="w-full max-w-lg mt-4">
             <Gift giftData={addressData} />
          </div>
        </ScrollReveal>
      )}

      {/* Ornament Layer - Decorative elements */}
      <OrnamentLayer ornaments={getOrnaments('wedding-gift')} />
    </div>
  );
};

export default WeddingGift;