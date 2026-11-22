import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { name, email, password, role } = await req.json();

  const validRoles = ["PATIENT", "DOCTOR", "HOSPITAL", "AMBULANCE", "VOLUNTEER"];
  if (!name || !email || !password || !validRoles.includes(role)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already registered." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { name, email, passwordHash, role },
  });

  // Create the role-specific profile
  if (role === "PATIENT") {
    await prisma.patientProfile.create({ data: { userId: user.id } });
  } else if (role === "DOCTOR") {
    await prisma.doctorProfile.create({ data: { userId: user.id } });
  } else if (role === "HOSPITAL") {
    await prisma.hospitalProfile.create({ data: { userId: user.id } });
  } else if (role === "AMBULANCE") {
    await prisma.ambulanceProfile.create({ data: { userId: user.id } });
  } else if (role === "VOLUNTEER") {
    await prisma.volunteerProfile.create({ data: { userId: user.id } });
  }

  return NextResponse.json({ id: user.id }, { status: 201 });
}
