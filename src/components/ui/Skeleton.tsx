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

