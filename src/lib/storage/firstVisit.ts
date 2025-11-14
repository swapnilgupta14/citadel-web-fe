const FIRST_VISIT_KEY = "citadel_first_visit_completed";

export const firstVisit = {
  hasVisited: (): boolean => {
    try {
      const value = localStorage.getItem(FIRST_VISIT_KEY);
      return value === "true";
    } catch (error) {
      console.error("Failed to check first visit:", error);
      return false;
    }
  },

  markAsVisited: () => {
    try {
      localStorage.setItem(FIRST_VISIT_KEY, "true");
    } catch (error) {
      console.error("Failed to mark first visit:", error);
    }
  },

  // Only for testing/debugging - not exposed in normal flow
  clear: () => {
    localStorage.removeItem(FIRST_VISIT_KEY);
  },
};

