export const ProfileSkeleton = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-[130px] h-[130px] rounded-[5px] border-2 border-dashed border-white/20 bg-background-secondary animate-pulse mb-6" />
      <div className="h-9 bg-background-secondary rounded animate-pulse w-48 mb-2" />
      <div className="h-7 bg-background-secondary rounded animate-pulse w-28" />
      <div className="h-5 bg-background-secondary rounded animate-pulse w-40 mt-1" />
    </div>
  );
};

interface ProfileMenuSkeletonProps {
  count?: number;
  showBorder?: boolean;
}

export const ProfileMenuSkeleton = ({
  count = 6,
  showBorder = true,
}: ProfileMenuSkeletonProps) => {
  return (
    <div className="flex flex-col">
      {[...Array(count)].map((_, index) => {
        const isLast = index === count - 1;

        return (
          <div
            key={index}
            className={`w-full flex items-center gap-4 p-4 bg-background-secondary animate-pulse ${
              showBorder && !isLast ? "border-b border-border" : ""
            }`}
          >
            <div className="w-11 h-11 rounded-xl bg-white/5 flex-shrink-0" />
          </div>
        );
      })}
    </div>
  );
};
