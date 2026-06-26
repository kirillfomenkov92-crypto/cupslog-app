# Graph Report - /home/yan/projects/cupslog  (2026-06-26)

## Corpus Check
- Corpus is ~4,919 words - fits in a single context window. You may not need a graph.

## Summary
- 134 nodes · 144 edges · 17 communities (10 shown, 7 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.77)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Match API & Auth Routes|Match API & Auth Routes]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_Project Overview & Docs|Project Overview & Docs]]
- [[_COMMUNITY_Dev Dependencies|Dev Dependencies]]
- [[_COMMUNITY_Package Scripts & Meta|Package Scripts & Meta]]
- [[_COMMUNITY_Runtime Dependencies|Runtime Dependencies]]
- [[_COMMUNITY_Admin Panel Components|Admin Panel Components]]
- [[_COMMUNITY_App Layout & Navigation|App Layout & Navigation]]
- [[_COMMUNITY_Tournament Live Score|Tournament Live Score]]
- [[_COMMUNITY_Match Live Score Banner|Match Live Score Banner]]
- [[_COMMUNITY_Admin Seed Script|Admin Seed Script]]
- [[_COMMUNITY_MatchZy Webhook|MatchZy Webhook]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_Next.js Config|Next.js Config]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `authOptions` - 8 edges
3. `CupsLog - Next.js Application` - 7 edges
4. `scripts` - 6 edges
5. `Next.js Framework` - 5 edges
6. `Vercel Deployment Platform` - 4 edges
7. `AGENTS.md - Next.js Agent Rules` - 3 edges
8. `AdminMatchCard()` - 2 edges
9. `CreateTournamentForm()` - 2 edges
10. `LiveScore()` - 2 edges

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

## Communities (17 total, 7 thin omitted)

### Community 0 - "Match API & Auth Routes"
Cohesion: 0.11
Nodes (3): authOptions, globalForPrisma, handler

### Community 1 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 2 - "Project Overview & Docs"
Cohesion: 0.19
Nodes (13): AGENTS.md - Next.js Agent Rules, CLAUDE.md - Claude Code Instructions, CupsLog - Next.js Application, Geist Font (Vercel), Rationale: Next.js may have breaking changes vs training data, Next.js Framework, File Icon SVG (document/file icon), Globe Icon SVG (web/internet icon) (+5 more)

### Community 3 - "Dev Dependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, tsx, @types/bcryptjs, @types/node (+4 more)

### Community 4 - "Package Scripts & Meta"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, create-admin, dev, lint, start (+1 more)

### Community 5 - "Runtime Dependencies"
Cohesion: 0.20
Nodes (10): dependencies, bcryptjs, next, next-auth, pg, prisma, @prisma/adapter-pg, @prisma/client (+2 more)

### Community 6 - "Admin Panel Components"
Cohesion: 0.32
Nodes (4): AdminMatchCard(), Match, Team, CreateTournamentForm()

### Community 7 - "App Layout & Navigation"
Cohesion: 0.29
Nodes (3): geist, metadata, SessionProvider()

## Knowledge Gaps
- **66 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+61 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Dev Dependencies` to `Package Scripts & Meta`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Runtime Dependencies` to `Package Scripts & Meta`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `CupsLog - Next.js Application` (e.g. with `File Icon SVG (document/file icon)` and `Globe Icon SVG (web/internet icon)`) actually correct?**
  _`CupsLog - Next.js Application` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _66 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Match API & Auth Routes` be split into smaller, more focused modules?**
  _Cohesion score 0.10541310541310542 - nodes in this community are weakly interconnected._
- **Should `TypeScript Config` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._