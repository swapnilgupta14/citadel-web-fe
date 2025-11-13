import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { quizApi } from "../../services/api";
import type { SubmitQuizRequest, QuizQuestion } from "../../types/quiz";

const mapQuestionType = (type: string): QuizQuestion["type"] => {
    switch (type) {
        case "yes-no":
            return "yes_no";
        case "multiple-choice":
            return "multiple_choice";
        case "scale":
            return "slider";
        default:
            return "multiple_choice";
    }
};

export const useQuizQuestions = () => {
    return useQuery({
        queryKey: ["quiz", "questions"],
        queryFn: async () => {
            const response = await quizApi.getQuestions();
            const firstQuiz = response.data.quizzes[0];

            if (!firstQuiz) {
                return {
                    success: true,
                    data: {
                        questions: [],
                    },
                };
            }

            const transformedQuestions: QuizQuestion[] = firstQuiz.questions.map(
                (q, index) => ({
                    id: `${firstQuiz.id}-${index}`,
                    question: q.question,
                    type: mapQuestionType(q.type),
                    options: q.options,
                    min: q.type === "scale" ? 1 : undefined,
                    max: q.type === "scale" ? 10 : undefined,
                })
            );

            return {
                success: response.success,
                data: {
                    questions: transformedQuestions,
                },
            };
        },
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

