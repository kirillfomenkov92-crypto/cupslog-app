# Graph Report - .  (2026-06-27)

## Corpus Check
- Corpus is ~14,415 words - fits in a single context window. You may not need a graph.

## Summary
- 266 nodes · 304 edges · 24 communities (17 shown, 7 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.78)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Admin API Routes|Admin API Routes]]
- [[_COMMUNITY_Prisma Driver Adapter|Prisma Driver Adapter]]
- [[_COMMUNITY_Admin UI Panel|Admin UI Panel]]
- [[_COMMUNITY_Project Config & Deps|Project Config & Deps]]
- [[_COMMUNITY_Bracket Component|Bracket Component]]
- [[_COMMUNITY_Package Dependencies|Package Dependencies]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_Sidebar Navigation|Sidebar Navigation]]
- [[_COMMUNITY_App Docs & Context|App Docs & Context]]
- [[_COMMUNITY_Root Layout & Shell|Root Layout & Shell]]
- [[_COMMUNITY_LiveScore & Banners|LiveScore & Banners]]
- [[_COMMUNITY_Skeleton Loaders|Skeleton Loaders]]
- [[_COMMUNITY_Webhooks & Ratelimit|Webhooks & Ratelimit]]
- [[_COMMUNITY_Home Page|Home Page]]
- [[_COMMUNITY_Tournaments Page|Tournaments Page]]
- [[_COMMUNITY_Admin Scripts|Admin Scripts]]
- [[_COMMUNITY_Graphify Watch Script|Graphify Watch Script]]
- [[_COMMUNITY_Next.js Config|Next.js Config]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `authOptions` - 13 edges
3. `CupsLog - Next.js Application` - 7 edges
4. `scripts` - 6 edges
5. `Next.js Framework` - 5 edges
6. `Vercel Deployment Platform` - 4 edges
7. `NotFound()` - 3 edges
8. `rateLimit()` - 3 edges
9. `AGENTS.md - Next.js Agent Rules` - 3 edges
10. `@prisma/client` - 2 edges

## Surprising Connections (you probably didn't know these)
- `File Icon SVG (document/file icon)` --conceptually_related_to--> `CupsLog - Next.js Application`  [INFERRED]
  public/file.svg → README.md
- `Globe Icon SVG (web/internet icon)` --conceptually_related_to--> `CupsLog - Next.js Application`  [INFERRED]
  public/globe.svg → README.md
- `Browser Window Icon SVG` --conceptually_related_to--> `CupsLog - Next.js Application`  [INFERRED]
  public/window.svg → README.md
- `Next.js Wordmark SVG Logo` --conceptually_related_to--> `Next.js Framework`  [INFERRED]
  public/next.svg → README.md
- `Vercel Triangle Logo SVG` --conceptually_related_to--> `Vercel Deployment Platform`  [INFERRED]
  public/vercel.svg → README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **CupsLog project built on Next.js and deployed via Vercel** — cupslog_project, nextjs_framework, vercel_platform [EXTRACTED 1.00]
- **Public brand/UI SVG assets for the CupsLog Next.js project** — public_next_svg, public_vercel_svg, public_globe_svg [INFERRED 0.75]
- **Transaction Lifecycle Protocol** — transaction, adapter_class, sql_driver_adapter, savepoint [EXTRACTED]
- **Data Conversion Pipeline** — argument_mapping, row_mapping, column_type_inference, column_type_enum [INFERRED]

## Communities (24 total, 7 thin omitted)

### Community 0 - "Admin API Routes"
Cohesion: 0.08
Nodes (8): schema, authOptions, globalForPrisma, matchSchema, handler, playerSchema, teamSchema, tournamentSchema

### Community 1 - "Prisma Driver Adapter"
Cohesion: 0.11
Nodes (26): MyAdapter (Adapter Class), ArgType, Argument Mapping (mapArg), ColumnTypeEnum, Column Type Inference (inferColumnType), ConnectionInfo, DriverAdapterError, E2E Testing (with PrismaClient) (+18 more)

### Community 2 - "Admin UI Panel"
Cohesion: 0.11
Nodes (10): AdminMatchCard(), Match, Team, CS2_MAPS, Team, CreateTeamForm(), CreateTournamentForm(), DeleteTournamentButton() (+2 more)

### Community 3 - "Project Config & Deps"
Cohesion: 0.09
Nodes (21): eslintConfig, Adapter Implementation Checklist, MySQL/MariaDB Database Support, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss (+13 more)

### Community 4 - "Bracket Component"
Cohesion: 0.11
Nodes (12): Bracket(), BracketMatch, groupIntoRounds(), ROUND_LABELS, Team, LiveScore(), ScoreData, Match (+4 more)

### Community 5 - "Package Dependencies"
Cohesion: 0.10
Nodes (20): dependencies, bcryptjs, next, next-auth, pg, prisma, @prisma/adapter-pg, react (+12 more)

### Community 6 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 8 - "App Docs & Context"
Cohesion: 0.19
Nodes (13): AGENTS.md - Next.js Agent Rules, CLAUDE.md - Claude Code Instructions, CupsLog - Next.js Application, Geist Font (Vercel), Rationale: Next.js may have breaking changes vs training data, Next.js Framework, File Icon SVG (document/file icon), Globe Icon SVG (web/internet icon) (+5 more)

### Community 9 - "Root Layout & Shell"
Cohesion: 0.20
Nodes (4): geist, metadata, viewport, SessionProvider()

### Community 10 - "LiveScore & Banners"
Cohesion: 0.20
Nodes (6): NotFound(), LiveScoreBanner(), ScoreData, MatchPage(), TournamentPage(), MatchStatus

### Community 11 - "Skeleton Loaders"
Cohesion: 0.36
Nodes (3): SkeletonBlock(), SkeletonCard(), SkeletonMatchCard()

### Community 12 - "Webhooks & Ratelimit"
Cohesion: 0.47
Nodes (4): rateLimit(), requests, MatchZyEvent, POST()

## Knowledge Gaps
- **89 isolated node(s):** `.graphify-watch.sh script`, `eslintConfig`, `nextConfig`, `name`, `version` (+84 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Project Config & Deps` to `Package Dependencies`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Package Dependencies` to `Prisma Driver Adapter`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **What connects `.graphify-watch.sh script`, `eslintConfig`, `nextConfig` to the rest of the system?**
  _89 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Admin API Routes` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._
- **Should `Prisma Driver Adapter` be split into smaller, more focused modules?**
  _Cohesion score 0.1076923076923077 - nodes in this community are weakly interconnected._
- **Should `Admin UI Panel` be split into smaller, more focused modules?**
  _Cohesion score 0.1067193675889328 - nodes in this community are weakly interconnected._
- **Should `Project Config & Deps` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._