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

export interface DinnerPreferences {
    city: string;
    preferredAreas: string[];
    language?: string[];
    dietaryRestriction?: string;
    hasCompletedSetup: boolean;
}

export interface DinnerPreferencesResponse {
    success: boolean;
    data: {
        hasCompletedSetup: boolean;
        preferences: DinnerPreferences;
    };
}

export interface UpdatePreferencesRequest {
    city?: string;
    preferredAreas?: string[];
    language?: string[];
    dietaryRestriction?: string;
}

