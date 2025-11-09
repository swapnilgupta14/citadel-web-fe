import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { MobileLayout } from "./components/layout/MobileLayout";
import { SplashPage } from "./pages/SplashPage";
import { SignupPage } from "./pages/SignupPage";
import { EmailEntryPage } from "./pages/EmailEntryPage";
import { OTPEntryPage } from "./pages/OTPEntryPage";
import { LoginEmailPage } from "./pages/LoginEmailPage";
import { LoginOTPPage } from "./pages/LoginOTPPage";
import { ConnectPage } from "./pages/ConnectPage";
import { UniversitySelectionPage } from "./pages/UniversitySelectionPage";
import { WhoAreYouPage } from "./pages/WhoAreYouPage";
import { DateOfBirthPage } from "./pages/DateOfBirthPage";
import { DegreeSelectionPage } from "./pages/DegreeSelectionPage";
import { SuccessPage } from "./pages/SuccessPage";
import { HomePage } from "./pages/HomePage";
import { authApi, profileApi } from "./services/api";
import { showToast, handleApiError } from "./lib/toast";
import { signupPersistence } from "./lib/signupPersistence";

function App() {
  const [currentPage, setCurrentPage] = useState<
    | "splash"
    | "signup"
    | "loginEmail"
    | "loginOTP"
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
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [signupData, setSignupData] = useState<{
    universityId?: string;
    name?: string;
    gender?: "male" | "female" | "other";
    dateOfBirth?: string;
    degree?: string;
    year?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedData = signupPersistence.getSignupData();
    const savedEmail = signupPersistence.getEmail();
    const savedAccessToken = localStorage.getItem("accessToken");

    if (savedData && Object.keys(savedData).length > 0) {
      setSignupData(savedData);
    }
    if (savedEmail) {
      setUserEmail(savedEmail);
    }
    if (savedAccessToken) {
      setAccessToken(savedAccessToken);
    }

    const handleNavigateToLogin = () => {
      setCurrentPage("loginEmail");
    };

    window.addEventListener("navigateToLogin", handleNavigateToLogin);

    return () => {
      window.removeEventListener("navigateToLogin", handleNavigateToLogin);
    };
  }, []);

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

  const handleUniversityContinue = (universityId: string) => {
    const updatedData = { ...signupData, universityId };
    setSignupData(updatedData);
    signupPersistence.saveSignupData(updatedData);
    setCurrentPage("email");
  };

  const handleEmailContinue = async (email: string) => {
    setUserEmail(email);
    signupPersistence.saveEmail(email);
    setIsLoading(true);

    try {
      await authApi.sendOTP(email);
      showToast.success("OTP sent successfully! Check your email.");
      setCurrentPage("otp");
    } catch (err) {
      const errorMessage = handleApiError(err);
      showToast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailBack = () => {
    setCurrentPage("university");
  };

  const handleOTPContinue = async (otp: string) => {
    setIsLoading(true);

    try {
      const response = await authApi.verifyOTP(userEmail, otp);
      setAccessToken(response.tokens.accessToken);
      localStorage.setItem("accessToken", response.tokens.accessToken);
      localStorage.setItem("refreshToken", response.tokens.refreshToken);
      showToast.success("OTP verified successfully!");
      setCurrentPage("whoAreYou");
    } catch (err) {
      const errorMessage = handleApiError(err);
      showToast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPBack = () => {
    setCurrentPage("email");
  };

  const handleResendOTP = async () => {
    setIsLoading(true);

    try {
      await authApi.sendOTP(userEmail);
      showToast.success("OTP resent successfully!");
    } catch (err) {
      const errorMessage = handleApiError(err);
      showToast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhoAreYouContinue = (data: {
    name: string;
    gender: "male" | "female" | "other";
  }) => {
    const updatedData = {
      ...signupData,
      name: data.name,
      gender: data.gender,
    };
    setSignupData(updatedData);
    signupPersistence.saveSignupData(updatedData);
    setCurrentPage("dateOfBirth");
  };

  const handleWhoAreYouBack = () => {
    setCurrentPage("otp");
  };

  const handleDateOfBirthContinue = (data: {
    day: string;
    month: string;
    year: string;
  }) => {
    const dateOfBirth = `${data.year}-${data.month.padStart(2, "0")}-${data.day.padStart(2, "0")}`;
    const updatedData = { ...signupData, dateOfBirth };
    setSignupData(updatedData);
    signupPersistence.saveSignupData(updatedData);
    setCurrentPage("degree");
  };

  const handleDateOfBirthBack = () => {
    setCurrentPage("whoAreYou");
  };

  const handleDegreeContinue = async (data: {
    degree: string;
    year: string;
  }) => {
    if (
      !accessToken ||
      !signupData.universityId ||
      !signupData.name ||
      !signupData.gender ||
      !signupData.dateOfBirth
    ) {
      const errorMessage =
        "Missing required information. Please go back and complete all fields.";
      showToast.error(errorMessage);
      return;
    }

    const updatedData = { ...signupData, degree: data.degree, year: data.year };
    setSignupData(updatedData);
    signupPersistence.saveSignupData(updatedData);

    setIsLoading(true);

    try {
      await profileApi.createProfile(
        {
          name: signupData.name,
          dateOfBirth: signupData.dateOfBirth,
          gender: signupData.gender,
          universityId: signupData.universityId,
          degree: data.degree,
          year: data.year,
        },
        accessToken
      );
      showToast.success("Profile created successfully!");
      signupPersistence.clearSignupData();
      setCurrentPage("success");
    } catch (err) {
      const errorMessage = handleApiError(err);
      showToast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessComplete = () => {
    setCurrentPage("home");
  };

  const handleDegreeBack = () => {
    setCurrentPage("dateOfBirth");
  };

  const handleLoginEmailBack = () => {
    setCurrentPage("connect");
  };

  const handleLoginEmailContinue = async (email: string) => {
    setUserEmail(email);
    signupPersistence.saveEmail(email);
    setIsLoading(true);

    try {
      await authApi.sendOTP(email);
      showToast.success("OTP sent successfully! Check your email.");
      setCurrentPage("loginOTP");
    } catch (err) {
      const errorMessage = handleApiError(err);
      showToast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginOTPBack = () => {
    setCurrentPage("loginEmail");
  };

  const handleLoginOTPContinue = async (otp: string) => {
    setIsLoading(true);

    try {
      const response = await authApi.verifyOTP(userEmail, otp);
      setAccessToken(response.tokens.accessToken);
      localStorage.setItem("accessToken", response.tokens.accessToken);
      localStorage.setItem("refreshToken", response.tokens.refreshToken);
      showToast.success("Login successful!");
      setCurrentPage("success");
    } catch (err) {
      const errorMessage = handleApiError(err);
      showToast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginResendOTP = async () => {
    setIsLoading(true);

    try {
      await authApi.sendOTP(userEmail);
      showToast.success("OTP resent successfully!");
    } catch (err) {
      const errorMessage = handleApiError(err);
      showToast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
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

      {currentPage === "loginEmail" && (
        <LoginEmailPage
          onBack={handleLoginEmailBack}
          onContinue={handleLoginEmailContinue}
          initialEmail={userEmail}
        />
      )}

      {currentPage === "loginOTP" && (
        <LoginOTPPage
          email={userEmail}
          onBack={handleLoginOTPBack}
          onContinue={handleLoginOTPContinue}
          onResendOTP={handleLoginResendOTP}
        />
      )}

      {currentPage === "email" && (
        <EmailEntryPage
          onBack={handleEmailBack}
          onContinue={handleEmailContinue}
          initialEmail={userEmail}
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
          initialUniversityId={signupData.universityId}
        />
      )}

      {currentPage === "whoAreYou" && (
        <WhoAreYouPage
          onBack={handleWhoAreYouBack}
          onContinue={handleWhoAreYouContinue}
          initialName={signupData.name}
          initialGender={signupData.gender}
        />
      )}

      {currentPage === "dateOfBirth" && (
        <DateOfBirthPage
          onBack={handleDateOfBirthBack}
          onContinue={handleDateOfBirthContinue}
          initialDateOfBirth={signupData.dateOfBirth}
        />
      )}

      {currentPage === "degree" && (
        <>
          {isLoading && (
            <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
              <div className="text-text-primary">Creating your profile...</div>
            </div>
          )}
          <DegreeSelectionPage
            onBack={handleDegreeBack}
            onContinue={handleDegreeContinue}
            initialDegree={signupData.degree}
            initialYear={signupData.year}
          />
        </>
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
