import { useState } from "react";
import { ArrowLeft, X } from "lucide-react";
import { motion } from "framer-motion";
import { AREAS_BY_CITY } from "../constants/cities";
import { Button } from "../components/ui/Button";

interface AreaSelectionPageProps {
  cityId: string;
  cityName: string;
  onBack: () => void;
  onClose: () => void;
  onContinue: (selectedAreas: string[]) => void;
  isLoading?: boolean;
}

export const AreaSelectionPage = ({
  cityId,
  cityName,
  onBack,
  onClose,
  onContinue,
  isLoading = false,
}: AreaSelectionPageProps) => {
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [isExiting, setIsExiting] = useState(false);

  const areas = AREAS_BY_CITY[cityId] || AREAS_BY_CITY[cityName] || [];

  const toggleArea = (area: string) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const handleContinue = () => {
    if (selectedAreas.length > 0) {
      onContinue(selectedAreas);
    }
  };

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="flex h-full flex-col bg-background"
    >
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <button
          onClick={onBack}
          className="p-2 -ml-2 active:opacity-70 transition-opacity"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6 text-text-primary" strokeWidth={2} />
        </button>
        <h1 className="text-base font-semibold text-text-primary">Location</h1>
        <button
          onClick={handleClose}
          className="p-2 -mr-2 active:opacity-70 transition-opacity"
          aria-label="Close"
        >
          <X className="w-6 h-6 text-text-primary" strokeWidth={2} />
        </button>
      </div>

      <div className="flex-1 flex flex-col px-4 py-6 min-h-0 overflow-hidden">
        <div className="mb-6 text-center flex-shrink-0">
          <h2 className="font-semibold text-3xl leading-tight text-text-primary font-serif">
            Where would you like to have{" "}
            <span className="text-primary font-serif italic">DINNER?</span>
          </h2>
          <p className="text-sm sm-phone:text-base text-white font-medium mt-2">
            Select preferred areas in {cityName}
          </p>
        </div>

        <div className="p-2 grid grid-cols-2 auto-rows-min gap-x-4 gap-y-4 overflow-y-auto flex-1 min-h-0">
          {areas.map((area) => {
            const isSelected = selectedAreas.includes(area);

            return (
              <button
                key={area}
                onClick={() => toggleArea(area)}
                className={`relative w-full aspect-[6/3] overflow-hidden transition-all duration-300 bg-background-secondary rounded-2xl ${
                  isSelected
                    ? "ring-4 ring-primary"
                    : "ring-2 ring-border hover:scale-105"
                } active:scale-95`}
              >
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-white text-lg font-semibold text-center px-4">
                    {area}
                  </span>
                </div>

                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-background"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex-shrink-0">
          <Button
            onClick={handleContinue}
            disabled={selectedAreas.length === 0}
            isLoading={isLoading}
            variant="primary"
          >
            Continue
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
