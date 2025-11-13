import { useNavigate } from "react-router-dom";
import { QuizPage } from "../../pages/QuizPage";

export const QuizRoute = () => {
  const navigate = useNavigate();

  return (
    <QuizPage
      onBack={() => navigate("/area-selection")}
      onClose={() => navigate("/events")}
      onComplete={() => navigate("/personality-quiz")}
    />
  );
};

