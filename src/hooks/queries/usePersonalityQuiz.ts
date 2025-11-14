import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { personalityQuizApi } from "../../services/api";
import type { SubmitPersonalityQuizRequest, PersonalityQuizResponse, PersonalityQuizQuestion } from "../../types/personality-quiz";

const FALLBACK_QUESTIONS: PersonalityQuizQuestion[] = [
    {
        category: "language",
        question: "What languages are you willing to speak at dinner?",
        questionId: "language-preference",
        options: ["English", "Hindi"],
    },
    {
        category: "meal",
        question: "Select your meal preference",
        questionId: "meal-preference",
        options: ["Everything", "Vegetarian", "Vegan"],
    },
];

const FALLBACK_RESPONSE: PersonalityQuizResponse = {
    success: true,
    data: {
        questions: FALLBACK_QUESTIONS,
        totalQuestions: FALLBACK_QUESTIONS.length,
    },
};

export const usePersonalityQuizQuestions = () => {
    return useQuery({
        queryKey: ["personality-quiz", "questions"],
        queryFn: async () => {
            return FALLBACK_RESPONSE;
        },
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

