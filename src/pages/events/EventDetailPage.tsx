import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button, ImageWithPlaceholder } from "../../components/ui";
import { EventDetailCardSkeleton } from "../../components/skeleton";
import { useEventDetail } from "../../hooks/queries/useEvents";
import { useCreatePaymentOrder, useVerifyPayment } from "../../hooks/queries";
import { profileApi } from "../../services/api";
import { formatDate, formatTime } from "../../lib/helpers/eventUtils";
import { getLandmarkImage } from "../../lib/helpers/eventUtils";
import { useProtectedLayout } from "../../hooks/logic/useProtectedLayout";
import { loadRazorpayScript } from "../../lib/helpers/razorpay";
import { env } from "../../config/env";
import { auth } from "../../lib/storage/auth";
import { showToast, handleApiError } from "../../lib/helpers/toast";

export const EventDetailPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { data: eventData, isLoading, error } = useEventDetail(eventId);
  const { resetBookingFlow } = useProtectedLayout();
  const createOrderMutation = useCreatePaymentOrder();
  const verifyPaymentMutation = useVerifyPayment();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const event = eventData?.data;
  const userData = auth.getUserData();

  useEffect(() => {
    resetBookingFlow();
  }, [resetBookingFlow]);

  useEffect(() => {
    window.history.pushState(null, "", window.location.pathname);

    const handlePopState = () => {
      navigate("/personality-quiz", { replace: true });
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  const handleBack = () => {
    resetBookingFlow();
    navigate("/personality-quiz", { replace: true });
  };

  const handlePayAmount = async () => {
    if (!event || !eventId || !userData?.id) {
      showToast.error("Missing required information");
      return;
    }

    setIsProcessingPayment(true);

    try {
      const profileResponse = await profileApi.getProfile();
      const profileName = profileResponse?.data?.name || "";

      await loadRazorpayScript();

      if (!window.Razorpay) {
        throw new Error("Razorpay SDK failed to load");
      }

      const razorpayKeyId = env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKeyId) {
        throw new Error("Razorpay key not configured");
      }

      const dateStr = event.eventDate.includes("T")
        ? event.eventDate.split("T")[0]
        : event.eventDate;

      const orderData = await createOrderMutation.mutateAsync({
        userId: userData.id,
        eventId: eventId,
        eventType: "dinner",
        amount: event.bookingFee,
        currency: "INR",
        bookingDate: dateStr || event.eventDate,
        bookingTime: event.eventTime,
        location: `${event.area}, ${event.city}`,
        guests: 1,
      });

      const options = {
        key: razorpayKeyId,
        amount: orderData.data.order.amount,
        currency: orderData.data.order.currency,
        name: "Citadel Dinners",
        description: `Dinner on ${dateStr || event.eventDate} at ${event.eventTime}`,
        order_id: orderData.data.order.id,
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verifyData = await verifyPaymentMutation.mutateAsync({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyData.success) {
              showToast.success("Payment successful!");
              navigate(`/events/${eventId}/success`, { replace: true });
            } else {
              showToast.error("Payment verification failed");
            }
          } catch (err) {
            const errorMessage = handleApiError(err);
            showToast.error(errorMessage || "Payment verification failed");
          }
        },
        prefill: {
          name: profileName,
          email: userData.email ?? "",
          contact: "",
        },
        theme: {
          color: "#1BEA7B",
        },
        modal: {
          ondismiss: () => {
            setIsProcessingPayment(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      setIsProcessingPayment(false);
      const errorMessage = handleApiError(err);
      showToast.error(errorMessage || "Failed to initiate payment");
    }
  };

  const hasError = !!error || (!isLoading && !event);
  const dateStr = event?.eventDate.includes("T")
    ? event.eventDate.split("T")[0]
    : event?.eventDate;
  const formattedDate = dateStr ? formatDate(dateStr) : "";
  const formattedTime = event?.eventTime ? formatTime(event.eventTime) : "";

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

        {hasError ? (
          <div className="bg-background-secondary rounded-2xl p-4 mb-4 relative z-10 overflow-hidden">
            <div className="flex items-center justify-center py-8">
              <p className="text-text-secondary text-center text-base">
                Failed to load the event detail
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-background-secondary rounded-2xl p-4 mb-4 relative z-10 overflow-hidden">
            {isLoading ? (
              <EventDetailCardSkeleton />
            ) : (
              <>
                <div className="relative flex flex-col gap-4">
                  <div className="pr-24">
                    <h2 className="text-sm font-bold text-text-primary mb-1">
                      To be revealed
                    </h2>
                    <p className="text-text-secondary text-base">
                      {event?.maxAttendees} guests
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
                    <p className="text-text-secondary text-sm mb-1">Location</p>
                    <div className="flex items-center justify-between">
                      <p className="text-text-primary text-base font-semibold">
                        {event?.area}, {event?.city}
                      </p>
                      <MapPin
                        className="w-6 h-6 text-text-primary"
                        strokeWidth={2}
                      />
                    </div>
                  </div>

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
                    <div className="px-4 py-2 bg-primary/20 text-primary rounded-xl text-lg font-bold">
                      Rs {event?.bookingFee}
                    </div>
                    <button
                      onClick={() => navigate(`/events/${eventId}/guidelines`)}
                      className="text-text-primary text-base font-medium active:opacity-70 transition-opacity flex items-center gap-1"
                    >
                      Guidelines{" "}
                      <ChevronRight className="w-5 h-5" strokeWidth={2} />
                    </button>
                  </div>
                </div>

                {event && (
                  <div className="absolute top-6 right-6 w-[2.8rem] h-[2.8rem] rounded-2xl overflow-hidden">
                    <ImageWithPlaceholder
                      src={getLandmarkImage(
                        event.city.toLowerCase().replace(/\s+/g, "-")
                      )}
                      alt={event.city}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </>
            )}
          </div>
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
        <Button onClick={handleBack} variant="secondary" className="flex-1">
          Back
        </Button>
        <Button
          onClick={handlePayAmount}
          variant="primary"
          className="flex-1"
          disabled={isLoading || hasError || isProcessingPayment}
          isLoading={isProcessingPayment || createOrderMutation.isPending}
        >
          Pay amount
        </Button>
      </div>
    </motion.div>
  );
};
