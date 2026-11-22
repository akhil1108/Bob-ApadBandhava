# LIFEBridge

**Every Second Matters. Every Life Connects Us.**

A connected healthcare and emergency-response platform for patients, doctors, hospitals, ambulance operators, and community volunteers.

---

## Monorepo Structure

```
lifebridge/
├── apps/
│   ├── web/          → Next.js 14 web app  (deployed to Vercel)
│   └── mobile/       → Expo React Native Android app
└── packages/
    └── shared/       → Shared TypeScript types & Supabase config
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Install dependencies

```bash
npm install
```

### Run web app locally

```bash
npm run dev
# opens http://localhost:3000
```

### Run Android app

```bash
cd apps/mobile
npx expo start
# scan QR with Expo Go on your Android device
```

## Environment Setup

```bash
cp apps/web/.env.example apps/web/.env.local
# fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY from supabase.com
```

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the full system design.

## Tech Stack

| Layer | Technology |
|---|---|
| Web | Next.js 14, Tailwind CSS |
| Android | Expo, React Native, NativeWind |
| Backend | Next.js API Routes (serverless) |
| Database | Supabase (PostgreSQL + PostGIS) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Realtime | Supabase Realtime |
| AI | IBM watsonx.ai |
| Maps | OpenStreetMap + Leaflet |
| Hosting | Vercel (web), Expo EAS (mobile) |
