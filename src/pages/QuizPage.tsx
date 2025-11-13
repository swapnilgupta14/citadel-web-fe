import { useState, useEffect, useMemo, useCallback } from "react";
import { ArrowLeft, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui";
import { QuizSkeleton } from "../components/skeleton";
import { useQuizQuestions, useSubmitQuiz } from "../hooks/queries/useQuiz";
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
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const currentQuestion = questions[currentIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : null;

  useEffect(() => {
    if (!isLoading && questions.length > 0 && !hasLoadedOnce) {
      setHasLoadedOnce(true);
    }
  }, [isLoading, questions.length, hasLoadedOnce]);

  const handleAnswerChange = useCallback((value: string | number | string[]) => {
    if (!currentQuestion) return;

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        answer: value,
      },
    }));
  }, [currentQuestion]);

  useEffect(() => {
    if (currentQuestion?.type === "slider" && !currentAnswer) {
      const min = currentQuestion.min || 1;
      handleAnswerChange(min);
    }
  }, [currentQuestion?.id, currentQuestion?.type, currentAnswer, currentQuestion?.min, handleAnswerChange]);

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
      setShowSuccess(true);
    } catch {
      showToast.error("Failed to submit quiz. Please try again.");
    }
  };

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          if (onComplete) {
            onComplete();
          } else if (onClose) {
            onClose();
          }
        }, 300);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, onComplete, onClose]);

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
          <div>
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
            <div className="flex justify-center">
              <div className="bg-background-tertiary rounded-full w-10 h-10 flex items-center justify-center">
                <span className="text-primary text-sm leading-none font-bold">
                  {sliderValue}
                </span>
              </div>
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
                      className={`w-5 h-5 rounded-lg border-2 p-1 ${
                        isSelected ? "border-primary" : "border-white"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-full h-full rounded bg-primary" />
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
      {!showSuccess && (
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <button
            onClick={handleBack}
            className="p-2 -ml-2 active:opacity-70 transition-opacity"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6 text-text-primary" strokeWidth={2} />
          </button>
          <div className="flex flex-col items-center">
            <h1 className="text-base font-semibold text-text-primary">
              Quiz{" "}
              {questions.length > 0 && (
                <span>
                  ({Math.round((currentIndex / questions.length) * 100)}%)
                </span>
              )}
            </h1>
          </div>
          <button
            onClick={handleClose}
            className="p-2 -mr-2 active:opacity-70 transition-opacity"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-text-primary" strokeWidth={2} />
          </button>
        </div>
      )}

      {isLoading && !hasLoadedOnce ? (
        <QuizSkeleton />
      ) : showSuccess ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center"
          >
            <img src="/success.svg" alt="Success" className="w-20 h-20 mb-6" />
            <h2 className="text-2xl font-bold text-text-primary font-serif">
              Quiz submitted successfully
            </h2>
          </motion.div>
        </div>
      ) : questions.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="text-text-secondary">No questions found</div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col px-6 py-6 min-h-0 overflow-hidden">
          <div className="mb-4 flex-shrink-0">
            <h2 className="text-[24px] font-bold text-text-primary">
              {currentQuestion?.question}
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0 border-b-0">
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
