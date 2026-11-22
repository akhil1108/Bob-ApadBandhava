// ─── Shared TypeScript Types ──────────────────────────────────────────────────
// Define your app-wide types here. Both web and mobile import from this file.

export type UserRole =
  | "patient"
  | "doctor"
  | "hospital"
  | "ambulance"
  | "volunteer"
  | "admin";

// TODO: Add User, Incident, Consultation, HeroAction types as DB schema is finalised
