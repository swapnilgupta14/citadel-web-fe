import type { City } from "./events";

export interface ProtectedLayoutContextType {
    selectedCity: City | undefined;
    tempCity: City | undefined;
    hasCompletedSetup: boolean;
    savedPreferences: {
        preferredAreas?: string[];
        city?: string;
    } | undefined;

    selectCity: (city: City) => void;
    confirmCitySelection: (selectedAreas: string[], isBookingFlow: boolean) => Promise<boolean>;
    cancelCitySelection: () => void;
    isCitySelectionLoading: boolean;

    isBookingFlow: boolean;
    selectedSlotId: string | null;

    startBookingFlow: (slotId: string) => void;
    cancelBookingFlow: () => void;
    completePersonalityQuiz: () => Promise<void>;
    completeProgressLoader: () => void;
    resetBookingFlow: () => void;
}

