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
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { ProtectedPagesLayout } from "./components/layout/ProtectedPagesLayout";
import { useNavigation } from "./hooks/useNavigation";
import { useAuth } from "./hooks/useAuth";
import { useSignupFlow } from "./hooks/useSignupFlow";
import { authHandlers } from "./handlers/authHandlers";
import { createSignupHandlers } from "./handlers/signupHandlers";
import { createLoginHandlers } from "./handlers/loginHandlers";
import { signupPersistence } from "./lib/signupPersistence";
import { showToast } from "./lib/toast";

function App() {
  const { currentPage, navigateTo } = useNavigation();
  const {
    accessToken,
    userEmail,
    isLoading: authLoading,
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

  const signupHandlers = createSignupHandlers(updateSignupData, navigateTo);
  const loginHandlers = createLoginHandlers(navigateTo);

  const handleEmailContinue = async (email: string) => {
    signupPersistence.saveEmail(email);
    const success = await sendOTP(email);
    if (success) {
      navigateTo("otp");
    }
  };

  const handleOTPContinue = async (otp: string) => {
    try {
      await verifyOTP(userEmail, otp);
      navigateTo("whoAreYou");
    } catch {
      // Error already handled in verifyOTP
    }
  };

  const handleResendOTP = async () => {
    await resendOTP(userEmail);
  };

  const handleLoginEmailContinue = async (email: string) => {
    signupPersistence.saveEmail(email);
    const success = await sendOTP(email);
    if (success) {
      navigateTo("loginOTP");
    }
  };

  const handleLoginOTPContinue = async (otp: string) => {
    await verifyOTP(userEmail, otp);
    navigateTo("home");
  };

  const handleLoginResendOTP = async () => {
    await resendOTP(userEmail);
  };

  const handleDegreeContinue = async (data: {
    degree: string;
    year: string;
  }) => {
    if (!accessToken) {
      showToast.error("Please complete authentication first");
      return;
    }
    const success = await createProfile(data);
    if (success) {
      navigateTo("success");
    }
  };

  const isLoading = authLoading || signupLoading;

  return (
    <MobileLayout>
      <AnimatePresence mode="wait">
        {currentPage === "splash" && (
          <SplashPage
            onComplete={() => authHandlers.handleSplashComplete(navigateTo)}
            onAuthenticated={() =>
              authHandlers.handleSplashAuthenticated(navigateTo)
            }
          />
        )}
      </AnimatePresence>

      {currentPage === "signup" && (
        <SignupPage onComplete={signupHandlers.handleSignupComplete} />
      )}

      {currentPage === "loginEmail" && (
        <LoginEmailPage
          onBack={loginHandlers.handleLoginEmailBack}
          onContinue={handleLoginEmailContinue}
          initialEmail={userEmail}
        />
      )}

      {currentPage === "loginOTP" && (
        <LoginOTPPage
          email={userEmail}
          onBack={loginHandlers.handleLoginOTPBack}
          onContinue={handleLoginOTPContinue}
          onResendOTP={handleLoginResendOTP}
        />
      )}

      {currentPage === "connect" && (
        <ConnectPage onContinue={signupHandlers.handleConnectComplete} />
      )}

      {currentPage === "university" && (
        <UniversitySelectionPage
          onBack={signupHandlers.handleUniversityBack}
          onContinue={signupHandlers.handleUniversityContinue}
          initialUniversityId={signupData.universityId}
        />
      )}

      {currentPage === "email" && (
        <EmailEntryPage
          onBack={signupHandlers.handleEmailBack}
          onContinue={handleEmailContinue}
          initialEmail={userEmail}
        />
      )}

      {currentPage === "otp" && (
        <OTPEntryPage
          email={userEmail}
          onBack={signupHandlers.handleOTPBack}
          onContinue={handleOTPContinue}
          onResendOTP={handleResendOTP}
        />
      )}

      {currentPage === "whoAreYou" && (
        <WhoAreYouPage
          onBack={signupHandlers.handleWhoAreYouBack}
          onContinue={signupHandlers.handleWhoAreYouContinue}
          initialName={signupData.name}
          initialGender={signupData.gender}
        />
      )}

      {currentPage === "dateOfBirth" && (
        <DateOfBirthPage
          onBack={signupHandlers.handleDateOfBirthBack}
          onContinue={signupHandlers.handleDateOfBirthContinue}
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
            onBack={signupHandlers.handleDegreeBack}
            onContinue={handleDegreeContinue}
            initialDegree={signupData.degree}
            initialYear={signupData.year}
          />
        </>
      )}

      <AnimatePresence mode="wait">
        {currentPage === "success" && (
          <SuccessPage
            key="success"
            onComplete={() => authHandlers.handleSuccessComplete(navigateTo)}
          />
        )}
      </AnimatePresence>

      {currentPage === "home" && (
        <ProtectedRoute
          fallback={
            <div className="flex h-full items-center justify-center">
              <p className="text-text-secondary">Please login to continue</p>
            </div>
          }
        >
          <ProtectedPagesLayout />
        </ProtectedRoute>
      )}

      {currentPage === "404" && (
        <NotFoundPage
          onBack={() => authHandlers.handleNotFoundBack(navigateTo)}
        />
      )}
    </MobileLayout>
  );
}

export default App;
