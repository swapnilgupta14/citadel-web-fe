import { useNavigate } from "react-router-dom";
import { AreaSelectionPage } from "../../pages/events/AreaSelectionPage";
import { useProtectedLayout } from "../../hooks/logic";
import { useQuizResults } from "../../hooks/queries/useQuiz";

export const AreaSelectionRoute = () => {
  const navigate = useNavigate();
  const {
    selectedCity,
    tempCity,
    savedPreferences,
    confirmCitySelection,
    cancelCitySelection,
    isCitySelectionLoading,
    isBookingFlow,
  } = useProtectedLayout();
  const { refetch: refetchQuizResults } = useQuizResults();

  const handleComplete = async (selectedAreas: string[]) => {
    if (!tempCity) return;

    try {
      await confirmCitySelection(selectedAreas, isBookingFlow);

      if (isBookingFlow) {
        const { data: updatedQuizResults } = await refetchQuizResults();
        const hasCompletedQuiz = updatedQuizResults?.data?.hasCompletedQuiz ?? false;
        if (!hasCompletedQuiz) {
          navigate("/quiz");
        } else {
          navigate("/personality-quiz");
        }
      } else {
        navigate("/events");
      }
    } catch (error) {
      console.error("Failed to save city selection:", error);
    }
  };

  return (
    <AreaSelectionPage
      cityId={tempCity?.id || selectedCity?.id || ""}
      cityName={tempCity?.name || selectedCity?.name || ""}
      onBack={() => navigate("/location")}
      onClose={() => {
        cancelCitySelection();
        navigate("/events");
      }}
      onContinue={handleComplete}
      isLoading={isCitySelectionLoading}
      savedAreas={savedPreferences?.preferredAreas}
    />
  );
};
