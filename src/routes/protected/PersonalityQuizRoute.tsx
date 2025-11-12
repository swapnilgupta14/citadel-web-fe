import { useNavigate } from "react-router-dom";
import { PersonalityQuizPage } from "../../pages/events/PersonalityQuizPage";
import { useProtectedLayout } from "../../hooks/logic";

export const PersonalityQuizRoute = () => {
  const navigate = useNavigate();
  const {
    selectedCity,
    selectCity,
    resetBookingFlow,
    completePersonalityQuiz,
    isBookingFlow,
  } = useProtectedLayout();

  return (
    <PersonalityQuizPage
      onBack={() => {
        if (selectedCity) {
          selectCity(selectedCity);
        }
        navigate("/area-selection");
      }}
      onClose={() => {
        resetBookingFlow();
        navigate("/events");
      }}
      onComplete={() => {
        resetBookingFlow();
        navigate("/events");
      }}
      onBookingComplete={completePersonalityQuiz}
      isBookingFlow={isBookingFlow}
    />
  );
};

