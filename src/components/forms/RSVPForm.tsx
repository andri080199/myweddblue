'use client';
import { useState, useEffect } from "react";
import Image from "next/image";
import ScrollReveal from "../ui/ScrollReveal";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useUnifiedTheme } from "@/hooks/useUnifiedTheme";
import OrnamentLayer from "../wedding/OrnamentLayer";

interface RSVPFormProps {
  clientSlug: string;
  themeId?: string;
}

const RSVPForm: React.FC<RSVPFormProps> = ({ clientSlug, themeId }) => {
  const { theme } = useThemeContext();
  const { getOrnaments, getBackground } = useUnifiedTheme(themeId);
  const backgroundImage = getBackground('rsvp') || theme.images.background;
  const [name, setName] = useState<string>("");
  const [isAttending, setIsAttending] = useState<boolean | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [hasRSVPed, setHasRSVPed] = useState<boolean>(false);

  useEffect(() => {
    const hasRSVP = localStorage.getItem("hasRSVPed");
    if (hasRSVP === "true") {
      setHasRSVPed(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || isAttending === null) {
      setStatusMessage("Silakan isi nama dan status kehadiran.");
      return;
    }

    try {
      const response = await fetch(`/api/rsvp?clientSlug=${clientSlug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, isAttending }),
      });

      if (response.ok) {
        localStorage.setItem("hasRSVPed", "true");
        setHasRSVPed(true);
        setName("");
        setIsAttending(null);
      } else {
        const data = await response.json();
        setStatusMessage(`Error: ${data.message}`);
      }
    } catch {
      setStatusMessage("Terjadi kesalahan. Coba lagi nanti.");
    }
  };

  return (
    <div id="rsvp" className="relative min-h-screen flex items-center justify-center py-8 md:py-12 lg:py-16 px-4 md:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-primary/20 via-primarylight/30 to-darkprimary/20">
      {/* Enhanced Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt="RSVP Background"
          fill
          style={{ objectFit: 'cover' }}
          quality={100}
          unoptimized={backgroundImage?.startsWith('data:')}
        />
      </div>

      <ScrollReveal>
        <div className="w-full max-w-md md:max-w-lg lg:max-w-xl mx-auto relative z-10">
          {/* Modern Card Container */}
          <div className="bg-primarylight opacity-90 rounded-3xl border-2 border-darkprimary shadow-lg shadow-darkprimary p-6 md:p-8 lg:p-10 overflow-hidden relative">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 opacity-40 pointer-events-none">
              <div className="absolute top-4 right-4 animate-bounce delay-1000">
                <span className="text-4xl text-darkprimary">♥</span>
              </div>
              <div className="absolute top-8 left-6 animate-pulse">
                <span className="text-3xl text-darkprimary">★</span>
              </div>
              <div className="absolute bottom-6 right-8 animate-bounce" style={{animationDelay: '0.5s'}}>
                <span className="text-2xl text-darkprimary">✦</span>
              </div>
              <div className="absolute bottom-4 left-4 animate-pulse" style={{animationDelay: '0.8s'}}>
                <span className="text-3xl text-darkprimary">♡</span>
              </div>
              <div className="absolute top-1/2 right-2 animate-bounce" style={{animationDelay: '1s'}}>
                <span className="text-xl text-darkprimary">✧</span>
              </div>
            </div>

            {/* Header Section */}
            <div className="text-center mb-6 md:mb-8 relative z-10">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    background: `linear-gradient(to right, ${theme.colors.gold}, ${theme.colors.accent}CC)`
                  }}
                >
                  <span className="text-primary text-sm">★</span>
                </div>
                <h2 
                  className="text-2xl md:text-3xl lg:text-4xl font-lavishly font-bold drop-shadow-lg px-2"
                  style={{ 
                    lineHeight: '1.6', 
                    paddingBottom: '0.25rem',
                    paddingTop: '0.125rem',
                    minWidth: '200px',
                    textAlign: 'center',
                    background: `linear-gradient(to right, ${theme.colors.gold}, ${theme.colors.accent})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Wedding RSVP
                </h2>
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    background: `linear-gradient(to right, ${theme.colors.gold}CC, ${theme.colors.accent})`
                  }}
                >
                  <span className="text-white text-sm">♥</span>
                </div>
              </div>
              <div 
                className="w-24 h-1 rounded-full mx-auto mb-4"
                style={{
                  background: `linear-gradient(to right, ${theme.colors.gold}80, ${theme.colors.gold}, ${theme.colors.accent}80)`
                }}
              ></div>
              <p className="text-sm md:text-base font-merienda text-darkprimary leading-relaxed px-2">
                Bantu kami untuk mempersiapkan segalanya lebih baik dengan mengisi form kehadiran di bawah ini.
              </p>
            </div>

            {/* Content Section */}
            <div className="relative z-10">
              {hasRSVPed ? (
                <div className="text-center bg-primary/20 backdrop-blur-sm rounded-2xl border border-darkprimary p-4 md:p-4">
                  <div className="w-8 h-8 bg-darkprimary rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <span className="text-sm text-primarylight">✓</span>
                  </div>
                  <p className="text-center font-bold text-darkprimary font-merienda text-md">
                    Terima kasih! Kamu sudah mengisi RSVP. ♡
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Input */}
                  <div className="group">
                    <label htmlFor="name" className="block text-sm md:text-base font-semibold text-darkprimary mb-2 font-merienda">
                      Nama Kamu
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 md:p-4 bg-primarylight backdrop-blur-sm border-2 border-darkprimary rounded-2xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-darkprimary text-darkprimary font-medium transition-all duration-300 placeholder:text-darkprimary"
                        placeholder="Masukkan nama lengkap kamu"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>

                  {/* Attendance Selection */}
                  <div>
                    <p className="text-sm md:text-base font-semibold text-darkprimary mb-4 font-merienda">
                      Apakah kamu akan hadir?
                    </p>
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                      <button
                        type="button"
                        onClick={() => setIsAttending(true)}
                        className={`group relative py-2 md:py-4 px-4 md:px-6 rounded-2xl border-2 font-semibold font-merienda transition-all duration-300 transform hover:scale-105 ${
                          isAttending === true 
                            ? "bg-gradient-to-r from-primary to-darkprimary text-primarylight border-transparent shadow-lg" 
                            : "bg-primarylight backdrop-blur-sm text-darkprimary border-darkprimary hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-sm">✓</span>
                          <span className="text-sm">Ya, Hadir</span>
                        </div>
                        {isAttending === true && (
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-darkprimary/20 rounded-xl animate-pulse"></div>
                        )}
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setIsAttending(false)}
                        className={`group relative py-3 md:py-4 px-4 md:px-6 rounded-2xl border-2 font-semibold font-merienda transition-all duration-300 transform hover:scale-105 ${
                          isAttending === false 
                            ? "bg-gradient-to-r from-primary to-darkprimary text-primarylight border-transparent shadow-xl" 
                            : "bg-primarylight backdrop-blur-sm text-darkprimary border-darkprimary hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-sm">✗</span>
                          <span className="text-sm">Tidak Hadir</span>
                        </div>
                        {isAttending === false && (
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-darkprimary/20 rounded-xl animate-pulse"></div>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full group relative py-2 md:py-4 px-6 bg-gradient-to-r from-darkprimary to-primary text-primarylight rounded-xl font-bold text-sm font-merienda transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-darkprimary overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-darkprimary opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center justify-center space-x-2">
                      <span className="">♦</span>
                      <span className="">Konfirmasi Kehadiran</span>
                    </div>
                  </button>
                </form>
              )}

              {statusMessage && !hasRSVPed && (
                <div className="mt-6 text-center bg-red-50/80 backdrop-blur-sm rounded-xl border border-red-200 p-4">
                  <p className="text-sm md:text-sm font-merienda text-red-600 font-medium">{statusMessage}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Ornament Layer - Decorative elements */}
      <OrnamentLayer ornaments={getOrnaments('rsvp')} />
    </div>
  );
};

export default RSVPForm;
