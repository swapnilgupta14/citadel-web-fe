import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { personalityQuizApi } from "../../services/api";
import type { SubmitPersonalityQuizRequest } from "../../types/personality-quiz";

export const usePersonalityQuizQuestions = () => {
    return useQuery({
        queryKey: ["personality-quiz", "questions"],
        queryFn: () => personalityQuizApi.getQuestions(),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: false,
    });
};

export const useSubmitPersonalityQuiz = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: SubmitPersonalityQuizRequest) =>
            personalityQuizApi.submitQuiz(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["personality-quiz"] });
            queryClient.invalidateQueries({ queryKey: ["dinner-preferences"] });
        },
        retry: false,
    });
};

