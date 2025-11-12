export type UserData = {
  id: string;
  email: string;
  isProfileComplete: boolean;
};

type JwtPayload = {
  exp?: number;
  iat?: number;
  sub?: string;
  [key: string]: unknown;
};

const USER_DATA_KEY = "citadel_user_data";

const parseJwt = (token: string): JwtPayload | null => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload) as JwtPayload;
  } catch {
    return null;
  }
};

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
    localStorage.removeItem("citadel_selected_city");
    localStorage.removeItem("citadel_current_page");
    localStorage.removeItem("citadel_signup_data");
    localStorage.removeItem("citadel_signup_email");
  },

  logout: () => {
    auth.clearAll();
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("accessToken");
  },

  isTokenExpired: (token: string, clockSkewSeconds: number = 30): boolean => {
    const payload = parseJwt(token);
    if (!payload || !payload.exp) return true;
    const nowSeconds = Math.floor(Date.now() / 1000);
    return nowSeconds >= (payload.exp - clockSkewSeconds);
  },

  isAccessTokenExpired: (): boolean => {
    const token = auth.getAccessToken();
    if (!token) return true;
    return auth.isTokenExpired(token);
  },
};

