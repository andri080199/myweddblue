"use client";

import React, { useState, useEffect } from "react";

interface CountdownTimerProps {
  targetDate: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex gap-8 mt-4 font-merienda">
      <div className="text-center z-10">
        <h1 className="text-2xl">{String(timeLeft.days).padStart(2, "0")}</h1>
        <h2>Day</h2>
      </div>
      <div className="text-center z-10">
        <h1 className="text-2xl">{String(timeLeft.hours).padStart(2, "0")}</h1>
        <h2>Hour</h2>
      </div>
      <div className="text-center z-10">
        <h1 className="text-2xl">{String(timeLeft.minutes).padStart(2, "0")}</h1>
        <h2>Min</h2>
      </div>
      <div className="text-center z-10">
        <h1 className="text-2xl">{String(timeLeft.seconds).padStart(2, "0")}</h1>
        <h2>Sec</h2>
      </div>
    </div>
  );
};

export default CountdownTimer;
