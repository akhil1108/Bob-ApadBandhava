import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH /api/health/profile — patient updates their own profile
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const userId = (session.user as { id?: string }).id;
  const role   = (session.user as { role?: string }).role;
  if (!userId || role !== "PATIENT") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { bloodGroup, allergies, dob } = await req.json();

  const profile = await prisma.patientProfile.update({
    where: { userId },
    data: {
      bloodGroup: bloodGroup ?? undefined,
      allergies:  allergies  ?? undefined,
      dob:        dob ? new Date(dob) : undefined,
    },
  });

  return NextResponse.json(profile);
}

// GET /api/health/profile — patient fetches own profile
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const userId = (session.user as { id?: string }).id;
  if (!userId) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const profile = await prisma.patientProfile.findUnique({ where: { userId } });
  return NextResponse.json(profile);
}
