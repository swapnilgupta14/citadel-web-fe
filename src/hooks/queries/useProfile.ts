import { useQuery } from "@tanstack/react-query";
import { profileApi } from "../../services/api";

export const useProfile = () => {
    return useQuery({
        queryKey: ["profile", "me"],
        queryFn: () => profileApi.getProfile(),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: 1,
        enabled: false,
    });
};

