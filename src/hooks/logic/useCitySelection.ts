import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import type { City } from "../../types/events";
import {
  getInitialCity,
  defaultCity,
  saveCity,
  normalizeCityName,
  createCityFromName,
} from "../../lib/helpers/cityHelpers";
import { navigationPersistence } from "../../lib/storage/navigationPersistence";
import {
  useUpdateDinnerPreferences,
  useDinnerPreferences,
  useSaveInitialPreferences,
} from "../queries";

export const useCitySelection = () => {
  const location = useLocation();

  const shouldFetchPreferences =
    location.pathname === "/events" ||
    location.pathname === "/location" ||
    location.pathname === "/area-selection" ||
    location.pathname.startsWith("/events/");

  const { data: preferencesData } = useDinnerPreferences(shouldFetchPreferences);
  const saveInitialPreferencesMutation = useSaveInitialPreferences();
  const updatePreferencesMutation = useUpdateDinnerPreferences();

  const hasCompletedSetup = preferencesData?.data?.hasCompletedSetup ?? false;
  const savedPreferences = preferencesData?.data?.preferences;

  const selectedCityRef = useRef<City | undefined>(getInitialCity());

  const [selectedCity, setSelectedCity] = useState<City | undefined>(
    selectedCityRef.current
  );
  const [tempCity, setTempCity] = useState<City | undefined>();

  useEffect(() => {
    const persistedCity = navigationPersistence.getSelectedCity();

    if (!persistedCity) {
      navigationPersistence.saveSelectedCity(defaultCity);
      setSelectedCity(defaultCity);
    } else if (persistedCity.id === "new-delhi" && persistedCity.name === "Delhi") {
      const updatedCity = {
        ...persistedCity,
        name: normalizeCityName(persistedCity.id, persistedCity.name),
      };
      navigationPersistence.saveSelectedCity(updatedCity);
      setSelectedCity(updatedCity);
      selectedCityRef.current = updatedCity;
    }
  }, []);

  useEffect(() => {
    if (preferencesData?.success && preferencesData.data.preferences) {
      const { city } = preferencesData.data.preferences;

      if (city) {
        const cityData = createCityFromName(city);
        navigationPersistence.saveSelectedCity(cityData);
        setSelectedCity(cityData);
        selectedCityRef.current = cityData;
      }
    }
  }, [preferencesData]);

  useEffect(() => {
    if (
      savedPreferences?.city &&
      !tempCity &&
      location.pathname === "/area-selection"
    ) {
      const cityData = createCityFromName(savedPreferences.city);
      setTempCity(cityData);
    }
  }, [savedPreferences, location.pathname, tempCity]);

  const selectCity = (city: City) => {
    setTempCity(city);
  };

  const confirmCitySelection = async (selectedAreas: string[], isBookingFlow: boolean): Promise<boolean> => {
    if (!tempCity) return false;

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
      throw error;
    }

    selectedCityRef.current = tempCity;
    saveCity(tempCity);
    setSelectedCity(tempCity);
    setTempCity(undefined);

    return isBookingFlow;
  };

  const cancelCitySelection = () => {
    setTempCity(undefined);
  };

  return {
    selectedCity,
    tempCity,
    hasCompletedSetup,
    savedPreferences,
    selectCity,
    confirmCitySelection,
    cancelCitySelection,
    isLoading:
      saveInitialPreferencesMutation.isPending ||
      updatePreferencesMutation.isPending,
  };
};

