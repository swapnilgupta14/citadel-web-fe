import { useQuery } from "@tanstack/react-query";
import { legalApi } from "../../services/api";

export const usePrivacyPolicy = () => {
    return useQuery({
        queryKey: ["legal", "privacy-policy"],
        queryFn: () => legalApi.getPrivacyPolicy(),
        staleTime: 1000 * 60 * 60, // 1 hour
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
        retry: (failureCount, error: any) => {
            // Don't retry on 404 errors (API not implemented yet)
            if (error?.response?.status === 404) {
                return false;
            }
            return failureCount < 2;
        },
    });
};

export const useTermsAndConditions = () => {
    return useQuery({
        queryKey: ["legal", "terms-and-conditions"],
        queryFn: () => legalApi.getTermsAndConditions(),
        staleTime: 1000 * 60 * 60, // 1 hour
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
        retry: (failureCount, error: any) => {
            // Don't retry on 404 errors (API not implemented yet)
            if (error?.response?.status === 404) {
                return false;
            }
            return failureCount < 2;
        },
    });
};

