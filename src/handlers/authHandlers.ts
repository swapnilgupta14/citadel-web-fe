import { auth } from "../lib/auth";

export const authHandlers = {
  handleSplashComplete: (navigateTo: (page: "signup" | "home") => void) => {
    if (auth.isAuthenticated()) {
      navigateTo("home");
    } else {
      navigateTo("signup");
    }
  },

  handleSplashAuthenticated: (navigateTo: (page: "home") => void) => {
    navigateTo("home");
  },

  handleSuccessComplete: (navigateTo: (page: "home" | "connect") => void) => {
    if (auth.isAuthenticated()) {
      navigateTo("home");
    } else {
      navigateTo("connect");
    }
  },

  handleNotFoundBack: (navigateTo: (page: "home" | "connect") => void) => {
    if (auth.isAuthenticated()) {
      navigateTo("home");
    } else {
      navigateTo("connect");
    }
  },
};

