import IndiaGate from "../../assets/unsplash_va77t8vGbJ8.png";
import MumbaiGateway from "../../assets/gateway of mumbai stylized image.png";
import BangaloreMonument from "../../assets/bangalore monument.png";

const cityImages: Record<string, string> = {
  "new-delhi": IndiaGate,
  "delhi": IndiaGate,
  "new delhi": IndiaGate,
  "mumbai": MumbaiGateway,
  "bangalore": BangaloreMonument,
};

export const getLandmarkImage = (cityIdOrName: string): string => {
  if (!cityIdOrName) return "";
  const normalized = cityIdOrName.toLowerCase().trim();
  return cityImages[normalized] || `/landmarks/${normalized}.jpg`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayName = days[date.getDay()];
  const month = months[date.getMonth()];
  const day = date.getDate();

  return `${dayName}, ${month} ${day}`;
};

export const formatTime = (timeString: string): string => {
  if (!timeString) return "";
  const [hours, minutes] = timeString.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

