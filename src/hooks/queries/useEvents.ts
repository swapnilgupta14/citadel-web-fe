import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
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
        placeholderData: keepPreviousData,
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

export const useEventDetail = (eventId: string | undefined) => {
    return useQuery({
        queryKey: ["events", "detail", eventId],
        queryFn: () => eventsApi.getEventDetail(eventId!),
        enabled: !!eventId,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });
};

