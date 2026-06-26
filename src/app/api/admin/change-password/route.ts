import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  currentPassword: z.string().min(1, "Введите текущий пароль"),
  newPassword: z.string().min(8, "Новый пароль должен содержать минимум 8 символов"),
  confirmPassword: z.string().min(1, "Подтвердите новый пароль"),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  if ((session?.user as { role?: string })?.role !== "ADMIN" || !userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json({ error: first.message, field: String(first.path[0] ?? "") }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: userEmail } });
  if (!user) return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });

  const valid = await bcrypt.compare(parsed.data.currentPassword, user.password);
  if (!valid) {
    return NextResponse.json({ error: "Неверный текущий пароль", field: "currentPassword" }, { status: 400 });
  }

  const hashed = await bcrypt.hash(parsed.data.newPassword, 12);
  await prisma.user.update({ where: { email: userEmail }, data: { password: hashed } });

  return NextResponse.json({ ok: true });
}
