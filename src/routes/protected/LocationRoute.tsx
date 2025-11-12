import { useNavigate } from "react-router-dom";
import { LocationPage } from "../../pages/events/LocationPage";
import { useProtectedLayout } from "../../hooks/logic";

export const LocationRoute = () => {
  const navigate = useNavigate();
  const { selectedCity, selectCity, cancelBookingFlow } = useProtectedLayout();

  return (
    <LocationPage
      onBack={() => navigate("/events")}
      onClose={() => {
        cancelBookingFlow();
        navigate("/events");
      }}
      onSelectCity={selectCity}
      onNavigateToAreaSelection={(city) => {
        selectCity(city);
        navigate("/area-selection");
      }}
      selectedCityId={selectedCity?.id}
    />
  );
};

