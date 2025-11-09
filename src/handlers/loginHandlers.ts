import type { Page } from "../hooks/useNavigation";

export const createLoginHandlers = (navigateTo: (page: Page) => void) => {
  return {
    handleLoginEmailBack: () => {
      navigateTo("connect");
    },

    handleLoginOTPBack: () => {
      navigateTo("loginEmail");
    },
  };
};

