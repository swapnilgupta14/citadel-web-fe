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

