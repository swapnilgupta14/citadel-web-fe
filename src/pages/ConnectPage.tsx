import { ImageGrid } from "../components/ui/ImageGrid";

interface ConnectPageProps {
  onContinue: () => void;
}

export const ConnectPage = ({ onContinue }: ConnectPageProps) => {
  return (
    <div className="relative flex h-full flex-col bg-background overflow-hidden">
      <div className="flex flex-col flex-1 relative z-10 min-h-0">
        <div className="flex-1 flex items-center justify-center relative px-4 py-4 min-h-0">
          <ImageGrid
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-full max-h-full"
          />
        </div>

        <div className="flex flex-col justify-between px-6 py-4 pb-6 items-center gap-6 min-h-fit">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl sm:text-4xl leading-tight font-bold text-text-primary text-center font-serif">
              Connect with students across universities
            </h1>
          </div>

          <button
            onClick={onContinue}
            className="w-4/5 min-h-[3.5rem] bg-primary rounded-full flex items-center justify-center text-background text-lg font-semibold shadow-lg active:scale-95 transition-transform"
          >
            Let's go
          </button>

          <p className="text-center text-sm text-text-secondary">
            Already a user?{" "}
            <span className="text-text-primary underline font-medium cursor-pointer">
              Login
            </span>
          </p>
        </div>
      </div>

      <div className="h-[15%] min-h-[80px] max-h-[120px] overflow-hidden pointer-events-none bg-primary">
        <span></span>
      </div>
    </div>
  );
};
