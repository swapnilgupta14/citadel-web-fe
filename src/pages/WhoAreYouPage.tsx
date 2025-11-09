import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/Button";
import type { WhoAreYouPageProps } from "../types/pages";
import { nameSchema, genderSchema } from "../lib/validations";

type Gender = "male" | "female" | "other";

export const WhoAreYouPage = ({ 
  onBack, 
  onContinue, 
  initialName = "", 
  initialGender 
}: WhoAreYouPageProps) => {
  const [name, setName] = useState(initialName);
  const [gender, setGender] = useState<Gender | null>(initialGender || null);

  useEffect(() => {
    if (initialName) setName(initialName);
    if (initialGender) setGender(initialGender);
  }, [initialName, initialGender]);
  const [nameError, setNameError] = useState<string | null>(null);
  const [genderError, setGenderError] = useState<string | null>(null);
  const [nameTouched, setNameTouched] = useState(false);
  const [genderTouched, setGenderTouched] = useState(false);

  const validateName = (value: string) => {
    const result = nameSchema.safeParse(value);
    if (!result.success) {
      setNameError(result.error.issues[0].message);
      return false;
    }
    setNameError(null);
    return true;
  };

  const validateGender = (value: Gender | null) => {
    if (value === null) {
      setGenderError("Please select a gender");
      return false;
    }
    const result = genderSchema.safeParse(value);
    if (!result.success) {
      setGenderError(result.error.issues[0].message);
      return false;
    }
    setGenderError(null);
    return true;
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (nameTouched) {
      validateName(value);
    }
  };

  const handleGenderSelect = (value: Gender) => {
    setGender(value);
    setGenderTouched(true);
    validateGender(value);
  };

  const handleContinue = () => {
    setNameTouched(true);
    setGenderTouched(true);
    const isNameValid = validateName(name);
    const isGenderValid = validateGender(gender);

    if (isNameValid && isGenderValid && gender) {
      onContinue({ name: name.trim(), gender });
    }
  };

  const isValid = () => {
    if (!name.trim() || !gender) return false;
    const nameResult = nameSchema.safeParse(name.trim());
    const genderResult = gender !== null ? genderSchema.safeParse(gender) : { success: false };
    return nameResult.success && genderResult.success;
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
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            onBlur={() => {
              setNameTouched(true);
              validateName(name);
            }}
            placeholder="Write your full name"
            className={`w-full h-11 px-4 py-2.5 bg-button-search rounded-lg border text-text-secondary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
              nameError && nameTouched
                ? "border-red-500 focus:ring-red-500"
                : "border-border"
            }`}
          />
          {nameError && nameTouched && (
            <p className="text-sm text-red-500 px-1">{nameError}</p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-text-primary text-base">Gender</label>
          <div className="flex gap-3">
            {(["male", "female", "other"] as Gender[]).map((option) => (
              <button
                key={option}
                onClick={() => handleGenderSelect(option)}
                className={`flex-1 h-11 rounded-lg border transition-all ${
                  gender === option
                    ? "bg-primary text-background border-transparent"
                    : genderError && genderTouched
                    ? "bg-background-tertiary text-text-primary border-red-500"
                    : "bg-background-tertiary text-text-primary border-border"
                }`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
          {genderError && genderTouched && (
            <p className="text-sm text-red-500 px-1">{genderError}</p>
          )}
        </div>
      </div>

      <div className="px-6 py-4 pb-6">
        <Button
          onClick={handleContinue}
          disabled={!isValid()}
          variant={isValid() ? "primary" : "disabled"}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
