import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { type MotionValue, useMotionValue } from "framer-motion";

interface ImageGridContextValue {
  progress: MotionValue<number>;
  setProgress: (value: number) => void;
  isTransitioning: boolean;
  setIsTransitioning: (value: boolean) => void;
}

const ImageGridContext = createContext<ImageGridContextValue | null>(null);

export const ImageGridProvider = ({ children }: { children: ReactNode }) => {
  const progress = useMotionValue(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const setProgress = (value: number) => {
    progress.set(value);
  };

  return (
    <ImageGridContext.Provider value={{ progress, setProgress, isTransitioning, setIsTransitioning }}>
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
