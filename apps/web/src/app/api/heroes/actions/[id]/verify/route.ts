import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const role = (session.user as { role?: string }).role ?? "";
  if (role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const POINTS_AWARD = 10;

  const action = await prisma.heroAction.update({
    where: { id },
    data: { verified: true, pointsAwarded: POINTS_AWARD },
  });

  // Add points to volunteer's ledger
  await prisma.volunteerProfile.update({
    where: { id: action.volunteerId },
    data: { points: { increment: POINTS_AWARD } },
  });

  return NextResponse.json(action);
}
