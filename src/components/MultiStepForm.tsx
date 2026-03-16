import { useState } from 'react';
import WelcomeScreen from './form/WelcomeScreen';
import StepLifestyle from './form/StepLifestyle';
import StepLocation from './form/StepLocation';
import StepProperty from './form/StepProperty';
import StepTimeline from './form/StepTimeline';
import StepContact from './form/StepContact';
import FormSuccess from './form/FormSuccess';
import { submitLead } from '../lib/leadsApi';
import type { FormData } from '../types/form';

const INITIAL_FORM: FormData = {
  lifestyleValues: [],
  locationPreference: '',
  priceMin: 600000,
  priceMax: 900000,
  minBedrooms: 3,
  propertyType: '',
  mustHaves: [],
  timeline: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  currentStatus: '',
  agreedToTerms: false,
};

const TOTAL_STEPS = 5;

const STEP_LABELS = ['Lifestyle', 'Location', 'Property', 'Timeline', 'Contact'];

export default function MultiStepForm() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const next = () => setStep(s => Math.min(s + 1, TOTAL_STEPS));
  const back = () => setStep(s => Math.max(s - 1, 1));
  const startForm = () => setStep(1);

  const handleSubmit = async () => {
    if (!formData.agreedToTerms || !formData.email || !formData.firstName) return;
    setSubmitting(true);
    try {
      const result = await submitLead({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        currentStatus: formData.currentStatus,
        lifestyleValues: formData.lifestyleValues,
        locationPreference: formData.locationPreference,
        priceMin: formData.priceMin,
        priceMax: formData.priceMax,
        minBedrooms: formData.minBedrooms,
        propertyType: formData.propertyType,
        mustHaves: formData.mustHaves,
        timeline: formData.timeline,
        agreedToTerms: formData.agreedToTerms,
      });
      if (result.ok) {
        setSubmitted(true);
        setSubmitError(null);
      } else {
        setSubmitting(false);
        setSubmitError(result.error ?? 'Submission failed. Please try again.');
      }
    } catch {
      setSubmitting(false);
      setSubmitError('Submission failed. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="stepper-form-container">
        <div className="stepper-form-body">
          <FormSuccess firstName={formData.firstName} />
        </div>
      </div>
    );
  }

  if (step === 0) {
    return (
      <div className="stepper-form-container">
        <div className="stepper-form-body">
          <WelcomeScreen onStart={startForm} />
        </div>
      </div>
    );
  }

  return (
    <div className="stepper-form-container">
      <div className="stepper-form-body">
        <div className="form-progress-meta">
          <span className="form-progress-label">{STEP_LABELS[step - 1]}</span>
          <span className="form-progress-count">{step} / {TOTAL_STEPS}</span>
        </div>

        <div className="form-progress">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => {
            const segmentStep = i + 1;
            const isDone = segmentStep < step;
            const isActive = segmentStep === step;
            return (
              <div key={i} className="form-progress-segment">
                <div className="form-progress-bar">
                  <div
                    className="form-progress-fill"
                    style={{ width: isDone || isActive ? '100%' : '0%' }}
                  />
                </div>
                <div
                  className={`form-progress-dot ${
                    isActive ? 'form-progress-dot--active' : isDone ? 'form-progress-dot--done' : ''
                  }`}
                />
              </div>
            );
          })}
        </div>

        {step === 1 && <StepLifestyle data={formData} updateField={updateField} onNext={next} />}
        {step === 2 && <StepLocation data={formData} updateField={updateField} onNext={next} onBack={back} />}
        {step === 3 && <StepProperty data={formData} updateField={updateField} onNext={next} onBack={back} />}
        {step === 4 && <StepTimeline data={formData} updateField={updateField} onNext={next} onBack={back} />}
        {step === 5 && (
          <StepContact
            data={formData}
            updateField={updateField}
            onBack={back}
            onSubmit={handleSubmit}
            submitting={submitting}
            submitError={submitError}
          />
        )}
      </div>
    </div>
  );
}
