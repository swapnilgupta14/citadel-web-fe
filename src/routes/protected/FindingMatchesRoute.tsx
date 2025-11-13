import { Navigate } from "react-router-dom";
import { ProgressLoader } from "../../components/skeleton";
import { useProtectedLayout } from "../../hooks/logic";

export const FindingMatchesRoute = () => {
  const { isBookingFlow, completeProgressLoader } = useProtectedLayout();

  if (!isBookingFlow) {
    return <Navigate to="/events" replace />;
  }

  return (
    <ProgressLoader
      continuous={false}
      duration={2000}
      onComplete={completeProgressLoader}
    />
  );
};
