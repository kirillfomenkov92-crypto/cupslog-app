import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const tournamentSchema = z.object({
  name: z.string().min(2, "Название должно содержать минимум 2 символа"),
  description: z.string().optional(),
  startDate: z.string().min(1, "Укажите дату начала").refine((v) => !isNaN(Date.parse(v)), "Некорректная дата"),
  endDate: z.string().optional().nullable(),
});

export async function GET() {
  const tournaments = await prisma.tournament.findMany({
    include: { teams: true, _count: { select: { matches: true } } },
    orderBy: { startDate: "desc" },
  });
  return NextResponse.json(tournaments);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const parsed = tournamentSchema.safeParse(body);
  if (!parsed.success) {
    const issues = parsed.error.issues;
    const first = issues[0];
    return NextResponse.json(
      { error: first.message, field: String(first.path[0] ?? "") },
      { status: 400 }
    );
  }
  const { name, description, startDate, endDate } = parsed.data;
  const tournament = await prisma.tournament.create({
    data: {
      name,
      description,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
    },
  });
  return NextResponse.json(tournament, { status: 201 });
}
