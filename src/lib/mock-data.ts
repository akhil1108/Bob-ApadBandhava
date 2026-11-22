// ALL DATA IN THIS FILE IS SYNTHETIC. Never place real patient or incident data here.
import type {
  ConsentRequest,
  Incident,
  LedgerEntry,
  MedicalRecord,
  Participation,
  Patient,
  Provider,
  Volunteer,
} from "./types";

export const providers: Provider[] = [
  {
    id: "hosp-1",
    name: "Demo City Hospital (Simulated)",
    kind: "hospital",
    location: { lat: 12.9121, lng: 77.6446, label: "HSR Layout" },
    distanceKm: 2.1,
    capabilities: ["Trauma", "ICU", "Orthopaedics"],
  },
  {
    id: "hosp-2",
    name: "Sample Multispecialty Clinic (Simulated)",
    kind: "hospital",
    location: { lat: 12.9279, lng: 77.6271, label: "Koramangala" },
    distanceKm: 3.4,
    capabilities: ["Emergency", "General Surgery"],
  },
  {
    id: "amb-1",
    name: "Demo Ambulance Unit A (Simulated)",
    kind: "ambulance",
    location: { lat: 12.9166, lng: 77.6101, label: "BTM Layout" },
    distanceKm: 1.6,
    capabilities: ["BLS"],
  },
  {
    id: "amb-2",
    name: "Demo Ambulance Unit B (Simulated)",
    kind: "ambulance",
    location: { lat: 12.9352, lng: 77.6245, label: "Koramangala 5th Block" },
    distanceKm: 3.9,
    capabilities: ["ALS", "Ventilator"],
  },
];

export const incidents: Incident[] = [
  {
    id: "INC-2026-0001",
    type: "Road accident",
    description: "Two-wheeler and car collision near the Silk Board junction. One rider on the ground, conscious.",
    peopleAffected: 2,
    location: { lat: 12.9177, lng: 77.6238, label: "Silk Board Junction, Bengaluru" },
    status: "acknowledged",
    reportedAt: "2026-11-22T09:14:00+05:30",
    aiExtraction: {
      incidentType: "Road traffic collision",
      reportedInjuries: "1 conscious rider, possible leg injury",
      confidence: 0.82,
      reviewedByHuman: false,
    },
    providerResponses: [
      { providerId: "amb-1", state: "acknowledged", at: "2026-11-22T09:16:00+05:30" },
      { providerId: "amb-2", state: "pending" },
      { providerId: "hosp-1", state: "pending" },
      { providerId: "hosp-2", state: "declined", at: "2026-11-22T09:17:00+05:30", note: "No trauma bed" },
    ],
    volunteerIds: ["vol-1"],
    timeline: [
      { at: "2026-11-22T09:14:00+05:30", actor: "Citizen", message: "Incident reported", simulated: true },
      { at: "2026-11-22T09:14:05+05:30", actor: "IBM AI", message: "Structured details extracted (pending review)", simulated: true },
      { at: "2026-11-22T09:15:00+05:30", actor: "System", message: "Requests sent to 4 participating providers", simulated: true },
      { at: "2026-11-22T09:16:00+05:30", actor: "Demo Ambulance Unit A", message: "Acknowledged request", simulated: true },
      { at: "2026-11-22T09:17:00+05:30", actor: "Sample Multispecialty Clinic", message: "Declined: no trauma bed", simulated: true },
    ],
  },
  {
    id: "INC-2026-0002",
    type: "Medical emergency",
    description: "Elderly person collapsed at bus stop, breathing.",
    peopleAffected: 1,
    location: { lat: 12.9308, lng: 77.6205, label: "Koramangala Bus Stop" },
    status: "completed",
    reportedAt: "2026-11-21T18:02:00+05:30",
    providerResponses: [{ providerId: "amb-2", state: "accepted", at: "2026-11-21T18:04:00+05:30" }],
    volunteerIds: ["vol-2"],
    timeline: [
      { at: "2026-11-21T18:02:00+05:30", actor: "Citizen", message: "Incident reported", simulated: true },
      { at: "2026-11-21T18:04:00+05:30", actor: "Demo Ambulance Unit B", message: "Accepted and dispatched", simulated: true },
      { at: "2026-11-21T18:19:00+05:30", actor: "Demo Ambulance Unit B", message: "Arrived on scene", simulated: true },
      { at: "2026-11-21T18:52:00+05:30", actor: "Demo City Hospital", message: "Patient received; incident closed", simulated: true },
    ],
  },
];

export const patient: Patient = {
  id: "pat-1",
  name: "Asha Demo",
  age: 34,
  bloodGroup: "B+",
  allergies: ["Penicillin"],
  conditions: ["Mild asthma"],
};

export const records: MedicalRecord[] = [
  {
    id: "rec-1",
    title: "General consultation",
    kind: "consultation",
    date: "2026-08-12",
    author: "Dr. Sample Physician",
    facility: "Demo Family Clinic",
    origin: "provider-authored",
    verified: true,
    summary: "Seasonal wheeze. Inhaler prescribed. Referred to pulmonologist.",
  },
  {
    id: "rec-2",
    title: "Salbutamol inhaler",
    kind: "prescription",
    date: "2026-08-12",
    author: "Dr. Sample Physician",
    facility: "Demo Family Clinic",
    origin: "provider-authored",
    verified: true,
    summary: "2 puffs as needed, max 4 times a day.",
  },
  {
    id: "rec-3",
    title: "Complete blood count",
    kind: "lab-report",
    date: "2026-08-14",
    author: "Demo Diagnostics Lab",
    facility: "Demo Diagnostics Lab",
    origin: "patient-reported",
    verified: false,
    summary: "Uploaded by patient. Values within reference range.",
  },
  {
    id: "rec-4",
    title: "Referral to pulmonology",
    kind: "referral",
    date: "2026-08-12",
    author: "Dr. Sample Physician",
    facility: "Demo Family Clinic",
    origin: "provider-authored",
    verified: true,
    summary: "Referred to Dr. Example Specialist for spirometry.",
  },
];

export const consentRequests: ConsentRequest[] = [
  {
    id: "con-1",
    requester: "Dr. Example Specialist (Pulmonology)",
    purpose: "Specialist consultation following referral",
    recordIds: ["rec-1", "rec-2", "rec-3"],
    status: "pending",
    requestedAt: "2026-11-20T11:00:00+05:30",
  },
  {
    id: "con-2",
    requester: "Dr. Sample Physician",
    purpose: "Follow-up consultation",
    recordIds: ["rec-3"],
    status: "granted",
    requestedAt: "2026-08-15T10:00:00+05:30",
    expiresAt: "2026-12-15T10:00:00+05:30",
  },
];

export const volunteers: Volunteer[] = [
  { id: "vol-1", name: "Ravi Volunteer", certifications: ["First Aid (Demo Cert)"], points: 120 },
  { id: "vol-2", name: "Meera Volunteer", certifications: ["CPR (Demo Cert)", "First Aid (Demo Cert)"], points: 340 },
];

export const participations: Participation[] = [
  {
    id: "par-1",
    volunteerId: "vol-1",
    incidentId: "INC-2026-0001",
    contribution: "Kept the scene safe, directed traffic and guided the ambulance in.",
    status: "under-review",
  },
  {
    id: "par-2",
    volunteerId: "vol-2",
    incidentId: "INC-2026-0002",
    contribution: "Placed person in recovery position and stayed until the ambulance arrived.",
    status: "verified",
    points: 50,
  },
];

export const ledger: LedgerEntry[] = [
  {
    id: "led-1",
    volunteerId: "vol-2",
    at: "2026-11-21T20:00:00+05:30",
    points: 50,
    reason: "Verified assistance on INC-2026-0002",
    verifiedBy: "Admin (Demo)",
  },
];

// Lookup helpers
export const getIncident = (id: string) => incidents.find((i) => i.id === id);
export const getProvider = (id: string) => providers.find((p) => p.id === id);
export const getRecord = (id: string) => records.find((r) => r.id === id);
export const getVolunteer = (id: string) => volunteers.find((v) => v.id === id);
