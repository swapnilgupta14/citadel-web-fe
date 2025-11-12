import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BottomNavigation } from "../navigation/BottomNavigation";
import { ExplorePage } from "../../pages/ExplorePage";
import { EventsPage } from "../../pages/EventsPage";
import { ProfilePage } from "../../pages/ProfilePage";
import { LocationPage } from "../../pages/LocationPage";
import { AreaSelectionPage } from "../../pages/AreaSelectionPage";
import { QuizPage } from "../../pages/QuizPage";
import { PersonalityQuizPage } from "../../pages/PersonalityQuizPage";
import { EventDetailPage } from "../../pages/EventDetailPage";
import { ProgressLoader } from "../skeleton";
import type { City } from "../../types/events";
import {
  navigationPersistence,
  type ProtectedPage,
} from "../../lib/storage/navigationPersistence";
import { getLandmarkImage } from "../../lib/helpers/eventUtils";
import {
  useUpdateDinnerPreferences,
  useDinnerPreferences,
  useSaveInitialPreferences,
} from "../../hooks/queries";

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
  const saveInitialPreferencesMutation = useSaveInitialPreferences();
  const updatePreferencesMutation = useUpdateDinnerPreferences();

  const hasCompletedSetup = preferencesData?.data?.hasCompletedSetup ?? false;
  const savedPreferences = preferencesData?.data?.preferences;

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
  const hasLocationOpenedRef = useRef<boolean>(false);

  const [selectedCity, setSelectedCity] = useState<City | undefined>(
    selectedCityRef.current
  );

  const [tempCity, setTempCity] = useState<City | undefined>();
  const [isBookingFlow, setIsBookingFlow] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [_pendingEventId, _setPendingEventId] = useState<string | null>(null);

  const getCurrentPageFromPath = (path: string): ProtectedPage => {
    if (
      path === "/events" ||
      path === "/location" ||
      path === "/area-selection" ||
      path === "/quiz" ||
      path === "/personality-quiz" ||
      path.startsWith("/events/")
    )
      return "events";
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

    if (
      location.pathname !== "/location" &&
      location.pathname !== "/area-selection" &&
      location.pathname !== "/personality-quiz" &&
      location.pathname !== "/finding-matches" &&
      !location.pathname.startsWith("/events/")
    ) {
      navigationPersistence.saveCurrentPage(currentPage);
    }
  }, [location.pathname, currentPage]);

  useEffect(() => {
    if (preferencesData?.success && preferencesData.data.preferences) {
      const { city } = preferencesData.data.preferences;

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

  useEffect(() => {
    if (
      preferencesData &&
      !hasCompletedSetup &&
      !hasLocationOpenedRef.current &&
      location.pathname === "/events"
    ) {
      hasLocationOpenedRef.current = true;
      navigate("/location");
    }
  }, [preferencesData, hasCompletedSetup, location.pathname, navigate]);

  const handleNavigate = (page: ProtectedPage) => {
    const path = `/${page === "events" ? "events" : page === "profile" ? "profile" : "explore"}`;
    navigate(path);
  };

  const handleNavigateToAreaSelection = (city: City) => {
    setTempCity(city);
    navigate("/area-selection");
  };

  useEffect(() => {
    if (
      savedPreferences?.city &&
      !tempCity &&
      location.pathname === "/area-selection"
    ) {
      const cityId = savedPreferences.city.toLowerCase().replace(/\s+/g, "-");
      const cityData: City = {
        id: cityId,
        name: savedPreferences.city,
        landmarkImage: getLandmarkImage(cityId),
        isAvailable: true,
      };
      setTempCity(cityData);
    }
  }, [savedPreferences, location.pathname, tempCity]);

  const handleSelectCity = (city: City) => {
    setTempCity(city);
  };

  const handleAreaSelectionComplete = async (selectedAreas: string[]) => {
    if (!tempCity) return;

    try {
      if (!hasCompletedSetup) {
        const initialPayload = {
          city: tempCity.name,
          preferredAreas: selectedAreas,
          budget: "medium",
          language: [],
          dietaryRestriction: "any",
        };
        await saveInitialPreferencesMutation.mutateAsync(initialPayload);
      } else {
        await updatePreferencesMutation.mutateAsync({
          city: tempCity.name,
          preferredAreas: selectedAreas,
        });
      }
    } catch (error) {
      console.error("Backend preferences API error:", error);
      return;
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

    if (isBookingFlow) {
      navigate("/personality-quiz");
    } else {
      navigate("/events");
    }
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
    setIsBookingFlow(false);
    setSelectedSlotId(null);
    navigate("/events");
  };

  const handleStartBookingFlow = (slotId: string) => {
    setSelectedSlotId(slotId);
    setIsBookingFlow(true);
    navigate("/location");
  };

  const handlePersonalityQuizComplete = async () => {
    if (!isBookingFlow || !selectedSlotId) {
      setIsBookingFlow(false);
      setSelectedSlotId(null);
      navigate("/events");
      return;
    }

    _setPendingEventId(selectedSlotId);
    navigate("/finding-matches");
  };

  const handleProgressLoaderComplete = () => {
    const targetEventId = _pendingEventId || selectedSlotId;
    
    if (targetEventId) {
      navigate(`/events/${targetEventId}`);
      _setPendingEventId(null);
    } else {
      navigate("/events");
    }
    
    setTimeout(() => {
      setIsBookingFlow(false);
      setSelectedSlotId(null);
    }, 100);
  };

  useEffect(() => {
    if (location.pathname === "/finding-matches" && !isBookingFlow) {
      navigate("/events");
    }
  }, [location.pathname, isBookingFlow, navigate]);

  const renderPage = () => {
    if (location.pathname === "/finding-matches") {
      if (!isBookingFlow) {
        return null;
      }
      return (
        <ProgressLoader
          continuous={false}
          duration={3000}
          onComplete={handleProgressLoaderComplete}
        />
      );
    }

    if (
      location.pathname.startsWith("/events/") &&
      location.pathname !== "/events"
    ) {
      return <EventDetailPage key="event-detail" />;
    }

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
          cityId={tempCity?.id || selectedCity?.id || ""}
          cityName={tempCity?.name || selectedCity?.name || ""}
          onBack={handleAreaSelectionBack}
          onClose={handleAreaSelectionClose}
          onContinue={handleAreaSelectionComplete}
          isLoading={
            saveInitialPreferencesMutation.isPending ||
            updatePreferencesMutation.isPending
          }
          savedAreas={savedPreferences?.preferredAreas}
        />
      );
    }

    if (location.pathname === "/explore") {
      return <ExplorePage key="explore" />;
    }

    if (location.pathname === "/profile") {
      return <ProfilePage key="profile" />;
    }

    if (location.pathname === "/quiz") {
      return (
        <QuizPage
          key="quiz"
          onBack={() => navigate("/events")}
          onClose={() => navigate("/events")}
          onComplete={() => navigate("/events")}
        />
      );
    }

    if (location.pathname === "/personality-quiz") {
      return (
        <PersonalityQuizPage
          key="personality-quiz"
          onBack={() => {
            if (selectedCity) {
              setTempCity(selectedCity);
            }
            navigate("/area-selection");
          }}
          onClose={() => {
            setIsBookingFlow(false);
            setSelectedSlotId(null);
            navigate("/events");
          }}
          onComplete={() => {
            setIsBookingFlow(false);
            setSelectedSlotId(null);
            navigate("/events");
          }}
          onBookingComplete={handlePersonalityQuizComplete}
          isBookingFlow={isBookingFlow}
        />
      );
    }

    return (
      <EventsPage
        key="events"
        onOpenLocation={() => {
          setIsBookingFlow(false);
          navigate("/location");
        }}
        onStartBookingFlow={handleStartBookingFlow}
        selectedCity={selectedCity}
        hasCompletedSetup={hasCompletedSetup}
      />
    );
  };

  const showBottomNav =
    location.pathname !== "/location" &&
    location.pathname !== "/area-selection" &&
    location.pathname !== "/quiz" &&
    location.pathname !== "/personality-quiz" &&
    location.pathname !== "/finding-matches" &&
    !location.pathname.startsWith("/events/");

  return (
    <div className="flex h-full flex-col bg-background relative">
      <div className="flex-1 overflow-hidden relative">
        <div className={`h-full ${showBottomNav ? "pb-[92px]" : ""}`}>
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
