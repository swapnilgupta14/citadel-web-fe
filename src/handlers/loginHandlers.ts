import type { Page } from "../hooks/logic/useNavigation";

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

