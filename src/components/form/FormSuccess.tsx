import { useState, useEffect } from 'react';
import { CheckCircle, Clock, FileSearch, Bell, Phone } from 'lucide-react';
import { PHONE_DISPLAY, PHONE_TEL } from '../../lib/api';

interface FormSuccessProps {
  firstName: string;
}

const TIMELINE = [
  {
    icon: FileSearch,
    label: 'Profile Received',
    desc: 'Your criteria have been logged into our system.',
    delay: 0,
  },
  {
    icon: Clock,
    label: 'Matching In Progress',
    desc: 'Cross-referencing MLS, off-market, and pre-market data.',
    delay: 150,
  },
  {
    icon: Bell,
    label: 'Report Delivered',
    desc: 'Expect your personalized 5-listing briefing within 24 hrs.',
    delay: 300,
  },
];

export default function FormSuccess({ firstName }: FormSuccessProps) {
  const [entered, setEntered] = useState(false);
  const [stepsVisible, setStepsVisible] = useState<boolean[]>([false, false, false]);

  useEffect(() => {
    requestAnimationFrame(() => setEntered(true));
    TIMELINE.forEach((_, i) => {
      setTimeout(() => {
        setStepsVisible(prev => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, 600 + TIMELINE[i].delay);
    });
  }, []);

  return (
    <div className="form-success-screen">
      <div className={`form-success-badge${entered ? ' form-success-badge--in' : ''}`}>
        <CheckCircle size={32} strokeWidth={1.8} />
      </div>

      <span className="access-label" style={{ marginBottom: 12 }}>
        SUBMISSION_CONFIRMED // ACTIVE
      </span>

      <h2 className="form-success-headline">
        {firstName ? `${firstName}, You're` : "You're"} <span className="form-success-red">In.</span>
      </h2>

      <p className="form-success-sub">
        Your buyer profile is now in our system. Here's what happens next:
      </p>

      <div className="form-success-timeline">
        {TIMELINE.map((step, i) => {
          const Icon = step.icon;
          return (
            <div
              key={step.label}
              className={`form-success-step${stepsVisible[i] ? ' form-success-step--in' : ''}`}
            >
              <div className="form-success-step-icon">
                <Icon size={18} strokeWidth={2} />
              </div>
              <div className="form-success-step-connector" />
              <div className="form-success-step-content">
                <span className="form-success-step-label">{step.label}</span>
                <p className="form-success-step-desc">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {PHONE_TEL ? (
        <div className="form-success-call">
          <span className="form-success-call-label">Want answers now? Call us directly.</span>
          <a href={`tel:${PHONE_TEL}`} className="form-success-call-btn">
            <Phone size={16} strokeWidth={2.2} />
            <span>{PHONE_DISPLAY || PHONE_TEL}</span>
          </a>
        </div>
      ) : null}

      <div className="form-success-footer">
        <a href="https://apps.apple.com/us/app/red-post-realty/id6479816941?l=es-MX" target="_blank" rel="noopener noreferrer" className="form-success-app-link">
          Download our app for real-time alerts
          <Bell size={14} strokeWidth={2.2} />
        </a>
      </div>
    </div>
  );
}
