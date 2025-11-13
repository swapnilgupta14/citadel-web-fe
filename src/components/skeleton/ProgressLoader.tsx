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
  const [animationTime, setAnimationTime] = useState(0);

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

  useEffect(() => {
    let animationFrame: number;
    const startTime = Date.now();
    const pulseDuration = 10200;

    const animatePulse = () => {
      const now = Date.now();
      const elapsed = (now - startTime) % pulseDuration;
      const normalizedTime = elapsed / pulseDuration;
      setAnimationTime(normalizedTime);
      animationFrame = requestAnimationFrame(animatePulse);
    };

    animationFrame = requestAnimationFrame(animatePulse);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  const pulseScale =
    1 - (Math.sin(animationTime * Math.PI * 2) * 0.5 + 0.5) * 0.15;

  const circle1 = {
    originalSize: 50.6,
    originalCx: 23.8,
    originalCy: 23.8,
    originalR: 23.6,
  };
  const circle2 = {
    originalSize: 39.6,
    originalCx: 18.3,
    originalCy: 18.3,
    originalR: 18.1,
  };
  const circle3 = {
    originalSize: 30.6,
    originalCx: 14.3,
    originalCy: 14.3,
    originalR: 14.1,
  };
  const circle4 = {
    originalSize: 20.6,
    originalCx: 10.3,
    originalCy: 10.3,
    originalR: 10.1,
  };

  return (
    <div className="flex h-full flex-col bg-background px-6 overflow-hidden relative">
      <div className="flex-1 flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          <svg
            className="absolute"
            width={`${circle1.originalSize * pulseScale}rem`}
            height={`${circle1.originalSize * pulseScale}rem`}
            style={{
              width: `${circle1.originalSize * pulseScale}rem`,
              height: `${circle1.originalSize * pulseScale}rem`,
            }}
          >
            <circle
              cx={`${circle1.originalCx * pulseScale}rem`}
              cy={`${circle1.originalCy * pulseScale}rem`}
              r={`${circle1.originalR * pulseScale}rem`}
              fill="none"
              stroke="#1F1F1F"
              strokeWidth="1"
              strokeDasharray="12 8"
            />
          </svg>

          <svg
            className="absolute"
            width={`${circle2.originalSize * pulseScale}rem`}
            height={`${circle2.originalSize * pulseScale}rem`}
            style={{
              width: `${circle2.originalSize * pulseScale}rem`,
              height: `${circle2.originalSize * pulseScale}rem`,
            }}
          >
            <circle
              cx={`${circle2.originalCx * pulseScale}rem`}
              cy={`${circle2.originalCy * pulseScale}rem`}
              r={`${circle2.originalR * pulseScale}rem`}
              fill="none"
              stroke="#1F1F1F"
              strokeWidth="1"
              strokeDasharray="12 8"
            />
          </svg>

          <svg
            className="absolute"
            width={`${circle3.originalSize * pulseScale}rem`}
            height={`${circle3.originalSize * pulseScale}rem`}
            style={{
              width: `${circle3.originalSize * pulseScale}rem`,
              height: `${circle3.originalSize * pulseScale}rem`,
            }}
          >
            <circle
              cx={`${circle3.originalCx * pulseScale}rem`}
              cy={`${circle3.originalCy * pulseScale}rem`}
              r={`${circle3.originalR * pulseScale}rem`}
              fill="none"
              stroke="#1F1F1F"
              strokeWidth="1"
              strokeDasharray="12 8"
            />
          </svg>

          <svg
            className="absolute"
            width={`${circle4.originalSize * pulseScale}rem`}
            height={`${circle4.originalSize * pulseScale}rem`}
            style={{
              width: `${circle4.originalSize * pulseScale}rem`,
              height: `${circle4.originalSize * pulseScale}rem`,
            }}
          >
            <circle
              cx={`${circle4.originalCx * pulseScale}rem`}
              cy={`${circle4.originalCy * pulseScale}rem`}
              r={`${circle4.originalR * pulseScale}rem`}
              fill="none"
              stroke="#1F1F1F"
              strokeWidth="1"
              strokeDasharray="12 8"
            />
          </svg>
          <div className="relative w-full">
            <div className="absolute -top-32 -left-5 w-screen text-center z-20 flex items-center">
              <h2 className="text-[28px] font-semibold text-text-primary font-serif">
                Finding compatible{" "}
                <span className="block text-primary font-serif italic">
                  PROFILES!
                </span>
              </h2>
            </div>
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
    </div>
  );
};
