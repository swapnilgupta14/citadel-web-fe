export type SendOTPResponse = {
    success: boolean;
    message: string;
    expiresIn: number;
};

export type VerifyOTPResponse = {
    success: boolean;
    tokens: {
        accessToken: string;
        refreshToken: string;
    };
    user: {
        id: string;
        email: string;
        isProfileComplete: boolean;
    };
};

