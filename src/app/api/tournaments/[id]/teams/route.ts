import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id: tournamentId } = await params;
  const body = await req.json();
  const team = await prisma.team.create({
    data: { name: body.name, tag: body.tag, logoUrl: body.logoUrl, tournamentId },
  });
  return NextResponse.json(team, { status: 201 });
}
