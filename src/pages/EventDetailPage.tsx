import { useParams, useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";
import { useEventDetail } from "../hooks/queries/useEvents";
import { formatDate, formatTime } from "../lib/helpers/eventUtils";
import { ImageWithPlaceholder } from "../components/ui/ImageWithPlaceholder";
import { getLandmarkImage } from "../lib/helpers/eventUtils";
import { EventSlotSkeleton } from "../components/ui/Skeleton";

export const EventDetailPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { data: eventData, isLoading, error } = useEventDetail(eventId);

  const event = eventData?.data;

  const handleBack = () => {
    navigate("/events");
  };

  const handlePayAmount = () => {
    console.log("Pay amount clicked");
  };

  if (isLoading) {
    return (
      <div className="flex h-full flex-col bg-background">
        <div className="flex-1 flex items-center justify-center">
          <EventSlotSkeleton count={1} />
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex h-full flex-col bg-background">
        <div className="flex-1 flex items-center justify-center px-6">
          <p className="text-text-secondary text-center">
            Failed to load event details. Please try again.
          </p>
        </div>
      </div>
    );
  }

  const dateStr = event.eventDate.includes("T")
    ? event.eventDate.split("T")[0]
    : event.eventDate;
  const formattedDate = formatDate(dateStr);
  const formattedTime = formatTime(event.eventTime);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex h-full flex-col bg-background relative overflow-hidden py-4"
    >
      <div className="flex-1 flex flex-col px-6 py-4 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
        <div className="mb-6 text-center flex-shrink-0">
          <h1 className="text-[28px] font-bold text-text-primary font-serif mb-2">
            Let's book your{" "}
            <span className="text-primary font-serif italic">DINNER!</span>
          </h1>
        </div>

        <div className="bg-background-secondary rounded-2xl p-4 mb-4 relative overflow-hidden">
          <div className="relative z-10 flex flex-col gap-4">
            <div className="pr-24">
              <h2 className="text-sm font-bold text-text-primary mb-1">
                To be revealed
              </h2>
              <p className="text-text-secondary text-base">
                {event.maxAttendees} guests
              </p>
            </div>

            <div>
              <p className="text-text-secondary text-sm mb-1">Date & Time</p>
              <p className="text-text-primary text-base font-semibold">
                {formattedDate} | {formattedTime}
              </p>
            </div>

            <div>
              <p className="text-text-secondary text-sm mb-1">Location</p>
              <div className="flex items-center justify-between">
                <p className="text-text-primary text-base font-semibold">
                  {event.area}, {event.city}
                </p>
                <MapPin className="w-6 h-6 text-text-primary" strokeWidth={2} />
              </div>
            </div>

            <div className="my-2">
              <svg width="100%" height="2" xmlns="http://www.w3.org/2000/svg">
                <line
                  x1="0"
                  y1="1"
                  x2="100%"
                  y2="1"
                  stroke="#2C2C2C"
                  strokeWidth="1"
                  strokeDasharray="12 8"
                />
              </svg>
            </div>

            <div className="flex items-center justify-between">
              <div className="px-6 py-3 bg-primary/20 text-primary rounded-full text-lg font-bold">
                Rs {event.bookingFee}
              </div>
              <button className="text-text-primary text-base font-medium active:opacity-70 transition-opacity flex items-center gap-1">
                Guidelines <span className="text-lg">&gt;</span>
              </button>
            </div>
          </div>

          <div className="absolute top-6 right-6 w-[2.8rem] h-[2.8rem] rounded-2xl overflow-hidden">
            <ImageWithPlaceholder
              src={getLandmarkImage(
                event.city.toLowerCase().replace(/\s+/g, "-")
              )}
              alt={event.city}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="h-[15%] min-h-[80px] max-h-[120px] overflow-visible pointer-events-none relative flex-shrink-0 mb-5">
        <img
          src="/Splash/waves.svg"
          alt=""
          className="absolute inset-0 h-full object-none w-full overflow-visible"
        />
      </div>

      <div className="px-6 py-4 flex-shrink-0 bg-background flex gap-4">
        <Button onClick={handleBack} variant="secondary" className="flex-1">
          Back
        </Button>
        <Button onClick={handlePayAmount} variant="primary" className="flex-1">
          Pay amount
        </Button>
      </div>
    </motion.div>
  );
};
