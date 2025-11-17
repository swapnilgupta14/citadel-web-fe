import type { City } from "../types/events";
import { getLandmarkImage } from "../lib/helpers/eventUtils";

export const CITIES: City[] = [
  {
    id: "new-delhi",
    name: "New Delhi",
    landmarkImage: getLandmarkImage("new-delhi"),
    isAvailable: true,
  },
  {
    id: "bangalore",
    name: "Bangalore",
    landmarkImage: getLandmarkImage("bangalore"),
    isAvailable: false,
    comingSoon: true,
  },
  {
    id: "mumbai",
    name: "Mumbai",
    landmarkImage: getLandmarkImage("mumbai"),
    isAvailable: false,
    comingSoon: true,
  },
];

export const AREAS_BY_CITY: Record<string, string[]> = {
  "new-delhi": ["Connaught Place", "Gurgaon"],
  "New Delhi": ["Connaught Place", "Gurgaon"],
  // "new-delhi": ["CP", "Gurgaon", "South Delhi", "Hauz Khas", "Saket", "Vasant Kunj"],
  // "New Delhi": ["CP", "Gurgaon", "South Delhi", "Hauz Khas", "Saket", "Vasant Kunj"],
  "bangalore": ["Indiranagar", "Koramangala", "Whitefield", "HSR Layout", "MG Road"],
  "Bangalore": ["Indiranagar", "Koramangala", "Whitefield", "HSR Layout", "MG Road"],
  "mumbai": ["Bandra", "Andheri", "Powai", "Lower Parel", "Colaba"],
  "Mumbai": ["Bandra", "Andheri", "Powai", "Lower Parel", "Colaba"],
};

export const AREA_API_MAPPING: Record<string, string> = {
  CP: "Connaught Place",
};

export const getApiAreaName = (area: string): string => {
  return AREA_API_MAPPING[area] || area;
};

