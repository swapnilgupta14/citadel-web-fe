import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { MobileLayout } from "./components/layout/MobileLayout";
import { SplashPage } from "./pages/SplashPage";
import { SignupPage } from "./pages/SignupPage";
import { ConnectPage } from "./pages/ConnectPage";
import { HomePage } from "./pages/HomePage";

function App() {
  const [currentPage, setCurrentPage] = useState<
    "splash" | "signup" | "connect" | "home"
  >("splash");

  const handleSplashComplete = () => {
    setCurrentPage("signup");
  };

  const handleSignupComplete = () => {
    setCurrentPage("connect");
  };

  const handleConnectComplete = () => {
    setCurrentPage("home");
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

      {currentPage === "connect" && (
        <ConnectPage onContinue={handleConnectComplete} />
      )}

      {currentPage === "home" && <HomePage />}
    </MobileLayout>
  );
}

export default App;
