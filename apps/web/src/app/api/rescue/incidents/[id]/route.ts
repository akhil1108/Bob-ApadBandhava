import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const VALID_TRANSITIONS: Record<string, string[]> = {
  REPORTED:     ["ACKNOWLEDGED", "CANCELLED"],
  ACKNOWLEDGED: ["DISPATCHED",   "CANCELLED"],
  DISPATCHED:   ["ARRIVED",      "CANCELLED"],
  ARRIVED:      ["COMPLETED",    "CANCELLED"],
  COMPLETED:    [],
  CANCELLED:    [],
};

// PATCH /api/rescue/incidents/[id]/status — progress incident through lifecycle
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const role = (session.user as { role?: string }).role ?? "";
  if (!["HOSPITAL", "AMBULANCE", "ADMIN"].includes(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const { status: newStatus } = await req.json();

  const incident = await prisma.incident.findUnique({ where: { id } });
  if (!incident) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const allowed = VALID_TRANSITIONS[incident.status] ?? [];
  if (!allowed.includes(newStatus)) {
    return NextResponse.json(
      { error: `Cannot transition from ${incident.status} to ${newStatus}` },
      { status: 422 }
    );
  }

  const updated = await prisma.incident.update({
    where: { id },
    data: { status: newStatus },
  });

  return NextResponse.json(updated);
}

// GET /api/rescue/incidents/[id] — single incident with full detail
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { id } = await params;

  const incident = await prisma.incident.findUnique({
    where: { id },
    include: {
      reporter: { select: { name: true, role: true } },
      responses: {
        include: {
          hospital:  { include: { user: { select: { name: true } } } },
          ambulance: { include: { user: { select: { name: true } } } },
        },
      },
      heroActions: {
        include: { volunteer: { include: { user: { select: { name: true } } } } },
      },
    },
  });

  if (!incident) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(incident);
}
