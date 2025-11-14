import { useState, useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui";
import type { OTPEntryPageProps } from "../../types/pages";
import { otpSchema } from "../../lib/helpers/validations";
import { useKeyboardHeight } from "../../hooks/logic";

export const OTPEntryPage = ({
  email,
  onBack,
  onContinue,
  onResendOTP,
  isLoading = false,
  isResending = false,
}: OTPEntryPageProps) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(30);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const keyboardHeight = useKeyboardHeight();
  const buttonRef = useRef<HTMLDivElement>(null);

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
    <div className="flex h-full flex-col bg-background overflow-y-auto">
      <div className="flex flex-col pt-4 px-4 pb-2 flex-shrink-0">
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
        {email && (
          <p className="text-sm text-text-secondary mt-2">
            We sent a code to {email}
          </p>
        )}
      </div>

      <div className="flex-1 flex flex-col px-4 py-4 min-h-0 flex-shrink-0">
        <div className="flex gap-3">
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
              onChange={(e) => {
                handleOTPChange(index, e.target.value);
                if (!touched && e.target.value) {
                  setTouched(true);
                }
              }}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              onBlur={() => {
                if (isOTPComplete) {
                  setTouched(true);
                  validateOTP();
                }
              }}
              className={`w-16 h-16 text-center text-2xl font-semibold bg-button-search rounded-3xl border text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                error && touched
                  ? "border-red-500 focus:ring-red-500"
                  : "border-border"
              }`}
            />
          ))}
        </div>
        {error && touched && (
          <p className="text-sm text-red-500 mt-4 px-1">{error}</p>
        )}

        <div className="mt-6">
          <button
            onClick={handleResend}
            disabled={resendTimer > 0 || isResending}
            className={`text-sm flex items-center gap-2 ${
              resendTimer > 0 || isResending
                ? "text-text-secondary cursor-not-allowed"
                : "text-text-primary underline cursor-pointer"
            }`}
          >
            {isResending ? (
              <>
                <span className="flex gap-1">
                  <span
                    className="w-1 h-1 rounded-full bg-text-secondary animate-bounce"
                    style={{
                      animationDelay: "0ms",
                      animationDuration: "600ms",
                    }}
                  />
                  <span
                    className="w-1 h-1 rounded-full bg-text-secondary animate-bounce"
                    style={{
                      animationDelay: "150ms",
                      animationDuration: "600ms",
                    }}
                  />
                  <span
                    className="w-1 h-1 rounded-full bg-text-secondary animate-bounce"
                    style={{
                      animationDelay: "300ms",
                      animationDuration: "600ms",
                    }}
                  />
                </span>
                Resending...
              </>
            ) : resendTimer > 0 ? (
              `Resend OTP in ${resendTimer} seconds`
            ) : (
              "Resend OTP"
            )}
          </button>
        </div>
      </div>

      <div
        ref={buttonRef}
        className="px-6 py-4 pb-6 flex-shrink-0"
        style={{
          paddingBottom:
            keyboardHeight > 0
              ? `${Math.max(24, keyboardHeight + 16)}px`
              : "24px",
        }}
      >
        <Button
          onClick={handleContinue}
          disabled={!isOTPValid()}
          variant={isOTPValid() ? "primary" : "disabled"}
          isLoading={isLoading}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
