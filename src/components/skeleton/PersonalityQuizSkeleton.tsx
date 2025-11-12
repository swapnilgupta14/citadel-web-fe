export const PersonalityQuizSkeleton = () => {
  return (
    <div className="flex-1 flex flex-col px-4 min-h-0 overflow-hidden">
      <div className="flex-1 overflow-y-auto min-h-0 scrollbar-hide">
        <div className="flex flex-col gap-8">
          {[...Array(3)].map((_, questionIndex) => (
            <div key={questionIndex} className="flex flex-col gap-4">
              <div className="h-6 bg-background-secondary rounded animate-pulse w-3/4"></div>
              <div className="flex flex-col gap-3 px-1">
                {[...Array(3)].map((_, optionIndex) => (
                  <div
                    key={optionIndex}
                    className="w-full p-4 rounded-xl bg-background-secondary border-2 border-border animate-pulse"
                  >
                    <div className="flex items-center justify-between">
                      <div className="h-5 bg-background-tertiary rounded w-2/3"></div>
                      <div className="w-5 h-5 rounded border-2 border-white/30"></div>
                    </div>
                  </div>
                ))}
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
