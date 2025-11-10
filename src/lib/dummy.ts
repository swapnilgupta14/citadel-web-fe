import type { EventSlot, AvailableSlotsResponse } from "../types/events";

/**
 * Generate dummy event slots for testing
 * Based on the API structure from services.md
 * Generates exactly 10 events
 */
export const getDummyEventSlots = (city: string): AvailableSlotsResponse => {
  const today = new Date();
  const slots: EventSlot[] = [];
  const times = ["18:00", "19:00", "20:00"];

  // Generate exactly 10 events distributed across different dates
  for (let i = 0; i < 10; i++) {
    // Distribute events across next 5 days (2 events per day)
    const dayOffset = Math.floor(i / 2);
    const slotDate = new Date(today);
    slotDate.setDate(today.getDate() + dayOffset);
    const dateString = slotDate.toISOString().split("T")[0]; // YYYY-MM-DD format

    // Alternate between the 3 time slots
    const timeIndex = i % 3;
    const time = times[timeIndex];
    const slotId = `slot_${city.toLowerCase().replace(/\s+/g, "-")}_${dateString}_${time.replace(":", "")}_${i}`;

    // Vary availability: some slots almost full, some with good availability
    const totalSpots = 6;
    let spotsAvailable: number;
    if (i === 0) {
      spotsAvailable = 1; // First slot almost full
    } else if (i === 1) {
      spotsAvailable = 2; // Second slot half full
    } else {
      spotsAvailable = Math.floor(Math.random() * 4) + 2; // 2-5 spots available
    }

    // Vary cost based on time (later = more expensive) and day (weekend = more expensive)
    const isWeekend = slotDate.getDay() === 0 || slotDate.getDay() === 6;
    const timeMultiplier = time === "20:00" ? 1.2 : time === "19:00" ? 1.1 : 1.0;
    const dayMultiplier = isWeekend ? 1.15 : 1.0;
    const baseCost = 1000;
    const estimatedCost = Math.round(
      baseCost * timeMultiplier * dayMultiplier
    );

    slots.push({
      id: slotId,
      date: dateString,
      time: time,
      spotsAvailable,
      totalSpots,
      estimatedCost,
    });
  }

  return { slots };
};

/**
 * City-specific dummy data
 */
export const dummyEventData: Record<string, AvailableSlotsResponse> = {
  Delhi: getDummyEventSlots("Delhi"),
  Bangalore: getDummyEventSlots("Bangalore"),
  Mumbai: getDummyEventSlots("Mumbai"),
};

/**
 * Get dummy slots for a specific city
 */
export const getDummySlotsForCity = (
  city: string
): AvailableSlotsResponse => {
  // Normalize city name
  const normalizedCity =
    city.toLowerCase() === "new delhi" || city.toLowerCase() === "delhi"
      ? "Delhi"
      : city;

  return (
    dummyEventData[normalizedCity] || getDummyEventSlots(normalizedCity)
  );
};

