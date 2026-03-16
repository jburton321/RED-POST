import { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

const VIDEO_SRC = '/media/Buyers_Video_Cut_1.webm';

export default function ReverseEclipse() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const ambientRef = useRef<HTMLVideoElement>(null);
  const focusRef = useRef<HTMLVideoElement>(null);
  const scrubberRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const sync = () => {
      if (ambientRef.current && focusRef.current) {
        const diff = Math.abs(ambientRef.current.currentTime - focusRef.current.currentTime);
        if (diff > 0.15) {
          ambientRef.current.currentTime = focusRef.current.currentTime;
        }
      }
    };
    const id = setInterval(sync, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      const stage = stageRef.current;
      const portal = portalRef.current;
      if (!section || !stage || !portal) return;

      const rect = section.getBoundingClientRect();
      let p = -rect.top / window.innerHeight;
      p = Math.max(0, Math.min(1, p));

      const scale = 1 - p;
      const opacity = p > 0.85 ? 1 - (p - 0.85) / 0.15 : 1;
      portal.style.width = `${scale * 100}vw`;
      portal.style.height = `${scale * 100}vh`;
      portal.style.borderRadius = `${p * 50}px`;
      portal.style.opacity = `${opacity}`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const video = focusRef.current;
    if (!video) return;
    const onTime = () => {
      if (!isDragging && video.duration) {
        setProgress(video.currentTime / video.duration);
      }
    };
    video.addEventListener('timeupdate', onTime);
    return () => video.removeEventListener('timeupdate', onTime);
  }, [isDragging]);

  const togglePlay = () => {
    const focus = focusRef.current;
    const ambient = ambientRef.current;
    if (!focus) return;
    if (isPlaying) {
      focus.pause();
      ambient?.pause();
    } else {
      focus.play();
      ambient?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const focus = focusRef.current;
    const ambient = ambientRef.current;
    if (!focus) return;
    focus.muted = !isMuted ? true : false;
    if (ambient) ambient.muted = true;
    setIsMuted(!isMuted);
  };

  const seekTo = useCallback((clientX: number) => {
    const bar = scrubberRef.current;
    const video = focusRef.current;
    const ambient = ambientRef.current;
    if (!bar || !video || !video.duration) return;
    const rect = bar.getBoundingClientRect();
    let ratio = (clientX - rect.left) / rect.width;
    ratio = Math.max(0, Math.min(1, ratio));
    const time = ratio * video.duration;
    video.currentTime = time;
    if (ambient) ambient.currentTime = time;
    setProgress(ratio);
  }, []);

  const onScrubDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    seekTo(e.clientX);

    const onMove = (ev: MouseEvent) => seekTo(ev.clientX);
    const onUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    seekTo(e.touches[0].clientX);

    const onMove = (ev: TouchEvent) => seekTo(ev.touches[0].clientX);
    const onEnd = () => {
      setIsDragging(false);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
    };
    window.addEventListener('touchmove', onMove);
    window.addEventListener('touchend', onEnd);
  };

  return (
    <section className="reverse-eclipse-section" ref={sectionRef}>
      <div className="eclipse-sticky-stage" ref={stageRef}>
        <div className="eclipse-ambient-mask">
          <div className="eclipse-yt-wrap">
            <video
              ref={ambientRef}
              autoPlay
              muted
              loop
              playsInline
              src={VIDEO_SRC}
            />
          </div>
          <div className="eclipse-glass-blur" />
        </div>

        <div className="eclipse-shrink-portal" ref={portalRef}>
          <div className="eclipse-yt-wrap">
            <video
              ref={focusRef}
              autoPlay
              muted
              loop
              playsInline
              src={VIDEO_SRC}
            />
          </div>
        </div>

        <div className="eclipse-header-layer">
          <div className="eclipse-tag">INSIDER ACCESS</div>
          <h2 className="eclipse-headline">
            SEACOAST <span className="text-red">PERSPECTIVE.</span>
          </h2>
          <p className="eclipse-sub-copy">
            ACTIVE SURVEILLANCE // SECTOR: [43.0718&deg; N, 70.7626&deg; W]
          </p>

          <div className="eclipse-controls">
            <button
              className="eclipse-ctrl-btn"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>

            <div
              className="eclipse-scrubber"
              ref={scrubberRef}
              onMouseDown={onScrubDown}
              onTouchStart={onTouchStart}
            >
              <div className="eclipse-scrubber-track">
                <div
                  className="eclipse-scrubber-fill"
                  style={{ width: `${progress * 100}%` }}
                />
                <div
                  className="eclipse-scrubber-thumb"
                  style={{ left: `${progress * 100}%` }}
                />
              </div>
            </div>

            <button
              className="eclipse-ctrl-btn"
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
