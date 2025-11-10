import { useState, useEffect, useMemo, useCallback } from "react";
import { Calendar, RefreshCw } from "lucide-react";
import { eventsApi } from "../services/api";
import type { EventSlot, City } from "../types/events";
import { showToast, handleApiError } from "../lib/toast";
import { getLandmarkImage, formatDate, formatTime } from "../lib/eventUtils";
import { ImageWithPlaceholder } from "../components/ui/ImageWithPlaceholder";
interface EventsPageProps {
  onOpenLocation: () => void;
  selectedCity?: City;
}

const defaultCity: City = {
  id: "new-delhi",
  name: "New Delhi",
  landmarkImage: getLandmarkImage("new-delhi"),
  isAvailable: true,
};

const getApiCityName = (cityId: string): string => {
  if (cityId === "new-delhi") {
    return "Delhi";
  }
  return cityId;
};

export const EventsPage = ({
  onOpenLocation,
  selectedCity,
}: EventsPageProps) => {
  const [slots, setSlots] = useState<EventSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<EventSlot | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [peopleWaiting, setPeopleWaiting] = useState(0);

  const currentCity = useMemo(
    () => selectedCity || defaultCity,
    [selectedCity]
  );

  const loadSlots = useCallback(async () => {
    setIsLoading(true);
    try {
      // Use API city name for the request, but display name for UI
      const apiCityName = getApiCityName(currentCity.id);
      const response = await eventsApi.getAvailableSlots(apiCityName);
      setSlots(response.slots);

      // Calculate people waiting (sum of available spots)
      const totalWaiting = response.slots.reduce(
        (sum, slot) => sum + slot.spotsAvailable,
        0
      );
      setPeopleWaiting(totalWaiting);
    } catch (err) {
      const errorMessage = handleApiError(err);
      showToast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [currentCity.id]);

  useEffect(() => {
    loadSlots();
  }, [loadSlots]);

  const handleSlotSelect = (slot: EventSlot) => {
    setSelectedSlot(slot);
  };

  const handleBookSeat = async () => {
    if (!selectedSlot) return;

    setIsBooking(true);
    try {
      await eventsApi.bookEvent({
        slotId: selectedSlot.id,
        paymentMethodId: "razorpay_placeholder",
      });

      showToast.success("Seat booked successfully!");
      setSelectedSlot(null);
      loadSlots();
    } catch (err) {
      const errorMessage = handleApiError(err);
      showToast.error(errorMessage);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-background relative overflow-hidden">
      <div className="relative h-[34%]">
        <ImageWithPlaceholder
          src={currentCity.landmarkImage || getLandmarkImage(currentCity.id)}
          alt={currentCity.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6">
          <button
            className="flex items-center gap-2 px-5 py-2 rounded-full border border-white text-white text-[15px] font-medium bg-transparent active:opacity-70 transition-opacity"
            aria-label="View bookings"
          >
            <Calendar className="w-4 h-4" strokeWidth={2} />
            View Bookings
          </button>
          <div className="text-center flex flex-col items-center justify-center">
            <h2 className="text-white text-3xl font-bold text-center font-serif pb-1">
              {currentCity.name}
            </h2>
            <button
              onClick={onOpenLocation}
              className="flex items-center gap-1 text-white/90 text-sm active:opacity-70 transition-opacity"
            >
              <span className="underline text-[15px]">Change location</span>
              <RefreshCw className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-background rounded-t-3xl -mt-6 relative z-10 min-h-0">
        <div className="flex-1 flex flex-col px-4 py-6 min-h-0 overflow-y-auto">
          <div className="mb-6 flex flex-col items-center justify-center">
            <h3 className="text-white mb-1 font-bold text-2xl text-center">
              Book your next{" "}
              <span className="text-primary font-bold italic font-serif">
                DINNER
              </span>
            </h3>
            <p className="text-white text-sm font-medium text-[15px]">
              {peopleWaiting} people are waiting for you
            </p>
          </div>

          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-white/70">Loading available slots...</p>
            </div>
          ) : slots.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-white/70">No upcoming events available</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 mb-6">
              {slots.slice(0, 3).map((slot) => {
                const isSelected = selectedSlot?.id === slot.id;
                return (
                  <button
                    key={slot.id}
                    onClick={() => handleSlotSelect(slot)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isSelected
                        ? "bg-white/10 border-2 border-white"
                        : "bg-white/5 border border-white/20"
                    } active:scale-[0.98]`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-semibold text-base mb-1">
                          {formatDate(slot.date)}
                        </div>
                        <div className="text-white/70 text-sm">
                          {formatTime(slot.time)}
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected
                            ? "border-white bg-white"
                            : "border-white/50"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 bg-black rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="px-6 py-4 pb-6">
          <button
            onClick={handleBookSeat}
            disabled={!selectedSlot || isBooking}
            className={`w-full py-4 rounded-full text-white font-semibold transition-all ${
              selectedSlot
                ? "bg-primary hover:bg-primary/90 active:scale-95"
                : "bg-white/20 cursor-not-allowed"
            }`}
          >
            {isBooking ? "Booking..." : "Book my seat"}
          </button>
        </div>
      </div>
    </div>
  );
};
