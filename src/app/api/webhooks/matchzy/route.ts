import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/ratelimit";

interface MatchZyEvent {
  event: string;
  matchid?: string;
  team1?: { score: number };
  team2?: { score: number };
  winner?: { team: string };
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(ip, 60, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }

  const match = await prisma.match.findUnique({
    where: { webhookToken: token },
    include: { team1: true, team2: true },
  });

  if (!match) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  let body: MatchZyEvent;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.event === "round_end") {
    await prisma.match.update({
      where: { id: match.id },
      data: {
        team1Score: body.team1?.score ?? match.team1Score,
        team2Score: body.team2?.score ?? match.team2Score,
        status: "LIVE",
      },
    });
    return NextResponse.json({ ok: true });
  }

  if (body.event === "series_end") {
    const winnerTeam = body.winner?.team;
    const winnerId =
      winnerTeam === "team1"
        ? match.team1Id
        : winnerTeam === "team2"
          ? match.team2Id
          : null;

    await prisma.match.update({
      where: { id: match.id },
      data: {
        team1Score: body.team1?.score ?? match.team1Score,
        team2Score: body.team2?.score ?? match.team2Score,
        status: "COMPLETED",
        winnerId,
      },
    });
    return NextResponse.json({ ok: true });
  }

  // All other events — log and acknowledge
  console.log(`[matchzy] event=${body.event} matchId=${match.id}`);
  return NextResponse.json({ ok: true });
}
