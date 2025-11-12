import { motion, type MotionStyle, type HTMLMotionProps } from "framer-motion";
import { ImageWithPlaceholder } from "./ImageWithPlaceholder";

type ImageGridProps = {
  className?: string;
  style?: MotionStyle;
} & Pick<HTMLMotionProps<"div">, "initial" | "animate" | "transition">;

export const ImageGrid = ({
  className = "",
  style,
  initial,
  animate,
  transition,
}: ImageGridProps) => {
  return (
    <motion.div
      initial={initial}
      animate={animate}
      transition={transition}
      style={{
        aspectRatio: "1 / 1.3",
        maxHeight: "70%",
        ...style,
      }}
      className={`relative w-full ${className}`}
    >
      <motion.div className="absolute top-[2%] left-[14%] w-20 h-[6.5rem] bg-background-secondary border border-border overflow-hidden rounded-[3.75rem]">
        <ImageWithPlaceholder
          src="/Splash/Rectangle1.png"
          alt=""
          className="w-full h-full object-cover"
        />
      </motion.div>

      <motion.div className="absolute top-0 right-[8%] w-[9.375rem] h-[12.5rem] bg-background-secondary border border-border overflow-hidden rounded-[3.75rem]">
        <ImageWithPlaceholder
          src="/Splash/Rectangle2.png"
          alt=""
          className="w-full h-full object-cover"
        />
      </motion.div>

      <motion.div className="absolute bottom-[2%] left-[4%] w-[9.375rem] h-[12.5rem] bg-background-secondary border border-border overflow-hidden rounded-[3.75rem]">
        <ImageWithPlaceholder
          src="/Splash/Rectangle3.png"
          alt=""
          className="w-full h-full object-cover"
        />
      </motion.div>

      <motion.div className="absolute bottom-0 right-[14%] w-20 h-[6.5rem] bg-background-secondary border border-border overflow-hidden rounded-[3.75rem]">
        <ImageWithPlaceholder
          src="/Splash/Rectangle4.png"
          alt=""
          className="w-full h-full object-cover"
        />
      </motion.div>

      <motion.div className="absolute top-[25%] left-[6%]">
        <ImageWithPlaceholder src="/vector1.png" alt="" className="w-5 h-5" />
      </motion.div>

      <motion.div className="absolute top-[42%] left-[44%]">
        <ImageWithPlaceholder src="/vector1.png" alt="" className="w-4 h-4" />
      </motion.div>

      <motion.div className="absolute bottom-[10%] right-[5%]">
        <ImageWithPlaceholder src="/vector2.png" alt="" className="w-5 h-5" />
      </motion.div>
    </motion.div>
  );
};
