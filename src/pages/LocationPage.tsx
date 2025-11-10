import { useState } from "react";
import { ArrowLeft, X } from "lucide-react";
import { motion } from "framer-motion";
import type { City } from "../types/events";
import { getLandmarkImage } from "../lib/helpers/eventUtils";
import { CITIES } from "../constants/cities";
import { ImageWithPlaceholder } from "../components/ui/ImageWithPlaceholder";

interface LocationPageProps {
  onBack: () => void;
  onClose: () => void;
  onSelectCity: (city: City) => void;
  onNavigateToAreaSelection: (city: City) => void;
  selectedCityId?: string;
}

export const LocationPage = ({
  onBack,
  onClose,
  onSelectCity,
  onNavigateToAreaSelection,
  selectedCityId,
}: LocationPageProps) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleCitySelect = (city: City) => {
    if (city.isAvailable) {
      onSelectCity(city);
      onNavigateToAreaSelection(city);
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

      <div className="flex-1 flex flex-col py-6 min-h-0 overflow-hidden">
        <div className="mb-6 text-center flex-shrink-0">
          <h2 className="font-semibold text-3xl sm-phone:text-4xl leading-tight text-text-primary font-serif">
            Select <span className="text-primary font-serif italic">CITY</span>
          </h2>
          <p className="text-sm sm-phone:text-base text-white font-medium mt-2">
            You can change it later
          </p>
        </div>

        <div className="p-4 grid grid-cols-2 auto-rows-min gap-x-4 gap-y-3 overflow-y-auto flex-1 min-h-0">
          {CITIES.map((city) => {
            const isSelected = selectedCityId === city.id;
            const isDisabled = !city.isAvailable;

            return (
              <button
                key={city.id}
                onClick={() => handleCitySelect(city)}
                disabled={isDisabled}
                className={`relative w-full aspect-[9/10] rounded-2xl overflow-hidden ${
                  isSelected
                    ? "ring-2 ring-primary"
                    : isDisabled
                      ? "opacity-60"
                      : "ring-2 ring-border"
                } transition-all active:scale-95`}
              >
                <ImageWithPlaceholder
                  src={city.landmarkImage || getLandmarkImage(city.id)}
                  alt={city.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-lg font-semibold text-text-primary font-serif">
                    {city.name}
                  </p>
                  {city.comingSoon && (
                    <p className="text-xs text-text-secondary mt-1">
                      (Coming soon)
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
