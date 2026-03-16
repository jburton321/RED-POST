const reviews = [
  {
    source: 'GOOGLE',
    quote:
      '"Our Red Post agent was great at communicating at all stages of the process. We had 2 offers within the first 10 days the house was on the market. The professionalism and work ethic are truly remarkable."',
    client: 'M. GREGERSON',
    sector: 'NH_SEACOAST',
  },
  {
    source: 'ZILLOW',
    quote:
      '"I was very pleased with the professional help during the entire search and negotiation process right through and after closing of my real estate purchase. Our agent was very responsive and executed flawlessly."',
    client: 'JAMES W.',
    sector: 'SOUTHERN_ME',
  },
  {
    source: 'FACEBOOK',
    quote:
      '"Our Red Post agent helped me find and buy my house and was an absolute joy to work with. I was a first-time buyer and she made the whole process transparent and hopeful."',
    client: 'MARIE D.',
    sector: 'NORTH_SHORE_MA',
  },
];

import CommandButton from './CommandButton';

export default function MarketValidation() {
  return (
    <section id="reviews" className="review-monolith-container">
      <div className="monolith-header">
        <div className="section-header-row">
          <div>
            <span className="sys-code">VERIFIED_PERFORMANCE // 5.0_STARS</span>
            <h2 className="sys-title">
              CLIENT <span className="red">REVIEWS</span>
            </h2>
          </div>
          <CommandButton />
        </div>
      </div>

      <div className="box-grid">
        {reviews.map((r) => (
          <div key={r.client} className="dossier-box">
            <div className="box-top">
              <span className="box-label">INTEL_SOURCE: {r.source}</span>
              <div className="box-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
            </div>
            <div className="box-body">
              <p>{r.quote}</p>
            </div>
            <div className="box-footer">
              <span className="client-id">{r.client}</span>
              <span className="sector">{r.sector}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
