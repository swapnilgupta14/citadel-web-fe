const SIGNUP_DATA_KEY = "citadel_signup_data";
const SIGNUP_EMAIL_KEY = "citadel_signup_email";

export type PersistedSignupData = {
    universityId?: string;
    name?: string;
    gender?: "male" | "female" | "other";
    dateOfBirth?: string;
    degree?: string;
    year?: string;
};

export const signupPersistence = {
    saveSignupData: (data: PersistedSignupData) => {
        try {
            localStorage.setItem(SIGNUP_DATA_KEY, JSON.stringify(data));
        } catch (error) {
            console.error("Failed to save signup data:", error);
        }
    },

    getSignupData: (): PersistedSignupData => {
        try {
            const data = localStorage.getItem(SIGNUP_DATA_KEY);
            return data ? JSON.parse(data) : {};
        } catch (error) {
            console.error("Failed to get signup data:", error);
            return {};
        }
    },

    saveEmail: (email: string) => {
        try {
            localStorage.setItem(SIGNUP_EMAIL_KEY, email);
        } catch (error) {
            console.error("Failed to save email:", error);
        }
    },

    getEmail: (): string => {
        try {
            return localStorage.getItem(SIGNUP_EMAIL_KEY) || "";
        } catch (error) {
            console.error("Failed to get email:", error);
            return "";
        }
    },

    clearSignupData: () => {
        try {
            localStorage.removeItem(SIGNUP_DATA_KEY);
            localStorage.removeItem(SIGNUP_EMAIL_KEY);
        } catch (error) {
            console.error("Failed to clear signup data:", error);
        }
    },

    clearAll: () => {
        signupPersistence.clearSignupData();
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
    },
};

