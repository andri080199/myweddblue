import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useMusicContext } from '@/contexts/MusicContext';
import '../../styles/animations.css';

interface MusicCircleProps {
  clientSlug?: string;
  weddingImage?: string;
}

const MusicCircle: React.FC<MusicCircleProps> = ({ clientSlug, weddingImage }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [musicUrl, setMusicUrl] = useState('/audio/andmesh.mp3'); // Default music
  const [showMusicPlayer, setShowMusicPlayer] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);
  const { shouldAutoPlay, resetAutoPlay } = useMusicContext();
  const pathname = usePathname();
  const isDashboard = pathname?.includes('/dashboard');
  const isUndangan = pathname?.includes('/undangan');

  // Load music settings from admin if clientSlug is provided
  useEffect(() => {
    const loadMusicSettings = async () => {
      if (clientSlug) {
        try {
          const response = await fetch(`/api/client-content?clientSlug=${clientSlug}&contentType=music_settings`);
          if (response.ok) {
            const data = await response.json();
            if (data.length > 0 && data[0].content_data) {
              const settings = data[0].content_data;
              setMusicUrl(settings.musicUrl || '/audio/andmesh.mp3');
              setShowMusicPlayer(settings.showMusicPlayer !== false);
            }
          }
        } catch (error) {
          console.error('Error loading music settings:', error);
        }
      }
    };

    loadMusicSettings();
  }, [clientSlug]);

  // Function to safely play audio
  const safePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return false;

    try {
      // Wait for any pending play to resolve/reject first
      if (playPromiseRef.current) {
        try {
          await playPromiseRef.current;
        } catch {
          // Ignore errors from previous play attempts
        }
      }

      // Check if audio is ready
      if (audio.readyState < 2) {
        // Wait for audio to be ready
        await new Promise<void>((resolve, reject) => {
          const onCanPlay = () => {
            audio.removeEventListener('canplay', onCanPlay);
            audio.removeEventListener('error', onError);
            resolve();
          };
          const onError = () => {
            audio.removeEventListener('canplay', onCanPlay);
            audio.removeEventListener('error', onError);
            reject(new Error('Audio failed to load'));
          };
          audio.addEventListener('canplay', onCanPlay);
          audio.addEventListener('error', onError);
        });
      }

      playPromiseRef.current = audio.play();
      await playPromiseRef.current;
      playPromiseRef.current = null;
      return true;
    } catch (error) {
      playPromiseRef.current = null;
      // Only log if it's not an abort error (which is expected when pausing quickly)
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Audio play error:', error);
      }
      return false;
    }
  };

  // Function to safely pause audio
  const safePause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    // If there's a pending play, it will be aborted by pause
    audio.pause();
    setIsPlaying(false);
  };

  // Function to toggle play/pause
  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    // Pause should ALWAYS work, regardless of loading state
    if (isPlaying || !audio.paused) {
      audio.pause();
      setIsPlaying(false);
      setIsLoading(false);
      return;
    }

    // Only block play when loading
    if (isLoading) return;

    setIsLoading(true);
    const success = await safePlay();
    setIsLoading(false);
    if (success) {
      setIsPlaying(true);
    }
  };

  // Handle audio source changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Reset states when music URL changes
    setIsPlaying(false);
    setIsLoading(false);
    playPromiseRef.current = null;

    // Force reload the audio element with new source
    audio.load();
  }, [musicUrl]);

  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => {
      setIsPlaying(true);
      setIsLoading(false);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      // For looped audio, this shouldn't fire, but handle it just in case
      setIsPlaying(false);
    };

    const handleError = () => {
      setIsPlaying(false);
      setIsLoading(false);
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  // Handle auto-play trigger from context
  const hasAutoPlayedRef = useRef(false);

  useEffect(() => {
    // Only auto-play once per mount, and only if not already playing
    if (shouldAutoPlay && audioRef.current && !isPlaying && !isLoading && !hasAutoPlayedRef.current) {
      hasAutoPlayedRef.current = true;

      const playMusic = async () => {
        setIsLoading(true);
        const success = await safePlay();
        setIsLoading(false);

        if (success) {
          setIsPlaying(true);
        }
        resetAutoPlay(); // Reset the trigger regardless of success
      };

      playMusic();
    }
  }, [shouldAutoPlay, isPlaying, isLoading, resetAutoPlay]);

  // Don't show if disabled by admin
  if (!showMusicPlayer) {
    return null;
  }

  // Position classes - different positioning for dashboard and invitation
  const getPositionClasses = () => {
    if (isDashboard) {
      return 'dashboard-music-circle';
    }
    if (isUndangan) {
      // Desktop: right side within 1/3 panel
      // Tablet/Mobile: right side of screen
      return 'right-4 lg:right-4';
    }
    return 'lg:right-1/3 lg:mr-4 md:mr-4 md:right-1/4 right-4';
  };

  const positionClasses = getPositionClasses();

  return (
    <div
      ref={circleRef}
      className={`fixed top-3/4 ${positionClasses} z-40 w-12 h-12 rounded-full shadow-md shadow-darkprimary cursor-pointer ${
        isPlaying ? 'slow-spin' : 'pause-spin'
      } ${isLoading ? 'opacity-70' : ''}`}
      onClick={togglePlayPause}
      role="button"
      aria-label={isPlaying ? 'Pause music' : 'Play music'}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          togglePlayPause();
        }
      }}
    >
      <div
        className={`relative w-full h-full rounded-full pointer-events-none ${
          isPlaying ? '' : 'brightness-50' // Apply darker effect when paused
        }`}
      >
        <Image
          src={weddingImage || "/images/WeddingBG.jpg"}
          alt="Music Icon"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          priority
          className="rounded-full"
        />

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
            <svg className="w-4 h-4 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}

        {/* Play button - always visible when paused */}
        {!isLoading && !isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
            <svg className="w-5 h-5 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        )}

        {/* Pause button - only on hover when playing */}
        {!isLoading && isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
          </div>
        )}
      </div>
      <audio
        ref={audioRef}
        src={musicUrl}
        loop
        preload="auto"
        playsInline
      />
    </div>
  );
};

export default MusicCircle;