import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { type MotionValue, useMotionValue } from "framer-motion";

interface ImageGridContextValue {
  progress: MotionValue<number>;
  setProgress: (value: number) => void;
}

const ImageGridContext = createContext<ImageGridContextValue | null>(null);

export const ImageGridProvider = ({ children }: { children: ReactNode }) => {
  const progress = useMotionValue(0);

  const setProgress = (value: number) => {
    progress.set(value);
  };

  return (
    <ImageGridContext.Provider value={{ progress, setProgress }}>
      {children}
    </ImageGridContext.Provider>
  );
};

export const useImageGrid = () => {
  const context = useContext(ImageGridContext);
  if (!context) {
    throw new Error("useImageGrid must be used within ImageGridProvider");
  }
  return context;
};
