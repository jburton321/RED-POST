/**
 * Leads API - submits form data to Formspree or custom endpoint.
 * When no endpoint is configured, runs in dummy mode (simulates success).
 */

import { FORMSPREE_ID, LEADS_ENDPOINT } from './api';

/** Minimal payload for dummy mode (no endpoint configured). */
export interface DummyLeadPayload {
  firstName: string;
  lastName: string;
  email: string;
}

/** Full payload for real submissions (Formspree or custom endpoint). */
export interface LeadPayload extends DummyLeadPayload {
  /** e.g. hero-find-home */
  source?: string;
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
  /** Listing context when user opened the form from a property detail */
  listingId?: string;
  listingSummary?: string;
}

function getLeadsUrl(): string {
  if (LEADS_ENDPOINT) return LEADS_ENDPOINT;
  if (FORMSPREE_ID) return `https://formspree.io/f/${FORMSPREE_ID}`;
  return '';
}

export async function submitLead(payload: LeadPayload): Promise<{ ok: boolean; error?: string }> {
  const url = getLeadsUrl();
  if (!url) {
    // Dummy mode: no endpoint configured, simulate success until database is connected
    return { ok: true };
  }

  const isFormspree = url.includes('formspree.io');
  const body = isFormspree
    ? new URLSearchParams({
        _subject: payload.listingSummary
          ? `Red Post Realty - Lead: ${payload.listingSummary}`
          : 'Red Post Realty - New Lead',
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
        source: payload.source ?? '',
        listingId: payload.listingId ?? '',
        listingSummary: payload.listingSummary ?? '',
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
        source: payload.source,
        listing_id: payload.listingId,
        listing_summary: payload.listingSummary,
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
