import LegalPage from '../components/LegalPage';

export default function PrivacyPolicy() {
  return (
    <LegalPage title="Privacy Policy" effectiveDate="February 14, 2026">
      <section>
        <h2>1. Introduction and Scope</h2>
        <p>
          Red Post Realty ("we," "us," or "our") respects your privacy. This Privacy Policy describes
          how we collect, use, and share your personal information when you use our "Privileged
          Intelligence" portal and real-time search tools. This policy is designed to comply with New
          Hampshire state laws and the <a href="https://primemls.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>PrimeMLS (NEREN)</a> Internet Data Exchange (IDX) rules.
        </p>
      </section>

      <section>
        <h2>2. Information We Collect</h2>
        <p>
          <strong>Direct Information:</strong> When you register to "Unlock More Listings" or
          "Schedule a Briefing," we collect your name, email address, phone number, and any specific
          property interests you share.
        </p>
        <p>
          <strong>Automated Data:</strong> We collect IP addresses, browser types, and "property heat
          maps" (which listings you click on) to improve our market intelligence reports.
        </p>
        <p>
          <strong>Cookie Data:</strong> We use cookies to remember your search filters (e.g.,
          "Portsmouth 3-bedroom") so you don't have to re-enter them.
        </p>
      </section>

      <section>
        <h2>3. How We Use Your Information</h2>
        <p>
          Unlike third-party lead aggregators, we do not sell your data to outside lenders or agents.
          We use your information to:
        </p>
        <ul>
          <li>Verify your identity as a bona fide consumer.</li>
          <li>Deliver automated "New Listing" alerts based on your saved searches.</li>
          <li>Facilitate direct communication between you and a Red Post Realty advisor.</li>
        </ul>
      </section>

      <section>
        <h2>4. Data Sharing and Disclosure</h2>
        <p>We only share your information with:</p>
        <ul>
          <li>
            <strong>Service Providers:</strong> Software like Ruuster that hosts our data stream.
          </li>
          <li>
            <strong>Regulatory Bodies:</strong> The NH Real Estate Commission, if required for audit
            purposes.
          </li>
          <li>
            <strong>Compliance:</strong> <a href="https://primemls.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>PrimeMLS</a>, to verify that our users are legitimate consumers
            and not automated "scraping" bots.
          </li>
        </ul>
      </section>

      <section>
        <h2>5. Your Rights and Choices</h2>
        <p>
          You may "Opt-Out" of any marketing communications at any time by clicking the "Unsubscribe"
          link in our emails or by contacting us directly at our Portsmouth headquarters.
        </p>
      </section>
    </LegalPage>
  );
}
