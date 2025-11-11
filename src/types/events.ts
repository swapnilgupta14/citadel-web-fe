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
    eventId?: string;
}

export interface EventDetail {
    id: string;
    eventDate: string;
    eventTime: string;
    city: string;
    area: string;
    venue: string | null;
    venueAddress: string | null;
    venueDetails: string | null;
    maxAttendees: number;
    currentAttendees: number;
    availableSeats: number;
    bookingFee: number;
    status: string;
    isBooked: boolean;
    groupChatId: string | null;
}

export interface EventDetailResponse {
    success: boolean;
    data: EventDetail;
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
    budget?: string;
    drinksPreference?: string;
    relationshipStatus?: string;
}

