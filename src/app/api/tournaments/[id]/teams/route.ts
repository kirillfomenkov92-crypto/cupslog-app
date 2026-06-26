import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const teamSchema = z.object({
  name: z.string().min(2, "Название должно содержать минимум 2 символа"),
  tag: z
    .string()
    .min(1, "Тег обязателен")
    .max(5, "Тег не может быть длиннее 5 символов")
    .regex(/^[A-Z0-9]+$/, "Тег должен содержать только заглавные буквы и цифры"),
  logoUrl: z.string().url("Некорректный URL логотипа").optional().nullable(),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id: tournamentId } = await params;
  const body = await req.json();
  const parsed = teamSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: first.message, field: String(first.path[0] ?? "") },
      { status: 400 }
    );
  }
  const { name, tag, logoUrl } = parsed.data;
  const team = await prisma.team.create({
    data: { name, tag, logoUrl, tournamentId },
  });
  return NextResponse.json(team, { status: 201 });
}
