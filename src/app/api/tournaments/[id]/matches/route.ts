import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const matchSchema = z
  .object({
    team1Id: z.string().min(1, "Выберите команду 1"),
    team2Id: z.string().min(1, "Выберите команду 2"),
    format: z.enum(["BO1", "BO3", "BO5"], { error: "Формат должен быть BO1, BO3 или BO5" }),
    mapPool: z.array(z.string()).optional(),
    scheduledAt: z.string().optional().nullable(),
  })
  .refine((d) => d.team1Id !== d.team2Id, {
    message: "Команды должны быть разными",
    path: ["team2Id"],
  });

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id: tournamentId } = await params;
  const body = await req.json();
  const parsed = matchSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: first.message, field: String(first.path[0] ?? "") },
      { status: 400 }
    );
  }
  const { team1Id, team2Id, format, mapPool, scheduledAt } = parsed.data;
  const match = await prisma.match.create({
    data: {
      tournamentId,
      team1Id,
      team2Id,
      format,
      mapPool: mapPool ?? [],
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
    },
    include: { team1: true, team2: true },
  });
  return NextResponse.json(match, { status: 201 });
}
