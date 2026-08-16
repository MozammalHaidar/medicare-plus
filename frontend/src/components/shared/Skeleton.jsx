const Skeleton = ({ className = '' }) => (
  <div
    className={`animate-pulse rounded-xl2 bg-primary-100/60 dark:bg-white/10 ${className}`}
    aria-hidden="true"
  />
);

export const DoctorCardSkeleton = () => (
  <div className="overflow-hidden rounded-xl2 bg-white shadow-soft dark:bg-darksurface-card">
    <Skeleton className="h-56 w-full rounded-none" />
    <div className="space-y-3 p-5">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-9 w-full rounded-full" />
    </div>
  </div>
);

export const SpecialtyCardSkeleton = () => (
  <div className="rounded-xl2 border border-primary-100/60 bg-white p-6 dark:border-white/10 dark:bg-darksurface-card">
    <Skeleton className="h-12 w-12" />
    <Skeleton className="mt-4 h-4 w-2/3" />
    <Skeleton className="mt-2 h-3 w-full" />
    <Skeleton className="mt-2 h-3 w-4/5" />
  </div>
);

export const ServiceCardSkeleton = () => (
  <div className="rounded-xl2 bg-white p-7 shadow-soft dark:bg-darksurface-card">
    <Skeleton className="h-12 w-12" />
    <Skeleton className="mt-5 h-4 w-2/3" />
    <Skeleton className="mt-2 h-3 w-full" />
  </div>
);

export const BlogCardSkeleton = () => (
  <div className="overflow-hidden rounded-xl2 bg-white shadow-soft dark:bg-darksurface-card">
    <Skeleton className="h-48 w-full rounded-none" />
    <div className="space-y-3 p-5">
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  </div>
);

export const TextSkeleton = ({ className }) => <Skeleton className={className} />;

export default Skeleton;
