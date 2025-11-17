import { useNavigate } from "react-router-dom";
import { EventsPage } from "../../pages/events/EventsPage";
import { useProtectedLayout } from "../../hooks/logic";

export const EventsRoute = () => {
  const navigate = useNavigate();
  const {
    selectedCity,
    startBookingFlow,
    resetBookingFlow,
  } = useProtectedLayout();

  return (
    <EventsPage
      onOpenLocation={() => {
        resetBookingFlow();
        navigate("/location");
      }}
      onStartBookingFlow={startBookingFlow}
      selectedCity={selectedCity}
    />
  );
};
