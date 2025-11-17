import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { EventDetailCard } from "../../components/ui";
import { formatDate, formatTime } from "../../lib/helpers/eventUtils";
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
              const dateStr = booking.eventDate?.includes("T")
                ? booking.eventDate?.split("T")[0]
                : booking.eventDate;
              const formattedDate = dateStr ? formatDate(dateStr) : "";
              const formattedTime = booking.eventTime
                ? formatTime(booking.eventTime)
                : "";
              const currentRating = getRating(booking.bookingId);
              const venueName = booking.venue || "To be revealed";
              const paymentSubtitle =
                booking.paymentAmount > 0
                  ? `Rs ${booking.paymentAmount}`
                  : "Free";

              return (
                <EventDetailCard
                  key={booking.bookingId}
                  title={venueName}
                  subtitle={paymentSubtitle}
                  formattedDate={formattedDate}
                  formattedTime={formattedTime}
                  area={booking.area}
                  city={booking.city}
                  showRating={activeTab === "past"}
                  rating={currentRating}
                  onRatingChange={(rating) =>
                    handleRatingClick(booking.bookingId, rating)
                  }
                  showBookedButton={true}
                  onGuidelinesClick={() =>
                    navigate(`/events/${booking.eventId}/guidelines`)
                  }
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
