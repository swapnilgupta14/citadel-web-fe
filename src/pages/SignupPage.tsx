import { useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { ChevronRight } from "lucide-react";

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
        <motion.div
          style={{
            scale: imageScale,
            x: imageX,
            aspectRatio: "1 / 1.3",
          }}
          className="relative w-full max-h-[70%]"
        >
          <motion.div className="absolute top-[2%] left-[14%] w-20 h-[6.5rem] bg-background-secondary border border-border overflow-hidden rounded-[3.75rem]">
            <img
              src="/Splash/Rectangle1.png"
              alt=""
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div className="absolute top-0 right-[8%] w-[9.375rem] h-[12.5rem] bg-background-secondary border border-border overflow-hidden rounded-[3.75rem]">
            <img
              src="/Splash/Rectangle2.png"
              alt=""
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div className="absolute bottom-[2%] left-[4%] w-[9.375rem] h-[12.5rem] bg-background-secondary border border-border overflow-hidden rounded-[3.75rem]">
            <img
              src="/Splash/Rectangle3.png"
              alt=""
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div className="absolute bottom-0 right-[14%] w-20 h-[6.5rem] bg-background-secondary border border-border overflow-hidden rounded-[3.75rem]">
            <img
              src="/Splash/Rectangle4.png"
              alt=""
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div className="absolute top-[25%] left-[6%]">
            <img src="/vector1.png" alt="" className="w-5 h-5" />
          </motion.div>

          <motion.div className="absolute top-[42%] left-[44%]">
            <img src="/vector1.png" alt="" className="w-4 h-4" />
          </motion.div>

          <motion.div className="absolute bottom-[10%] right-[5%]">
            <img src="/vector2.png" alt="" className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </div>

      <div
        className="flex flex-col justify-between rounded-t-[45px] p-6 pb-4"
        style={{
          minHeight: "35%",
          maxHeight: "45%",
          background: "linear-gradient(180deg, #111111 0%, #040404 100%)",
        }}
      >
        <div className="flex flex-col items-center gap-2">
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
