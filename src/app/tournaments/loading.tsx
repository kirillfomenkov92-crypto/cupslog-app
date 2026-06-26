import { SkeletonCard } from "@/components/Skeleton";

export default function TournamentsLoading() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="shimmer rounded h-9 w-32 mb-8" />
      <div className="grid gap-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}
