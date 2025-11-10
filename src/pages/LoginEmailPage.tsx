import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/Button";
import type { LoginEmailPageProps } from "../types/pages";
import { emailSchema } from "../lib/validations";

export const LoginEmailPage = ({ onBack, onContinue, initialEmail = "", isLoading = false }: LoginEmailPageProps) => {
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  const validateEmail = (value: string) => {
    const result = emailSchema.safeParse(value);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return false;
    }
    setError(null);
    return true;
  };

  const isEmailValid = () => {
    const result = emailSchema.safeParse(email.trim());
    return result.success;
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (touched) {
      validateEmail(value);
    }
  };

  const handleBlur = () => {
    setTouched(true);
    validateEmail(email);
  };

  const handleContinue = () => {
    setTouched(true);
    if (validateEmail(email)) {
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
          Login
        </h1>
      </div>

      <div className="flex-1 flex flex-col px-4 py-4 min-h-0 gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => handleEmailChange(e.target.value)}
          onBlur={handleBlur}
          placeholder="Enter your email address"
          className={`w-full h-11 px-4 py-2.5 bg-button-search rounded-lg border text-text-secondary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
            error && touched
              ? "border-red-500 focus:ring-red-500"
              : "border-border"
          }`}
        />
        {error && touched && (
          <p className="text-sm text-red-500 px-1">{error}</p>
        )}
      </div>

      <div className="px-6 py-4 pb-6">
        <Button
          onClick={handleContinue}
          disabled={!isEmailValid()}
          variant={isEmailValid() ? "primary" : "disabled"}
          isLoading={isLoading}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

