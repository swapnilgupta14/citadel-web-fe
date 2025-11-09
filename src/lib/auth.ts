export type UserData = {
  id: string;
  email: string;
  isProfileComplete: boolean;
};

const USER_DATA_KEY = "citadel_user_data";

export const auth = {
  getAccessToken: (): string | null => {
    return localStorage.getItem("accessToken");
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem("refreshToken");
  },

  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  },

  clearTokens: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },

  getUserData: (): UserData | null => {
    try {
      const data = localStorage.getItem(USER_DATA_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Failed to get user data:", error);
      return null;
    }
  },

  setUserData: (userData: UserData) => {
    try {
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error("Failed to save user data:", error);
    }
  },

  clearUserData: () => {
    localStorage.removeItem(USER_DATA_KEY);
  },

  clearAll: () => {
    auth.clearTokens();
    auth.clearUserData();
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("accessToken");
  },
};

