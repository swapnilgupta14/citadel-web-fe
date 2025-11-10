import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UniversitySelectionPage } from "../pages/UniversitySelectionPage";
import { EmailEntryPage } from "../pages/EmailEntryPage";
import { OTPEntryPage } from "../pages/OTPEntryPage";
import { WhoAreYouPage } from "../pages/WhoAreYouPage";
import { DateOfBirthPage } from "../pages/DateOfBirthPage";
import { DegreeSelectionPage } from "../pages/DegreeSelectionPage";
import { SuccessPage } from "../pages/SuccessPage";
import { useAuth } from "../hooks/logic/useAuth";
import { useSignupFlow } from "../hooks/logic/useSignupFlow";

type SignupStep =
  | "university"
  | "email"
  | "otp"
  | "whoAreYou"
  | "dateOfBirth"
  | "degree"
  | "success";

export const SignupFlow = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<SignupStep>("university");

  const {
    userEmail,
    isLoading: authLoading,
    isResending,
    sendOTP,
    verifyOTP,
    resendOTP,
  } = useAuth();

  const {
    signupData,
    isLoading: signupLoading,
    updateSignupData,
    createProfile,
  } = useSignupFlow();

  const handleUniversityBack = () => {
    navigate("/connect");
  };

  const handleUniversityContinue = (universityId: string) => {
    updateSignupData({ universityId });
    setCurrentStep("email");
  };

  const handleEmailBack = () => {
    setCurrentStep("university");
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
    try {
      await verifyOTP(userEmail, otp);
      setCurrentStep("whoAreYou");
    } catch {
      // Error already handled
    }
  };

  const handleResendOTP = async () => {
    await resendOTP(userEmail);
  };

  const handleWhoAreYouBack = () => {
    setCurrentStep("otp");
  };

  const handleWhoAreYouContinue = (data: {
    name: string;
    gender: "male" | "female" | "other";
  }) => {
    updateSignupData({
      name: data.name,
      gender: data.gender,
    });
    setCurrentStep("dateOfBirth");
  };

  const handleDateOfBirthBack = () => {
    setCurrentStep("whoAreYou");
  };

  const handleDateOfBirthContinue = (data: {
    day: string;
    month: string;
    year: string;
  }) => {
    const dateOfBirth = `${data.year}-${data.month.padStart(2, "0")}-${data.day.padStart(2, "0")}`;
    updateSignupData({ dateOfBirth });
    setCurrentStep("degree");
  };

  const handleDegreeBack = () => {
    setCurrentStep("dateOfBirth");
  };

  const handleDegreeContinue = async (data: {
    degree: string;
    year: string;
  }) => {
    updateSignupData(data);

    const finalData = { ...signupData, ...data };
    const success = await createProfile(finalData);

    if (success) {
      setCurrentStep("success");
    }
  };

  const handleSuccessComplete = () => {
    navigate("/events");
  };

  if (currentStep === "university") {
    return (
      <UniversitySelectionPage
        onBack={handleUniversityBack}
        onContinue={handleUniversityContinue}
        initialUniversityId={signupData.universityId}
      />
    );
  }

  if (currentStep === "email") {
    return (
      <EmailEntryPage
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

  if (currentStep === "whoAreYou") {
    return (
      <WhoAreYouPage
        onBack={handleWhoAreYouBack}
        onContinue={handleWhoAreYouContinue}
        initialName={signupData.name}
        initialGender={signupData.gender}
      />
    );
  }

  if (currentStep === "dateOfBirth") {
    return (
      <DateOfBirthPage
        onBack={handleDateOfBirthBack}
        onContinue={handleDateOfBirthContinue}
        initialDateOfBirth={signupData.dateOfBirth}
      />
    );
  }

  if (currentStep === "degree") {
    return (
      <DegreeSelectionPage
        onBack={handleDegreeBack}
        onContinue={handleDegreeContinue}
        initialDegree={signupData.degree}
        initialYear={signupData.year}
        isLoading={signupLoading}
      />
    );
  }

  if (currentStep === "success") {
    return <SuccessPage onComplete={handleSuccessComplete} />;
  }

  return null;
};
