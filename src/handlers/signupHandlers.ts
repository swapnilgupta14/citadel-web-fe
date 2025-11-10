import type { SignupData } from "../hooks/logic/useSignupFlow";
import type { Page } from "../hooks/logic/useNavigation";

export const createSignupHandlers = (
    updateSignupData: (data: Partial<SignupData>) => void,
    navigateTo: (page: Page) => void
) => {
    return {
        handleSignupComplete: () => {
            navigateTo("connect");
        },

        handleConnectComplete: () => {
            navigateTo("university");
        },

        handleUniversityBack: () => {
            navigateTo("connect");
        },

        handleUniversityContinue: (universityId: string) => {
            updateSignupData({ universityId });
            navigateTo("email");
        },

        handleEmailBack: () => {
            navigateTo("university");
        },

        handleOTPBack: () => {
            navigateTo("email");
        },

        handleWhoAreYouBack: () => {
            navigateTo("otp");
        },

        handleWhoAreYouContinue: (data: {
            name: string;
            gender: "male" | "female" | "other";
        }) => {
            updateSignupData({
                name: data.name,
                gender: data.gender,
            });
            navigateTo("dateOfBirth");
        },

        handleDateOfBirthBack: () => {
            navigateTo("whoAreYou");
        },

        handleDateOfBirthContinue: (data: {
            day: string;
            month: string;
            year: string;
        }) => {
            const dateOfBirth = `${data.year}-${data.month.padStart(2, "0")}-${data.day.padStart(2, "0")}`;
            updateSignupData({ dateOfBirth });
            navigateTo("degree");
        },

        handleDegreeBack: () => {
            navigateTo("dateOfBirth");
        },
    };
};

