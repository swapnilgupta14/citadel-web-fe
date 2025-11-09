import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/Button";
import type { EmailEntryPageProps } from "../types/pages";

export const EmailEntryPage = ({ onBack, onContinue }: EmailEntryPageProps) => {
  const [email, setEmail] = useState("");

  const isValidEmail = email.trim().length > 0 && email.includes("@");

  const handleContinue = () => {
    if (isValidEmail) {
      onContinue(email);
    }
  };

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
          Your email
        </h1>
      </div>

      <div className="flex-1 flex flex-col px-4 py-4 min-h-0">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Sign up with your university email ID."
          className="w-full h-11 px-4 py-2.5 bg-button-search rounded-lg border border-border text-text-secondary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <div className="px-6 py-4 pb-6">
        <Button
          onClick={handleContinue}
          disabled={!isValidEmail}
          variant={isValidEmail ? "primary" : "disabled"}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
