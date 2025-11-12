import { useEffect } from "react";
import { useLocation, Outlet, useNavigate } from "react-router-dom";
import { BottomNavigation } from "../navigation/BottomNavigation";
import {
  navigationPersistence,
  type ProtectedPage,
} from "../../lib/storage/navigationPersistence";
import {
  getCurrentPageFromPath,
  shouldShowBottomNav,
  shouldPersistPage,
} from "../../lib/helpers";
import { useBookingFlow, useCitySelection } from "../../hooks/logic";
import type { ProtectedLayoutContextType } from "../../types/layout";

export const ProtectedPagesLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const bookingFlow = useBookingFlow();
  const { isLoading: isCitySelectionLoading, ...citySelection } =
    useCitySelection();

  const currentPage = getCurrentPageFromPath(location.pathname);

  useEffect(() => {
    if (shouldPersistPage(location.pathname)) {
      navigationPersistence.saveCurrentPage(currentPage);
    }
  }, [location.pathname, currentPage]);

  const contextValue: ProtectedLayoutContextType = {
    ...citySelection,
    ...bookingFlow,
    isCitySelectionLoading,
  };

  const showBottomNav = shouldShowBottomNav(location.pathname);

  const handleNavigate = (page: ProtectedPage) => {
    const path = `/${page === "events" ? "events" : page === "profile" ? "profile" : "explore"}`;
    navigate(path);
  };

  return (
    <div className="flex h-full flex-col relative">
      <div className="flex-1 overflow-hidden relative">
        <Outlet context={contextValue} />
      </div>
      {showBottomNav && (
        <BottomNavigation
          activePage={currentPage}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
};
