import { MapPin, DollarSign, GraduationCap, BarChart3 } from 'lucide-react';
import CTAButton from '../CTAButton';
import type { StepProps } from '../../types/form';

const LOCATIONS = [
  {
    id: 'nh',
    name: 'New Hampshire Seacoast',
    towns: 'Portsmouth, Rye, Dover',
    tax: 'No income tax, higher property tax',
    school: 'Portsmouth ranked #4 in NH',
    image: 'https://images.pexels.com/photos/2079234/pexels-photo-2079234.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'me',
    name: 'Southern Maine',
    towns: 'Kittery, York, Eliot',
    tax: 'Income tax up to 7.15%, moderate property tax',
    school: 'York High #1 in York County',
    image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'ma',
    name: 'Northern Massachusetts',
    towns: 'Newburyport, Amesbury',
    tax: '5% income tax, moderate property tax',
    school: 'Strong districts statewide',
    image: 'https://images.pexels.com/photos/2360673/pexels-photo-2360673.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

interface Props extends StepProps {
  onNext: () => void;
  onBack: () => void;
}

export default function StepLocation({ data, updateField, onNext, onBack }: Props) {
  const select = (id: string) => updateField('locationPreference', id);

  return (
    <div>
      <div className="step-header">
        <h2>Where Do You See Yourself?</h2>
        <p>Each region has distinct tax structures and market dynamics.</p>
      </div>

      <div className="flex flex-col gap-2.5">
        {LOCATIONS.map(loc => {
          const selected = data.locationPreference === loc.id;
          return (
            <button
              key={loc.id}
              type="button"
              onClick={() => select(loc.id)}
              className={`relative border text-left transition-all duration-200 ${
                selected ? 'border-[#d21920]' : 'border-black/[0.06] hover:border-black/15'
              }`}
            >
              <div className="flex">
                <div
                  className="w-[80px] flex-shrink-0 bg-cover bg-center self-stretch"
                  style={{ backgroundImage: `url('${loc.image}')` }}
                />
                <div className="p-4 flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <span className="font-['Poppins'] text-black text-[13px] font-semibold leading-tight">{loc.name}</span>
                    <div className={`w-[18px] h-[18px] rounded-full border-2 flex-shrink-0 flex items-center justify-center ml-2 transition-colors duration-200 ${
                      selected ? 'border-[#d21920]' : 'border-black/15'
                    }`}>
                      {selected && <div className="w-2 h-2 rounded-full bg-[#d21920]" />}
                    </div>
                  </div>
                  <div className="flex items-start gap-1.5 mb-[2px]">
                    <MapPin size={10} className="text-black/35 flex-shrink-0 mt-[2px]" />
                    <span className="font-['Poppins'] text-black/35 text-[10px] leading-snug">{loc.towns}</span>
                  </div>
                  <div className="flex items-start gap-1.5 mb-[2px]">
                    <DollarSign size={10} className="text-black/35 flex-shrink-0 mt-[2px]" />
                    <span className="font-['Poppins'] text-black/35 text-[10px] leading-snug">{loc.tax}</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <GraduationCap size={10} className="text-black/35 flex-shrink-0 mt-[2px]" />
                    <span className="font-['Poppins'] text-black/35 text-[10px] leading-snug">{loc.school}</span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => select('compare')}
          className={`relative p-4 border text-left transition-all duration-200 ${
            data.locationPreference === 'compare'
              ? 'border-[#d21920] bg-[#d21920]/[0.08]'
              : 'border-black/[0.06] hover:border-black/15'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 flex-shrink-0 flex items-center justify-center transition-colors duration-200 ${
              data.locationPreference === 'compare' ? 'bg-[#d21920]' : 'bg-black/[0.04]'
            }`}>
              <BarChart3 size={15} className={`transition-colors duration-200 ${data.locationPreference === 'compare' ? 'text-white' : 'text-black/40'}`} />
            </div>
            <div>
              <span className="font-['Poppins'] text-black text-[13px] font-semibold block leading-tight">Compare All Three</span>
              <span className="font-['Poppins'] text-black/35 text-[11px]">Show me the total cost comparison</span>
            </div>
            <div className={`w-[18px] h-[18px] rounded-full border-2 flex-shrink-0 flex items-center justify-center ml-auto transition-colors duration-200 ${
              data.locationPreference === 'compare' ? 'border-[#d21920]' : 'border-black/15'
            }`}>
              {data.locationPreference === 'compare' && <div className="w-2 h-2 rounded-full bg-[#d21920]" />}
            </div>
          </div>
        </button>
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
