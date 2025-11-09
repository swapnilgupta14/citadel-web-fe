import { useState, useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/Button";
import type { LoginOTPPageProps } from "../types/pages";
import { otpSchema } from "../lib/validations";

export const LoginOTPPage = ({
  email,
  onBack,
  onContinue,
  onResendOTP,
}: LoginOTPPageProps) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(30);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }

    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 4);
    if (/^\d{1,4}$/.test(pastedData)) {
      const newOtp = ["", "", "", ""];
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      const nextIndex = Math.min(pastedData.length, 3);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const isOTPComplete = otp.every((digit) => digit !== "");

  const validateOTP = () => {
    const otpString = otp.join("");
    const result = otpSchema.safeParse(otpString);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return false;
    }
    setError(null);
    return true;
  };

  const isOTPValid = () => {
    if (!isOTPComplete) return false;
    const otpString = otp.join("");
    const result = otpSchema.safeParse(otpString);
    return result.success;
  };

  const handleContinue = () => {
    setTouched(true);
    if (validateOTP()) {
      onContinue(otp.join(""));
    }
  };

  useEffect(() => {
    if (isOTPComplete && touched) {
      validateOTP();
    } else if (!isOTPComplete && touched) {
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp.join(""), isOTPComplete, touched]);

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
          Enter OTP
        </h1>
        <p className="text-sm text-text-secondary mt-2">
          We sent a code to {email}
        </p>
      </div>

      <div className="flex-1 flex flex-col px-4 py-4 min-h-0 gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex gap-3 justify-center">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOTPChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`w-14 h-14 text-center text-2xl font-bold bg-button-search rounded-lg border text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                  error && touched
                    ? "border-red-500 focus:ring-red-500"
                    : "border-border"
                }`}
              />
            ))}
          </div>
          {error && touched && (
            <p className="text-sm text-red-500 text-center px-1">{error}</p>
          )}
        </div>

        <div className="flex flex-col items-center gap-4 mt-auto">
          <button
            onClick={onResendOTP}
            disabled={resendTimer > 0}
            className={`text-sm ${
              resendTimer > 0
                ? "text-text-muted cursor-not-allowed"
                : "text-primary active:opacity-70 transition-opacity"
            }`}
          >
            {resendTimer > 0
              ? `Resend OTP in ${resendTimer}s`
              : "Resend OTP"}
          </button>
        </div>
      </div>

      <div className="px-6 py-4 pb-6">
        <Button
          onClick={handleContinue}
          disabled={!isOTPValid()}
          variant={isOTPValid() ? "primary" : "disabled"}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

