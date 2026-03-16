import { useRef, useEffect } from 'react';
import MultiStepForm from './MultiStepForm';
import CommandButton from './CommandButton';

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
          <div className="brand-tag">STRATEGIC ACQUISITIONS</div>
          <h1>Complete Your Profile and Get<br /><span className="text-red">5 Off-Market Listings</span></h1>
          <p className="hero-sub">Fill out your buyer profile and we'll match you with exclusive properties before they hit the open market.</p>
          <CommandButton />
        </div>

        <div id="hero-form" className="glow-card">
          <MultiStepForm />
        </div>
      </div>
    </section>
  );
}
