export function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`shimmer rounded ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="p-5 rounded-xl bg-card border border-line">
      <div className="flex items-center justify-between mb-3">
        <SkeletonBlock className="h-5 w-48" />
        <SkeletonBlock className="h-5 w-16 rounded-full" />
      </div>
      <SkeletonBlock className="h-4 w-64 mb-2" />
      <SkeletonBlock className="h-3 w-32" />
    </div>
  );
}

export function SkeletonMatchCard() {
  return (
    <div className="p-4 rounded-xl bg-card border border-line">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <SkeletonBlock className="h-4 w-28" />
          <SkeletonBlock className="h-4 w-12" />
          <SkeletonBlock className="h-4 w-28" />
        </div>
        <SkeletonBlock className="h-4 w-20" />
      </div>
    </div>
  );
}
