import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/health/consents — doctor requests access to a patient's records
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const userId = (session.user as { id?: string }).id;
  const role   = (session.user as { role?: string }).role;
  if (!userId || !["DOCTOR", "ADMIN"].includes(role ?? "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { patientProfileId, purpose, expiresAt } = await req.json();
  if (!patientProfileId || !purpose) {
    return NextResponse.json({ error: "patientProfileId and purpose are required" }, { status: 400 });
  }

  const consent = await prisma.consent.create({
    data: {
      patientId:   patientProfileId,
      requestedBy: userId,
      purpose,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    },
  });

  return NextResponse.json(consent, { status: 201 });
}
