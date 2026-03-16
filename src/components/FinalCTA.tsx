import CommandButton from './CommandButton';

export default function FinalCTA() {
  return (
    <section className="final-monolith">
      <div className="final-blueprint-overlay" />

      <div className="monolith-cta-content">
        <div className="access-tag">FINAL_STEP // UNLOCK_DATA</div>

        <h1 className="monolith-headline">
          Ready to See What <br />
          <span className="red-glow">You're Missing?</span>
        </h1>

        <p className="monolith-sub">
          Complete Your Profile and Get <strong>5 Off-Market Listings</strong> We
          think you'll love, plus access to search available homes across the
          Seacoast.
        </p>

        <div className="monolith-action">
          <CommandButton>
            GET_STARTED
          </CommandButton>

          <div className="terminal-footer">
            <span className="footer-item">
              <span className="tf-dot" /> STATUS: READY
            </span>
            <span className="footer-item">
              <span className="tf-dot" /> DATABASE: LIVE
            </span>
            <span className="footer-item">
              <span className="tf-dot" /> ACCESS: PRIVILEGED
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
