import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, MapPin, Star } from "lucide-react";
import { motion } from "framer-motion";
import { ImageWithPlaceholder } from "../../components/ui";
import { formatDate, formatTime } from "../../lib/helpers/eventUtils";
import { getLandmarkImage } from "../../lib/helpers/eventUtils";
import { useBookings } from "../../hooks/queries";
import { EventDetailCardSkeleton } from "../../components/skeleton";

type TabType = "upcoming" | "past";

export const EventBookingsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [ratings, setRatings] = useState<Record<string, number>>({});

  const getInitialTab = (): TabType => {
    const tabParam = searchParams.get("tab");
    return tabParam === "past" ? "past" : "upcoming";
  };

  const [activeTab, setActiveTab] = useState<TabType>(getInitialTab());

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "past" || tabParam === "upcoming") {
      setActiveTab(tabParam);
    } else if (!tabParam) {
      setSearchParams({ tab: "upcoming" }, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSearchParams({ tab }, { replace: true });
  };

  const {
    data: bookingsData,
    isLoading,
    error,
  } = useBookings({ type: activeTab });

  const bookings = bookingsData?.data?.bookings || [];

  const handleRatingClick = (bookingId: string, rating: number) => {
    setRatings((prev) => ({ ...prev, [bookingId]: rating }));
  };

  const getRating = (bookingId: string) => {
    return ratings[bookingId] ?? 0;
  };

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex items-center gap-4 px-2 py-4 flex-shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-10 h-10 active:opacity-70 transition-opacity"
          aria-label="Go back"
        >
          <ChevronLeft className="w-6 h-6 text-text-primary" strokeWidth={2} />
        </button>
        <h1 className="text-2xl font-semibold text-text-primary font-serif flex-1">
          Event Bookings
        </h1>
      </div>

      <div className="flex border-b border-border flex-shrink-0">
        <button
          onClick={() => handleTabChange("upcoming")}
          className={`flex-1 py-4 px-2 text-base font-medium transition-colors relative ${
            activeTab === "upcoming"
              ? "text-text-primary"
              : "text-text-secondary"
          }`}
        >
          Upcoming
          {activeTab === "upcoming" && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </button>
        <button
          onClick={() => handleTabChange("past")}
          className={`flex-1 py-4 px-2 text-base font-medium transition-colors relative ${
            activeTab === "past" ? "text-text-primary" : "text-text-secondary"
          }`}
        >
          Past
          {activeTab === "past" && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
        {isLoading ? (
          <div className="space-y-4 mt-4 pt-4">
            <EventDetailCardSkeleton />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-text-secondary text-center text-base">
              Failed to load bookings
            </p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-text-secondary text-center text-base">
              No {activeTab} events
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const dateStr = booking.eventDate.includes("T")
                ? booking.eventDate.split("T")[0]
                : booking.eventDate;
              const formattedDate = dateStr ? formatDate(dateStr) : "";
              const formattedTime = booking.eventTime
                ? formatTime(booking.eventTime)
                : "";
              const currentRating = getRating(booking.bookingId);
              const venueName = booking.venue || "To be revealed";

              return (
                <div
                  key={booking.bookingId}
                  className="bg-background-secondary rounded-2xl p-4 relative overflow-hidden"
                >
                  <div className="relative flex flex-col gap-4">
                    <div className="pr-24">
                      <h2 className="text-base font-bold text-text-primary mb-1">
                        {venueName}
                      </h2>
                      <p className="text-text-secondary text-base">
                        {booking.paymentAmount > 0
                          ? `Rs ${booking.paymentAmount}`
                          : "Free"}
                      </p>
                    </div>

                    <div>
                      <p className="text-text-secondary text-sm mb-1">
                        Date & Time
                      </p>
                      <p className="text-text-primary text-base font-semibold">
                        {formattedDate} | {formattedTime}
                      </p>
                    </div>

                    <div>
                      <p className="text-text-secondary text-sm mb-1">
                        Location
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-text-primary text-base font-semibold">
                          {booking.area}, {booking.city}
                        </p>
                        <MapPin
                          className="w-6 h-6 text-text-primary"
                          strokeWidth={2}
                        />
                      </div>
                    </div>

                    {activeTab === "past" && (
                      <div>
                        <p className="text-text-secondary text-sm mb-2">
                          Tell us{" "}
                          <span className="text-text-primary font-semibold">
                            Your experience
                          </span>
                        </p>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() =>
                                handleRatingClick(booking.bookingId, star)
                              }
                              className="active:scale-95 transition-transform"
                              aria-label={`Rate ${star} stars`}
                            >
                              <Star
                                className={`w-5 h-5 ${
                                  star <= currentRating
                                    ? "fill-white text-white"
                                    : "text-text-secondary"
                                }`}
                                strokeWidth={2}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="my-1">
                      <svg
                        width="100%"
                        height="2"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <line
                          x1="0"
                          y1="1"
                          x2="100%"
                          y2="1"
                          stroke="#2C2C2C"
                          strokeWidth="1"
                          strokeDasharray="8 6"
                        />
                      </svg>
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        disabled
                        className="px-4 py-2 bg-primary text-background rounded-xl text-base font-semibold cursor-not-allowed opacity-70"
                      >
                        Booked
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/events/${booking.eventId}/guidelines`)
                        }
                        className="text-text-primary text-base font-medium active:opacity-70 transition-opacity flex items-center gap-1"
                      >
                        Guidelines{" "}
                        <span className="text-base font-semibold">&gt;</span>
                      </button>
                    </div>
                  </div>

                  <div className="absolute top-6 right-6 w-[2.8rem] h-[2.8rem] rounded-2xl overflow-hidden">
                    <ImageWithPlaceholder
                      src={getLandmarkImage(
                        booking.city.toLowerCase().replace(/\s+/g, "-")
                      )}
                      alt={booking.city}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
