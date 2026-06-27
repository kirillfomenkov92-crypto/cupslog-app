import { SkeletonBlock, SkeletonMatchCard } from "@/components/Skeleton";

export default function TournamentLoading() {
  return (
    <div className="px-6 md:px-8 py-8">
      {/* Header */}
      <div className="relative mb-8 pb-8 border-b border-line">
        <SkeletonBlock className="h-8 w-64 mb-3" />
        <SkeletonBlock className="h-4 w-48 mb-3" />
        <div className="flex gap-4">
          <SkeletonBlock className="h-3 w-20" />
          <SkeletonBlock className="h-3 w-20" />
          <SkeletonBlock className="h-3 w-24" />
        </div>
      </div>

      {/* Matches */}
      <SkeletonBlock className="h-6 w-24 mb-4" />
      <div className="grid gap-2 mb-10">
        <SkeletonMatchCard />
        <SkeletonMatchCard />
        <SkeletonMatchCard />
      </div>

      {/* Teams */}
      <SkeletonBlock className="h-6 w-36 mb-4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-4 rounded-xl bg-card border border-line">
            <div className="flex items-center gap-3 mb-3">
              <SkeletonBlock className="h-9 w-9 rounded-lg" />
              <div className="flex-1">
                <SkeletonBlock className="h-4 w-28 mb-1.5" />
                <SkeletonBlock className="h-3 w-12" />
              </div>
            </div>
            <SkeletonBlock className="h-3 w-full mb-1" />
            <SkeletonBlock className="h-3 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}
