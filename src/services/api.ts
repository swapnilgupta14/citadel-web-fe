import { axiosInstance } from "./axiosInstance";
import type {
    UniversitiesResponse,
    UniversitiesParams,
} from "../types/universities";
import type {
    SendOTPResponse,
    VerifyOTPResponse,
} from "../types/auth";
import type {
    CreateProfileResponse,
    CreateProfileData,
    GetProfileResponse,
} from "../types/profile";
import type {
    AvailableSlotsResponse,
    BookEventRequest,
    BookEventResponse,
    DinnerPreferencesResponse,
    UpdatePreferencesRequest,
} from "../types/events";

export const universitiesApi = {
    getUniversities: async (
        params: UniversitiesParams = {}
    ): Promise<UniversitiesResponse> => {
        const { search = "", limit = 50, offset = 0 } = params;

        const queryParams: Record<string, string> = {
            limit: limit.toString(),
            offset: offset.toString(),
        };

        if (search) {
            queryParams.search = search;
        }

        const response = await axiosInstance.get<{
            universities: Array<{
                _id: string;
                name: string;
                country: string;
                domain?: string;
                createdAt?: string;
                updatedAt?: string;
                __v?: number;
            }>;
            hasMore: boolean;
        }>(
            "/v1/universities",
            {
                params: queryParams,
            }
        );

        // Transform _id to id to match our TypeScript types
        return {
            universities: response.data.universities.map((university) => ({
                id: university._id,
                name: university.name,
                country: university.country,
                domain: university.domain,
            })),
            hasMore: response.data.hasMore,
        };
    },
};

export const authApi = {
    sendOTP: async (email: string): Promise<SendOTPResponse> => {
        const response = await axiosInstance.post<SendOTPResponse>(
            "/v1/auth/send-otp",
            { email }
        );
        return response.data;
    },

    verifyOTP: async (
        email: string,
        otp: string
    ): Promise<VerifyOTPResponse> => {
        const response = await axiosInstance.post<VerifyOTPResponse>(
            "/v1/auth/verify-otp",
            { email, otp }
        );
        return response.data;
    },
};

export const profileApi = {
    getProfile: async (): Promise<GetProfileResponse> => {
        const response = await axiosInstance.get<GetProfileResponse>(
            "/v1/profile/me"
        );
        return response.data;
    },

    createProfile: async (
        data: CreateProfileData
    ): Promise<CreateProfileResponse> => {
        const response = await axiosInstance.post<CreateProfileResponse>(
            "/v1/onboarding",
            {
                name: data.name,
                dob: data.dateOfBirth,
                gender: data.gender,
                university: data.university,
                degree: data.degree,
                year: parseInt(data.year.replace(/\D/g, "")) || parseInt(data.year) || 1,
                skills: [],
                friends: [],
            }
        );
        return response.data;
    },
};

export const eventsApi = {
    getAvailableSlots: async (
        city: string,
        date?: string,
        area?: string
    ): Promise<AvailableSlotsResponse> => {
        const params: Record<string, string> = {
            city,
        };

        if (date) {
            params.date = date;
        }

        if (area) {
            params.area = area;
        }

        const response = await axiosInstance.get<{
            success: boolean;
            data: {
                events: Array<{
                    id: string;
                    eventDate: string | Date;
                    eventTime: string;
                    city: string;
                    area: string;
                    maxAttendees: number;
                    currentAttendees: number;
                    availableSeats: number;
                    bookingFee: number;
                    status: string;
                    isBooked: boolean;
                    isFull: boolean;
                }>;
                totalEvents: number;
            };
        }>(
            "/v1/dinner-events/upcoming",
            { params }
        );

        if (response.data.success && response.data.data) {
            return {
                slots: response.data.data.events.map((event) => ({
                    id: event.id,
                    date: typeof event.eventDate === 'string'
                        ? event.eventDate
                        : event.eventDate.toISOString().split('T')[0],
                    time: event.eventTime,
                    spotsAvailable: event.availableSeats,
                    totalSpots: event.maxAttendees,
                    estimatedCost: event.bookingFee,
                })),
            };
        }

        return { slots: [] };
    },

    bookEvent: async (
        data: BookEventRequest
    ): Promise<BookEventResponse> => {
        const response = await axiosInstance.post<BookEventResponse>(
            "/v1/events/book",
            data
        );
        return response.data;
    },
};

export const dinnerPreferencesApi = {
    getPreferences: async (): Promise<DinnerPreferencesResponse> => {
        const response = await axiosInstance.get<DinnerPreferencesResponse>(
            "/v1/dinner-preferences"
        );
        return response.data;
    },

    updatePreferences: async (
        data: UpdatePreferencesRequest
    ): Promise<DinnerPreferencesResponse> => {
        const response = await axiosInstance.patch<DinnerPreferencesResponse>(
            "/v1/dinner-preferences",
            data
        );
        return response.data;
    },
};

