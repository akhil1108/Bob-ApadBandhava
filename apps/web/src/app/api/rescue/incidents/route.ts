import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { extractIncidentFields } from "@/lib/watsonx";

export async function GET() {
  const incidents = await prisma.incident.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { reporter: { select: { name: true } }, responses: true },
  });
  return NextResponse.json(incidents);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const userId = (session.user as { id?: string }).id;
  if (!userId) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { description, latitude, longitude } = await req.json();
  if (!description || latitude == null || longitude == null) {
    return NextResponse.json({ error: "description, latitude and longitude are required." }, { status: 400 });
  }

  // IBM watsonx.ai — extract structured fields (assistive only)
  const aiExtracted = await extractIncidentFields(description);

  const incident = await prisma.incident.create({
    data: { reporterId: userId, description, latitude, longitude, aiExtracted },
  });

  return NextResponse.json(incident, { status: 201 });
}
