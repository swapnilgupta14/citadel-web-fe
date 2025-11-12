import type { City } from "../../types/events";
import { getLandmarkImage } from "./eventUtils";
import { navigationPersistence } from "../storage/navigationPersistence";

export const defaultCity: City = {
  id: "new-delhi",
  name: "New Delhi",
  landmarkImage: getLandmarkImage("new-delhi"),
  isAvailable: true,
};

export const normalizeCityName = (cityId: string, cityName: string): string => {
  if (cityId === "new-delhi" && cityName === "Delhi") {
    return "New Delhi";
  }
  return cityName;
};

export const createCityFromName = (cityName: string): City => {
  const cityId = cityName.toLowerCase().replace(/\s+/g, "-");
  return {
    id: cityId,
    name: cityName,
    landmarkImage: getLandmarkImage(cityId),
    isAvailable: true,
  };
};

export const getInitialCity = (): City => {
  const persistedCity = navigationPersistence.getSelectedCity();
  
  if (persistedCity) {
    const normalizedName = normalizeCityName(persistedCity.id, persistedCity.name);

    return {
      ...persistedCity,
      name: normalizedName,
      landmarkImage:
        persistedCity.landmarkImage || getLandmarkImage(persistedCity.id),
    };
  }
  
  return defaultCity;
};

export const saveCity = (city: City): void => {
  navigationPersistence.saveSelectedCity({
    id: city.id,
    name: city.name,
    landmarkImage: city.landmarkImage,
    isAvailable: city.isAvailable,
    comingSoon: city.comingSoon,
  });
};

