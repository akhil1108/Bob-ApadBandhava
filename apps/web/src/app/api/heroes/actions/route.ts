import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/heroes/actions — volunteer logs a hero action on an incident
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const userId = (session.user as { id?: string }).id;
  const role   = (session.user as { role?: string }).role;
  if (!userId || role !== "VOLUNTEER") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { incidentId, description } = await req.json();
  if (!incidentId) return NextResponse.json({ error: "incidentId is required" }, { status: 400 });

  const volunteer = await prisma.volunteerProfile.findUnique({ where: { userId } });
  if (!volunteer) return NextResponse.json({ error: "Volunteer profile not found" }, { status: 404 });

  // Prevent duplicate: one action per volunteer per incident
  const existing = await prisma.heroAction.findFirst({
    where: { incidentId, volunteerId: volunteer.id },
  });
  if (existing) {
    return NextResponse.json({ error: "You have already logged a contribution for this incident." }, { status: 409 });
  }

  const action = await prisma.heroAction.create({
    data: { incidentId, volunteerId: volunteer.id, description: description ?? undefined },
    include: { incident: { select: { description: true } } },
  });

  return NextResponse.json(action, { status: 201 });
}
