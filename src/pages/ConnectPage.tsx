import { ImageGrid } from "../components/ui/ImageGrid";
import { Button } from "../components/ui/Button";

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

        <div className="flex flex-col justify-between px-6 py-4 pb-10 items-center gap-6 min-h-fit">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl sm:text-4xl leading-tight font-bold text-text-primary text-center font-serif">
              Connect with students across universities
            </h1>
          </div>

          <div className="w-4/5">
            <Button onClick={onContinue} variant="primary">
              Let's go
            </Button>
          </div>

          <button
            onClick={() => {
              window.location.href = "/login";
            }}
            className="text-center text-sm text-text-secondary active:opacity-70 transition-opacity"
          >
            Already a user?{" "}
            <span className="text-text-primary underline font-medium">
              Login
            </span>
          </button>
        </div>
      </div>

      <div className="h-[15%] min-h-[80px] max-h-[120px] overflow-visible pointer-events-none relative">
        <img
          src="/Splash/waves.svg"
          alt=""
          className="absolute inset-0 h-full object-none w-full overflow-visible"
        />
      </div>
    </div>
  );
};
