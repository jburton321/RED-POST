import { useRef, useCallback, useState } from 'react';
import CommandButton from './CommandButton';

const CHARS = 'ABCDEFGHIJKLMN0123456789$#@%';

const faqs = [
  {
    id: '01',
    question: 'Do I have to sign a buyer agreement to get the 5 listings?',
    answer:
      'No. Your initial access is free. However, NAR regulations require an agreement before property tours. This ensures we have a fiduciary duty to negotiate in your interest.',
  },
  {
    id: '02',
    question: 'Are these homes on Zillow?',
    answer:
      "Some are; most aren't. Our access includes developer pipelines, planning board approvals, and properties preparing for market. You're getting the first call, not the last look.",
  },
  {
    id: '03',
    question: 'I\'m moving from MA. Do you handle both states?',
    answer:
      'Yes. We specialize in "Border Economics" — helping you calculate the total cost of ownership between states based on your specific income.',
  },
];

export default function IntelFAQ() {
  const intervalsRef = useRef<Record<string, ReturnType<typeof setInterval>>>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const DEFAULT_TEXT = 'DECRYPT_ACCESS_PENDING_';

  const decrypt = useCallback((rowEl: HTMLDivElement, faqId: string, answer: string) => {
    if (intervalsRef.current[faqId]) clearInterval(intervalsRef.current[faqId]);

    const textEl = rowEl.querySelector('.scramble-text') as HTMLElement | null;
    if (!textEl) return;

    let iteration = 0;
    const step = answer.length / 20;

    intervalsRef.current[faqId] = setInterval(() => {
      textEl.innerText = answer
        .split('')
        .map((_, index) => {
          if (index < iteration) return answer[index];
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join('');

      if (iteration >= answer.length) {
        clearInterval(intervalsRef.current[faqId]);
        delete intervalsRef.current[faqId];
      }

      iteration += step;
    }, 25);
  }, []);

  const reset = useCallback((rowEl: HTMLDivElement, faqId: string) => {
    if (intervalsRef.current[faqId]) {
      clearInterval(intervalsRef.current[faqId]);
      delete intervalsRef.current[faqId];
    }

    const textEl = rowEl.querySelector('.scramble-text') as HTMLElement | null;
    if (!textEl) return;

    textEl.innerText = DEFAULT_TEXT;
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>, faqId: string, answer: string) => {
    e.preventDefault();
    const rowEl = e.currentTarget;

    if (activeId === faqId) {
      setActiveId(null);
      reset(rowEl, faqId);
    } else {
      setActiveId(faqId);
      decrypt(rowEl, faqId, answer);
    }
  }, [activeId, decrypt, reset]);

  return (
    <section id="faq" className="intel-faq-wall">
      <div className="faq-inner">
        <div className="section-header-row">
          <div className="faq-section-header">
            <span className="faq-badge">SYSTEM_STATUS // INTEL_DECODE</span>
            <h2 className="faq-title">
              Frequently Asked <span className="faq-red-weight">Questions</span>
            </h2>
          </div>
          <CommandButton />
        </div>

        <div className="faq-wall-panel">
          <div className="faq-wall-header">
            <div className="faq-header-left">
              <span className="faq-status-dot" />
              <span className="faq-label">LIVE_DECODE // 2026_CORE_INTEL</span>
            </div>
            <div className="faq-header-right">
              <span className="faq-label">ENCRYPTION_LEVEL: HIGH</span>
            </div>
          </div>

          <div className="faq-wall-grid">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="wall-row"
                onClick={(e) => handleClick(e, faq.id, faq.answer)}
                onMouseEnter={(e) => {
                  if (!('ontouchstart' in window)) {
                    decrypt(e.currentTarget, faq.id, faq.answer);
                  }
                }}
                onMouseLeave={(e) => {
                  if (!('ontouchstart' in window) && activeId !== faq.id) {
                    reset(e.currentTarget, faq.id);
                  }
                }}
              >
                <div className="row-inner">
                  <div className="q-cell">
                    <span className="row-id">{faq.id}</span>
                    <h3 className="question">{faq.question}</h3>
                  </div>
                  <div className="a-cell">
                    <p className="scramble-text">DECRYPT_ACCESS_PENDING_</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
