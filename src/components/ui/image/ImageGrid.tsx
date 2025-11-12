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
      className={`relative w-full ${className} max-h-[350px] max-w-[350px] mx-auto`}
    >
      <motion.div
        className="absolute top-[4%] left-[14%] w-[23%] bg-background-secondary border border-border overflow-hidden rounded-[3.75rem]"
        style={{ aspectRatio: "10 / 13" }}
      >
        <ImageWithPlaceholder
          src="/Splash/Rectangle1.png"
          alt=""
          className="w-full h-full object-cover"
        />
      </motion.div>

      <motion.div
        className="absolute top-[3%] right-[8%] w-[43%] bg-background-secondary border border-border overflow-hidden rounded-[3.75rem]"
        style={{ aspectRatio: "3 / 4" }}
      >
        <ImageWithPlaceholder
          src="/Splash/Rectangle2.png"
          alt=""
          className="w-full h-full object-cover"
        />
      </motion.div>

      <motion.div
        className="absolute bottom-[2%] left-[4%] w-[43%] bg-background-secondary border border-border overflow-hidden rounded-[3.75rem]"
        style={{ aspectRatio: "3 / 4" }}
      >
        <ImageWithPlaceholder
          src="/Splash/Rectangle3.png"
          alt=""
          className="w-full h-full object-cover"
        />
      </motion.div>

      <motion.div
        className="absolute bottom-[7%] right-[14%] w-[23%] bg-background-secondary border border-border overflow-hidden rounded-[3.75rem]"
        style={{ aspectRatio: "10 / 13" }}
      >
        <ImageWithPlaceholder
          src="/Splash/Rectangle4.png"
          alt=""
          className="w-full h-full object-cover"
        />
      </motion.div>

      <motion.div className="absolute top-[25%] left-[6%] w-[5.7%] aspect-square">
        <ImageWithPlaceholder
          src="/vector1.png"
          alt=""
          className="w-full h-full"
        />
      </motion.div>

      <motion.div className="absolute top-[42%] left-[44%] w-[4.6%] aspect-square">
        <ImageWithPlaceholder
          src="/vector1.png"
          alt=""
          className="w-full h-full"
        />
      </motion.div>

      <motion.div className="absolute bottom-[16%] right-[5%] w-[5.7%] aspect-square">
        <ImageWithPlaceholder
          src="/vector2.png"
          alt=""
          className="w-full h-full"
        />
      </motion.div>
    </motion.div>
  );
};
