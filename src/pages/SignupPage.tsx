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
      <div className="flex-1 flex items-center justify-center relative px-4">
        <motion.div
          style={{
            scale: imageScale,
            x: imageX,
          }}
          className="relative w-full h-[350px]"
        >
          <motion.div
            className="absolute top-2 left-14 w-[80px] h-[105px] bg-background-secondary border border-border overflow-hidden"
            style={{ borderRadius: "60px 60px 60px 60px" }}
          >
            <img
              src="/Splash/Rectangle1.png"
              alt=""
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div
            className="absolute top-0 right-8 w-[150px] h-[200px] bg-background-secondary border border-border overflow-hidden"
            style={{ borderRadius: "60px 60px 60px 60px" }}
          >
            <img
              src="/Splash/Rectangle2.png"
              alt=""
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div
            className="absolute top-40 left-4 w-[150px] h-[200px] bg-background-secondary border border-border overflow-hidden"
            style={{ borderRadius: "60px 60px 60px 60px" }}
          >
            <img
              src="/Splash/Rectangle3.png"
              alt=""
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div
            className="absolute bottom-0 right-14 w-[80px] h-[105px] bg-background-secondary border border-border overflow-hidden"
            style={{ borderRadius: "60px 60px 60px 60px" }}
          >
            <img
              src="/Splash/Rectangle4.png"
              alt=""
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div className="absolute top-24 left-6">
            <img src="/vector1.png" alt="" className="w-6 h-6" />
          </motion.div>

          <motion.div className="absolute top-[50%] left-[45%]">
            <img src="/vector1.png" alt="" className="w-6 h-6" />
          </motion.div>

          <motion.div className="absolute bottom-10 right-4">
            <img src="/vector2.png" alt="" className="w-6 h-6" />
          </motion.div>
        </motion.div>
      </div>

      <div
        className="flex flex-col justify-between h-[40%] rounded-t-[45px] p-8"
        style={{
          background: "linear-gradient(180deg, #111111 0%, #040404 100%)",
        }}
      >
        <div className="flex flex-col items-center space-y-3">
          <div className="w-12 h-12">
            <img src="/logo.png" alt="Citadel" className="w-full h-full" />
          </div>

          <h2 className="text-[36px] font-bold text-text-primary text-center font-serif">
            i'm good, wby?
          </h2>
        </div>

        <div
          ref={constraintsRef}
          className="relative w-full h-20 bg-background-tertiary rounded-full overflow-hidden"
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
            <ChevronRight className="w-8 h-8 text-background" strokeWidth={3} />
          </motion.div>
        </div>

        <div className="px-14">
          <p className="text-center text-sm text-text-muted">
            By signing in you accept our{" "}
            <span className="underline">Terms of use</span> and{" "}
            <span className="underline">Privacy policy</span>
          </p>
        </div>
      </div>
    </div>
  );
};
