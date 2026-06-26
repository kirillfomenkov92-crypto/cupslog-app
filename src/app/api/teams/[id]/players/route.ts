import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const playerSchema = z.object({
  nickname: z.string().min(1, "Никнейм обязателен"),
  realName: z.string().optional().nullable(),
  steamId: z.string().optional().nullable(),
});

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
  const parsed = playerSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: first.message, field: String(first.path[0] ?? "") },
      { status: 400 }
    );
  }
  const { nickname, realName, steamId } = parsed.data;
  const player = await prisma.player.create({
    data: { nickname, realName, steamId, teamId },
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
