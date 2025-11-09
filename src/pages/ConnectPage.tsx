import { motion } from "framer-motion";

interface ConnectPageProps {
  onContinue: () => void;
}

export const ConnectPage = ({ onContinue }: ConnectPageProps) => {
  return (
    <div className="relative flex h-full flex-col bg-background overflow-hidden">
      <div className="flex flex-col flex-1 relative z-10 min-h-0">
        <div className="flex-1 flex items-center justify-center relative px-4 py-4 min-h-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-full max-w-full max-h-full"
            style={{ aspectRatio: "1 / 1.3", maxHeight: "70%" }}
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

        <div className="flex flex-col justify-between px-6 py-4 pb-6 items-center gap-6 min-h-fit">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl sm:text-4xl leading-tight font-bold text-text-primary text-center font-serif">
              Connect with students across universities
            </h1>
          </div>

          <button
            onClick={onContinue}
            className="w-4/5 min-h-[3.5rem] bg-primary rounded-full flex items-center justify-center text-background text-lg font-semibold shadow-lg active:scale-95 transition-transform"
          >
            Let's go
          </button>

          <p className="text-center text-sm text-text-secondary">
            Already a user?{" "}
            <span className="text-text-primary underline font-medium cursor-pointer">
              Login
            </span>
          </p>
        </div>
      </div>

      <div className="h-[15%] min-h-[80px] max-h-[120px] overflow-hidden pointer-events-none bg-primary">
        <span></span>
      </div>
    </div>
  );
};
