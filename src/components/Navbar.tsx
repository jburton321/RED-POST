import { useState, useEffect, useCallback } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import CommandButton from './CommandButton';

const NAV_LINKS = [
  { label: 'Listings', href: '#inventory', image: '/images/Portsmouth.png', tag: 'ACTIVE PROPERTIES' },
  { label: 'Calculator', href: '#calculator', image: '/images/Newburyport.png', tag: 'ACQUISITION TOOLS' },
  { label: 'Areas', href: '#service-areas', image: '/images/Rye.png', tag: 'SERVICE REGIONS' },
  { label: 'Relocation', href: '#relocation', image: '/images/York.png', tag: 'INTEL BRIEFING' },
  { label: 'Reviews', href: '#reviews', image: '/images/Kittery.png', tag: 'FIELD REPORTS' },
  { label: 'FAQ', href: '#faq', image: '/images/Dover.png', tag: 'MISSION SUPPORT' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [linksVisible, setLinksVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
      const t = setTimeout(() => setLinksVisible(true), 80);
      return () => clearTimeout(t);
    } else {
      document.body.style.overflow = '';
      setLinksVisible(false);
      setActiveIndex(null);
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      const offset = 80;
      const y = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, []);

  const scrollToTop = () => {
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <nav className={`site-nav ${scrolled ? 'site-nav--solid' : ''}`}>
        <div className="nav-inner">
          <button className="nav-logo-btn" onClick={scrollToTop} aria-label="Scroll to top">
            <img src="/images/Logo-Light-8.png" alt="Logo" className="nav-logo" />
          </button>

          <div className="nav-links-desktop">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link"
                onClick={(e) => handleClick(e, link.href)}
              >
                {link.label}
              </a>
            ))}
          </div>

          <button
            className="nav-mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      <div className={`mob-menu ${mobileOpen ? 'mob-menu--open' : ''}`}>
        {NAV_LINKS.map((link, i) => (
          <div
            key={link.href}
            className={`mob-menu-bg ${activeIndex === i ? 'mob-menu-bg--active' : ''}`}
            style={{ backgroundImage: `url(${link.image})` }}
          />
        ))}
        <div className="mob-menu-bg mob-menu-bg--default" style={{
          backgroundImage: `url(/images/Newburyport.png)`,
          opacity: activeIndex === null && mobileOpen ? 0.35 : 0,
        }} />

        <div className="mob-menu-grain" />
        <div className="mob-menu-vignette" />

        <div className="mob-menu-content">
          <div className="mob-menu-header">
            <img src="/images/Logo-Light-8.png" alt="Logo" className="mob-menu-logo" />
            <button
              className="mob-menu-close"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          <div className="mob-menu-links">
            {NAV_LINKS.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                className={`mob-link ${linksVisible ? 'mob-link--visible' : ''} ${activeIndex === i ? 'mob-link--active' : ''}`}
                style={{ transitionDelay: linksVisible ? `${i * 70 + 120}ms` : '0ms' }}
                onClick={(e) => handleClick(e, link.href)}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
                onTouchStart={() => setActiveIndex(i)}
              >
                <span className="mob-link-num">0{i + 1}</span>
                <span className="mob-link-label">{link.label}</span>
                <span className="mob-link-tag">{link.tag}</span>
                <ArrowUpRight size={16} className="mob-link-arrow" />
              </a>
            ))}
          </div>

          <div className={`mob-menu-footer ${linksVisible ? 'mob-menu-footer--visible' : ''}`}>
            <CommandButton
              onClick={() => {
                setMobileOpen(false);
                const el = document.getElementById('hero-form');
                if (el) {
                  const y = el.getBoundingClientRect().top + window.scrollY - 80;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }
              }}
              className="mob-footer-cmd"
            />
            <p className="mob-footer-tag">SEACOAST INTELLIGENCE HQ</p>
          </div>
        </div>

        <div className="mob-menu-scanline" />
      </div>
    </>
  );
}
