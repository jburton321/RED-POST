export interface FormData {
  lifestyleValues: string[];
  locationPreference: string;
  priceMin: number;
  priceMax: number;
  minBedrooms: number;
  propertyType: string;
  mustHaves: string[];
  timeline: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  currentStatus: string;
  agreedToTerms: boolean;
}

export interface StepProps {
  data: FormData;
  updateField: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
}
