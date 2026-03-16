const PRESS_MENTIONS = [
  'BOSTON GLOBE',
  'SEACOAST ONLINE',
  'NEW HAMPSHIRE MAGAZINE',
  'BOSTON MAGAZINE',
  'INMAN',
];

export default function PressTicker() {
  const duplicatedMentions = [...PRESS_MENTIONS, ...PRESS_MENTIONS];

  return (
    <section id="news" className="press-ticker">
      <div className="ticker-header">ESTABLISHED AUTHORITY // MENTIONS</div>
      <div className="ticker-wrap">
        <div className="ticker-move">
          {duplicatedMentions.map((mention, index) => (
            <span key={index}>{mention}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
