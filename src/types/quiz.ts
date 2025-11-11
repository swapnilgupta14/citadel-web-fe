export type QuestionType = "yes_no" | "multiple_choice" | "slider" | "multi_select" | "single_select";

export interface QuizQuestion {
  id: string;
  question: string;
  type: QuestionType;
  options?: string[];
  min?: number;
  max?: number;
  required?: boolean;
}

export interface QuizQuestionsResponse {
  success: boolean;
  data: {
    questions: QuizQuestion[];
  };
}

export interface QuizAnswer {
  questionId: string;
  answer: string | number | string[];
}

export interface SubmitQuizRequest {
  answers: QuizAnswer[];
}

export interface SubmitQuizResponse {
  success: boolean;
  message: string;
}

export interface QuizResultsResponse {
  success: boolean;
  data: {
    results: unknown;
  };
}

