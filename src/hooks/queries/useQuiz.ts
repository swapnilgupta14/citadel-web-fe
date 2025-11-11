import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { quizApi } from "../../services/api";
import type { SubmitQuizRequest } from "../../types/quiz";

export const useQuizQuestions = () => {
    return useQuery({
        queryKey: ["quiz", "questions"],
        queryFn: () => quizApi.getQuestions(),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: false,
    });
};

export const useSubmitQuiz = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: SubmitQuizRequest) => quizApi.submitQuiz(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["quiz"] });
        },
        retry: false,
    });
};

export const useQuizResults = () => {
    return useQuery({
        queryKey: ["quiz", "results"],
        queryFn: () => quizApi.getResults(),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: false,
    });
};

