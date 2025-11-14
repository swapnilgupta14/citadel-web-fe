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
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  const currentQuestion = questions[currentIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : null;

  useEffect(() => {
    if (!isLoading && questions.length > 0 && !hasLoadedOnce) {
      setHasLoadedOnce(true);
    }
  }, [isLoading, questions.length, hasLoadedOnce]);

  const questionsLength = questions.length;

  const handleAnswerChange = useCallback(
    (value: string | number | string[], shouldAutoAdvance: boolean = false) => {
      if (!currentQuestion) return;

      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: {
          questionId: currentQuestion.id,
          answer: value,
        },
      }));

      if (shouldAutoAdvance && currentIndex < questionsLength - 1) {
        setTimeout(() => {
          setDirection("forward");
          setCurrentIndex((prev) => prev + 1);
        }, 300);
      }
    },
    [currentQuestion, currentIndex, questionsLength]
  );

  useEffect(() => {
    if (currentQuestion?.type === "slider" && !currentAnswer) {
      const min = currentQuestion.min || 1;
      handleAnswerChange(min);
    }
    if (currentQuestion?.type === "input" && !currentAnswer) {
      handleAnswerChange("");
    }
  }, [
    currentQuestion?.id,
    currentQuestion?.type,
    currentAnswer,
    currentQuestion?.min,
    handleAnswerChange,
  ]);

  const handleYesNoAnswer = (value: "Yes" | "No") => {
    handleAnswerChange(value, true);
  };

  const handleMultipleChoiceAnswer = (value: string) => {
    handleAnswerChange(value, true);
  };

  const handleSliderChange = (value: number) => {
    handleAnswerChange(value, false);
  };

  const handleSliderEnd = () => {
    if (currentIndex < questionsLength - 1 && currentAnswer) {
      setTimeout(() => {
        setDirection("forward");
        setCurrentIndex((prev) => prev + 1);
      }, 300);
    }
  };

  const handleMultiSelectToggle = (value: string) => {
    if (!currentQuestion) return;
    const currentValues = (currentAnswer?.answer as string[]) || [];
    const isSelecting = !currentValues.includes(value);
    const newValues = isSelecting
      ? [...currentValues, value]
      : currentValues.filter((v) => v !== value);
    const shouldAdvance =
      isSelecting && newValues.length > 0 && currentIndex < questionsLength - 1;
    handleAnswerChange(newValues, shouldAdvance);
  };

  const handleSingleSelectAnswer = (value: string) => {
    handleAnswerChange(value, true);
  };

  const handleInputChange = (value: string) => {
    handleAnswerChange(value, false);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === "Enter" &&
      canContinue &&
      currentIndex < questionsLength - 1
    ) {
      e.preventDefault();
      setTimeout(() => {
        setDirection("forward");
        setCurrentIndex((prev) => prev + 1);
      }, 100);
    }
  };

  const canContinue = useMemo(() => {
    if (!currentQuestion) return false;
    if (!currentAnswer) return false;

    if (currentQuestion.type === "multi_select") {
      const values = currentAnswer.answer as string[];
      return values.length > 0;
    }

    if (currentQuestion.type === "input") {
      const inputValue = currentAnswer.answer as string;
      return inputValue.trim().length > 0;
    }

    return true;
  }, [currentQuestion, currentAnswer]);

  const handleContinue = async () => {
    if (!canContinue) return;

    if (currentIndex < questions.length - 1) {
      setDirection("forward");
      setCurrentIndex((prev) => prev + 1);
    } else {
      await handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setDirection("backward");
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

    if (import.meta.env.DEV) {
      console.log("Current question:", currentQuestion);
      console.log("Current question type:", currentQuestion.type);
      console.log("Type check - is 'input'?", currentQuestion.type === "input");
    }

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

        const percentage = ((sliderValue - min) / (max - min)) * 100;

        return (
          <div>
            <div className="mb-6 relative">
              <input
                type="range"
                min={min}
                max={max}
                value={sliderValue}
                onChange={(e) => handleSliderChange(Number(e.target.value))}
                onMouseUp={handleSliderEnd}
                onTouchEnd={handleSliderEnd}
                className="w-full h-2 bg-background-tertiary rounded-lg appearance-none cursor-pointer slider-custom"
                style={{
                  background: `linear-gradient(to right, #1BEA7B 0%, #1BEA7B ${percentage}%, #2C2C2C ${percentage}%, #2C2C2C 100%)`,
                }}
              />
              <style>{`
                .slider-custom::-webkit-slider-thumb {
                  appearance: none;
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  background: radial-gradient(circle, #000000 0%, #000000 40%, #1BEA7B 40%, #1BEA7B 100%);
                  border: none;
                  cursor: pointer;
                }
                .slider-custom::-moz-range-thumb {
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  background: radial-gradient(circle, #000000 0%, #000000 40%, #1BEA7B 40%, #1BEA7B 100%);
                  border: none;
                  cursor: pointer;
                }
              `}</style>
            </div>
            <div className="flex justify-between items-center px-1">
              <span className="text-text-secondary text-base">No</span>
              <span className="text-text-secondary text-base">Yes</span>
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

      case "input": {
        const inputValue = (currentAnswer?.answer as string) || "";
        return (
          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="Enter your response"
              className="w-full p-4 rounded-xl bg-background-secondary border-2 border-border text-lg font-medium text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:border-primary focus:bg-primary/5 transition-all"
              autoFocus
            />
          </div>
        );
      }

      default:
        console.warn("Unknown question type:", currentQuestion.type);
        return (
          <div className="flex flex-col gap-4">
            <div className="text-text-secondary">
              Unknown question type: {currentQuestion.type}
            </div>
          </div>
        );
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
                initial={{
                  opacity: 0,
                  x: direction === "forward" ? 20 : -20,
                }}
                animate={{ opacity: 1, x: 0 }}
                exit={{
                  opacity: 0,
                  x: direction === "forward" ? -20 : 20,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {renderQuestion()}
              </motion.div>
            </AnimatePresence>
          </div>

          {currentIndex === questions.length - 1 && (
            <div className="mt-6 flex-shrink-0 px-6 keyboard-safe-bottom">
              <Button
                onClick={handleContinue}
                disabled={!canContinue}
                isLoading={submitQuizMutation.isPending}
                variant="primary"
              >
                Submit
              </Button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};
