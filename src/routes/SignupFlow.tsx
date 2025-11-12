import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UniversitySelectionPage } from "../pages/signup/UniversitySelectionPage";
import { EmailEntryPage } from "../pages/signup/EmailEntryPage";
import { OTPEntryPage } from "../pages/auth/OTPEntryPage";
import { WhoAreYouPage } from "../pages/signup/WhoAreYouPage";
import { DateOfBirthPage } from "../pages/signup/DateOfBirthPage";
import { DegreeSelectionPage } from "../pages/signup/DegreeSelectionPage";
import { SuccessPage } from "../pages/signup/SuccessPage";
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
    clearSignupData,
  } = useSignupFlow();

  const handleUniversityBack = () => {
    clearSignupData();
    navigate("/connect");
  };

  const handleUniversityContinue = (university: {
    id: string;
    name: string;
    country: string;
    domain?: string;
  }) => {
    console.log("=== UNIVERSITY SELECTION - Continue ===");
    console.log("University:", university);
    updateSignupData({ university });
    setCurrentStep("email");
  };

  const handleEmailBack = () => {
    setCurrentStep("university");
  };

  const handleEmailContinue = async (email: string) => {
    const success = await sendOTP(email, false);
    if (success) {
      setCurrentStep("otp");
    }
  };

  const handleOTPBack = () => {
    setCurrentStep("email");
  };

  const handleOTPContinue = async (otp: string) => {
    console.log("=== OTP VERIFICATION - Continue ===");
    console.log("Email:", userEmail);
    console.log("OTP:", otp);
    try {
      await verifyOTP(userEmail, otp);
      console.log("OTP verified successfully");
      setCurrentStep("whoAreYou");
    } catch (error) {
      console.error("OTP verification failed:", error);
    }
  };

  const handleResendOTP = async () => {
    await resendOTP(userEmail, false);
  };

  const handleWhoAreYouBack = () => {
    setCurrentStep("otp");
  };

  const handleWhoAreYouContinue = (data: {
    name: string;
    gender: "male" | "female" | "other";
  }) => {
    console.log("=== WHO ARE YOU - Continue ===");
    console.log("Name and gender data:", data);
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
    console.log("=== DATE OF BIRTH - Continue ===");
    console.log("Date data:", data);
    const dateOfBirth = `${data.year}-${data.month.padStart(2, "0")}-${data.day.padStart(2, "0")}`;
    console.log("Formatted date of birth:", dateOfBirth);
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
    console.log("=== SIGNUP FLOW - Degree Continue ===");
    console.log("Degree data received:", data);
    console.log("Current signup data before update:", signupData);

    updateSignupData(data);

    const finalData = { ...signupData, ...data };
    console.log("Final data to be sent:", finalData);

    const success = await createProfile(finalData);
    console.log("Profile creation success:", success);

    if (success) {
      console.log("Moving to success page");
      setCurrentStep("success");
    } else {
      console.log("Profile creation failed, staying on degree page");
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
        initialUniversityId={signupData.university?.id}
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
