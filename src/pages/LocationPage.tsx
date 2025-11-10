import { ArrowLeft, X } from "lucide-react";
import type { City } from "../types/events";
import { getLandmarkImage } from "../lib/eventUtils";
import { CITIES } from "../constants/cities";

interface LocationPageProps {
  onBack: () => void;
  onSelectCity: (city: City) => void;
  selectedCityId?: string;
}

export const LocationPage = ({
  onBack,
  onSelectCity,
  selectedCityId,
}: LocationPageProps) => {
  const handleCitySelect = (city: City) => {
    if (city.isAvailable) {
      onSelectCity(city);
      onBack();
    }
  };

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <button
          onClick={onBack}
          className="p-2 -ml-2 active:opacity-70 transition-opacity"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6 text-text-primary" strokeWidth={2} />
        </button>
        <h1 className="text-xl font-semibold text-text-primary font-serif">
          Location
        </h1>
        <button
          onClick={onBack}
          className="p-2 -mr-2 active:opacity-70 transition-opacity"
          aria-label="Close"
        >
          <X className="w-6 h-6 text-text-primary" strokeWidth={2} />
        </button>
      </div>

      <div className="flex-1 flex flex-col px-4 py-6 min-h-0">
        <div className="mb-6">
          <h2 className="text-3xl sm-phone:text-4xl leading-tight font-bold text-text-primary font-serif">
            Select <span className="text-primary">CITY</span>
          </h2>
          <p className="text-sm text-text-secondary mt-2">
            You can change it later
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 flex-1">
          {CITIES.map((city) => {
            const isSelected = selectedCityId === city.id;
            const isDisabled = !city.isAvailable;

            return (
              <button
                key={city.id}
                onClick={() => handleCitySelect(city)}
                disabled={isDisabled}
                className={`relative aspect-square rounded-2xl overflow-hidden ${
                  isSelected
                    ? "ring-2 ring-primary"
                    : isDisabled
                      ? "opacity-60"
                      : "ring-2 ring-border"
                } transition-all active:scale-95`}
              >
                <img
                  src={city.landmarkImage || getLandmarkImage(city.id)}
                  alt={city.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%232C2C2C' width='200' height='200'/%3E%3Ctext fill='%23ffffff' font-family='sans-serif' font-size='20' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3E" +
                      encodeURIComponent(city.name) +
                      "%3C/text%3E%3C/svg%3E";
                  }}
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
    </div>
  );
};
