import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: teamId } = await params;
  const players = await prisma.player.findMany({ where: { teamId } });
  return NextResponse.json(players);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id: teamId } = await params;
  const body = await req.json();
  const player = await prisma.player.create({
    data: { nickname: body.nickname, realName: body.realName, steamId: body.steamId, teamId },
  });
  return NextResponse.json(player, { status: 201 });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id: teamId } = await params;
  const { playerId } = await req.json();
  await prisma.player.deleteMany({ where: { id: playerId, teamId } });
  return NextResponse.json({ ok: true });
}
