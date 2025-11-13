import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { auth } from "../lib/storage/auth";

interface SplashPageProps {
  onComplete: () => void;
  onAuthenticated: () => void;
}

export const SplashPage = ({
  onComplete,
  onAuthenticated,
}: SplashPageProps) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (auth.isAuthenticated()) {
      const fadeOutTimer = setTimeout(() => {
        setIsExiting(true);
      }, 1000);

      const navigateTimer = setTimeout(() => {
        onAuthenticated();
      }, 2500);

      return () => {
        clearTimeout(fadeOutTimer);
        clearTimeout(navigateTimer);
      };
    } else {
      const fadeOutTimer = setTimeout(() => {
        setIsExiting(true);
      }, 1500);

      const navigateTimer = setTimeout(() => {
        onComplete();
      }, 2200);

      return () => {
        clearTimeout(fadeOutTimer);
        clearTimeout(navigateTimer);
      };
    }
  }, [onComplete, onAuthenticated]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-background"
    >
      <motion.img
        src="/Citedel_branding.png"
        alt="Citadel"
        className="h-auto w-[150px]"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: isExiting ? 0.9 : 1,
          opacity: isExiting ? 0 : 1,
        }}
        transition={{
          duration: isExiting ? 1 : 0.8,
          ease: "easeOut",
        }}
      />
    </motion.div>
  );
};
