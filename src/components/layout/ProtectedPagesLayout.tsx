import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BottomNavigation } from "../navigation/BottomNavigation";
import { ExplorePage } from "../../pages/ExplorePage";
import { EventsPage } from "../../pages/EventsPage";
import { ProfilePage } from "../../pages/ProfilePage";
import { LocationPage } from "../../pages/LocationPage";
import { AreaSelectionPage } from "../../pages/AreaSelectionPage";
import type { City } from "../../types/events";
import {
  navigationPersistence,
  type ProtectedPage,
} from "../../lib/storage/navigationPersistence";
import { getLandmarkImage } from "../../lib/helpers/eventUtils";
import { showToast } from "../../lib/helpers/toast";
import { useUpdateDinnerPreferences, useDinnerPreferences } from "../../hooks/queries";

const defaultCity: City = {
  id: "new-delhi",
  name: "New Delhi",
  landmarkImage: getLandmarkImage("new-delhi"),
  isAvailable: true,
};

export const ProtectedPagesLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { data: preferencesData } = useDinnerPreferences();
  const updatePreferencesMutation = useUpdateDinnerPreferences();

  const getInitialCity = (): City => {
    const persistedCity = navigationPersistence.getSelectedCity();
    if (persistedCity) {
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

  const [tempCity, setTempCity] = useState<City | undefined>();

  const getCurrentPageFromPath = (path: string): ProtectedPage => {
    if (path === "/events" || path === "/location" || path === "/area-selection") return "events";
    if (path === "/profile") return "profile";
    if (path === "/explore") return "explore";
    return "events";
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

    if (location.pathname !== "/location" && location.pathname !== "/area-selection") {
      navigationPersistence.saveCurrentPage(currentPage);
    }
  }, [location.pathname, currentPage]);

  useEffect(() => {
    if (preferencesData?.success && preferencesData.data.preferences) {
      const { city, preferredAreas } = preferencesData.data.preferences;
      
      console.log("Fetched dinner preferences:", { city, preferredAreas });

      if (city) {
        const cityId = city.toLowerCase().replace(/\s+/g, "-");
        const cityData: City = {
          id: cityId,
          name: city,
          landmarkImage: getLandmarkImage(cityId),
          isAvailable: true,
        };

        navigationPersistence.saveSelectedCity(cityData);
        setSelectedCity(cityData);
        selectedCityRef.current = cityData;
      }
    }
  }, [preferencesData]);

  const handleNavigate = (page: ProtectedPage) => {
    const path = `/${page === "events" ? "events" : page === "profile" ? "profile" : "explore"}`;
    navigate(path);
  };

  const handleNavigateToAreaSelection = (city: City) => {
    setTempCity(city);
    navigate("/area-selection");
  };

  const handleSelectCity = (city: City) => {
    setTempCity(city);
  };

  const handleAreaSelectionComplete = async (selectedAreas: string[]) => {
    if (!tempCity) return;

    try {
      await updatePreferencesMutation.mutateAsync({
        city: tempCity.name,
        preferredAreas: selectedAreas,
      });
    } catch (error) {
      console.log("Backend preferences API not available yet, storing locally");
    }

    selectedCityRef.current = tempCity;
    navigationPersistence.saveSelectedCity({
      id: tempCity.id,
      name: tempCity.name,
      landmarkImage: tempCity.landmarkImage,
      isAvailable: tempCity.isAvailable,
      comingSoon: tempCity.comingSoon,
    });

    setSelectedCity(tempCity);
    setTempCity(undefined);

    showToast.success("Location updated successfully!");
    navigate("/events");
  };

  const handleAreaSelectionBack = () => {
    navigate("/location");
  };

  const handleAreaSelectionClose = () => {
    setTempCity(undefined);
    navigate("/events");
  };

  const handleLocationBack = () => {
    navigate("/events");
  };

  const handleLocationClose = () => {
    navigate("/events");
  };

  const renderPage = () => {
    if (location.pathname === "/location") {
      return (
        <LocationPage
          key="location"
          onBack={handleLocationBack}
          onClose={handleLocationClose}
          onSelectCity={handleSelectCity}
          onNavigateToAreaSelection={handleNavigateToAreaSelection}
          selectedCityId={selectedCity?.id}
        />
      );
    }

    if (location.pathname === "/area-selection") {
      return (
        <AreaSelectionPage
          key="area-selection"
          cityId={tempCity?.id || ""}
          cityName={tempCity?.name || ""}
          onBack={handleAreaSelectionBack}
          onClose={handleAreaSelectionClose}
          onContinue={handleAreaSelectionComplete}
          isLoading={updatePreferencesMutation.isPending}
        />
      );
    }

    if (location.pathname === "/explore") {
      return <ExplorePage key="explore" />;
    }

    if (location.pathname === "/profile") {
      return <ProfilePage key="profile" />;
    }

    return (
      <EventsPage
        key="events"
        onOpenLocation={() => navigate("/location")}
        selectedCity={selectedCity}
      />
    );
  };

  const showBottomNav = location.pathname !== "/location" && location.pathname !== "/area-selection";

  return (
    <div className="flex h-full flex-col bg-background relative">
      <div className="flex-1 overflow-hidden relative">
        <div className={`h-full ${showBottomNav ? 'pb-[92px]' : ''}`}>
          {renderPage()}
        </div>
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
