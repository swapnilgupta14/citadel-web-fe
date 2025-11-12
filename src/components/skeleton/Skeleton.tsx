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

export const EventDetailCardSkeleton = () => {
  return (
    <div className="relative z-10 flex flex-col gap-4">
      <div className="pr-24">
        <div className="h-5 bg-background-tertiary rounded w-2/3 mb-2 animate-pulse"></div>
        <div className="h-4 bg-background-tertiary rounded w-1/2 animate-pulse"></div>
      </div>

      <div>
        <div className="h-4 bg-background-tertiary rounded w-1/3 mb-2 animate-pulse"></div>
        <div className="h-5 bg-background-tertiary rounded w-3/4 animate-pulse"></div>
      </div>

      <div>
        <div className="h-4 bg-background-tertiary rounded w-1/3 mb-2 animate-pulse"></div>
        <div className="flex items-center justify-between">
          <div className="h-5 bg-background-tertiary rounded w-2/3 animate-pulse"></div>
          <div className="w-6 h-6 bg-background-tertiary rounded animate-pulse"></div>
        </div>
      </div>

      <div className="my-2">
        <svg width="100%" height="2" xmlns="http://www.w3.org/2000/svg">
          <line
            x1="0"
            y1="1"
            x2="100%"
            y2="1"
            stroke="#2C2C2C"
            strokeWidth="1"
            strokeDasharray="8 6"
          />
        </svg>
      </div>

      <div className="flex items-center justify-between">
        <div className="h-10 bg-background-tertiary rounded-full w-24 animate-pulse"></div>
        <div className="h-5 bg-background-tertiary rounded w-20 animate-pulse"></div>
      </div>
    </div>
  );
};
