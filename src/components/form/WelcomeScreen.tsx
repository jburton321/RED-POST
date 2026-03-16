import CTAButton from '../CTAButton';

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="form-entry-screen">
      <span className="access-label">PRIVILEGED ACCESS // 2026 MARKET DATA</span>

      <h2 className="entry-headline">
        The Seacoast's Best Homes{' '}
        <span className="entry-red-text">Aren't on <span className="marker-strike">ZILLOW</span> Yet.</span>
      </h2>

      <p className="entry-sub">
        Complete Your Profile and Get <strong>5&nbsp;Off-Market Listings</strong> We
        think you'll love, plus access to search available&nbsp;homes.
      </p>

      <div className="entry-action-zone">
        <CTAButton variant="filled" className="cta-btn--entry" showArrow onClick={onStart}>GET YOUR 5 LISTINGS</CTAButton>
        <p className="entry-disclaimer">
          No generic searches. No blind algorithms. Just results.
        </p>
      </div>
    </div>
  );
}
