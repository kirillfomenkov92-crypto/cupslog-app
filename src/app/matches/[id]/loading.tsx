import { SkeletonBlock } from "@/components/Skeleton";

export default function MatchLoading() {
  return (
    <div className="px-6 md:px-8 py-8 max-w-3xl">
      {/* Status row */}
      <div className="flex items-center gap-3 mb-6">
        <SkeletonBlock className="h-4 w-12 rounded-full" />
        <SkeletonBlock className="h-5 w-20 rounded-full" />
      </div>

      {/* Hero score */}
      <div className="relative rounded-2xl bg-card border border-line overflow-hidden mb-8">
        <div className="px-6 py-10">
          <div className="flex items-center justify-center gap-4 sm:gap-10">
            <div className="flex-1 text-right">
              <SkeletonBlock className="h-7 w-36 ml-auto mb-2" />
              <SkeletonBlock className="h-4 w-16 ml-auto" />
            </div>
            <div className="shrink-0 text-center">
              <SkeletonBlock className="h-16 w-36" />
            </div>
            <div className="flex-1">
              <SkeletonBlock className="h-7 w-36 mb-2" />
              <SkeletonBlock className="h-4 w-16" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
