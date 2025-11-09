export type CreateProfileResponse = {
    success: boolean;
    userId: string;
};

export type CreateProfileData = {
    name: string;
    dateOfBirth: string;
    gender: "male" | "female" | "other";
    universityId: string;
    degree: string;
    year: string;
};

