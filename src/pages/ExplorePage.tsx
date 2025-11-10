export const ExplorePage = () => {
  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <h1 className="text-3xl sm-phone:text-4xl leading-tight font-bold text-text-primary text-center font-serif mb-4">
          Find university students worldwide with one click!
        </h1>
        <div className="flex flex-col gap-4 w-full max-w-sm mt-8">
          <button className="w-full min-h-[3.5rem] bg-primary rounded-full flex items-center justify-center text-background text-lg font-semibold shadow-lg active:scale-95 transition-transform">
            Interested
          </button>
          <button className="w-full min-h-[3.5rem] border-2 border-red-500 rounded-full flex items-center justify-center text-red-500 text-lg font-semibold active:scale-95 transition-transform">
            Not Interested
          </button>
        </div>
      </div>
    </div>
  );
};
