import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { dinnerPreferencesApi } from "../../services/api";
import type { UpdatePreferencesRequest } from "../../types/events";

export const useDinnerPreferences = (enabled: boolean = true) => {
    return useQuery({
        queryKey: ["dinner-preferences"],
        queryFn: () => dinnerPreferencesApi.getPreferences(),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: false,
        enabled,
    });
};

export const useSaveInitialPreferences = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdatePreferencesRequest) =>
            dinnerPreferencesApi.saveInitialPreferences(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dinner-preferences"] });
            queryClient.invalidateQueries({ queryKey: ["events", "slots"] });
        },
        retry: false,
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
        retry: false,
    });
};

