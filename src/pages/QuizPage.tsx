import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui";
import {
  useQuizQuestions,
  useSubmitQuiz,
} from "../hooks/queries/useQuiz";
import type { QuizAnswer } from "../types/quiz";
import { showToast } from "../lib/helpers/toast";

interface QuizPageProps {
  onBack?: () => void;
  onClose?: () => void;
  onComplete?: () => void;
}

export const QuizPage = ({ onBack, onClose, onComplete }: QuizPageProps) => {
  const { data: questionsData, isLoading } = useQuizQuestions();
  const submitQuizMutation = useSubmitQuiz();

  const questions = questionsData?.data?.questions || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, QuizAnswer>>({});
  const [isExiting, setIsExiting] = useState(false);

  const currentQuestion = questions[currentIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : null;

  useEffect(() => {
    if (currentQuestion?.type === "slider" && !currentAnswer) {
      const min = currentQuestion.min || 1;
      handleAnswerChange(min);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion?.id, currentQuestion?.type]);

  const handleAnswerChange = (value: string | number | string[]) => {
    if (!currentQuestion) return;

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        answer: value,
      },
    }));
  };

  const handleYesNoAnswer = (value: "Yes" | "No") => {
    handleAnswerChange(value);
  };

  const handleMultipleChoiceAnswer = (value: string) => {
    handleAnswerChange(value);
  };

  const handleSliderChange = (value: number) => {
    handleAnswerChange(value);
  };

  const handleMultiSelectToggle = (value: string) => {
    if (!currentQuestion) return;
    const currentValues = (currentAnswer?.answer as string[]) || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    handleAnswerChange(newValues);
  };

  const handleSingleSelectAnswer = (value: string) => {
    handleAnswerChange(value);
  };

  const canContinue = useMemo(() => {
    if (!currentQuestion) return false;
    if (!currentAnswer) return false;

    if (currentQuestion.type === "multi_select") {
      const values = currentAnswer.answer as string[];
      return values.length > 0;
    }

    return true;
  }, [currentQuestion, currentAnswer]);

  const handleContinue = async () => {
    if (!canContinue) return;

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      await handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else if (onBack) {
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

  const handleSubmit = async () => {
    try {
      const answersArray = Object.values(answers);
      await submitQuizMutation.mutateAsync({ answers: answersArray });
      showToast.success("Quiz completed successfully!");
      if (onComplete) {
        onComplete();
      }
    } catch {
      showToast.error("Failed to submit quiz. Please try again.");
    }
  };

  const renderQuestion = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.type) {
      case "yes_no":
        return (
          <div className="flex flex-col gap-4">
            {["Yes", "No"].map((option) => {
              const isSelected = currentAnswer?.answer === option;
              return (
                <button
                  key={option}
                  onClick={() => handleYesNoAnswer(option as "Yes" | "No")}
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
                  </div>
                </button>
              );
            })}
          </div>
        );

      case "multiple_choice":
        return (
          <div className="flex flex-col gap-4">
            {currentQuestion.options?.map((option) => {
              const isSelected = currentAnswer?.answer === option;
              return (
                <button
                  key={option}
                  onClick={() => handleMultipleChoiceAnswer(option)}
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
                  </div>
                </button>
              );
            })}
          </div>
        );

      case "slider": {
        const min = currentQuestion.min || 1;
        const max = currentQuestion.max || 10;
        const sliderValue =
          typeof currentAnswer?.answer === "number"
            ? currentAnswer.answer
            : min;

        return (
          <div className="px-2">
            <div className="mb-6">
              <input
                type="range"
                min={min}
                max={max}
                value={sliderValue}
                onChange={(e) => handleSliderChange(Number(e.target.value))}
                className="w-full h-2 bg-background-tertiary rounded-lg appearance-none cursor-pointer accent-primary"
                style={{
                  background: `linear-gradient(to right, #1BEA7B 0%, #1BEA7B ${
                    ((sliderValue - min) / (max - min)) * 100
                  }%, #2C2C2C ${((sliderValue - min) / (max - min)) * 100}%, #2C2C2C 100%)`,
                }}
              />
            </div>
            <div className="flex justify-between text-sm text-text-secondary">
              <span>{min}</span>
              <span className="text-primary font-semibold text-lg">
                {sliderValue}
              </span>
              <span>{max}</span>
            </div>
          </div>
        );
      }

      case "multi_select": {
        const selectedValues = (currentAnswer?.answer as string[]) || [];
        return (
          <div className="flex flex-col gap-3">
            {currentQuestion.options?.map((option) => {
              const isSelected = selectedValues.includes(option);
              return (
                <button
                  key={option}
                  onClick={() => handleMultiSelectToggle(option)}
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
                    <div
                      className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center ${
                        isSelected
                          ? "border-primary bg-primary"
                          : "border-white/30"
                      }`}
                    >
                      {isSelected && (
                        <svg
                          className="w-3 h-3 text-background"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        );
      }

      case "single_select": {
        return (
          <div className="flex flex-col gap-4">
            {currentQuestion.options?.map((option) => {
              const isSelected = currentAnswer?.answer === option;
              return (
                <button
                  key={option}
                  onClick={() => handleSingleSelectAnswer(option)}
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
                  </div>
                </button>
              );
            })}
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="flex h-full flex-col bg-background"
    >
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <button
          onClick={handleBack}
          className="p-2 -ml-2 active:opacity-70 transition-opacity"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6 text-text-primary" strokeWidth={2} />
        </button>
        <h1 className="text-base font-semibold text-text-primary">Quiz</h1>
        <button
          onClick={handleClose}
          className="p-2 -mr-2 active:opacity-70 transition-opacity"
          aria-label="Close"
        >
          <X className="w-6 h-6 text-text-primary" strokeWidth={2} />
        </button>
      </div>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="text-text-secondary">Loading quiz questions...</div>
        </div>
      ) : questions.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="text-text-secondary">No questions found</div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col px-4 py-6 min-h-0 overflow-hidden">
          <div className="mb-8 flex-shrink-0">
            <h2 className="text-2xl sm-phone:text-3xl font-bold text-text-primary font-serif mb-6">
              {currentQuestion?.question}
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderQuestion()}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex-shrink-0">
            <Button
              onClick={handleContinue}
              disabled={!canContinue}
              isLoading={submitQuizMutation.isPending}
              variant="primary"
            >
              {currentIndex < questions.length - 1 ? "Continue" : "Submit"}
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
};
