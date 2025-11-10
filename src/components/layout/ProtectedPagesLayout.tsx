import { useState, useEffect, useRef } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { BottomNavigation } from "../navigation/BottomNavigation";
import { ExplorePage } from "../../pages/ExplorePage";
import { EventsPage } from "../../pages/EventsPage";
import { ProfilePage } from "../../pages/ProfilePage";
import { LocationPage } from "../../pages/LocationPage";
import type { City } from "../../types/events";
import {
  navigationPersistence,
  type ProtectedPage,
} from "../../lib/storage/navigationPersistence";
import { getLandmarkImage } from "../../lib/helpers/eventUtils";

const defaultCity: City = {
  id: "new-delhi",
  name: "New Delhi",
  landmarkImage: getLandmarkImage("new-delhi"),
  isAvailable: true,
};

export const ProtectedPagesLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getInitialCity = (): City => {
    const persistedCity = navigationPersistence.getSelectedCity();
    if (persistedCity) {
      // Normalize city name: if id is "new-delhi" but name is "Delhi", update to "New Delhi"
      const normalizedName =
        persistedCity.id === "new-delhi" && persistedCity.name === "Delhi"
          ? "New Delhi"
          : persistedCity.name;

      return {
        ...persistedCity,
        name: normalizedName,
        landmarkImage:
          persistedCity.landmarkImage || getLandmarkImage(persistedCity.id),
      };
    }
    return defaultCity;
  };

  const selectedCityRef = useRef<City | undefined>(getInitialCity());

  const [selectedCity, setSelectedCity] = useState<City | undefined>(
    selectedCityRef.current
  );

  const getCurrentPageFromPath = (path: string): ProtectedPage => {
    if (path === "/events") return "events";
    if (path === "/profile") return "profile";
    return "explore";
  };

  const currentPage = getCurrentPageFromPath(location.pathname);

  useEffect(() => {
    const persistedCity = navigationPersistence.getSelectedCity();
    if (!persistedCity) {
      navigationPersistence.saveSelectedCity(defaultCity);
      setSelectedCity(defaultCity);
    } else if (
      persistedCity.id === "new-delhi" &&
      persistedCity.name === "Delhi"
    ) {
      const updatedCity = {
        ...persistedCity,
        name: "New Delhi",
      };
      navigationPersistence.saveSelectedCity(updatedCity);
      setSelectedCity(updatedCity);
      selectedCityRef.current = updatedCity;
    }

    const persistedPage = navigationPersistence.getCurrentPage();
    const currentPath = location.pathname;
    const persistedPath = `/${persistedPage === "events" ? "events" : persistedPage === "profile" ? "profile" : "explore"}`;

    if (currentPath === "/" || currentPath === "/home") {
      navigate(persistedPath, { replace: true });
    } else if (location.pathname !== "/location") {
      navigationPersistence.saveCurrentPage(currentPage);
    }
  }, [navigate, location.pathname, currentPage]);

  const handleNavigate = (page: ProtectedPage) => {
    const path = `/${page === "events" ? "events" : page === "profile" ? "profile" : "explore"}`;
    navigate(path);
  };

  const handleSelectCity = (city: City) => {
    selectedCityRef.current = city;
    navigationPersistence.saveSelectedCity({
      id: city.id,
      name: city.name,
      landmarkImage: city.landmarkImage,
      isAvailable: city.isAvailable,
      comingSoon: city.comingSoon,
    });

    setSelectedCity(city);
    navigate(-1);
  };

  return (
    <div className="flex h-full flex-col bg-background relative">
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence>
          {location.pathname === "/location" ? (
            <LocationPage
              key="location"
              onBack={() => navigate(-1)}
              onSelectCity={handleSelectCity}
              selectedCityId={selectedCity?.id}
            />
          ) : (
            <div className="h-full pb-[92px]">
              <Routes location={location} key={location.pathname}>
                <Route
                  path="/events"
                  element={
                    <EventsPage
                      onOpenLocation={() => navigate("/location")}
                      selectedCity={selectedCity}
                    />
                  }
                />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route
                  path="/*"
                  element={
                    <EventsPage
                      onOpenLocation={() => navigate("/location")}
                      selectedCity={selectedCity}
                    />
                  }
                />
              </Routes>
            </div>
          )}
        </AnimatePresence>
      </div>
      {location.pathname !== "/location" && (
        <BottomNavigation
          activePage={currentPage}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
};
