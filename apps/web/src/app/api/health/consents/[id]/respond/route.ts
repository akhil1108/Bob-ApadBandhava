import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH /api/health/consents/[id]/respond — patient approves or revokes a consent request
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const userId = (session.user as { id?: string }).id;
  const role   = (session.user as { role?: string }).role;
  if (!userId || role !== "PATIENT") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const { action } = await req.json(); // "APPROVED" | "REVOKED"

  if (!["APPROVED", "REVOKED"].includes(action)) {
    return NextResponse.json({ error: "action must be APPROVED or REVOKED" }, { status: 400 });
  }

  // Verify this consent belongs to the requesting patient
  const profile = await prisma.patientProfile.findUnique({ where: { userId } });
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const consent = await prisma.consent.findUnique({ where: { id } });
  if (!consent || consent.patientId !== profile.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await prisma.consent.update({
    where: { id },
    data: { status: action },
  });

  return NextResponse.json(updated);
}
