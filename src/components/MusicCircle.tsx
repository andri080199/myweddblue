import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import '../styles/animations.css';

const MusicCircle: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioReady, setIsAudioReady] = useState(false); // Track if the audio is ready
  const audioRef = useRef<HTMLAudioElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);

  // Function to toggle play/pause
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  useEffect(() => {
    if (!isAudioReady) {
      // Wait for user interaction to start playing
      const playAudioOnUserInteraction = () => {
        if (audioRef.current) {
          audioRef.current.play().then(() => {
            setIsPlaying(true);
            setIsAudioReady(true); // Audio is ready
          }).catch((err) => {
            console.error('Audio play error:', err);
          });
        }
      };

      // Attach click event listener to allow auto play on first interaction
      document.body.addEventListener('click', playAudioOnUserInteraction, { once: true });

      return () => {
        document.body.removeEventListener('click', playAudioOnUserInteraction);
      };
    }
  }, [isAudioReady]);

  return (
    <div
      ref={circleRef}
      className={`fixed top-3/4 lg:right-1/3 lg:mr-4 md:mr-4 md:right-1/4 right-4 z-40 w-12 h-12 rounded-full shadow-md shadow-darkprimary ${
        isPlaying ? 'slow-spin' : 'pause-spin'
      }`}
      onClick={togglePlayPause}
    >
      <div
        className={`relative w-full h-full rounded-full ${
          isPlaying ? '' : 'brightness-50' // Apply darker effect when paused
        }`}
      >
        <Image
          src="/images/WeddingBG.jpg"
          alt="Music Icon"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          priority
          className="rounded-full cursor-pointer"
        />
      </div>
      <audio ref={audioRef} src="/audio/andmesh.mp3" />
    </div>
  );
};

export default MusicCircle;
