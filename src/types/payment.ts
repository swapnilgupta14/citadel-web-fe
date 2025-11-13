export interface CreatePaymentOrderRequest {
    userId: string;
    eventId: string;
    eventType: "dinner";
    amount: number;
    currency: "INR";
    bookingDate: string;
    bookingTime: string;
    location: string;
    guests?: number;
    notes?: string;
}

export interface PaymentOrder {
    id: string;
    amount: number;
    currency: string;
    receipt: string;
}

export interface PaymentBooking {
    id: string;
    status: string;
    eventId: string;
}

export interface Payment {
    id: string;
    status: string;
}

export interface CreatePaymentOrderResponse {
    success: boolean;
    message: string;
    data: {
        order: PaymentOrder;
        booking: PaymentBooking;
        payment: Payment;
    };
}

export interface VerifyPaymentRequest {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

export interface VerifyPaymentResponse {
    success: boolean;
    message: string;
    data: {
        bookingId: string;
        paymentId: string;
    };
}

declare global {
    interface Window {
        Razorpay: any;
    }
}

