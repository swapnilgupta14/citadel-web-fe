import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { SuccessPageProps } from "../types/pages";
import { ImageWithPlaceholder } from "../components/ui";

export const SuccessPage = ({ onComplete }: SuccessPageProps) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const fadeOutTimer = setTimeout(() => {
      setIsExiting(true);
    }, 3000);

    const navigateTimer = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(navigateTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="flex h-full flex-col bg-background items-center justify-center px-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: isExiting ? 0 : 1, scale: isExiting ? 0.9 : 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="flex flex-col items-center justify-center"
      >
        <ImageWithPlaceholder
          src="/success.svg"
          alt="Success"
          className="w-[75px] h-[75px] mb-6 object-contain"
        />
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isExiting ? 0 : 1, y: isExiting ? -10 : 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
          className="text-3xl font-bold text-text-primary font-serif"
        >
          Success!
        </motion.h1>
      </motion.div>
    </motion.div>
  );
};
