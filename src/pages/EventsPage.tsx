import { useState, useEffect } from "react";
import { Calendar, RotateCcw } from "lucide-react";
import { Button } from "../components/ui/Button";
import { eventsApi } from "../services/api";
import type { EventSlot, City } from "../types/events";
import { showToast, handleApiError } from "../lib/toast";
import { getLandmarkImage, formatDate, formatTime } from "../lib/eventUtils";

interface EventsPageProps {
  onOpenLocation: () => void;
  selectedCity?: City;
}

export const EventsPage = ({
  onOpenLocation,
  selectedCity,
}: EventsPageProps) => {
  const [slots, setSlots] = useState<EventSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<EventSlot | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [peopleWaiting, setPeopleWaiting] = useState(5);

  const currentCity = selectedCity || {
    id: "new-delhi",
    name: "Delhi",
    landmarkImage: getLandmarkImage("new-delhi"),
    isAvailable: true,
  };

  useEffect(() => {
    loadSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCity.id]);

  const loadSlots = async () => {
    setIsLoading(true);
    try {
      const response = await eventsApi.getAvailableSlots(currentCity.name);
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
  };

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
      <div className="flex items-center justify-center px-4 pt-4 pb-2 relative z-10">
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-background-secondary text-text-primary text-sm font-medium active:opacity-70 transition-opacity"
          aria-label="View bookings"
        >
          <Calendar className="w-4 h-4" strokeWidth={2} />
          View Bookings
        </button>
      </div>
      <div className="relative h-[40%] min-h-[200px] max-h-[300px]">
        <img
          src={currentCity.landmarkImage || getLandmarkImage(currentCity.id)}
          alt={currentCity.name}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%232C2C2C' width='400' height='300'/%3E%3Ctext fill='%23ffffff' font-family='sans-serif' font-size='24' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3E" +
              encodeURIComponent(currentCity.name) +
              "%3C/text%3E%3C/svg%3E";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background" />
        <div className="absolute top-1/2 left-0 right-0 px-4 transform -translate-y-1/2">
          <h2 className="text-4xl sm-phone:text-5xl font-bold text-text-primary font-serif mb-2">
            {currentCity.name}
          </h2>
          <button
            onClick={onOpenLocation}
            className="flex items-center gap-2 text-sm text-text-secondary active:opacity-70 transition-opacity"
          >
            <RotateCcw className="w-4 h-4" strokeWidth={2} />
            Change location
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-background rounded-t-3xl -mt-6 relative z-10 min-h-0">
        <div className="flex-1 flex flex-col px-4 py-6 min-h-0 overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-2xl sm-phone:text-3xl font-bold text-text-primary font-serif">
              Book your next <span className="text-primary">DINNER</span>
            </h3>
            <p className="text-sm text-text-secondary mt-2">
              {peopleWaiting} people are waiting for you
            </p>
          </div>

          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-text-secondary">Loading available slots...</p>
            </div>
          ) : slots.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-text-secondary">
                No available slots at the moment
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 mb-6">
              {slots.map((slot) => {
                const isSelected = selectedSlot?.id === slot.id;
                return (
                  <button
                    key={slot.id}
                    onClick={() => handleSlotSelect(slot)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-border bg-background-secondary"
                    } active:scale-[0.98]`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-base font-semibold text-text-primary">
                          {formatDate(slot.date)}
                        </p>
                        <p className="text-sm text-text-secondary mt-1">
                          {formatTime(slot.time)}
                        </p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected
                            ? "border-primary bg-primary"
                            : "border-border"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-background" />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="px-6 py-4 pb-6 border-t border-border">
          <Button
            onClick={handleBookSeat}
            disabled={!selectedSlot}
            variant={selectedSlot ? "primary" : "disabled"}
            isLoading={isBooking}
          >
            Book my seat
          </Button>
        </div>
      </div>
    </div>
  );
};
