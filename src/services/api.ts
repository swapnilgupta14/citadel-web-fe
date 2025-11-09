import { axiosInstance } from "./axiosInstance";
import type {
    UniversitiesResponse,
    UniversitiesParams,
} from "../types/universities";

export const universitiesApi = {
    getUniversities: async (
        params: UniversitiesParams = {}
    ): Promise<UniversitiesResponse> => {
        const { search = "", limit = 50, offset = 0 } = params;

        const queryParams: Record<string, string> = {
            limit: limit.toString(),
            offset: offset.toString(),
        };

        if (search) {
            queryParams.search = search;
        }

        const response = await axiosInstance.get<UniversitiesResponse>(
            "/v1/universities",
            {
                params: queryParams,
            }
        );

        return response.data;
    },
};

