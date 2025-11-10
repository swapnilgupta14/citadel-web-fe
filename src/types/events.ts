export interface EventSlot {
    id: string;
    date: string;
    time: string;
    spotsAvailable: number;
    totalSpots: number;
    estimatedCost: number;
}

export interface AvailableSlotsResponse {
    slots: EventSlot[];
}

export interface BookEventRequest {
    slotId: string;
    paymentMethodId: string;
}

export interface BookEventResponse {
    success: boolean;
    bookingId: string;
    status: string;
}

export interface City {
    id: string;
    name: string;
    landmarkImage?: string;
    isAvailable: boolean;
    comingSoon?: boolean;
}

