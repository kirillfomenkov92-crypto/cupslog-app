import { SkeletonCard } from "@/components/Skeleton";

export default function HomeLoading() {
  return (
    <div className="px-6 md:px-8 py-8">
      <div className="mb-8">
        <div className="shimmer rounded-full h-6 w-32 mb-4" />
        <div className="shimmer rounded h-8 w-56 mb-2" />
        <div className="shimmer rounded h-4 w-80" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}
