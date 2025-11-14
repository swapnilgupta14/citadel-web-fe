import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SplashPage } from "./SplashPage";
import { SplashSequence } from "./SplashSequence";
import { StartPage } from "./StartPage";
import { auth } from "../lib/storage/auth";
import { firstVisit } from "../lib/storage/firstVisit";

export const HomePage = () => {
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);
  const [showSplashSequence, setShowSplashSequence] = useState(false);

  useEffect(() => {
    if (auth.isAuthenticated() && !showSplash && !showSplashSequence) {
      navigate("/events", { replace: true });
    }
  }, [showSplash, showSplashSequence, navigate]);

  const handleSplashComplete = () => {
    setShowSplash(false);
    // Check if this is the first visit - if yes, show SplashSequence
    const isFirstVisit = !firstVisit.hasVisited();
    if (isFirstVisit) {
      setShowSplashSequence(true);
    }
  };

  const handleSplashAuthenticated = () => {
    navigate("/events");
  };

  const handleSplashSequenceComplete = () => {
    setShowSplashSequence(false);
  };

  const handleStartComplete = () => {
    navigate("/connect");
  };

  // Flow: SplashPage -> (SplashSequence if first visit) -> StartPage
  if (showSplash) {
    return (
      <SplashPage
        onComplete={handleSplashComplete}
        onAuthenticated={handleSplashAuthenticated}
      />
    );
  }

  // Show splash sequence for first-time visitors after SplashPage
  if (showSplashSequence) {
    return <SplashSequence onComplete={handleSplashSequenceComplete} />;
  }

  return <StartPage onComplete={handleStartComplete} />;
};
