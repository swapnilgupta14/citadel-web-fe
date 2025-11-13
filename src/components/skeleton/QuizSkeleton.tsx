export const QuizSkeleton = () => {
  return (
    <div className="flex-1 flex flex-col px-6 py-6 min-h-0 overflow-hidden">
      <div className="mb-4 flex-shrink-0">
        <div className="h-7 bg-background-secondary rounded animate-pulse w-full mb-2"></div>
        <div className="h-7 bg-background-secondary rounded animate-pulse w-4/5"></div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 border-b-0">
        <div className="flex flex-col gap-4">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="w-full p-4 rounded-xl bg-background-secondary border-2 border-border animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div className="h-5 bg-background-tertiary rounded w-2/3"></div>
                <div className="w-5 h-5 rounded-full border-2 border-white/30"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex-shrink-0">
        <div className="w-full min-h-[3.5rem] rounded-full bg-background-tertiary animate-pulse"></div>
      </div>
    </div>
  );
};
