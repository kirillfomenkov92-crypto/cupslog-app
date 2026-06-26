import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tournament = await prisma.tournament.findUnique({
    where: { id },
    include: {
      teams: true,
      matches: {
        include: { team1: true, team2: true, winner: true },
        orderBy: { scheduledAt: "asc" },
      },
    },
  });
  if (!tournament) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(tournament);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await prisma.$transaction([
    prisma.matchMap.deleteMany({ where: { match: { tournamentId: id } } }),
    prisma.match.deleteMany({ where: { tournamentId: id } }),
    prisma.team.deleteMany({ where: { tournamentId: id } }),
    prisma.tournament.delete({ where: { id } }),
  ]);
  return NextResponse.json({ ok: true });
}
