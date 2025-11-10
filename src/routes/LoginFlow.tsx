import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginEmailPage } from "../pages/LoginEmailPage";
import { OTPEntryPage } from "../pages/OTPEntryPage";
import { useAuth } from "../hooks/logic/useAuth";
import { signupPersistence } from "../lib/storage/signupPersistence";

type LoginStep = "email" | "otp";

export const LoginFlow = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<LoginStep>("email");

  useEffect(() => {
    signupPersistence.clearSignupData();
  }, []);

  const {
    userEmail,
    isLoading: authLoading,
    isResending,
    sendOTP,
    verifyOTP,
    resendOTP,
  } = useAuth();

  const handleEmailBack = () => {
    navigate("/connect");
  };

  const handleEmailContinue = async (email: string) => {
    const success = await sendOTP(email);
    if (success) {
      setCurrentStep("otp");
    }
  };

  const handleOTPBack = () => {
    setCurrentStep("email");
  };

  const handleOTPContinue = async (otp: string) => {
    await verifyOTP(userEmail, otp);
    navigate("/events");
  };

  const handleResendOTP = async () => {
    await resendOTP(userEmail);
  };

  if (currentStep === "email") {
    return (
      <LoginEmailPage
        onBack={handleEmailBack}
        onContinue={handleEmailContinue}
        initialEmail={userEmail}
        isLoading={authLoading}
      />
    );
  }

  if (currentStep === "otp") {
    return (
      <OTPEntryPage
        email={userEmail}
        onBack={handleOTPBack}
        onContinue={handleOTPContinue}
        onResendOTP={handleResendOTP}
        isLoading={authLoading}
        isResending={isResending}
      />
    );
  }

  return null;
};
