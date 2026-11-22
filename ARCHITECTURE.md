# LIFEBridge — Application Architecture

> **Guiding principle:** Use only 100% free services. No credit card. No running cost during MVP/hackathon phase.

---

## Free Services Used

| Service | What it provides | Free Limit |
|---|---|---|
| **Supabase** | PostgreSQL + PostGIS + Auth + Storage + Realtime | 500 MB DB, 1 GB storage, 50K users, 2 projects |
| **Vercel** | Web hosting + serverless API functions | 100 GB bandwidth, unlimited deployments |
| **Expo** | Mobile build + OTA updates + push notifications | Free for open source / small teams |
| **OpenStreetMap + Leaflet** | Maps & geocoding | Unlimited, forever free |
| **IBM watsonx.ai** | AI incident text extraction | Hackathon trial credits (free) |
| **GitHub + GitHub Actions** | Source code + CI/CD | Free for public repos |

> **Total running cost: $0**

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                            CLIENTS                              │
│                                                                 │
│   ┌──────────────────────┐     ┌──────────────────────────┐    │
│   │     Web App          │     │      Android App         │    │
│   │  Next.js 14          │     │  Expo + React Native     │    │
│   │  (Vercel — free)     │     │  (Expo Go / APK)         │    │
│   └──────────┬───────────┘     └────────────┬─────────────┘    │
└──────────────┼──────────────────────────────┼──────────────────┘
               │  HTTPS                       │  HTTPS
               ▼                              ▼
┌──────────────────────────────────────────���──────────────────────┐
│               API LAYER (Next.js API Routes on Vercel)          │
│                                                                 │
│   /api/auth       /api/health      /api/rescue    /api/heroes   │
│                        │                │               │       │
│                        └────────────────┴───────────────┘       │
│                                     │                           │
│                              IBM watsonx.ai                     │
│                         (incident text extraction)              │
└──────────────────────────────┬──────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│                     SUPABASE (Free Tier)                        │
│                                                                 │
│   ┌───────────┐  ┌──────────────────┐  ┌──────────┐  ┌──────┐  │
│   │   Auth    │  │ PostgreSQL        │  │ Storage  │  │  RT  │  │
│   │ Email+JWT │  │ + PostGIS         │  │ Med docs │  │ Live │  │
│   │ + Roles   │  │ (incidents, users │  │          │  │ push │  │
│   └───────────┘  │  health records) │  └──────────┘  └──────┘  │
│                  └──────────────────┘                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Monorepo Structure

```
lifebridge/                          ← GitHub repo (Turborepo monorepo)
├── apps/
│   ├── web/                         ← Next.js 14  →  deployed to Vercel
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (auth)/          ← Login / Register pages
│   │   │   │   ├── (health)/        ← Patient records, consultations, consent
│   │   │   │   ├── (rescue)/        ← Report incident, ops dashboard, map
│   │   │   │   ├── (heroes)/        ← Volunteer portal, points ledger
│   │   │   │   └── api/             ← All backend serverless API routes
│   │   │   ├── components/
│   │   │   └── lib/
│   │   └── package.json
│   └── mobile/                      ← Expo app  →  Android APK via EAS Build
│       ├── app/                     ← Same screens mirroring web
│       ├── components/
│       └── package.json
└── packages/
    └── shared/                      ← Shared between web & mobile
        ├── types.ts                 ← User, Incident, HeroAction, etc.
        └── supabase.ts              ← Supabase client (reused on both sides)
```

---

## Technology Choices

| Layer | Web | Android |
|---|---|---|
| Framework | Next.js 14 (App Router) | React Native + Expo |
| Styling | Tailwind CSS | NativeWind (Tailwind for RN) |
| State / Data fetching | React Query + Zustand | Same |
| Auth | Supabase Auth (JWT + roles) | Same |
| Database | Supabase PostgreSQL + PostGIS | — (via API) |
| Storage | Supabase Storage | — (via API) |
| Realtime | Supabase Realtime (WebSocket) | Same |
| Maps | Leaflet + OpenStreetMap | React Native Maps + OSM |
| Push notifications | — (web alerts) | Expo Push Notifications |
| AI | IBM watsonx.ai (server-side only) | — (via API) |
| Hosting | Vercel (free) | Expo Go / EAS Build (free) |
| CI/CD | GitHub Actions | GitHub Actions |

---

## Auth & Role Strategy

Roles are stored in Supabase `user_metadata` at registration — no extra table needed.

```
Register (choose role)
        │
        ▼
Supabase Auth  ──►  JWT with role claim
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
        Web Routes   API Routes  Mobile Screens
        (guarded)    (guarded)   (guarded)
```

### Roles

| Role | Access |
|---|---|
| `patient` | Own health records, consent management, report incident |
| `doctor` | Patient consultations (with consent), upload documents |
| `hospital` | Acknowledge rescue requests, capacity management |
| `ambulance` | Acknowledge dispatch requests, location updates |
| `volunteer` | Report assistance, view own points ledger |
| `admin` | Full access, verify hero actions, manage users |

---

## Three Core Modules

### 1. LIFEBridge Health
Patient-controlled longitudinal health records.

- Patient registration and profile
- Doctor consultations and referrals
- Prescription and report uploads (Supabase Storage)
- Consent-based record sharing
- IBM AI-assisted document summaries

### 2. LIFEBridge Rescue
Emergency incident reporting and coordination.

- Citizen reports incident with text + map pin
- IBM watsonx.ai extracts structured fields (type, severity, location)
- Nearby hospitals and ambulances queried via PostGIS
- Providers receive push notification and can acknowledge/decline
- Live incident status updates via Supabase Realtime

### 3. LIFEBridge Heroes
Community volunteer recognition.

- Volunteer registration and first-aid certification records
- Link volunteer to an incident
- Admin verification workflow
- Points ledger (auditable, tamper-evident)

---

## Critical Data Flow — Emergency Rescue

```
Citizen types incident + pins location
              │
              ▼
    POST /api/rescue/incidents
              │
              ├──► IBM watsonx.ai  →  extract {type, severity, injuries}
              │
              ├──► INSERT into Supabase Postgres (incidents table)
              │
              ├──► PostGIS query  →  find nearby hospitals & ambulances
              │
              ├──► Expo Push  →  notify ambulance & hospital apps
              │
              └──► Supabase Realtime  →  broadcast to ops dashboard
                                │
                      Responder acknowledges
                                │
                      Incident status updated
                                │
                      Live update on citizen's screen
```

---

## Database Tables (Supabase PostgreSQL)

```sql
users              -- managed by Supabase Auth
patient_profiles   -- dob, blood group, allergies
doctor_profiles    -- specialisation, licence
hospital_profiles  -- address, lat/lng, capacity
ambulance_profiles -- vehicle no, lat/lng
volunteer_profiles -- certified, points
consultations      -- doctor + patient + notes + ai_summary
documents          -- file url, consultation id
consents           -- patient → requester, status, expiry
incidents          -- reporter, description, lat/lng, status, ai_extracted (jsonb)
incident_responses -- incident + hospital/ambulance + acknowledged
hero_actions       -- incident + volunteer + verified + points_awarded
```

---

## MVP Feature Matrix

| Feature | Web | Android |
|---|---|---|
| Register / Login by role | ✅ | ✅ |
| Report incident + map pin | ✅ | ✅ |
| IBM AI extracts incident fields | ✅ | ✅ |
| Ops dashboard with live updates | ✅ | ✅ |
| Hospital / Ambulance acknowledge | ✅ | ✅ |
| Patient health profile | ✅ | ✅ |
| Upload medical documents | ✅ | ✅ |
| Consent-based record sharing | ✅ | ✅ |
| Volunteer registration + points | ✅ | ✅ |
| Admin verification panel | ✅ | — |

---

## Deployment Pipeline

```
GitHub push  →  GitHub Actions
                    │
                    ├──► Vercel (web)   →  auto-deploys web app
                    └──► EAS Build      →  builds Android APK (free tier)
```

---

## Running Cost Summary

| Phase | Cost |
|---|---|
| Hackathon / MVP | **$0 / month** |
| Post-hackathon (small scale) | **$0 / month** (within free limits) |
| Growth (>50K users or >500MB DB) | ~$45–50 / month |
