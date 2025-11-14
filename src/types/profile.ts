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
    id: string;
    email: string;
    name: string;
    username?: string;
    university: {
        id: string;
        name: string;
        domain: string;
        country: string;
    };
    degree: string;
    year: string;
    gender: string;
    dateOfBirth: string | null;
    skills?: string[];
    friends?: string[];
    isProfileComplete: boolean;
    isEmailVerified: boolean;
    aboutMe?: string | null;
    sports?: string | null;
    movies?: string | null;
    tvShows?: string | null;
    teams?: string | null;
    portfolioLink?: string | null;
    phoneNumber?: string | null;
    images?: Array<{
        id: string;
        s3Key?: string;
        cloudfrontUrl: string;
        originalName?: string;
        mimeType?: string;
        fileSize?: number;
        createdAt?: string;
    }>;
    slots?: Array<{
        slot: number;
        image: null | {
            id: string;
            s3Key?: string;
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

export type UploadImageResponse = {
    message: string;
    data: {
        id: string;
        s3Key?: string;
        cloudfrontUrl: string;
        originalName?: string;
        mimeType?: string;
        fileSize?: number;
        createdAt?: string;
    };
};

export type UserImage = {
    id: string;
    userId?: string;
    s3Key?: string;
    cloudfrontUrl: string;
    originalName?: string;
    mimeType?: string;
    fileSize?: number;
    createdAt?: string;
};

export type GetUserImagesResponse = {
    message: string;
    data: UserImage[];
};

