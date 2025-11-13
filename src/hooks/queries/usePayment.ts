import { useMutation } from "@tanstack/react-query";
import { paymentApi } from "../../services/api";
import type {
    CreatePaymentOrderRequest,
    VerifyPaymentRequest,
} from "../../types/payment";

export const useCreatePaymentOrder = () => {
    return useMutation({
        mutationFn: (data: CreatePaymentOrderRequest) =>
            paymentApi.createOrder(data),
    });
};

export const useVerifyPayment = () => {
    return useMutation({
        mutationFn: (data: VerifyPaymentRequest) =>
            paymentApi.verifyPayment(data),
    });
};

