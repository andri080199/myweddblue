'use client';
import { useState, useEffect } from "react";
import GuestBookForm from "../forms/GuestBookForm";
import ScrollReveal from "../ui/ScrollReveal";
import Image from "next/image";
import { MessageCircle, Heart, Calendar, User, Sparkles } from "lucide-react";
import EnhancedLoading from "../ui/EnhancedLoading";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useUnifiedTheme } from "@/hooks/useUnifiedTheme";
import OrnamentLayer from "../wedding/OrnamentLayer";

interface GuestEntry {
  name: string;
  message: string;
  timestamp: string;
}

interface GuestBookListProps {
  clientSlug: string;
  themeId?: string;
}

const GuestBookList = ({ clientSlug, themeId }: GuestBookListProps) => {
  const { theme } = useThemeContext();
  const { getOrnaments, getBackground } = useUnifiedTheme(themeId);
  const backgroundImage = getBackground('guestbook') || theme.images.background;
  const [entries, setEntries] = useState<GuestEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch(`/api/guestbook?clientSlug=${clientSlug}`);
        if (!response.ok) {
          throw new Error("Failed to fetch guestbook entries");
        }
        const data: GuestEntry[] = await response.json();
        setEntries(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [clientSlug]);

  // Callback untuk menambahkan entri baru
  const handleNewEntry = (newEntry: GuestEntry) => {
    setEntries((prevEntries) => [newEntry, ...prevEntries]);
  };

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center p-4">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundImage}
            alt="Background"
            fill
            style={{ objectFit: 'cover' }}
            quality={100}
            unoptimized={backgroundImage?.startsWith('data:')}
          />
        </div>

        <div className="relative z-10 bg-white/20 backdrop-blur-lg rounded-3xl border border-white/30 shadow-2xl">
          <EnhancedLoading
            message="Loading beautiful messages..."
            type="wedding"
            size="md"
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen flex items-center justify-center p-4">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundImage}
            alt="Background"
            fill
            style={{ objectFit: 'cover' }}
            quality={100}
            unoptimized={backgroundImage?.startsWith('data:')}
          />
        </div>

        <div className="relative z-10 text-center bg-red-50/80 backdrop-blur-lg rounded-3xl border border-red-200/50 p-8 shadow-2xl">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <span className="text-white text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Oops! Something went wrong</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div id="guestbook" className="relative overflow-hidden min-h-screen bg-gradient-to-br from-primary/20 via-primarylight/30 to-darkprimary/20">
      {/* Enhanced Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt="Background"
          fill
          style={{ objectFit: 'cover' }}
          quality={100}
          unoptimized={backgroundImage?.startsWith('data:')}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-4 md:p-6 lg:p-8 space-y-8">
        {/* Guest Book Form */}
        <div className="">
          <GuestBookForm onNewEntry={handleNewEntry} clientSlug={clientSlug} />
        </div>

        {/* Messages Container */}
        {entries.length === 0 ? (
          <ScrollReveal>
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl p-12 text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Sparkles 
                  className="w-8 h-8 animate-pulse" 
                  style={{
                    background: `linear-gradient(to right, ${theme.colors.gold}, ${theme.colors.accent})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                />
                <MessageCircle 
                  className="w-10 h-10" 
                  style={{
                    background: `linear-gradient(to right, ${theme.colors.gold}, ${theme.colors.accent})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                />
                <Sparkles 
                  className="w-8 h-8 animate-pulse" 
                  style={{
                    background: `linear-gradient(to right, ${theme.colors.gold}, ${theme.colors.accent})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                />
              </div>
              <h2 
                className="text-3xl md:text-4xl text-center font-bold font-lavishly mb-4 leading-relaxed"
                style={{
                  background: `linear-gradient(to right, ${theme.colors.gold}, ${theme.colors.accent})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Ucapan Doa
              </h2>
              <div 
                className="w-24 h-1 rounded-full mx-auto mb-6"
                style={{
                  background: `linear-gradient(to right, ${theme.colors.gold}80, ${theme.colors.gold}, ${theme.colors.accent}80)`
                }}
              ></div>
              <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Messages Yet</h3>
              <p className="text-gray-500">Be the first to share your beautiful wishes!</p>
            </div>
          </ScrollReveal>
        ) : (
          <ScrollReveal>
            <div className="bg-white/40 backdrop-blur-xl rounded-3xl border-2 border-white shadow-2xl overflow-hidden">
              {/* Header inside messages container */}
              <div className="text-center p-6 border-b-2 border-white/10">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <Sparkles 
                    className="w-8 h-8 animate-pulse" 
                    style={{
                      background: `linear-gradient(to right, ${theme.colors.gold}, ${theme.colors.accent})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  />
                  <MessageCircle 
                    className="w-10 h-10" 
                    style={{
                      background: `linear-gradient(to right, ${theme.colors.gold}, ${theme.colors.accent})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  />
                  <Sparkles 
                    className="w-8 h-8 animate-pulse" 
                    style={{
                      background: `linear-gradient(to right, ${theme.colors.gold}, ${theme.colors.accent})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  />
                </div>
                <h2 
                  className="text-3xl md:text-4xl text-center font-bold font-lavishly mb-2 leading-relaxed"
                  style={{
                    background: `linear-gradient(to right, ${theme.colors.gold}, ${theme.colors.accent})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Ucapan Doa
                </h2>
                <div 
                  className="w-24 h-1 rounded-full mx-auto"
                  style={{
                    background: `linear-gradient(to right, ${theme.colors.gold}80, ${theme.colors.gold}, ${theme.colors.accent}80)`
                  }}
                ></div>
              </div>
              
              {/* Custom Styled Scrollable Area */}
              <div 
                className="h-96 md:h-[500px] overflow-y-auto p-6 space-y-4 custom-scrollbar"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#d4af37 transparent'
                }}
              >
                {entries.map((entry, index) => (
                  <div
                    key={index}
                    className="group bg-white/70 backdrop-blur-sm rounded-2xl border-2 border-white shadow-lg hover:shadow-xl transition-all duration-300 p-6 hover:scale-102 hover:bg-white/50"
                  >
                    {/* Message Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-rose-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800 group-hover:text-gray-900 transition-colors text-lg">
                            {entry.name}
                          </h4>
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(entry.timestamp).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}</span>
                          </div>
                        </div>
                      </div>
                      <Heart className="w-5 h-5 text-pink-400 group-hover:text-pink-500 group-hover:scale-110 transition-all" />
                    </div>

                    {/* Message Content */}
                    <div className="relative">
                      <div className="absolute -left-2 top-0 w-1 h-full bg-gradient-to-b from-pink-400 to-rose-500 rounded-full group-hover:from-pink-500 group-hover:to-rose-600 transition-colors"></div>
                      <p className="text-gray-700 leading-relaxed pl-4 italic group-hover:text-gray-800 transition-colors font-medium">
                        "{entry.message}"
                      </p>
                    </div>

                    {/* Decorative Elements */}
                    <div className="flex justify-end mt-4 space-x-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-rose-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-2 h-2 bg-pink-300 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #d4af37, #b8941f);
          border-radius: 10px;
          border: 2px solid rgba(255, 255, 255, 0.2);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #e6c547, #d4af37);
          box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
        }
      `}</style>

      {/* Ornament Layer - Decorative elements */}
      <OrnamentLayer ornaments={getOrnaments('guestbook')} />
    </div>
  );
};

export default GuestBookList;
