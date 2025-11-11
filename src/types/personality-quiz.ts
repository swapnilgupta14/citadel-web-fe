export interface PersonalityQuizQuestion {
    category: string;
    question: string;
    questionId: string;
    options: string[];
}

export interface PersonalityQuizResponse {
    success: boolean;
    data: {
        questions: PersonalityQuizQuestion[];
        totalQuestions: number;
    };
}

export interface PersonalityQuizAnswer {
    questionId: string;
    question: string;
    answer: string | string[];
}

export interface SubmitPersonalityQuizRequest {
    answers: PersonalityQuizAnswer[];
}

export interface SubmitPersonalityQuizResponse {
    success: boolean;
    message?: string;
}