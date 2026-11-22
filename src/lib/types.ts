// Domain types for the UI mock layer. Mirror these in the real API later.

export type Role = "citizen" | "patient" | "doctor" | "hospital" | "ambulance" | "volunteer" | "admin";

export type IncidentStatus =
  | "reported"
  | "requested"
  | "acknowledged"
  | "accepted"
  | "dispatched"
  | "arrived"
  | "completed";

export type DataOrigin = "patient-reported" | "provider-authored" | "system-generated" | "ai-generated";

export interface GeoPoint {
  lat: number;
  lng: number;
  label: string;
}

export interface TimelineEvent {
  at: string; // ISO timestamp
  actor: string;
  message: string;
  simulated: boolean;
}

export interface Incident {
  id: string;
  type: string;
  description: string;
  peopleAffected: number;
  location: GeoPoint;
  status: IncidentStatus;
  reportedAt: string;
  aiExtraction?: {
    incidentType: string;
    reportedInjuries: string;
    confidence: number;
    reviewedByHuman: boolean;
  };
  providerResponses: ProviderResponse[];
  volunteerIds: string[];
  timeline: TimelineEvent[];
}

export type ProviderKind = "hospital" | "ambulance";

export interface Provider {
  id: string;
  name: string;
  kind: ProviderKind;
  location: GeoPoint;
  distanceKm: number;
  capabilities: string[];
}

export interface ProviderResponse {
  providerId: string;
  state: "pending" | "acknowledged" | "declined" | "accepted";
  at?: string;
  note?: string;
}

export interface MedicalRecord {
  id: string;
  title: string;
  kind: "consultation" | "prescription" | "lab-report" | "imaging" | "referral";
  date: string;
  author: string;
  facility: string;
  origin: DataOrigin;
  verified: boolean;
  summary: string;
}

export interface ConsentRequest {
  id: string;
  requester: string;
  purpose: string;
  recordIds: string[];
  status: "pending" | "granted" | "denied" | "revoked" | "expired";
  requestedAt: string;
  expiresAt?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  bloodGroup: string;
  allergies: string[];
  conditions: string[];
}

export interface Volunteer {
  id: string;
  name: string;
  certifications: string[];
  points: number;
}

export interface Participation {
  id: string;
  volunteerId: string;
  incidentId: string;
  contribution: string;
  status: "submitted" | "under-review" | "verified" | "rejected";
  points?: number;
}

export interface LedgerEntry {
  id: string;
  volunteerId: string;
  at: string;
  points: number;
  reason: string;
  verifiedBy: string;
}
