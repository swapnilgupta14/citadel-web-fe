import { useState, useEffect } from "react";
import { auth } from "../../lib/auth";

export type Page =
    | "splash"
    | "signup"
    | "loginEmail"
    | "loginOTP"
    | "email"
    | "otp"
    | "connect"
    | "university"
    | "whoAreYou"
    | "dateOfBirth"
    | "degree"
    | "success"
    | "home"
    | "404";

const getInitialPage = (): Page => {
    if (auth.isAuthenticated()) {
        return "home";
    }
    return "splash";
};

export const useNavigation = () => {
    const [currentPage, setCurrentPage] = useState<Page>(getInitialPage());

    useEffect(() => {
        const handleNavigateToLogin = () => {
            setCurrentPage("loginEmail");
        };

        window.addEventListener("navigateToLogin", handleNavigateToLogin);

        return () => {
            window.removeEventListener("navigateToLogin", handleNavigateToLogin);
        };
    }, []);

    return {
        currentPage,
        setCurrentPage,
        navigateTo: setCurrentPage,
    };
};

