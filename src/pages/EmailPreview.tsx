import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Monitor,
  Tablet,
  Smartphone,
  Check,
  Loader2,
  FileArchive,
  Code2,
  Maximize2,
} from 'lucide-react';
import JSZip from 'jszip';

type Viewport = 'desktop' | 'tablet' | 'mobile';

const VIEWPORT_WIDTHS: Record<Viewport, number> = {
  desktop: 660,
  tablet: 480,
  mobile: 375,
};

export default function EmailPreview() {
  const [emailHtml, setEmailHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [viewport, setViewport] = useState<Viewport>('desktop');
  const [iframeHeight, setIframeHeight] = useState(800);
  const [zipping, setZipping] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    fetch('/email-template.html')
      .then(res => res.text())
      .then(html => {
        setEmailHtml(html);
        setLoading(false);
      });
  }, []);

  const syncHeight = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentDocument?.body) return;
    const h = iframe.contentDocument.body.scrollHeight;
    if (h > 0) setIframeHeight(h + 40);
  }, []);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !emailHtml) return;
    const onLoad = () => {
      syncHeight();
      const timer = setTimeout(syncHeight, 500);
      return () => clearTimeout(timer);
    };
    iframe.addEventListener('load', onLoad);
    return () => iframe.removeEventListener('load', onLoad);
  }, [emailHtml, viewport, syncHeight]);

  const handleDownload = async () => {
    setZipping(true);
    try {
      const zip = new JSZip();
      const imgFolder = zip.folder('images')!;

      const srcRegex = /src=["'](\/?images\/[^"']+)["']/g;
      const imagePaths = new Set<string>();
      let match: RegExpExecArray | null;
      while ((match = srcRegex.exec(emailHtml)) !== null) {
        imagePaths.add(match[1].replace(/^\//, ''));
      }

      let rewrittenHtml = emailHtml;

      await Promise.all(
        Array.from(imagePaths).map(async (path) => {
          try {
            const res = await fetch(`/${path}`);
            if (!res.ok) return;
            const blob = await res.blob();
            const filename = path.split('/').pop()!;
            imgFolder.file(filename, blob);
            rewrittenHtml = rewrittenHtml.replaceAll(
              `/${path}`,
              `images/${filename}`
            );
            rewrittenHtml = rewrittenHtml.replaceAll(
              `${path}`,
              `images/${filename}`
            );
          } catch {
            // skip unreachable assets
          }
        })
      );

      zip.file('email-template.html', rewrittenHtml);

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'red-post-realty-email.zip';
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setZipping(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(emailHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenTab = () => {
    const blob = new Blob([emailHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const viewports: { key: Viewport; icon: typeof Monitor; label: string }[] = [
    { key: 'desktop', icon: Monitor, label: 'Desktop' },
    { key: 'tablet', icon: Tablet, label: 'Tablet' },
    { key: 'mobile', icon: Smartphone, label: 'Mobile' },
  ];

  return (
    <div className="ep-root">
      <div className="ep-bar">
        <div className="ep-bar-left">
          <Link to="/" className="ep-back">
            <ArrowLeft size={16} />
            <span>Back</span>
          </Link>
          <div className="ep-bar-divider" />
          <h1 className="ep-title">Email Template Preview</h1>
        </div>

        <div className="ep-bar-center">
          {viewports.map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setViewport(key)}
              className={`ep-vp-btn ${viewport === key ? 'ep-vp-btn--active' : ''}`}
              title={label}
            >
              <Icon size={16} />
              <span className="ep-vp-label">{label}</span>
            </button>
          ))}
        </div>

        <div className="ep-bar-right" />
      </div>

      <div className="ep-ctrl-bar">
        <div className="ep-ctrl-inner">
          <div className="ep-ctrl-meta">
            <span className="ep-ctrl-badge">HTML</span>
            <span className="ep-ctrl-dim">{VIEWPORT_WIDTHS[viewport]}px</span>
          </div>

          <div className="ep-ctrl-actions">
            <button
              onClick={handleDownload}
              className="ep-ctrl-btn ep-ctrl-btn--download"
              disabled={zipping}
            >
              <span className="ep-ctrl-btn-icon">
                {zipping ? <Loader2 size={15} className="animate-spin" /> : <FileArchive size={15} />}
              </span>
              <span className="ep-ctrl-btn-text">
                {zipping ? 'Packaging...' : 'Download Email'}
              </span>
            </button>

            <div className="ep-ctrl-sep" />

            <div className="ep-ctrl-copy-wrap">
              <button
                onClick={handleCopy}
                className={`ep-ctrl-btn ep-ctrl-btn--copy ${copied ? 'ep-ctrl-btn--copied' : ''}`}
              >
                <span className="ep-ctrl-btn-icon">
                  {copied ? <Check size={15} /> : <Code2 size={15} />}
                </span>
                <span className="ep-ctrl-btn-text">
                  {copied ? 'Copied!' : 'Copy Code'}
                </span>
              </button>
              {copied && (
                <span className="ep-ctrl-tooltip">
                  Copied to clipboard
                </span>
              )}
            </div>

            <div className="ep-ctrl-sep" />

            <button
              onClick={handleOpenTab}
              className="ep-ctrl-btn ep-ctrl-btn--open"
            >
              <span className="ep-ctrl-btn-icon">
                <Maximize2 size={15} />
              </span>
              <span className="ep-ctrl-btn-text">Open in New Tab</span>
            </button>
          </div>
        </div>
      </div>

      <div className="ep-canvas">
        {loading ? (
          <div className="ep-loading">
            <div className="ep-spinner" />
            <p>Loading template...</p>
          </div>
        ) : (
          <div
            className="ep-frame-wrap"
            style={{ width: VIEWPORT_WIDTHS[viewport] }}
          >
            <iframe
              ref={iframeRef}
              srcDoc={emailHtml}
              title="Email Preview"
              className="ep-iframe"
              style={{ height: iframeHeight }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
