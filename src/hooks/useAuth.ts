import { useState, useEffect } from "react";
import { authApi } from "../services/api";
import { auth } from "../lib/auth";
import { showToast, handleApiError } from "../lib/toast";

export const useAuth = () => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const savedAccessToken = auth.getAccessToken();
        const savedUserData = auth.getUserData();

        if (savedAccessToken) {
            setAccessToken(savedAccessToken);
        }
        if (savedUserData) {
            setUserEmail(savedUserData.email);
        }
    }, []);

    const sendOTP = async (email: string) => {
        setIsLoading(true);
        try {
            await authApi.sendOTP(email);
            setUserEmail(email);
            showToast.success("OTP sent successfully! Check your email.");
            return true;
        } catch (err) {
            const errorMessage = handleApiError(err);
            showToast.error(errorMessage);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const verifyOTP = async (email: string, otp: string) => {
        setIsLoading(true);
        try {
            const response = await authApi.verifyOTP(email, otp);
            auth.setTokens(response.tokens.accessToken, response.tokens.refreshToken);
            auth.setUserData(response.user);
            setAccessToken(response.tokens.accessToken);
            setUserEmail(response.user.email);
            showToast.success("OTP verified successfully!");
            return response;
        } catch (err) {
            const errorMessage = handleApiError(err);
            showToast.error(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const resendOTP = async (email: string) => {
        setIsLoading(true);
        try {
            await authApi.sendOTP(email);
            showToast.success("OTP resent successfully!");
        } catch (err) {
            const errorMessage = handleApiError(err);
            showToast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        accessToken,
        userEmail,
        isLoading,
        sendOTP,
        verifyOTP,
        resendOTP,
        setUserEmail,
    };
};

