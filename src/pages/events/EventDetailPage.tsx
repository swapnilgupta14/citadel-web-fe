import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button, EventDetailCard } from "../../components/ui";
import { EventDetailCardSkeleton } from "../../components/skeleton";
import { useEventDetail } from "../../hooks/queries/useEvents";
import { formatDate } from "../../lib/helpers/eventUtils";
import { useProtectedLayout, useRazorpayPayment } from "../../hooks/logic";

export const EventDetailPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { data: eventData, isLoading, error } = useEventDetail(eventId);
  const { resetBookingFlow } = useProtectedLayout();
  const {
    initiatePayment,
    isProcessingPayment,
    isVerifyingPayment,
    isCreatingOrder,
  } = useRazorpayPayment();

  const event = eventData?.data;

  useEffect(() => {
    resetBookingFlow();
  }, [resetBookingFlow]);

  useEffect(() => {
    window.history.pushState(null, "", window.location.pathname);

    const handlePopState = () => {
      if (isVerifyingPayment) {
        window.history.pushState(null, "", window.location.pathname);
        return;
      }
      navigate("/personality-quiz", { replace: true });
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate, isVerifyingPayment]);

  const handleBack = () => {
    resetBookingFlow();
    navigate("/personality-quiz", { replace: true });
  };

  const handlePayAmount = async () => {
    if (!event || !eventId) {
      return;
    }

    await initiatePayment({
      eventId,
      eventDate: event.eventDate,
      eventTime: event.eventTime,
      area: event.area,
      city: event.city,
      bookingFee: event.bookingFee,
      maxAttendees: event.maxAttendees,
    });
  };

  const hasError = !!error || (!isLoading && !event);
  const dateStr = event?.eventDate?.includes("T")
    ? event?.eventDate?.split("T")[0]
    : event?.eventDate;
  const formattedDate = dateStr ? formatDate(dateStr) : "";
  const formattedTime = event?.eventTime;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex h-full flex-col bg-background relative overflow-hidden py-4"
    >
      <div className="flex-1 flex flex-col px-6 py-4 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
        <div className="mb-6 text-center flex-shrink-0">
          <h1 className="text-[28px] font-bold text-text-primary font-serif mb-2 leading-tight">
            Let's book your{" "}
            <span className="text-primary font-serif italic">DINNER!</span>
          </h1>
        </div>

        {hasError ? (
          <div className="bg-background-secondary rounded-2xl p-4 mb-4 relative z-10 overflow-hidden">
            <div className="flex items-center justify-center py-8">
              <p className="text-text-secondary text-center text-base">
                Failed to load the event detail
              </p>
            </div>
          </div>
        ) : isLoading ? (
          <div className="bg-background-secondary rounded-2xl p-4 mb-4 relative z-10 overflow-hidden">
            <EventDetailCardSkeleton />
          </div>
        ) : (
          event && (
            <EventDetailCard
              maxAttendees={event.maxAttendees}
              formattedDate={formattedDate}
              formattedTime={formattedTime || ""}
              area={event.area}
              city={event.city}
              bookingFee={event.bookingFee}
              showBookedButton={false}
              onGuidelinesClick={() =>
                navigate(`/events/${eventId}/guidelines`)
              }
            />
          )
        )}
      </div>

      <div className="h-[15%] min-h-[80px] max-h-[120px] overflow-visible pointer-events-none relative flex-shrink-0 mb-5">
        <img
          src="/Splash/waves.svg"
          alt=""
          className="absolute inset-0 h-full object-none w-full overflow-visible"
        />
      </div>

      <div className="px-6 py-4 flex-shrink-0 bg-background flex gap-4">
        <Button
          onClick={handleBack}
          variant="secondary"
          className="flex-1"
          disabled={isVerifyingPayment}
        >
          Back
        </Button>
        <Button
          onClick={handlePayAmount}
          variant="primary"
          className="flex-1"
          disabled={isLoading || hasError || isProcessingPayment}
          isLoading={isProcessingPayment || isCreatingOrder}
        >
          Pay amount
        </Button>
      </div>
    </motion.div>
  );
};
