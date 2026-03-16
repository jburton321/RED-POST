import CommandButton from './CommandButton';

export default function StrategicAdvantage() {
  return (
    <section className="dossier-values-dark">
      <div className="dossier-values-blueprint" />
      <div className="values-inner">
        <div className="section-header-row">
          <div className="values-intro">
            <div className="dossier-tag">STRATEGIC ADVANTAGE</div>
            <h2 className="editorial-title">
              WHY CHOOSE <span className="red-post">RED POST?</span>
            </h2>
            <p className="editorial-subtitle">The Undisputed Authority on Seacoast Real Estate</p>
          </div>
          <CommandButton />
        </div>
      </div>

      <div className="intelligence-feed">
        <div className="intel-strip">
          <div className="intel-strip-inner">
            <div className="strip-header">
              <span className="strip-num">01</span>
              <h3 className="strip-title">Pre-Market Intelligence</h3>
              <div className="strip-line"></div>
            </div>
            <div className="strip-body">
              <p>
                We monitor planning boards in Portsmouth, Dover, Kittery, and York. When a variance is
                approved or a subdivision filed, you hear about it months before the "For Sale" sign.
              </p>
              <div className="strip-meta">SECTOR: PLANNING & ZONING</div>
            </div>
          </div>
        </div>

        <div className="intel-strip">
          <div className="intel-strip-inner">
            <div className="strip-header">
              <span className="strip-num">02</span>
              <h3 className="strip-title">Tri-State Tax Strategy</h3>
              <div className="strip-line"></div>
            </div>
            <div className="strip-body">
              <p>
                Moving from MA to NH? We calculate your REAL savings—not just the price difference, but
                total cost of ownership including property tax, income tax, and commute.
              </p>
              <div className="strip-meta">SECTOR: FISCAL ANALYSIS</div>
            </div>
          </div>
        </div>

        <div className="intel-strip">
          <div className="intel-strip-inner">
            <div className="strip-header">
              <span className="strip-num">03</span>
              <h3 className="strip-title">Development Tracking</h3>
              <div className="strip-line"></div>
            </div>
            <div className="strip-body">
              <p>
                From Seacoast Landing to Kittery Foreside, we track every major project reshaping the
                region. Understand how new construction impacts your equity before your neighbors do.
              </p>
              <div className="strip-meta">SECTOR: EQUITY & DEVELOPMENT</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
