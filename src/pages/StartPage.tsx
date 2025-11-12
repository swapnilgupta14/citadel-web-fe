import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "framer-motion";
import { ChevronRight } from "lucide-react";
import { ImageGrid, ImageWithPlaceholder } from "../components/ui";

interface StartPageProps {
  onComplete: () => void;
}

export const StartPage = ({ onComplete }: StartPageProps) => {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const sliderOpacity = useTransform(x, [0, 250], [1, 0]);

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    _info: PanInfo
  ) => {
    // Get the actual container width to calculate max draggable distance
    const container = constraintsRef.current;
    if (!container) return;

    const containerWidth = container.offsetWidth;
    const buttonWidth = 72; // Approximate button width (w-16 or smaller)
    const maxDragDistance = containerWidth - buttonWidth - 8; // 8px for left/right padding

    // Check if dragged to 95% of max distance
    const draggedDistance = x.get();
    const threshold = maxDragDistance * 0.95;

    if (draggedDistance >= threshold) {
      onComplete();
    } else {
      x.set(0);
    }
  };

  // Calculate max drag distance for animation (use container width dynamically)
  const container = constraintsRef.current;
  const containerWidth = container?.offsetWidth || 350;
  const maxDragDistance = containerWidth - 72 - 8;
  const dragProgress = useTransform(x, [0, maxDragDistance], [0, 1]);

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex-1 flex items-center justify-center relative min-h-0">
        <ImageGrid dragProgress={dragProgress} />
      </div>

      <div
        className="flex flex-col justify-between rounded-t-[45px] p-6 gap-4"
        style={{
          minHeight: "38%",
          maxHeight: "48%",
          background: "linear-gradient(180deg, #111111 0%, #040404 100%)",
        }}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10">
            <ImageWithPlaceholder
              src="/logo.svg"
              alt="Citadel"
              className="w-full h-full"
            />
          </div>

          <h2 className="text-[2rem] leading-tight font-bold text-text-primary text-center font-serif mt-2">
            i'm good, wby?
          </h2>
        </div>

        <div
          ref={constraintsRef}
          className="relative w-full h-20 min-h-[3.5rem] bg-slider-bg rounded-full overflow-hidden"
        >
          <motion.div
            style={{ opacity: sliderOpacity }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <span className="text-lg bg-gradient-to-r from-[#CACACA] to-[#9A9A9A] bg-clip-text text-transparent">
              Slide to start
            </span>
          </motion.div>

          <motion.div
            drag="x"
            dragConstraints={constraintsRef}
            dragElastic={0}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            style={{ x }}
            className="absolute left-1 top-1 bottom-1 aspect-square max-w-[4.5rem] bg-primary rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg"
          >
            <ChevronRight
              className="w-[30%] h-[30%] text-background"
              strokeWidth={3}
            />
          </motion.div>
        </div>

        <div className="text-center text-xs text-text-muted px-4">
          By signing in you accept our{" "}
          <span className="underline">Terms of use</span> and{" "}
          <span className="underline">Privacy policy</span>
        </div>
      </div>
    </div>
  );
};
