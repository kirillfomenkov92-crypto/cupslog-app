import { SkeletonBlock } from "@/components/Skeleton";

export default function AdminLoading() {
  return (
    <div className="px-6 md:px-8 py-8">
      <SkeletonBlock className="h-8 w-48 mb-8" />

      <div className="mb-10 pb-10 border-b border-line">
        <SkeletonBlock className="h-5 w-36 mb-4" />
        <div className="bg-card border border-line rounded-xl p-5 max-w-md flex flex-col gap-3">
          <SkeletonBlock className="h-9 w-full" />
          <SkeletonBlock className="h-9 w-full" />
          <SkeletonBlock className="h-9 w-full" />
          <SkeletonBlock className="h-9 w-32" />
        </div>
      </div>

      <SkeletonBlock className="h-5 w-28 mb-6" />
      {[...Array(2)].map((_, i) => (
        <div key={i} className="bg-card border border-line rounded-xl p-6 mb-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <SkeletonBlock className="h-5 w-48 mb-2" />
              <SkeletonBlock className="h-3 w-24" />
            </div>
            <SkeletonBlock className="h-7 w-40 rounded-full" />
          </div>
          <SkeletonBlock className="h-4 w-24 mb-3" />
          <SkeletonBlock className="h-10 w-full rounded-lg mb-4" />
          <SkeletonBlock className="h-4 w-20 mb-3" />
          <SkeletonBlock className="h-10 w-full rounded-lg" />
        </div>
      ))}
    </div>
  );
}
