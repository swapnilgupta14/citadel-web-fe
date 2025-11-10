import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SplashPage } from "./SplashPage";
import { StartPage } from "./StartPage";
import { auth } from "../lib/storage/auth";

export const HomePage = () => {
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (auth.isAuthenticated() && !showSplash) {
      navigate("/events", { replace: true });
    }
  }, [showSplash, navigate]);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleSplashAuthenticated = () => {
    navigate("/events");
  };

  const handleStartComplete = () => {
    navigate("/connect");
  };

  if (showSplash) {
    return (
      <SplashPage
        onComplete={handleSplashComplete}
        onAuthenticated={handleSplashAuthenticated}
      />
    );
  }

  return <StartPage onComplete={handleStartComplete} />;
};
