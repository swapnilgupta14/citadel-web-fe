import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ImageWithPlaceholder } from "../../components/ui";

export const DinnerBookedSuccessPage = () => {
  const navigate = useNavigate();
  const autoNavigateTimerRef = useRef<number | null>(null);

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
      navigate("/events", { replace: true });
    };
    window.addEventListener("popstate", handlePopState);

    autoNavigateTimerRef.current = setTimeout(() => {
      navigate("/events", { replace: true });
    }, 5000);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      if (autoNavigateTimerRef.current) {
        clearTimeout(autoNavigateTimerRef.current);
      }
    };
  }, [navigate]);

  const handleViewTicket = () => {
    if (autoNavigateTimerRef.current) {
      clearTimeout(autoNavigateTimerRef.current);
    }
    navigate("/events", { replace: true });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex h-full flex-col bg-background items-center justify-center px-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center justify-center"
      >
        <ImageWithPlaceholder
          src="/success.svg"
          alt="Success"
          className="w-[73px] h-[76px] mb-4 object-contain"
        />
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="text-3xl font-bold text-text-primary font-serif mb-2"
        >
          Dinner Booked!
        </motion.h1>
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          onClick={handleViewTicket}
          className="text-base text-[#7F7F7F] underline active:opacity-70 transition-opacity"
        >
          View ticket
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
