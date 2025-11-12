import { useEffect, useState } from "react";

interface ProgressLoaderProps {
  duration?: number;
  onComplete?: () => void;
  continuous?: boolean;
}

export const ProgressLoader = ({
  duration = 3000,
  onComplete,
  continuous = true,
}: ProgressLoaderProps) => {
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    let animationFrame: number;
    let cycleStartTime = Date.now();

    const animate = () => {
      const now = Date.now();
      let elapsed = now - cycleStartTime;

      if (continuous && elapsed >= duration) {
        cycleStartTime = now;
        elapsed = 0;
      }

      const progressRatio = Math.min(elapsed / duration, 1);

      const easedProgress = 1 + progressRatio * 99;
      setProgress(Math.floor(easedProgress));

      if (continuous) {
        animationFrame = requestAnimationFrame(animate);
      } else if (progressRatio >= 1) {
        setProgress(100);
        if (onComplete) {
          setTimeout(() => onComplete(), 100);
        }
      } else {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [duration, onComplete, continuous]);

  return (
    <div className="flex h-full flex-col bg-background px-6 overflow-hidden relative">
      <div className="text-center absolute top-[20%] left-1/2 -translate-x-1/2 z-20 w-full">
        <h2 className="text-[28px] font-semibold text-text-primary font-serif">
          Finding compatible{" "}
          <span className="block text-primary font-serif italic">
            PROFILES!
          </span>
        </h2>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          <svg
            className="absolute"
            width="47.6rem"
            height="47.6rem"
            style={{ width: "50.6rem", height: "50.6rem" }}
          >
            <circle
              cx="23.8rem"
              cy="23.8rem"
              r="23.6rem"
              fill="none"
              stroke="#1F1F1F"
              strokeWidth="1"
              strokeDasharray="12 8"
            />
          </svg>

          <svg
            className="absolute"
            width="36.6rem"
            height="36.6rem"
            style={{ width: "39.6rem", height: "39.6rem" }}
          >
            <circle
              cx="18.3rem"
              cy="18.3rem"
              r="18.1rem"
              fill="none"
              stroke="#1F1F1F"
              strokeWidth="1"
              strokeDasharray="12 8"
            />
          </svg>

          <svg
            className="absolute"
            width="28.6rem"
            height="28.6rem"
            style={{ width: "30.6rem", height: "30.6rem" }}
          >
            <circle
              cx="14.3rem"
              cy="14.3rem"
              r="14.1rem"
              fill="none"
              stroke="#1F1F1F"
              strokeWidth="1"
              strokeDasharray="12 8"
            />
          </svg>

          <svg
            className="absolute"
            width="20.6rem"
            height="20.6rem"
            style={{ width: "20.6rem", height: "20.6rem" }}
          >
            <circle
              cx="10.3rem"
              cy="10.3rem"
              r="10.1rem"
              fill="none"
              stroke="#1F1F1F"
              strokeWidth="1"
              strokeDasharray="12 8"
            />
          </svg>

          <div
            className="relative h-[15.6rem] w-[15.6rem] rounded-full bg-black flex flex-col items-center justify-center z-10 animate-spin"
            style={{
              boxShadow:
                "0 0 8px rgba(27, 234, 123, 0.3), 0 10px 16px rgba(27, 234, 123, 0.5)",
              animationDuration: "2s",
            }}
          >
            <span
              className="text-white font-black text-6xl animate-spin"
              style={{
                animationDuration: "2s",
                animationDirection: "reverse",
              }}
            >
              {progress}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
