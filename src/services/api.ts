import { axiosInstance } from "./axiosInstance";
import { getApiAreaName } from "../constants/cities";
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
    UploadImageResponse,
    GetUserImagesResponse,
} from "../types/profile";
import type {
    AvailableSlotsResponse,
    BookEventRequest,
    BookEventResponse,
    DinnerPreferencesResponse,
    UpdatePreferencesRequest,
    EventDetailResponse,
    UserBookingsResponse,
} from "../types/events";
import type {
    QuizApiResponse, SubmitQuizRequest,
    SubmitQuizResponse,
    QuizResultsResponse,
} from "../types/quiz";
import type {
    SubmitPersonalityQuizRequest,
    SubmitPersonalityQuizResponse,
} from "../types/personality-quiz";
import type {
    LegalContentResponse,
    HelpSupportResponse,
} from "../types/legal";
import type {
    CreatePaymentOrderRequest,
    CreatePaymentOrderResponse,
    VerifyPaymentRequest,
    VerifyPaymentResponse,
} from "../types/payment";

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
    sendOTP: async (email: string, isLogin: boolean): Promise<SendOTPResponse> => {
        const response = await axiosInstance.post<SendOTPResponse>(
            "/v1/auth/send-otp",
            { email, isLogin }
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

    uploadImage: async (
        file: File
    ): Promise<UploadImageResponse> => {
        if (!file || !(file instanceof File)) {
            throw new Error("Invalid file provided");
        }

        const formData = new FormData();
        formData.append("image", file, file.name);

        const response = await axiosInstance.post<UploadImageResponse>(
            "/v1/profile/upload",
            formData,
            {
                timeout: 30000,
            }
        );
        return response.data;
    },

    assignImageToSlot: async (
        slot: number,
        userImageId: string
    ): Promise<{ message: string }> => {
        const response = await axiosInstance.put<{ message: string }>(
            "/v1/profile/images/slot",
            { slot, userImageId }
        );
        return response.data;
    },

    clearImageSlot: async (
        slot: number
    ): Promise<{ message: string }> => {
        const response = await axiosInstance.delete<{ message: string }>(
            `/v1/profile/images/slot/${slot}`
        );
        return response.data;
    },

    getUserImages: async (): Promise<GetUserImagesResponse> => {
        const response = await axiosInstance.get<GetUserImagesResponse>(
            "/v1/profile/images"
        );
        return response.data;
    },

    deleteUserImage: async (
        imageId: string
    ): Promise<{ message: string }> => {
        const response = await axiosInstance.delete<{ message: string }>(
            `/v1/profile/images/${imageId}`
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
            params.area = getApiAreaName(area);
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

    getEventDetail: async (eventId: string): Promise<EventDetailResponse> => {
        const response = await axiosInstance.get<EventDetailResponse>(
            `/v1/dinner-events/${eventId}`
        );
        return response.data;
    },

    getUserBookings: async (
        type?: "upcoming" | "past"
    ): Promise<UserBookingsResponse> => {
        const params: Record<string, string> = {};
        if (type) {
            params.type = type;
        }
        const response = await axiosInstance.get<UserBookingsResponse>(
            "/v1/dinner-events/bookings/my",
            { params }
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

    saveInitialPreferences: async (
        data: UpdatePreferencesRequest
    ): Promise<DinnerPreferencesResponse> => {
        const response = await axiosInstance.post<DinnerPreferencesResponse>(
            "/v1/dinner-preferences/initial",
            data
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

export const quizApi = {
    getQuestions: async (): Promise<QuizApiResponse> => {
        const response = await axiosInstance.get<QuizApiResponse>(
            "/quiz"
        );
        return response.data;
    },

    submitQuiz: async (
        data: SubmitQuizRequest
    ): Promise<SubmitQuizResponse> => {
        const response = await axiosInstance.post<SubmitQuizResponse>(
            "/v1/quiz/submit",
            data
        );
        return response.data;
    },

    getResults: async (): Promise<QuizResultsResponse> => {
        const response = await axiosInstance.get<QuizResultsResponse>(
            "/v1/quiz/results"
        );
        return response.data;
    },
};

export const personalityQuizApi = {
    submitQuiz: async (
        data: SubmitPersonalityQuizRequest
    ): Promise<SubmitPersonalityQuizResponse> => {
        const response = await axiosInstance.post<SubmitPersonalityQuizResponse>(
            "/v1/dinner-preferences/personality-quiz",
            data
        );
        return response.data;
    },
};

export const legalApi = {
    getPrivacyPolicy: async (): Promise<LegalContentResponse> => {
        const response = await axiosInstance.get<LegalContentResponse>(
            "/v1/legal/privacy-policy"
        );
        return response.data;
    },

    getTermsAndConditions: async (): Promise<LegalContentResponse> => {
        const response = await axiosInstance.get<LegalContentResponse>(
            "/v1/legal/terms-and-conditions"
        );
        return response.data;
    },
};

export const helpSupportApi = {
    getHelpSupport: async (): Promise<HelpSupportResponse> => {
        const response = await axiosInstance.get<HelpSupportResponse>(
            "/v1/help-support"
        );
        return response.data;
    },
};

export const paymentApi = {
    createOrder: async (
        data: CreatePaymentOrderRequest
    ): Promise<CreatePaymentOrderResponse> => {
        const response = await axiosInstance.post<CreatePaymentOrderResponse>(
            "/v1/payments/create-order",
            data
        );
        return response.data;
    },

    verifyPayment: async (
        data: VerifyPaymentRequest
    ): Promise<VerifyPaymentResponse> => {
        const response = await axiosInstance.post<VerifyPaymentResponse>(
            "/v1/payments/verify",
            data
        );
        return response.data;
    },
};

