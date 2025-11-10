import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eventsApi } from "../../services/api";
import type { BookEventRequest } from "../../types/events";

interface UseEventsParams {
    city: string;
    date?: string;
    area?: string;
}

export const useEvents = (params: UseEventsParams) => {
    const { city, date, area } = params;

    return useQuery({
        queryKey: ["events", "slots", city, date, area],
        queryFn: () => eventsApi.getAvailableSlots(city, date, area),
        enabled: !!city,
        staleTime: 1000 * 30,
        gcTime: 1000 * 60 * 5,
    });
};

export const useBookEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: BookEventRequest) => eventsApi.bookEvent(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events", "slots"] });
        },
    });
};

