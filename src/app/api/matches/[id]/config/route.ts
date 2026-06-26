import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  let match = await prisma.match.findUnique({
    where: { id },
    include: { team1: true, team2: true },
  });
  if (!match) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Generate token on first config download and persist it
  if (!match.webhookToken) {
    const token = crypto.randomBytes(32).toString("hex");
    match = await prisma.match.update({
      where: { id },
      data: { webhookToken: token },
      include: { team1: true, team2: true },
    });
  }

  const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";
  const webhookUrl = `${siteUrl}/api/webhooks/matchzy?token=${match.webhookToken}`;

  const formatMap: Record<string, string> = { BO1: "1", BO3: "3", BO5: "5" };
  const numMaps = formatMap[match.format] ?? "1";

  const mapPoolLines: string[] = [];
  if (match.mapPool && match.mapPool.length > 0) {
    mapPoolLines.push(`matchzy_map_pool "${match.mapPool.join(",")}"`);
  }

  const cfg = [
    `// CupsLog match config — ${match.team1.name} vs ${match.team2.name}`,
    `// Generated: ${new Date().toISOString()}`,
    ``,
    `matchzy_team1_name "${match.team1.name}"`,
    `matchzy_team2_name "${match.team2.name}"`,
    `matchzy_num_maps "${numMaps}"`,
    ...mapPoolLines,
    ``,
    `matchzy_remote_log_url "${webhookUrl}"`,
    `matchzy_remote_log_header_key ""`,
    `matchzy_remote_log_header_value ""`,
    ``,
    `matchzy_pausing_enabled 1`,
    `matchzy_max_pauses_per_team 4`,
    `matchzy_enable_tech_pause 1`,
    `matchzy_max_tech_pauses_allowed 1`,
    `matchzy_tech_pause_duration 60`,
  ].join("\n");

  return new NextResponse(cfg, {
    headers: {
      "Content-Type": "text/plain",
      "Content-Disposition": `attachment; filename="match_${id}.cfg"`,
    },
  });
}
