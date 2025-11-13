import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QuizPage } from "../../pages/QuizPage";
import { useProtectedLayout } from "../../hooks/logic";

export const QuizRoute = () => {
  const navigate = useNavigate();
  const { isBookingFlow } = useProtectedLayout();

  useEffect(() => {
    if (!isBookingFlow) {
      navigate("/events");
    }
  }, [isBookingFlow, navigate]);

  if (!isBookingFlow) {
    return null;
  }

  return (
    <QuizPage
      onBack={() => navigate("/area-selection")}
      onClose={() => navigate("/events")}
      onComplete={() => navigate("/personality-quiz")}
    />
  );
};

