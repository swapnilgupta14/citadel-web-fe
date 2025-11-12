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
    info: PanInfo
  ) => {
    if (info.point.x > 280) {
      onComplete();
    } else {
      x.set(0);
    }
  };

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex-1 flex items-center justify-center relative min-h-0">
        <ImageGrid />
      </div>

      <div
        className="flex flex-col justify-around rounded-t-[45px] p-6"
        style={{
          minHeight: "38%",
          maxHeight: "48%",
          background: "linear-gradient(180deg, #111111 0%, #040404 100%)",
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10">
            <ImageWithPlaceholder
              src="/logo.svg"
              alt="Citadel"
              className="w-full h-full"
            />
          </div>

          <h2 className="text-[2rem] leading-tight font-bold text-text-primary text-center font-serif">
            i'm good, wby?
          </h2>
        </div>

        <div
          ref={constraintsRef}
          className="relative w-full h-[5rem] bg-slider-bg rounded-full overflow-hidden"
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
            className="absolute left-2 top-2 w-16 h-16 bg-primary rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg"
          >
            <ChevronRight className="w-7 h-7 text-background" strokeWidth={3} />
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
