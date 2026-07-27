import { useState, useEffect } from 'react';

const CountdownTimer = ({ examDate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    if (!examDate) return;

    const target = new Date(examDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft({ days, hours, minutes });
    }, 1000);

    return () => clearInterval(interval);
  }, [examDate]);

  if (!examDate) {
    return (
      <div className="p-6 bg-[hsl(var(--card))] border border-[hsl(var(--foreground))/10] rounded-xl text-center">
        <h3 className="text-lg font-semibold mb-2">Exam Date Not Set</h3>
        <button className="px-4 py-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-lg hover:opacity-90 transition-opacity">
          Set Exam Date
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[hsl(var(--card))] border border-[hsl(var(--foreground))/10] rounded-xl flex flex-col items-center justify-center">
      <h3 className="text-lg font-semibold mb-4 opacity-80">Time Until Exam</h3>
      <div className="flex gap-4 text-center">
        <div className="flex flex-col">
          <span className="text-3xl font-bold text-[hsl(var(--primary))]">{timeLeft.days}</span>
          <span className="text-xs uppercase tracking-wider opacity-70">Days</span>
        </div>
        <span className="text-3xl font-bold opacity-30">:</span>
        <div className="flex flex-col">
          <span className="text-3xl font-bold text-[hsl(var(--primary))]">{timeLeft.hours}</span>
          <span className="text-xs uppercase tracking-wider opacity-70">Hours</span>
        </div>
        <span className="text-3xl font-bold opacity-30">:</span>
        <div className="flex flex-col">
          <span className="text-3xl font-bold text-[hsl(var(--primary))]">{timeLeft.minutes}</span>
          <span className="text-xs uppercase tracking-wider opacity-70">Mins</span>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
