import { useEffect } from "react";
import { motion } from "framer-motion";

interface SplashPageProps {
  onComplete: () => void;
}

export const SplashPage = ({ onComplete }: SplashPageProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-background"
    >
      <motion.img
        src="/Citedel_branding.png"
        alt="Citadel"
        className="h-auto w-48"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
      />
    </motion.div>
  );
};
