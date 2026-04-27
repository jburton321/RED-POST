import { useRef, useEffect } from 'react';
import HeroLeadForm from './HeroLeadForm';
import HeroListingStrip from './HeroListingStrip';

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.playsInline = true;
    video.loop = true;
    video.src = '/media/HERO-VID.mp4';
    video.load();
    video.play().catch(() => {});
  }, []);

  return (
    <section className="hero">
      <video
        ref={videoRef}
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      <div className="hero-overlay"></div>

      <div className="hero-content">
        <div className="hero-text-block">
          <h1>
            Get Active Seacoast Open House Listings
            <br />
            <sup className="hero-h1-sup">Plus Early Access to 5 Off-Market Homes</sup>
          </h1>
        </div>

        <div id="hero-form" className="glow-card glow-card--hero-form">
          <HeroLeadForm />
        </div>
      </div>

      <HeroListingStrip />
    </section>
  );
}
