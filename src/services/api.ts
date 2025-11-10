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
} from "../types/profile";
import type {
    AvailableSlotsResponse,
    BookEventRequest,
    BookEventResponse,
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

        const response = await axiosInstance.get<UniversitiesResponse>(
            "/v1/universities",
            {
                params: queryParams,
            }
        );

        return response.data;
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
    createProfile: async (
        data: CreateProfileData
    ): Promise<CreateProfileResponse> => {
        const response = await axiosInstance.post<CreateProfileResponse>(
            "/v1/users/profile",
            {
                name: data.name,
                dateOfBirth: data.dateOfBirth,
                gender: data.gender,
                universityId: data.universityId,
                degree: data.degree,
                year: parseInt(data.year.replace(/\D/g, "")) || parseInt(data.year) || 1,
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

        const response = await axiosInstance.get<AvailableSlotsResponse>(
            "/v1/events/available-slots",
            { params }
        );

        return response.data;
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

