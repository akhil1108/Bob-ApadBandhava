import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/health/consultations — doctor creates a consultation record
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const userId = (session.user as { id?: string }).id;
  const role   = (session.user as { role?: string }).role;
  if (!userId || role !== "DOCTOR") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { patientProfileId, notes, prescription } = await req.json();
  if (!patientProfileId) return NextResponse.json({ error: "patientProfileId is required" }, { status: 400 });

  const doctor = await prisma.doctorProfile.findUnique({ where: { userId } });
  if (!doctor) return NextResponse.json({ error: "Doctor profile not found" }, { status: 404 });

  const consultation = await prisma.consultation.create({
    data: {
      patientId: patientProfileId,
      doctorId:  doctor.id,
      notes:        notes        ?? undefined,
      prescription: prescription ?? undefined,
    },
    include: { patient: { include: { user: true } }, doctor: { include: { user: true } } },
  });

  return NextResponse.json(consultation, { status: 201 });
}

// GET /api/health/consultations — doctor lists patients they can consult
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const userId = (session.user as { id?: string }).id;
  const role   = (session.user as { role?: string }).role;
  if (!userId || role !== "DOCTOR") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const doctor = await prisma.doctorProfile.findUnique({ where: { userId } });
  if (!doctor) return NextResponse.json([], { status: 200 });

  const consultations = await prisma.consultation.findMany({
    where: { doctorId: doctor.id },
    include: { patient: { include: { user: true } }, documents: true },
    orderBy: { consultedAt: "desc" },
  });

  return NextResponse.json(consultations);
}
