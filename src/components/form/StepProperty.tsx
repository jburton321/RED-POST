import CTAButton from '../CTAButton';
import type { StepProps } from '../../types/form';

const PROPERTY_TYPES = [
  'Single-Family Home',
  'Condo / Townhouse',
  'Multi-Family (Investment)',
  'New Construction Only',
  'Open to All Types',
];

const MUST_HAVES = [
  'Garage (2+ car)',
  'Water Views',
  'Single-Level Living',
  'Move-In Ready',
  'In-Law Suite / ADU Potential',
];

const BEDROOM_OPTIONS: (number | string)[] = [2, 3, 4, '5+'];

interface Props extends StepProps {
  onNext: () => void;
  onBack: () => void;
}

const formatPrice = (val: number) => {
  if (val >= 3000000) return '$3M+';
  if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
  return `$${(val / 1000).toFixed(0)}K`;
};

export default function StepProperty({ data, updateField, onNext, onBack }: Props) {
  const toggleMustHave = (item: string) => {
    const current = data.mustHaves;
    updateField(
      'mustHaves',
      current.includes(item) ? current.filter(v => v !== item) : [...current, item]
    );
  };

  return (
    <div>
      <div className="step-header">
        <h2>What Are You Looking For?</h2>
        <p>We'll cross-reference criteria with our pipeline and active inventory.</p>
      </div>

      <div>
        <div className="mb-3">
          <label className="font-['Poppins'] text-black/50 text-[10px] uppercase tracking-[0.15em] block mb-1.5 font-semibold">
            Price Range
          </label>
          <div className="text-center font-['Poppins'] text-[#d21920] text-[13px] font-semibold mb-2">
            {formatPrice(data.priceMin)} &mdash; {formatPrice(data.priceMax)}
          </div>
          <div className="dual-range-container">
            <input
              type="range"
              min={300000}
              max={3000000}
              step={50000}
              value={data.priceMin}
              onChange={e => {
                const val = Number(e.target.value);
                if (val < data.priceMax) updateField('priceMin', val);
              }}
              className="dual-range"
            />
            <input
              type="range"
              min={300000}
              max={3000000}
              step={50000}
              value={data.priceMax}
              onChange={e => {
                const val = Number(e.target.value);
                if (val > data.priceMin) updateField('priceMax', val);
              }}
              className="dual-range"
            />
          </div>
          <div className="flex justify-between font-['Poppins'] text-[10px] text-black/25 mt-1">
            <span>$300K</span><span>$3M+</span>
          </div>
        </div>

        <div className="mb-3">
          <label className="font-['Poppins'] text-black/50 text-[10px] uppercase tracking-[0.15em] block mb-1.5 font-semibold">
            Minimum Bedrooms
          </label>
          <div className="flex gap-2">
            {BEDROOM_OPTIONS.map(opt => {
              const val = typeof opt === 'string' ? 5 : opt;
              const selected = data.minBedrooms === val;
              return (
                <button
                  key={String(opt)}
                  type="button"
                  onClick={() => updateField('minBedrooms', val)}
                  className={`w-11 h-11 flex items-center justify-center font-['Poppins'] text-sm font-semibold border transition-all duration-200 ${
                    selected
                      ? 'bg-[#d21920] border-[#d21920] text-white'
                      : 'border-black/[0.08] text-black/40 hover:border-black/20'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-3">
          <label className="font-['Poppins'] text-black/50 text-[10px] uppercase tracking-[0.15em] block mb-1.5 font-semibold">
            Property Type
          </label>
          <div className="flex flex-col gap-0.5">
            {PROPERTY_TYPES.map(type => {
              const selected = data.propertyType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => updateField('propertyType', type)}
                  className={`flex items-center gap-2.5 py-2 px-1 text-left transition-all duration-200 ${
                    selected ? 'text-black' : 'text-black/35 hover:text-black/60'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors duration-200 ${
                    selected ? 'border-[#d21920]' : 'border-black/15'
                  }`}>
                    {selected && <div className="w-1.5 h-1.5 rounded-full bg-[#d21920]" />}
                  </div>
                  <span className="font-['Poppins'] text-[13px]">{type}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-3">
          <label className="font-['Poppins'] text-black/50 text-[10px] uppercase tracking-[0.15em] block mb-1.5 font-semibold">
            Must-Haves <span className="text-black/25 font-normal">(Optional)</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {MUST_HAVES.map(item => {
              const selected = data.mustHaves.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleMustHave(item)}
                  className={`px-3 py-1.5 border text-[11px] font-['Poppins'] transition-all duration-200 ${
                    selected
                      ? 'bg-[#d21920]/[0.08] border-[#d21920] text-black'
                      : 'border-black/[0.08] text-black/35 hover:border-black/20'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        <p className="font-['Poppins'] text-[10px] text-black/25 italic mb-1">
          We also track planning board approvals for homes 6-12 months out.
        </p>
      </div>

      <div className="form-nav">
        <CTAButton variant="stroke" showBack onClick={onBack}>
          BACK
        </CTAButton>
        <CTAButton variant="filled" showArrow onClick={onNext}>
          NEXT STEP
        </CTAButton>
      </div>
    </div>
  );
}
