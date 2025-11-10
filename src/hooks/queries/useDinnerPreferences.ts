import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dinnerPreferencesApi } from "../../services/api";
import type { UpdatePreferencesRequest } from "../../types/events";

export const useDinnerPreferences = () => {
    return useQuery({
        queryKey: ["dinner-preferences"],
        queryFn: () => dinnerPreferencesApi.getPreferences(),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: 1,
    });
};

export const useUpdateDinnerPreferences = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdatePreferencesRequest) =>
            dinnerPreferencesApi.updatePreferences(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dinner-preferences"] });
            queryClient.invalidateQueries({ queryKey: ["events", "slots"] });
        },
    });
};

export const useSaveDinnerPreferences = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdatePreferencesRequest) =>
            dinnerPreferencesApi.savePreferences(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dinner-preferences"] });
            queryClient.invalidateQueries({ queryKey: ["events", "slots"] });
        },
    });
};

