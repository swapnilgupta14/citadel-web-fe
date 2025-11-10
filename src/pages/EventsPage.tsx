import { useState, useMemo, useEffect } from "react";
import { Calendar, RefreshCw } from "lucide-react";
import type { EventSlot, City } from "../types/events";
import { showToast, handleApiError } from "../lib/helpers/toast";
import {
  getLandmarkImage,
  formatDate,
  formatTime,
} from "../lib/helpers/eventUtils";
import { ImageWithPlaceholder } from "../components/ui/ImageWithPlaceholder";
import { useEvents, useBookEvent } from "../hooks/queries/useEvents";
import { Button } from "../components/ui/Button";
import { EventSlotSkeleton } from "../components/ui/Skeleton";
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
  const [selectedSlot, setSelectedSlot] = useState<EventSlot | null>(null);

  const currentCity = useMemo(
    () => selectedCity || defaultCity,
    [selectedCity]
  );

  const apiCityName = useMemo(
    () => getApiCityName(currentCity.id),
    [currentCity.id]
  );

  const {
    data: eventsData,
    isLoading,
    error,
  } = useEvents({ city: apiCityName });

  const bookEventMutation = useBookEvent();

  const slots = useMemo(() => eventsData?.slots || [], [eventsData?.slots]);
  const peopleWaiting = useMemo(
    () =>
      slots.reduce(
        (sum: number, slot: EventSlot) => sum + slot.spotsAvailable,
        0
      ),
    [slots]
  );

  useEffect(() => {
    if (error) {
      const errorMessage = handleApiError(error);
      showToast.error(errorMessage);
    }
  }, [error]);

  const handleSlotSelect = (slot: EventSlot) => {
    setSelectedSlot(slot);
  };

  const handleBookSeat = async () => {
    if (!selectedSlot) return;

    try {
      await bookEventMutation.mutateAsync({
        slotId: selectedSlot.id,
        paymentMethodId: "razorpay_placeholder",
      });

      showToast.success("Seat booked successfully!");
      setSelectedSlot(null);
    } catch (err) {
      const errorMessage = handleApiError(err);
      showToast.error(errorMessage);
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
              className="flex items-center gap-1 text-white text-sm active:opacity-70 transition-opacity"
            >
              <span className="underline text-[15px]">Change location</span>
              <RefreshCw className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-background rounded-t-3xl -mt-6 z-10 min-h-0 overflow-hidden relative">
        <div className="flex-1 flex flex-col px-4 py-6 min-h-0 overflow-hidden">
          <div className="mb-6 flex flex-col items-center justify-center flex-shrink-0">
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
            <div className="flex-1 flex flex-col gap-3 overflow-y-auto min-h-0 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
              <EventSlotSkeleton count={3} />
            </div>
          ) : slots.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-white/70">No upcoming events available</p>
            </div>
          ) : (
            <div
              className={`flex-1 flex flex-col gap-3 overflow-y-auto min-h-0 [&::-webkit-scrollbar]:hidden [scrollbar-width:none] ${slots.length > 0 ? "pb-24" : ""}`}
            >
              {slots.map((slot: EventSlot) => {
                const isSelected = selectedSlot?.id === slot.id;
                return (
                  <button
                    key={slot.id}
                    onClick={() => handleSlotSelect(slot)}
                    className={`w-full p-4 rounded-xl text-left transition-all duration-150 bg-[#111111] ${
                      isSelected ? "border-2 border-primary" : "border-0"
                    } active:scale-[0.99]`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-semibold text-base mb-1">
                          {formatDate(slot.date)}
                        </div>
                        <div className="text-white text-sm">
                          {formatTime(slot.time)}
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? "border-primary bg-primary" : ""
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 bg-background rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {slots.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 px-6 py-4 flex-shrink-0 border-t border-border/20 bg-background">
            <Button
              onClick={handleBookSeat}
              disabled={!selectedSlot || bookEventMutation.isPending}
              isLoading={bookEventMutation.isPending}
              variant="primary"
            >
              Book my seat
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
