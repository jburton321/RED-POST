import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { submitLead } from '../lib/leadsApi';
import { PHONE_DISPLAY, PHONE_TEL } from '../lib/api';
import { formatPrice } from '../lib/listings';
import type { ListingRecord } from '../lib/listings';
import LeadFormContextListing from './LeadFormContextListing';

const HERO_CALL_HREF = `tel:${PHONE_TEL.replace(/^tel:/i, '')}`;

const SUCCESS_COPY =
  'Your submission has been received. A Red Post Realty representative will be in contact with you soon.';

interface HeroLeadFormProps {
  /** Passed to CRM / lead endpoint (e.g. hero-find-home, listing-lightbox) */
  leadSource?: string;
  /** Listing the user tapped GET_STARTED from (e.g. lightbox); shown as context card */
  contextListing?: ListingRecord | null;
}

export default function HeroLeadForm({
  leadSource = 'hero-find-home',
  contextListing = null,
}: HeroLeadFormProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !email.trim() || !agreed) {
      setError('Please complete all required fields and accept the consent terms.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const result = await submitLead({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        agreedToTerms: agreed,
        source: leadSource,
        listingId: contextListing?.id,
        listingSummary: contextListing
          ? `${contextListing.firstAddress}, ${contextListing.secondAddress} — ${formatPrice(contextListing.price)}`
          : undefined,
      });
      if (result.ok) {
        setDone(true);
      } else {
        setError(result.error ?? 'Submission failed. Please try again.');
      }
    } catch {
      setError('Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="hero-lead-panel hero-lead-panel--success">
        <p className="hero-lead-success">{SUCCESS_COPY}</p>
      </div>
    );
  }

  return (
    <div className="hero-lead-panel">
      <h2 className="hero-lead-panel-title">FIND YOUR NEW SEACOAST HOME</h2>
      <p className="hero-lead-panel-sub">Homes from $400k - $3M</p>

      {contextListing ? <LeadFormContextListing listing={contextListing} /> : null}

      <form className="hero-lead-form" onSubmit={handleSubmit} noValidate>
        <div className="hero-lead-fields">
          <label className="hero-lead-label">
            <span>First Name</span>
            <input
              className="hero-lead-input"
              name="firstName"
              autoComplete="given-name"
              value={firstName}
              onChange={(ev) => setFirstName(ev.target.value)}
              required
            />
          </label>
          <label className="hero-lead-label">
            <span>Last Name</span>
            <input
              className="hero-lead-input"
              name="lastName"
              autoComplete="family-name"
              value={lastName}
              onChange={(ev) => setLastName(ev.target.value)}
            />
          </label>
          <label className="hero-lead-label">
            <span>Email</span>
            <input
              className="hero-lead-input"
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              required
            />
          </label>
          <label className="hero-lead-label">
            <span>Phone</span>
            <input
              className="hero-lead-input"
              type="tel"
              name="phone"
              autoComplete="tel"
              value={phone}
              onChange={(ev) => setPhone(ev.target.value)}
            />
          </label>
        </div>

        <label className="hero-lead-consent">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(ev) => setAgreed(ev.target.checked)}
          />
          <span>
            By providing your email and phone number, you consent to receive marketing messages via text, email,
            or phone from Red Post Realty. See our{' '}
            <Link to="/terms-of-service">Terms and Conditions</Link> and our{' '}
            <Link to="/privacy-policy">Privacy Policy</Link>.
          </span>
        </label>

        {error && <p className="hero-lead-error">{error}</p>}

        <button type="submit" className="hero-lead-submit" disabled={submitting}>
          {submitting ? 'Sending…' : 'Submit'}
        </button>
      </form>

      <p className="hero-lead-call-prompt">
        <a href={HERO_CALL_HREF} className="hero-lead-call-link">
          Want answers now? Call us directly. {PHONE_DISPLAY}
        </a>
      </p>
    </div>
  );
}
