import { SkeletonBlock, SkeletonMatchCard } from "@/components/Skeleton";

export default function TournamentLoading() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center gap-3 mb-8">
        <SkeletonBlock className="h-9 w-56" />
        <SkeletonBlock className="h-6 w-16 rounded-full" />
      </div>
      <SkeletonBlock className="h-6 w-24 mb-4" />
      <div className="grid gap-2.5 mb-10">
        <SkeletonMatchCard />
        <SkeletonMatchCard />
        <SkeletonMatchCard />
      </div>
      <SkeletonBlock className="h-6 w-32 mb-4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-4 rounded-xl bg-card border border-line">
            <SkeletonBlock className="h-5 w-32 mb-3" />
            <SkeletonBlock className="h-3 w-24 mb-1" />
            <SkeletonBlock className="h-3 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
