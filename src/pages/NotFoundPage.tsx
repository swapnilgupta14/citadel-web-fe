import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/Button";
import { auth } from "../lib/auth";

interface NotFoundPageProps {
  onBack: () => void;
}

export const NotFoundPage = ({ onBack }: NotFoundPageProps) => {
  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex flex-col pt-4 px-4 pb-2">
        <button
          onClick={onBack}
          className="self-start mb-4 p-2 -ml-2 active:opacity-70 transition-opacity"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6 text-text-primary" strokeWidth={2} />
        </button>
        <h1 className="text-3xl sm-phone:text-4xl leading-tight font-bold text-text-primary font-serif">
          404
        </h1>
        <p className="text-text-secondary mt-2">
          Page not found
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-6">
        <p className="text-text-secondary text-center">
          The page you're looking for doesn't exist.
        </p>
      </div>

      <div className="px-6 py-4 pb-6">
        <Button onClick={onBack} variant="primary">
          {auth.isAuthenticated() ? "Go to Home" : "Go Back"}
        </Button>
      </div>
    </div>
  );
};

