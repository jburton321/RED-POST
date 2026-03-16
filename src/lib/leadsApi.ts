/**
 * Leads API - submits form data to Formspree or custom endpoint.
 * Uses Formspree or custom endpoint via env.
 */

const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID ?? '';
const LEADS_ENDPOINT = import.meta.env.VITE_LEADS_ENDPOINT ?? '';

export interface LeadPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  currentStatus?: string;
  lifestyleValues?: string[];
  locationPreference?: string;
  priceMin?: number;
  priceMax?: number;
  minBedrooms?: number;
  propertyType?: string;
  mustHaves?: string[];
  timeline?: string;
  agreedToTerms?: boolean;
}

function getEndpoint(): string {
  if (LEADS_ENDPOINT) return LEADS_ENDPOINT;
  if (FORMSPREE_ID) return `https://formspree.io/f/${FORMSPREE_ID}`;
  return '';
}

export async function submitLead(payload: LeadPayload): Promise<{ ok: boolean; error?: string }> {
  const url = getEndpoint();
  if (!url) {
    console.warn('No leads endpoint configured. Set VITE_FORMSPREE_ID or VITE_LEADS_ENDPOINT.');
    return { ok: false, error: 'Leads not configured' };
  }

  const isFormspree = url.includes('formspree.io');
  const body = isFormspree
    ? new URLSearchParams({
        _subject: 'Red Post Realty - New Lead',
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        phone: payload.phone ?? '',
        currentStatus: payload.currentStatus ?? '',
        lifestyleValues: JSON.stringify(payload.lifestyleValues ?? []),
        locationPreference: payload.locationPreference ?? '',
        priceMin: String(payload.priceMin ?? ''),
        priceMax: String(payload.priceMax ?? ''),
        minBedrooms: String(payload.minBedrooms ?? ''),
        propertyType: payload.propertyType ?? '',
        mustHaves: JSON.stringify(payload.mustHaves ?? []),
        timeline: payload.timeline ?? '',
        agreedToTerms: String(payload.agreedToTerms ?? false),
      })
    : JSON.stringify({
        first_name: payload.firstName,
        last_name: payload.lastName,
        email: payload.email,
        phone: payload.phone,
        current_status: payload.currentStatus,
        lifestyle_values: payload.lifestyleValues,
        location_preference: payload.locationPreference,
        price_min: payload.priceMin,
        price_max: payload.priceMax,
        min_bedrooms: payload.minBedrooms,
        property_type: payload.propertyType,
        must_haves: payload.mustHaves,
        timeline: payload.timeline,
        agreed_to_terms: payload.agreedToTerms,
      });

  const headers: Record<string, string> = isFormspree
    ? { 'Content-Type': 'application/x-www-form-urlencoded' }
    : { 'Content-Type': 'application/json' };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: body as string,
    });

    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: text || `HTTP ${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { ok: false, error: message };
  }
}
