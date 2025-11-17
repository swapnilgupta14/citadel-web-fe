import { useState, useMemo } from "react";
import { ArrowLeft, X } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../../components/ui";
import { PersonalityQuizSkeleton } from "../../components/skeleton";
import {
  usePersonalityQuizQuestions,
  useSubmitPersonalityQuiz,
} from "../../hooks/queries/usePersonalityQuiz";
import type { PersonalityQuizAnswer } from "../../types/personality-quiz";
import { showToast } from "../../lib/helpers/toast";

interface PersonalityQuizPageProps {
  onBack?: () => void;
  onClose?: () => void;
  onComplete?: () => void;
  onBookingComplete?: () => Promise<void>;
  isBookingFlow?: boolean;
}

const isMultiSelectQuestion = (question: {
  category: string;
  question: string;
}): boolean => {
  const lowerCategory = question.category?.toLowerCase() || "";
  const lowerQuestion = question.question?.toLowerCase() || "";

  if (
    lowerCategory.includes("language") ||
    lowerQuestion.includes("language")
  ) {
    return true;
  }

  return false;
};

export const PersonalityQuizPage = ({
  onBack,
  onClose,
  onComplete,
  onBookingComplete,
  isBookingFlow = false,
}: PersonalityQuizPageProps) => {
  const { data: questionsData, isLoading } = usePersonalityQuizQuestions();
  const submitQuizMutation = useSubmitPersonalityQuiz();

  const questions = useMemo(
    () => questionsData?.data?.questions || [],
    [questionsData?.data?.questions]
  );
  const [answers, setAnswers] = useState<Record<string, PersonalityQuizAnswer>>(
    {}
  );
  const [isExiting, setIsExiting] = useState(false);

  const handleMultiSelectToggle = (
    questionId: string,
    question: string,
    value: string
  ) => {
    setAnswers((prev) => {
      const currentAnswer = prev[questionId];
      const currentValues = (currentAnswer?.answer as string[]) || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];

      return {
        ...prev,
        [questionId]: {
          questionId,
          question,
          answer: newValues,
        },
      };
    });
  };

  const handleSingleSelectAnswer = (
    questionId: string,
    question: string,
    value: string
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        questionId,
        question,
        answer: value,
      },
    }));
  };

  const canContinue = useMemo(() => {
    if (questions.length === 0) return false;

    return questions.every((question) => {
      const answer = answers[question.questionId];
      if (!answer) return false;

      const isMultiSelect = isMultiSelectQuestion(question);
      if (isMultiSelect) {
        const values = answer.answer as string[];
        return values.length > 0;
      }

      return !!answer.answer;
    });
  }, [questions, answers]);

  const handleContinue = async () => {
    if (!canContinue) return;

    try {
      const answersArray = Object.values(answers).map((answer) => ({
        questionId: answer.questionId,
        question: answer.question,
        answer: Array.isArray(answer.answer)
          ? answer.answer.join(", ")
          : answer.answer,
      }));
      await submitQuizMutation.mutateAsync({ answers: answersArray });

      if (isBookingFlow && onBookingComplete) {
        await onBookingComplete();
      } else if (onComplete) {
        onComplete();
      }
    } catch {
      showToast.error("Failed to submit quiz. Please try again.");
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="flex h-full flex-col bg-background"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <button
          onClick={handleBack}
          className="p-2 -ml-2 active:opacity-70 transition-opacity"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6 text-text-primary" strokeWidth={2} />
        </button>
        <h1 className="text-base font-semibold text-text-primary">
          Your Dinner
        </h1>
        <button
          onClick={handleClose}
          className="p-2 -mr-2 active:opacity-70 transition-opacity"
          aria-label="Close"
        >
          <X className="w-6 h-6 text-text-primary" strokeWidth={2} />
        </button>
      </div>

      {isLoading ? (
        <PersonalityQuizSkeleton />
      ) : questions.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="text-text-secondary">No questions found</div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col px-4 py-6 min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto min-h-0 scrollbar-hide">
            <div className="flex flex-col gap-8 p-1">
              {questions.map((question) => {
                const isMultiSelect = isMultiSelectQuestion(question);
                const answer = answers[question.questionId];
                const selectedValues = isMultiSelect
                  ? (answer?.answer as string[]) || []
                  : [];

                return (
                  <div
                    key={question.questionId}
                    className="flex flex-col gap-4"
                  >
                    <h2 className="text-lg font-bold text-text-primary">
                      {question.question}*
                    </h2>

                    <div className="flex flex-col gap-3 px-1">
                      {question.options.map((option) => {
                        const isSelected = isMultiSelect
                          ? selectedValues.includes(option)
                          : answer?.answer === option;

                        return (
                          <button
                            key={option}
                            onClick={() => {
                              if (isMultiSelect) {
                                handleMultiSelectToggle(
                                  question.questionId,
                                  question.question,
                                  option
                                );
                              } else {
                                handleSingleSelectAnswer(
                                  question.questionId,
                                  question.question,
                                  option
                                );
                              }
                            }}
                            className={`w-full p-4 rounded-xl bg-background-secondary border-2 transition-all ${
                              isSelected
                                ? "border-primary bg-primary/10"
                                : "border-border active:scale-95"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-medium text-text-primary">
                                {option}
                              </span>
                              {isMultiSelect ? (
                                <div
                                  className={`w-5 h-5 rounded-md border-2 p-[2px] ${
                                    isSelected
                                      ? "border-primary"
                                      : "border-white"
                                  }`}
                                >
                                  {isSelected && (
                                    <div className="rounded-sm w-full h-full bg-primary" />
                                  )}
                                </div>
                              ) : (
                                <div
                                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                    isSelected
                                      ? "border-primary bg-primary"
                                      : "border-white/30"
                                  }`}
                                >
                                  {isSelected && (
                                    <div className="w-2 h-2 bg-background rounded-full"></div>
                                  )}
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 flex-shrink-0">
            <Button
              onClick={handleContinue}
              disabled={!canContinue}
              isLoading={submitQuizMutation.isPending}
              variant="primary"
            >
              Continue
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
};
