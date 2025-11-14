import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { profileApi } from "../../services/api";

export const useProfile = () => {
    return useQuery({
        queryKey: ["profile", "me"],
        queryFn: () => profileApi.getProfile(),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: 1,
    });
};

export const useUploadProfileImage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ file, slot = 0 }: { file: File; slot?: number }) => {
            const uploadResponse = await profileApi.uploadImage(file);
            if (uploadResponse.data?.id) {
                await profileApi.assignImageToSlot(slot, uploadResponse.data.id);
            }
            return uploadResponse;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
            queryClient.invalidateQueries({ queryKey: ["profile", "images"] });
        },
    });
};

export const useDeleteProfileImage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ slot }: { slot: number }) =>
            profileApi.clearImageSlot(slot),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
            queryClient.invalidateQueries({ queryKey: ["profile", "images"] });
        },
    });
};

export const useGetUserImages = () => {
    return useQuery({
        queryKey: ["profile", "images"],
        queryFn: () => profileApi.getUserImages(),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: 1,
    });
};

