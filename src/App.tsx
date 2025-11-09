import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { MobileLayout } from "./components/layout/MobileLayout";
import { SplashPage } from "./pages/SplashPage";
import { SignupPage } from "./pages/SignupPage";
import { HomePage } from "./pages/HomePage";

function App() {
  const [currentPage, setCurrentPage] = useState<"splash" | "signup" | "home">(
    "splash"
  );

  const handleSplashComplete = () => {
    setCurrentPage("signup");
  };

  const handleSignupComplete = () => {
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

      {currentPage === "home" && <HomePage />}
    </MobileLayout>
  );
}

export default App;
