import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import CTAButton from '../CTAButton';
import type { StepProps } from '../../types/form';

const STATUS_OPTIONS = [
  'Rent',
  'Own a Home (Will Sell First)',
  'Own a Home (Keeping as Investment)',
  'Relocating from Out of State',
];

interface Props extends StepProps {
  onBack: () => void;
  onSubmit: () => void;
  submitting: boolean;
  submitError?: string | null;
}

export default function StepContact({ data, updateField, onBack, onSubmit, submitting, submitError }: Props) {
  const canSubmit = data.agreedToTerms && data.email.trim() !== '' && data.firstName.trim() !== '' && !submitting;

  return (
    <div>
      <div className="step-header">
        <h2>Almost There</h2>
      </div>

      <div className="font-['Poppins'] text-[11px] text-black/40 mb-3 leading-relaxed flex flex-wrap gap-x-3 gap-y-0.5">
        <span className="flex items-center gap-1"><span className="text-[#d21920]">&#10003;</span> Active listings</span>
        <span className="flex items-center gap-1"><span className="text-[#d21920]">&#10003;</span> Off-market</span>
        <span className="flex items-center gap-1"><span className="text-[#d21920]">&#10003;</span> Development opps</span>
        <span className="flex items-center gap-1"><span className="text-[#d21920]">&#10003;</span> Tax analysis</span>
      </div>

      <div>
        <div className="grid grid-cols-2 gap-2.5 mb-2">
          <div>
            <label className="font-['Poppins'] text-black/35 text-[10px] uppercase tracking-[0.15em] block mb-1">First Name</label>
            <input
              type="text"
              placeholder="John"
              value={data.firstName}
              onChange={e => updateField('firstName', e.target.value)}
              className="form-input"
            />
          </div>
          <div>
            <label className="font-['Poppins'] text-black/35 text-[10px] uppercase tracking-[0.15em] block mb-1">Last Name</label>
            <input
              type="text"
              placeholder="Smith"
              value={data.lastName}
              onChange={e => updateField('lastName', e.target.value)}
              className="form-input"
            />
          </div>
        </div>

        <div className="mb-2">
          <label className="font-['Poppins'] text-black/35 text-[10px] uppercase tracking-[0.15em] block mb-1">Email Address</label>
          <input
            type="email"
            placeholder="john@example.com"
            value={data.email}
            onChange={e => updateField('email', e.target.value)}
            className="form-input"
          />
        </div>

        <div className="mb-2">
          <label className="font-['Poppins'] text-black/35 text-[10px] uppercase tracking-[0.15em] block mb-1">Phone Number</label>
          <input
            type="tel"
            placeholder="(603) 555-1234"
            value={data.phone}
            onChange={e => updateField('phone', e.target.value)}
            className="form-input"
          />
          <span className="font-['Poppins'] text-[9px] text-black/20 mt-0.5 block">
            We use SMS for time-sensitive alerts. Reply STOP anytime.
          </span>
        </div>

        <div className="mb-3">
          <label className="font-['Poppins'] text-black/35 text-[10px] uppercase tracking-[0.15em] block mb-1">I currently...</label>
          <div className="flex flex-col gap-0">
            {STATUS_OPTIONS.map(opt => {
              const selected = data.currentStatus === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => updateField('currentStatus', opt)}
                  className={`flex items-center gap-2 py-1.5 px-1 text-left transition-all duration-200 ${
                    selected ? 'text-black' : 'text-black/35 hover:text-black/60'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors duration-200 ${
                    selected ? 'border-[#d21920]' : 'border-black/15'
                  }`}>
                    {selected && <div className="w-1.5 h-1.5 rounded-full bg-[#d21920]" />}
                  </div>
                  <span className="font-['Poppins'] text-[11px]">{opt}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mb-2 mt-2">
        <Lock size={11} className="text-black/25 flex-shrink-0" />
        <span className="font-['Poppins'] text-[10px] text-black/25">
          Your information is secure. We never sell your data.
        </span>
      </div>

      <label className="flex items-start gap-2 mb-0 cursor-pointer">
        <input
          type="checkbox"
          checked={data.agreedToTerms}
          onChange={e => updateField('agreedToTerms', e.target.checked)}
          className="mt-0.5 accent-[#d21920] w-3.5 h-3.5 flex-shrink-0"
        />
        <span className="font-['Poppins'] text-[11px] text-black/35 leading-relaxed">
          By clicking, I agree to the Red Post{' '}
          <Link to="/terms-of-service" target="_blank" className="underline text-black/50 hover:text-black">Terms of Service</Link>
          {' '}and{' '}
          <Link to="/privacy-policy" target="_blank" className="underline text-black/50 hover:text-black">Privacy Policy</Link>
          {' '}and acknowledge the <a href="https://primemls.com/" target="_blank" rel="noopener noreferrer" className="underline text-black/50 hover:text-black">PrimeMLS</a> IDX Disclaimer.
        </span>
      </label>

      {submitError && (
        <p className="font-['Poppins'] text-[11px] text-[#d21920] mb-2">{submitError}</p>
      )}
      <div className="form-nav">
        <CTAButton variant="stroke" showBack onClick={onBack}>
          BACK
        </CTAButton>
        <CTAButton variant="filled" showArrow disabled={!canSubmit} onClick={onSubmit}>
          {submitting ? 'SUBMITTING...' : 'GET MY BRIEFING'}
        </CTAButton>
      </div>
    </div>
  );
}
