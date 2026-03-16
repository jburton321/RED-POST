import { useState, useEffect, useRef } from 'react';

const STATS = [
  { endVal: 2500, prefix: '', suffix: '+', lbl: 'RELOCATIONS' },
  { endVal: 780, prefix: '$', suffix: 'M', lbl: 'VOLUME' },
  { endVal: 5.0, prefix: '', suffix: '', lbl: 'RATING', star: true, decimal: true },
  { endVal: 3, prefix: '', suffix: '-STATE', lbl: 'LICENSURE' },
];

function useCountUp(end: number, duration: number, start: boolean, decimal?: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = decimal ? parseFloat((easeOut * end).toFixed(1)) : Math.floor(easeOut * end);
      setCount(current);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, start, decimal]);

  return count;
}

function StatItem({ stat, inView, delay }: { stat: typeof STATS[0]; inView: boolean; delay: number }) {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const count = useCountUp(stat.endVal, 2000, shouldAnimate, stat.decimal);

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => setShouldAnimate(true), delay);
      return () => clearTimeout(timer);
    }
  }, [inView, delay]);

  const displayValue = stat.decimal ? count.toFixed(1) : count.toLocaleString();

  return (
    <div className="stats-counter-item">
      <span className="stats-counter-val">
        {stat.prefix}{displayValue}{stat.suffix}
        {stat.star && <span className="stats-star">&#9733;</span>}
      </span>
      <span className="stats-counter-lbl">{stat.lbl}</span>
    </div>
  );
}

export default function StatsCounter() {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="stats-counter-section" ref={sectionRef}>
      <div className="stats-inner">
      <div className="stats-counter-grid">
        {STATS.map((stat, index) => (
          <StatItem key={index} stat={stat} inView={inView} delay={index * 150} />
        ))}
      </div>
      </div>
    </section>
  );
}
