import { useState, useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/Button";
import type { OTPEntryPageProps } from "../types/pages";

export const OTPEntryPage = ({
//   email,
  onBack,
  onContinue,
  onResendOTP,
}: OTPEntryPageProps) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(30);
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

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 4);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length && i < 4; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      const nextEmptyIndex = newOtp.findIndex((val) => !val);
      if (nextEmptyIndex !== -1) {
        inputRefs.current[nextEmptyIndex]?.focus();
      } else {
        inputRefs.current[3]?.focus();
      }
    }
  };

  const handleResend = () => {
    if (resendTimer === 0) {
      setResendTimer(30);
      onResendOTP();
    }
  };

  const isOTPComplete = otp.every((digit) => digit !== "");

  const handleContinue = () => {
    if (isOTPComplete) {
      onContinue(otp.join(""));
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
          Enter OTP
        </h1>
      </div>

      <div className="flex-1 flex flex-col px-4 py-4 min-h-0">
        <div className="flex gap-3 justify-start">
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
              className="w-16 h-16 text-center text-2xl font-semibold bg-button-search rounded-3xl border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          ))}
        </div>

        <div className="mt-6">
          <button
            onClick={handleResend}
            disabled={resendTimer > 0}
            className={`text-sm ${
              resendTimer > 0
                ? "text-text-secondary cursor-not-allowed"
                : "text-text-primary underline cursor-pointer"
            }`}
          >
            {resendTimer > 0
              ? `Resend OTP in ${resendTimer} seconds`
              : "Resend OTP"}
          </button>
        </div>
      </div>

      <div className="px-6 py-4 pb-6">
        <Button
          onClick={handleContinue}
          disabled={!isOTPComplete}
          variant={isOTPComplete ? "primary" : "disabled"}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
