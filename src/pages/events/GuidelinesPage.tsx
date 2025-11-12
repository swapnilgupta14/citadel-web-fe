import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { motion } from "framer-motion";

const guidelines = [
  {
    number: 1,
    text: "Find your ticket in ",
    highlight: "settings → event bookings",
    suffix: ".",
  },
  {
    number: 2,
    text: "Restaurant name will be available ",
    highlight: "12 hours before the dinner",
    suffix: ".",
  },
  {
    number: 3,
    text: "This price includes ",
    highlight: "one time Citadel dinner experience",
    suffix: " with like-minded people.",
  },
  {
    number: 4,
    text: "The ",
    highlight: "meal cost is to be paid",
    suffix: " at the restaurant.",
  },
  {
    number: 5,
    text: "Free ",
    highlight: "reschedule up to 48 hours",
    suffix: " before the dinner.",
  },
];

export const GuidelinesPage = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex h-full flex-col bg-background"
    >
      <div className="flex items-center justify-between px-4 pt-4 pb-2 flex-shrink-0">
        <div className="w-10" />
        <h1 className="text-base font-semibold text-text-primary">
          Guidelines
        </h1>
        <button
          onClick={handleClose}
          className="p-2 -mr-2 active:opacity-70 transition-opacity"
          aria-label="Close"
        >
          <X className="w-6 h-6 text-text-primary" strokeWidth={2} />
        </button>
      </div>

      <div className="flex-1 flex flex-col px-6 pt-4 pb-6 min-h-0 overflow-y-auto scrollbar-hide">
        <div className="space-y-2">
          {guidelines.map((guideline) => (
            <div key={guideline.number} className="flex gap-1">
              <span className="text-text-secondary text-base flex-shrink-0">
                {guideline.number}.
              </span>
              <p className="text-base">
                <span className="text-text-secondary">{guideline.text}</span>
                <span className="text-text-primary font-semibold">
                  {guideline.highlight}
                </span>
                {guideline.suffix && (
                  <span className="text-text-secondary">
                    {guideline.suffix}
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
