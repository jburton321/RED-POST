import LegalPage from '../components/LegalPage';

export default function TermsOfService() {
  return (
    <LegalPage title="Terms of Service" effectiveDate="February 14, 2026">
      <section>
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing the Red Post Realty search portal, you agree to these Terms of Service and all
          applicable laws and regulations. If you do not agree, you are prohibited from using this
          site.
        </p>
      </section>

      <section>
        <h2>2. <a href="https://primemls.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>PrimeMLS (NEREN)</a> IDX Rules</h2>
        <p>This website utilizes a data feed provided by <a href="https://primemls.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>PrimeMLS (NEREN)</a>.</p>
        <ul>
          <li>
            <strong>Bona Fide Interest:</strong> You represent that you have a bona fide interest in
            the purchase, sale, or lease of real estate of the type being offered on this website.
          </li>
          <li>
            <strong>Non-Commercial Use:</strong> You may use the listing data exclusively for your
            personal, non-commercial use.
          </li>
          <li>
            <strong>No Scraping:</strong> You are prohibited from using automated scripts, "bots," or
            spiders to "scrape" or download listing data for any purpose.
          </li>
        </ul>
      </section>

      <section>
        <h2>3. Information Reliability and Disclaimer</h2>
        <ul>
          <li>
            <strong>No Guarantee:</strong> All listing information is provided "as is." While our data
            is refreshed via a direct stream, it is deemed reliable but is not guaranteed.
          </li>
          <li>
            <strong>Verified Specs:</strong> Users are responsible for independently verifying square
            footage, lot size, school districts, and tax assessments.
          </li>
          <li>
            <strong>Market Fluctuations:</strong> Properties shown may be subject to prior sale, price
            changes, or withdrawal without notice.
          </li>
        </ul>
      </section>

      <section>
        <h2>4. Professional Relationship</h2>
        <p>
          Accessing this data does not create an exclusive brokerage relationship. Red Post Realty
          remains the listing broker for the properties identified as such in the data.
        </p>
      </section>

      <section>
        <h2>5. Limitation of Liability</h2>
        <p>
          Red Post Realty and its data providers (including <a href="https://primemls.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>PrimeMLS</a>) shall not be held liable for any
          damages arising from the use or inability to use the materials on this website, even if
          notified of the possibility of such damage.
        </p>
      </section>
    </LegalPage>
  );
}
