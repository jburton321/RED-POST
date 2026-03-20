import CTAButton from '../CTAButton';
import type { StepProps } from '../../types/form';

const TIMELINE_OPTIONS = [
  {
    id: 'immediate',
    label: 'Immediate / < 30 Days',
    desc: 'Priority access + immediate advisor contact',
    color: '#d21920',
  },
  {
    id: '1-3months',
    label: '1-3 Months',
    desc: 'Curated listings + coming soon alerts',
    color: '#D4A017',
  },
  {
    id: '3-6months',
    label: '3-6 Months',
    desc: 'Development tracking + market analysis',
    color: '#2E8B57',
  },
  {
    id: 'researching',
    label: 'Just Researching / 6+ Months',
    desc: 'Educational content + quarterly reports',
    color: '#3B82F6',
  },
];

interface Props extends StepProps {
  onBack: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
  submitting?: boolean;
  submitError?: string | null;
}

export default function StepTimeline({ data, updateField, onBack, onNext, onSubmit, submitting, submitError }: Props) {
  const isLastStep = !!onSubmit;
  const canSubmit = !submitting;
  return (
    <div>
      <div className="step-header">
        <h2>When Are You Looking to Move?</h2>
        <p>This helps us prioritize the right opportunities for your timeline.</p>
      </div>

      <div className="flex flex-col gap-2.5">
        {TIMELINE_OPTIONS.map(opt => {
          const selected = data.timeline === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => updateField('timeline', opt.id)}
              className={`flex items-center gap-3 p-4 border text-left transition-all duration-200 ${
                selected
                  ? 'border-[#d21920] bg-[#d21920]/[0.06]'
                  : 'border-black/[0.06] hover:border-black/15'
              }`}
            >
              <div className={`w-[18px] h-[18px] rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors duration-200 ${
                selected ? 'border-[#d21920]' : 'border-black/15'
              }`}>
                {selected && <div className="w-2 h-2 rounded-full bg-[#d21920]" />}
              </div>
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: opt.color }}
              />
              <div className="flex-1 min-w-0">
                <span className="font-['Poppins'] text-black text-[13px] font-medium block leading-snug">{opt.label}</span>
                <span className="font-['Poppins'] text-black/35 text-[11px] leading-snug block">{opt.desc}</span>
              </div>
            </button>
          );
        })}
      </div>

      {submitError && (
        <p className="font-['Poppins'] text-[11px] text-[#d21920] mb-2">{submitError}</p>
      )}
      <div className="form-nav">
        <CTAButton variant="stroke" showBack onClick={onBack}>
          BACK
        </CTAButton>
        {isLastStep ? (
          <CTAButton variant="filled" showArrow disabled={!canSubmit} onClick={onSubmit}>
            {submitting ? 'SUBMITTING...' : 'GET MY BRIEFING'}
          </CTAButton>
        ) : (
          <CTAButton variant="filled" showArrow onClick={onNext}>
            NEXT STEP
          </CTAButton>
        )}
      </div>
    </div>
  );
}
