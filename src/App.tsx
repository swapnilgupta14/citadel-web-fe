import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { MobileLayout } from "./components/layout/MobileLayout";
import { SplashPage } from "./pages/SplashPage";
import { SignupPage } from "./pages/SignupPage";
import { EmailEntryPage } from "./pages/EmailEntryPage";
import { OTPEntryPage } from "./pages/OTPEntryPage";
import { ConnectPage } from "./pages/ConnectPage";
import { UniversitySelectionPage } from "./pages/UniversitySelectionPage";
import { WhoAreYouPage } from "./pages/WhoAreYouPage";
import { DateOfBirthPage } from "./pages/DateOfBirthPage";
import { DegreeSelectionPage } from "./pages/DegreeSelectionPage";
import { SuccessPage } from "./pages/SuccessPage";
import { HomePage } from "./pages/HomePage";

function App() {
  const [currentPage, setCurrentPage] = useState<
    | "splash"
    | "signup"
    | "email"
    | "otp"
    | "connect"
    | "university"
    | "whoAreYou"
    | "dateOfBirth"
    | "degree"
    | "success"
    | "home"
  >("splash");
  const [userEmail, setUserEmail] = useState("");

  const handleSplashComplete = () => {
    setCurrentPage("signup");
  };

  const handleSignupComplete = () => {
    setCurrentPage("connect");
  };

  const handleConnectComplete = () => {
    setCurrentPage("university");
  };

  const handleUniversityBack = () => {
    setCurrentPage("connect");
  };

  const handleUniversityContinue = () => {
    setCurrentPage("email");
  };

  const handleEmailContinue = (email: string) => {
    setUserEmail(email);
    setCurrentPage("otp");
  };

  const handleEmailBack = () => {
    setCurrentPage("university");
  };

  const handleOTPContinue = (_otp: string) => {
    setCurrentPage("whoAreYou");
  };

  const handleOTPBack = () => {
    setCurrentPage("email");
  };

  const handleResendOTP = () => {
    console.log("Resending OTP to:", userEmail);
  };

  const handleWhoAreYouContinue = (_data: {
    name: string;
    gender: "male" | "female" | "other";
  }) => {
    setCurrentPage("dateOfBirth");
  };

  const handleWhoAreYouBack = () => {
    setCurrentPage("otp");
  };

  const handleDateOfBirthContinue = (_data: {
    day: string;
    month: string;
    year: string;
  }) => {
    setCurrentPage("degree");
  };

  const handleDateOfBirthBack = () => {
    setCurrentPage("whoAreYou");
  };

  const handleDegreeContinue = (_data: { degree: string; year: string }) => {
    setCurrentPage("success");
  };

  const handleSuccessComplete = () => {
    setCurrentPage("home");
  };

  const handleDegreeBack = () => {
    setCurrentPage("dateOfBirth");
  };

  return (
    <MobileLayout>
      <AnimatePresence mode="wait">
        {currentPage === "splash" && (
          <SplashPage onComplete={handleSplashComplete} />
        )}
      </AnimatePresence>

      {currentPage === "signup" && (
        <SignupPage onComplete={handleSignupComplete} />
      )}

      {currentPage === "email" && (
        <EmailEntryPage
          onBack={handleEmailBack}
          onContinue={handleEmailContinue}
        />
      )}

      {currentPage === "otp" && (
        <OTPEntryPage
          email={userEmail}
          onBack={handleOTPBack}
          onContinue={handleOTPContinue}
          onResendOTP={handleResendOTP}
        />
      )}

      {currentPage === "connect" && (
        <ConnectPage onContinue={handleConnectComplete} />
      )}

      {currentPage === "university" && (
        <UniversitySelectionPage
          onBack={handleUniversityBack}
          onContinue={handleUniversityContinue}
        />
      )}

      {currentPage === "whoAreYou" && (
        <WhoAreYouPage
          onBack={handleWhoAreYouBack}
          onContinue={handleWhoAreYouContinue}
        />
      )}

      {currentPage === "dateOfBirth" && (
        <DateOfBirthPage
          onBack={handleDateOfBirthBack}
          onContinue={handleDateOfBirthContinue}
        />
      )}

      {currentPage === "degree" && (
        <DegreeSelectionPage
          onBack={handleDegreeBack}
          onContinue={handleDegreeContinue}
        />
      )}

      <AnimatePresence mode="wait">
        {currentPage === "success" && (
          <SuccessPage key="success" onComplete={handleSuccessComplete} />
        )}
      </AnimatePresence>

      {currentPage === "home" && <HomePage />}
    </MobileLayout>
  );
}

export default App;
