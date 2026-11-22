import { config } from "dotenv";

// Load .env.local for Prisma CLI (Next.js doesn't expose it automatically)
config({ path: ".env.local" });
