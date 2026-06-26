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
  const match = await prisma.match.create({
    data: {
      tournamentId,
      team1Id: body.team1Id,
      team2Id: body.team2Id,
      format: body.format ?? "BO1",
      mapPool: body.mapPool ?? [],
      scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
    },
    include: { team1: true, team2: true },
  });
  return NextResponse.json(match, { status: 201 });
}
