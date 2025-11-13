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

export interface Quiz {
  id: string;
  title: string;
  questions: Array<{
    question: string;
    type: "yes-no" | "multiple-choice" | "scale";
    options: string[];
  }>;
  totalQuestions: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuizApiResponse {
  success: boolean;
  message: string;
  data: {
    quizzes: Quiz[];
    totalQuizzes: number;
  };
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
    hasCompletedQuiz?: boolean;
  };
}

