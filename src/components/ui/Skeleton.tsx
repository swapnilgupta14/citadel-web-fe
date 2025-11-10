interface SkeletonProps {
  count?: number;
  className?: string;
  itemClassName?: string;
}

export const Skeleton = ({
  count = 5,
  className = "",
  itemClassName = "",
}: SkeletonProps) => {
  return (
    <div className={`flex flex-col gap-0 ${className}`}>
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          className={`border-b border-border py-4 px-5 bg-background-secondary animate-pulse ${itemClassName}`}
        >
          <div className="h-5 bg-background-tertiary rounded w-3/4"></div>
        </div>
      ))}
    </div>
  );
};

interface EventSlotSkeletonProps {
  count?: number;
  className?: string;
}

export const EventSlotSkeleton = ({
  count = 4,
  className = "",
}: EventSlotSkeletonProps) => {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          className="w-full p-4 rounded-xl bg-[#111111] animate-pulse"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="h-5 bg-background-tertiary rounded w-2/3 mb-2"></div>
              <div className="h-4 bg-background-tertiary rounded w-1/2"></div>
            </div>
            <div className="w-5 h-5 rounded-full border-2 border-white/20"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
