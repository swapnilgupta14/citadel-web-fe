import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { eventsApi } from "../../services/api";

interface UseBookingsParams {
    type?: "upcoming" | "past";
}

export const useBookings = (params: UseBookingsParams = {}) => {
    const { type } = params;

    return useQuery({
        queryKey: ["bookings", "my", type],
        queryFn: () => eventsApi.getUserBookings(type),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 30,
        gcTime: 1000 * 60 * 5,
    });
};

