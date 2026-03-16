import { MapPin, GraduationCap, Anchor, DollarSign, Navigation, TrendingUp, Shield } from 'lucide-react';
import CTAButton from '../CTAButton';
import type { StepProps } from '../../types/form';

const LIFESTYLE_OPTIONS = [
  { id: 'walkable', icon: MapPin, label: 'Walkable Downtown', desc: 'Coffee shops and errands without a car' },
  { id: 'schools', icon: GraduationCap, label: 'Top-Ranked Schools', desc: 'Best education for your family' },
  { id: 'water', icon: Anchor, label: 'Deep Water Access', desc: 'Dock your boat or kayak from home' },
  { id: 'tax', icon: DollarSign, label: 'Tax Optimization', desc: 'Maximize income after taxes' },
  { id: 'commute', icon: Navigation, label: 'Commute to Boston', desc: 'Easy access to I-95 or commuter rail' },
  { id: 'investment', icon: TrendingUp, label: 'Investment Potential', desc: 'Short-term rental or multi-family zones' },
  { id: 'privacy', icon: Shield, label: 'Privacy & Land', desc: '5+ acres, no neighbors in sight' },
];

interface Props extends StepProps {
  onNext: () => void;
}

export default function StepLifestyle({ data, updateField, onNext }: Props) {
  const toggle = (id: string) => {
    const current = data.lifestyleValues;
    updateField(
      'lifestyleValues',
      current.includes(id) ? current.filter(v => v !== id) : [...current, id]
    );
  };

  return (
    <div>
      <div className="step-header">
        <h2>What Matters Most?</h2>
        <p>Select all that apply. We'll match locations to your priorities.</p>
      </div>

      <div className="flex flex-col gap-[5px]">
        {LIFESTYLE_OPTIONS.map(opt => {
          const selected = data.lifestyleValues.includes(opt.id);
          const Icon = opt.icon;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggle(opt.id)}
              className={`flex items-center gap-3 p-3 border text-left transition-all duration-200 ${
                selected
                  ? 'border-[#d21920] bg-[#d21920]/[0.08]'
                  : 'border-black/[0.06] hover:border-black/15'
              }`}
            >
              <div className={`w-9 h-9 flex-shrink-0 flex items-center justify-center transition-colors duration-200 ${
                selected ? 'bg-[#d21920]' : 'bg-black/[0.04]'
              }`}>
                <Icon size={15} className={`transition-colors duration-200 ${selected ? 'text-white' : 'text-black/40'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-['Poppins'] text-black text-[13px] font-semibold block leading-tight">{opt.label}</span>
                <span className="font-['Poppins'] text-black/35 text-[11px] block leading-tight">{opt.desc}</span>
              </div>
              <div className={`w-[18px] h-[18px] flex-shrink-0 border rounded-sm flex items-center justify-center transition-all duration-200 ${
                selected ? 'bg-[#d21920] border-[#d21920]' : 'border-black/15'
              }`}>
                {selected && (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <p className="font-['Poppins'] text-[10px] text-black/25 italic mt-3">
        Not sure which matters most? That's exactly what we help you figure out.
      </p>

      <div className="form-nav-full">
        <CTAButton variant="filled" showArrow onClick={onNext}>
          NEXT STEP
        </CTAButton>
      </div>
    </div>
  );
}
