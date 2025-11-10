const NAVIGATION_STORAGE_KEY = "citadel_navigation";
const CITY_STORAGE_KEY = "citadel_selected_city";

export type ProtectedPage = "events" | "explore" | "profile";

export interface PersistedCity {
    id: string;
    name: string;
    landmarkImage?: string;
    isAvailable: boolean;
    comingSoon?: boolean;
}

export const navigationPersistence = {
    saveCurrentPage: (page: ProtectedPage) => {
        try {
            localStorage.setItem(NAVIGATION_STORAGE_KEY, page);
        } catch (error) {
            console.error("Failed to save current page:", error);
        }
    },

    getCurrentPage: (): ProtectedPage => {
        try {
            const page = localStorage.getItem(NAVIGATION_STORAGE_KEY);
            if (page === "events" || page === "explore" || page === "profile") {
                return page;
            }
            return "explore";
        } catch (error) {
            console.error("Failed to get current page:", error);
            return "explore";
        }
    },

    saveSelectedCity: (city: PersistedCity) => {
        try {
            localStorage.setItem(CITY_STORAGE_KEY, JSON.stringify(city));
        } catch (error) {
            console.error("Failed to save selected city:", error);
        }
    },

    getSelectedCity: (): PersistedCity | null => {
        try {
            const data = localStorage.getItem(CITY_STORAGE_KEY);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error("Failed to get selected city:", error);
            return null;
        }
    },

    clearNavigation: () => {
        try {
            localStorage.removeItem(NAVIGATION_STORAGE_KEY);
            localStorage.removeItem(CITY_STORAGE_KEY);
        } catch (error) {
            console.error("Failed to clear navigation data:", error);
        }
    },
};

