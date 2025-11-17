import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadRazorpayScript } from "../../lib/helpers/razorpay";
import { env } from "../../config/env";
import { auth } from "../../lib/storage/auth";
import { showToast, handleApiError } from "../../lib/helpers/toast";
import {
  useCreatePaymentOrder,
  useVerifyPayment,
  useProfile,
} from "../queries";

interface PaymentDetails {
  eventId: string;
  eventDate: string;
  eventTime: string;
  area: string;
  city: string;
  bookingFee: number;
  maxAttendees?: number;
}

export const useRazorpayPayment = () => {
  const navigate = useNavigate();
  const createOrderMutation = useCreatePaymentOrder();
  const verifyPaymentMutation = useVerifyPayment();
  const { data: profileData } = useProfile();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);

  const initiatePayment = async (paymentDetails: PaymentDetails) => {
    const userData = auth.getUserData();

    if (!paymentDetails.eventId || !userData?.id) {
      showToast.error("Missing required information");
      return;
    }

    setIsProcessingPayment(true);

    try {
      const profileName = profileData?.data?.name || userData.id;

      await loadRazorpayScript();

      if (!window.Razorpay) {
        throw new Error("Razorpay SDK failed to load");
      }

      const razorpayKeyId = env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKeyId) {
        throw new Error("Razorpay key not configured");
      }

      const dateStr = paymentDetails.eventDate?.includes("T")
        ? paymentDetails.eventDate?.split("T")[0]
        : paymentDetails.eventDate;

      const orderData = await createOrderMutation.mutateAsync({
        userId: userData.id,
        eventId: paymentDetails.eventId,
        eventType: "dinner",
        amount: paymentDetails.bookingFee,
        currency: "INR",
        bookingDate: dateStr || paymentDetails.eventDate,
        bookingTime: paymentDetails.eventTime,
        location: `${paymentDetails.area}, ${paymentDetails.city}`,
        guests: 1,
      });

      const options = {
        key: razorpayKeyId,
        amount: orderData.data.order.amount,
        currency: orderData.data.order.currency,
        name: "Citadel Dinners",
        description: `Dinner on ${dateStr || paymentDetails.eventDate} at ${paymentDetails.eventTime}`,
        order_id: orderData.data.order.id,
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          setIsVerifyingPayment(true);
          const loadingToastId = showToast.loading("Verifying payment...");

          try {
            const verifyData = await verifyPaymentMutation.mutateAsync({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            showToast.dismiss(loadingToastId);

            if (verifyData.success) {
              showToast.success("Payment successful!");
              navigate(`/events/${paymentDetails.eventId}/success`, {
                replace: true,
              });
            } else {
              showToast.error("Payment verification failed");
              setIsVerifyingPayment(false);
            }
          } catch (err) {
            showToast.dismiss(loadingToastId);
            const errorMessage = handleApiError(err);
            showToast.error(errorMessage || "Payment verification failed");
            setIsVerifyingPayment(false);
          }
        },
        prefill: {
          name: profileName,
          email: userData.email ?? "",
          contact: "",
        },
        theme: {
          color: "#1BEA7B",
          backdrop_color: "rgba(0, 0, 0, 0.7)",
        },
        modal: {
          ondismiss: () => {
            setIsProcessingPayment(false);
          },
          confirm_close: true,
          escape: true,
          animation: true,
          backdropclose: true,
        },
        config: {
          display: {
            blocks: {
              banks: {
                name: "All payment methods",
                instruments: [
                  {
                    method: "card",
                  },
                  {
                    method: "upi",
                  },
                  {
                    method: "netbanking",
                  },
                ],
              },
            },
            sequence: ["block.banks"],
            preferences: {
              show_default_blocks: true,
            },
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

  return {
    initiatePayment,
    isProcessingPayment,
    isVerifyingPayment,
    isCreatingOrder: createOrderMutation.isPending,
  };
};

