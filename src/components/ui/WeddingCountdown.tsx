import React, { useState, useEffect, useRef } from 'react';
import ScrollReveal from './ScrollReveal';

interface WeddingCountdownProps {
  clientSlug?: string;
}

interface ReceptionData {
  weddingDate: string;
  resepsiTime: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface FlipCardProps {
  currentValue: string;
  previousValue: string;
  label: string;
}

// Animated Flip Card Component
const FlipCard: React.FC<FlipCardProps> = ({ currentValue, previousValue, label }) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [displayValue, setDisplayValue] = useState(currentValue);

  useEffect(() => {
    if (currentValue !== previousValue && previousValue !== '') {
      setIsFlipping(true);
      // Change the display value halfway through the animation
      setTimeout(() => {
        setDisplayValue(currentValue);
      }, 150);
      // Reset flip state
      setTimeout(() => {
        setIsFlipping(false);
      }, 300);
    } else {
      setDisplayValue(currentValue);
    }
  }, [currentValue, previousValue]);

  return (
    <div className="relative">
      {/* Flip Card Container */}
      <div className="relative w-full h-16 md:h-20 lg:h-16">
        {/* Background Card with Animation */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-darkprimary via-primary to-darkprimary rounded-xl shadow-2xl border border-primarylight transition-all duration-300"
          style={{
            transform: isFlipping ? 'scaleY(0.8) rotateX(10deg)' : 'scaleY(1) rotateX(0deg)',
            transformOrigin: 'center',
          }}
        >
          {/* Inner Shadow */}
          <div className="absolute inset-1 bg-gradient-to-b from-black/20 to-transparent rounded-lg"></div>
          {/* Highlight */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-t-xl"></div>
          
          {/* Content */}
          <div className="flex flex-col items-center justify-center h-full text-center relative z-10">
            <div 
              className="text-primarylight font-bold text-xl md:text-2xl lg:text-xl font-merienda leading-none drop-shadow-lg transition-all duration-300"
              style={{
                transform: isFlipping ? 'scale(1.1)' : 'scale(1)',
                opacity: isFlipping ? '0.8' : '1',
              }}
            >
              {displayValue}
            </div>
            <div className="text-primarylight text-xs md:text-sm lg:text-xs font-merienda mt-1 opacity-90">
              {label}
            </div>
          </div>
        </div>

        {/* Bounce Effect */}
        {isFlipping && (
          <div className="absolute inset-0 bg-gradient-to-b from-gold/30 to-accent/30 rounded-xl animate-ping"></div>
        )}
      </div>

      {/* Pulsing Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-gold/20 to-accent/20 rounded-xl blur-sm animate-pulse opacity-50"></div>
    </div>
  );
};

const WeddingCountdown: React.FC<WeddingCountdownProps> = ({ clientSlug }) => {
  const [receptionData, setReceptionData] = useState<ReceptionData | null>(null);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [previousTimeLeft, setPreviousTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  // Fetch reception data
  useEffect(() => {
    const fetchReceptionData = async () => {
      if (!clientSlug) return;
      
      try {
        const response = await fetch(`/api/client-content?clientSlug=${clientSlug}&contentType=resepsi_info`);
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0 && data[0].content_data) {
            setReceptionData(data[0].content_data);
          }
        }
      } catch (error) {
        console.error('Error fetching reception data:', error);
      }
    };

    fetchReceptionData();
  }, [clientSlug]);

  // Calculate countdown
  useEffect(() => {
    if (!receptionData?.weddingDate || !receptionData?.resepsiTime) return;

    const calculateTimeLeft = () => {
      const weddingDateTime = new Date(`${receptionData.weddingDate}T${receptionData.resepsiTime}:00`);
      const now = new Date();
      const difference = weddingDateTime.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        const newTimeLeft = { days, hours, minutes, seconds };
        
        // Store previous values for animation
        setPreviousTimeLeft(timeLeft);
        setTimeLeft(newTimeLeft);
        setIsExpired(false);
      } else {
        setIsExpired(true);
        setPreviousTimeLeft(timeLeft);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft(); // Calculate immediately

    return () => clearInterval(timer);
  }, [receptionData]);

  return (
    <div className="w-full mx-auto">
        <ScrollReveal>
        <div className="w-full">
          {/* Countdown Timer */}
          {!isExpired ? (
            <div className="grid grid-cols-4 gap-2 md:gap-3">
              <FlipCard
                currentValue={timeLeft.days.toString().padStart(2, '0')}
                previousValue={previousTimeLeft.days.toString().padStart(2, '0')}
                label="Hari"
              />
              <FlipCard
                currentValue={timeLeft.hours.toString().padStart(2, '0')}
                previousValue={previousTimeLeft.hours.toString().padStart(2, '0')}
                label="Jam"
              />
              <FlipCard
                currentValue={timeLeft.minutes.toString().padStart(2, '0')}
                previousValue={previousTimeLeft.minutes.toString().padStart(2, '0')}
                label="Menit"
              />
              <FlipCard
                currentValue={timeLeft.seconds.toString().padStart(2, '0')}
                previousValue={previousTimeLeft.seconds.toString().padStart(2, '0')}
                label="Detik"
              />
            </div>
          ) : (
            <div className="text-center">
              <div className="bg-gradient-to-r from-gold to-accent text-white px-8 py-4 rounded-2xl shadow-lg">
                <p className="font-bold font-merienda text-xl">🎉 Hari Bahagia Telah Tiba! 🎉</p>
              </div>
            </div>
          )}
        </div>
        </ScrollReveal>
    </div>
  );
};

export default WeddingCountdown;