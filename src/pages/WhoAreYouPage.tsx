import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/Button";
import type { WhoAreYouPageProps } from "../types/pages";

type Gender = "male" | "female" | "other";

export const WhoAreYouPage = ({ onBack, onContinue }: WhoAreYouPageProps) => {
  const [name, setName] = useState("");
  const [gender, setGender] = useState<Gender | null>(null);

  const isValid = name.trim().length > 0 && gender !== null;

  const handleContinue = () => {
    if (isValid && gender) {
      onContinue({ name: name.trim(), gender });
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
        <h1 className="text-4xl leading-tight font-bold text-text-primary font-serif">
          Who are you?
        </h1>
      </div>

      <div className="flex-1 flex flex-col px-4 py-4 min-h-0 gap-6">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Write your full name"
          className="w-full h-11 px-4 py-2.5 bg-button-search rounded-lg border border-border text-text-secondary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />

        <div className="flex flex-col gap-3">
          <label className="text-text-primary text-base">Gender</label>
          <div className="flex gap-3">
            {(["male", "female", "other"] as Gender[]).map((option) => (
              <button
                key={option}
                onClick={() => setGender(option)}
                className={`flex-1 h-11 rounded-lg border border-border transition-all ${
                  gender === option
                    ? "bg-primary text-background"
                    : "bg-background-tertiary text-text-primary"
                }`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 py-4 pb-6">
        <Button
          onClick={handleContinue}
          disabled={!isValid}
          variant={isValid ? "primary" : "disabled"}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
