import { useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { ImageGrid } from "../components/ui/ImageGrid";

interface SignupPageProps {
  onComplete: () => void;
}

export const SignupPage = ({ onComplete }: SignupPageProps) => {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  const imageScale = useTransform(x, [0, 250], [1, 1.2]);
  const imageX = useTransform(x, [0, 250], [0, 50]);
  const sliderOpacity = useTransform(x, [0, 250], [1, 0]);

  const handleDragEnd = (_event: any, info: any) => {
    if (info.point.x > 280) {
      onComplete();
    } else {
      x.set(0);
    }
  };

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex-1 flex items-center justify-center relative px-4 min-h-0 py-4">
        <ImageGrid
          style={{
            scale: imageScale,
            x: imageX,
          }}
          className="max-h-[70%]"
        />
      </div>

      <div
        className="flex flex-col justify-center rounded-t-[45px] p-6 gap-8"
        style={{
          minHeight: "38%",
          maxHeight: "48%",
          background: "linear-gradient(180deg, #111111 0%, #040404 100%)",
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10">
            <img src="/logo.png" alt="Citadel" className="w-full h-full" />
          </div>

          <h2 className="text-[2rem] leading-tight font-bold text-text-primary text-center font-serif">
            i'm good, wby?
          </h2>
        </div>

        <div
          ref={constraintsRef}
          className="relative w-full h-16 bg-background-tertiary rounded-full overflow-hidden"
        >
          <motion.div
            style={{ opacity: sliderOpacity }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <span className="text-base bg-gradient-to-r from-[#CACACA] to-[#9A9A9A] bg-clip-text text-transparent">
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
            className="absolute left-2 top-2 w-12 h-12 bg-primary rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg"
          >
            <ChevronRight className="w-7 h-7 text-background" strokeWidth={3} />
          </motion.div>
        </div>

        <p className="text-center text-xs text-text-muted px-4">
          By signing in you accept our{" "}
          <span className="underline">Terms of use</span> and{" "}
          <span className="underline">Privacy policy</span>
        </p>
      </div>
    </div>
  );
};
