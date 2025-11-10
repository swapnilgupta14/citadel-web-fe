export type CreateProfileResponse = {
    success: boolean;
    userId: string;
};

export type CreateProfileData = {
    name: string;
    dateOfBirth: string;
    gender: "male" | "female" | "other";
    university: {
        id: string;
        name: string;
        country: string;
        domain?: string;
    };
    degree: string;
    year: string;
};

export type UserProfile = {
    id: number;
    email: string;
    name: string;
    university: {
        id: number;
        name: string;
        domain: string;
        country: string;
    };
    degree: string;
    year: string;
    gender: string;
    dateOfBirth: string;
    skills?: string[];
    isProfileComplete: boolean;
    isEmailVerified: boolean;
    aboutMe?: string;
    sports?: string;
    movies?: string;
    tvShows?: string;
    teams?: string;
    portfolioLink?: string;
    phoneNumber?: string;
    images?: Array<{
        id: number;
        cloudfrontUrl: string;
        originalName?: string;
        mimeType?: string;
        fileSize?: number;
        createdAt?: string;
    }>;
    slots?: Array<{
        slot: number;
        image: null | {
            id: number;
            cloudfrontUrl: string;
            originalName?: string;
            mimeType?: string;
            fileSize?: number;
            createdAt?: string;
        };
    }>;
    createdAt: string;
    updatedAt: string;
};

export type GetProfileResponse = {
    success: boolean;
    message: string;
    data: UserProfile;
};

