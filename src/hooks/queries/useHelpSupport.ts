import { useQuery } from "@tanstack/react-query";
import { helpSupportApi } from "../../services/api";

export const useHelpSupport = () => {
    return useQuery({
        queryKey: ["help-support"],
        queryFn: () => helpSupportApi.getHelpSupport(),
        staleTime: 1000 * 60 * 30, // 30 minutes
        gcTime: 1000 * 60 * 60, // 1 hour
        retry: (failureCount, error: any) => {
            // Don't retry on 404 errors (API not implemented yet)
            if (error?.response?.status === 404) {
                return false;
            }
            return failureCount < 2;
        },
    });
};

