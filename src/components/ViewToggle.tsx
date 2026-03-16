import { LayoutGrid, List, Map } from 'lucide-react';

export type ViewMode = 'card' | 'list' | 'map';

interface ViewToggleProps {
  active: ViewMode;
  onChange: (mode: ViewMode) => void;
}

const modes: { key: ViewMode; icon: typeof LayoutGrid; label: string }[] = [
  { key: 'card', icon: LayoutGrid, label: 'Card' },
  { key: 'list', icon: List, label: 'List' },
  { key: 'map', icon: Map, label: 'Map' },
];

export default function ViewToggle({ active, onChange }: ViewToggleProps) {
  return (
    <div className="view-toggle">
      {modes.map(({ key, icon: Icon, label }) => (
        <button
          key={key}
          type="button"
          className={`view-toggle-btn ${active === key ? 'view-toggle-btn--active' : ''}`}
          onClick={() => onChange(key)}
          aria-label={`${label} view`}
        >
          <Icon size={15} strokeWidth={2} />
          <span className="view-toggle-label">{label}</span>
        </button>
      ))}
    </div>
  );
}
