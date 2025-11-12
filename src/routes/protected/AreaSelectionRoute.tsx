import { useNavigate } from "react-router-dom";
import { AreaSelectionPage } from "../../pages/events/AreaSelectionPage";
import { useProtectedLayout } from "../../hooks/logic";

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

  const handleComplete = async (selectedAreas: string[]) => {
    if (!tempCity) return;

    try {
      await confirmCitySelection(selectedAreas, isBookingFlow);

      if (isBookingFlow) {
        navigate("/personality-quiz");
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
