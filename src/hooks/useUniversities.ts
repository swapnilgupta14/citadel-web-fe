import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { universitiesApi } from "../services/api";
import type { UniversitiesParams } from "../types/universities";

export const useUniversities = (params: UniversitiesParams = {}) => {
    const { search = "", limit = 50, offset = 0 } = params;

    return useQuery({
        queryKey: ["universities", search, limit, offset],
        queryFn: () => universitiesApi.getUniversities({ search, limit, offset }),
        enabled: search.trim().length > 0,
        placeholderData: keepPreviousData,
        staleTime: 1000 * 5,
        gcTime: 1000 * 60 * 10,
    });
};

