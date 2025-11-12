import {
  motion,
  type MotionStyle,
  type HTMLMotionProps,
  type MotionValue,
  useTransform,
  useMotionValue,
  useMotionValueEvent,
} from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { ImageWithPlaceholder } from "./ImageWithPlaceholder";

// Base ratio: Screen height 852px : ImageGrid height 350px
const BASE_SCREEN_HEIGHT = 852;
const BASE_IMAGE_GRID_HEIGHT = 350;
const BASE_BORDER_RADIUS = 60;

type ImageGridProps = {
  className?: string;
  style?: MotionStyle;
  dragProgress?: MotionValue<number>;
} & Pick<HTMLMotionProps<"div">, "initial" | "animate" | "transition">;

export const ImageGrid = ({
  className = "",
  style,
  initial,
  animate,
  transition,
  dragProgress,
}: ImageGridProps) => {
  // Calculate scale factor based on viewport height
  const [scaleFactor, setScaleFactor] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const viewportHeight = window.innerHeight;
      const scale = viewportHeight / BASE_SCREEN_HEIGHT;
      setScaleFactor(scale);
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  // Create a default motion value if dragProgress is not provided
  const defaultProgress = useMotionValue(0);
  const progress = dragProgress || defaultProgress;

  // Transform drag progress (0 to 1) to percentage values for each image
  // Small images (1 & 4) move more toward center, large images (2 & 3) move ~half as much
  // Reduced by 40% for subtler movement

  // Image 1 (top-left, small): Move DOWN and RIGHT toward center
  const img1Top = useTransform(progress, [0, 1], ["4%", "17.2%"]);
  const img1Left = useTransform(progress, [0, 1], ["14%", "23.6%"]);

  // Image 2 (top-right, large): Move DOWN and LEFT toward center (half movement)
  const img2Top = useTransform(progress, [0, 1], ["3%", "-5%"]);
  const img2Right = useTransform(progress, [0, 1], ["8%", "9.5%"]);

  // Image 3 (bottom-left, large): Move UP and RIGHT toward center (half movement)
  const img3Bottom = useTransform(progress, [0, 1], ["2%", "-2%"]);
  const img3Left = useTransform(progress, [0, 1], ["4%", "8%"]);

  // Image 4 (bottom-right, small): Move UP and LEFT toward center
  const img4Bottom = useTransform(progress, [0, 1], ["7%", "20.2%"]);
  const img4Right = useTransform(progress, [0, 1], ["14%", "23.6%"]);

  // Border radius animations - gradually un-round specific corners
  // Scale border radius based on viewport height
  const scaledBorderRadius = BASE_BORDER_RADIUS * scaleFactor;
  const cornerRadius = useTransform(progress, (latest) => {
    const value = scaledBorderRadius * (1 - latest); // scaledBorderRadius when progress=0, 0 when progress=1
    return `${value}px`;
  });

  // Refs for each image container to apply border-radius directly
  const img1Ref = useRef<HTMLDivElement>(null);
  const img2Ref = useRef<HTMLDivElement>(null);
  const img3Ref = useRef<HTMLDivElement>(null);
  const img4Ref = useRef<HTMLDivElement>(null);

  // Apply border-radius directly to DOM elements when cornerRadius changes
  useMotionValueEvent(cornerRadius, "change", (latest) => {
    if (img1Ref.current) {
      img1Ref.current.style.borderBottomRightRadius = latest;
    }
    if (img2Ref.current) {
      img2Ref.current.style.borderBottomLeftRadius = latest;
    }
    if (img3Ref.current) {
      img3Ref.current.style.borderTopRightRadius = latest;
    }
    if (img4Ref.current) {
      img4Ref.current.style.borderTopLeftRadius = latest;
    }
  });

  // Calculate scaled dimensions
  const scaledHeight = BASE_IMAGE_GRID_HEIGHT * scaleFactor;
  const scaledHeightRem = `${scaledHeight / 16}rem`;

  return (
    <motion.div
      initial={initial}
      animate={animate}
      transition={transition}
      style={{
        aspectRatio: "1 / 1.3",
        maxHeight: scaledHeightRem,
        maxWidth: scaledHeightRem,
        ...style,
      }}
      className={`relative w-full ${className} mx-auto`}
    >
      <motion.div
        ref={img1Ref}
        className="absolute w-[23%] bg-background-secondary border border-border overflow-hidden"
        style={{
          aspectRatio: "10 / 13",
          top: img1Top,
          left: img1Left,
          borderTopLeftRadius: `${scaledBorderRadius}px`,
          borderTopRightRadius: `${scaledBorderRadius}px`,
          borderBottomLeftRadius: `${scaledBorderRadius}px`,
          borderBottomRightRadius: `${scaledBorderRadius}px`, // Initial value, will be updated via ref
        }}
      >
        <ImageWithPlaceholder
          src="/Splash/Rectangle1.png"
          alt=""
          className="w-full h-full object-cover"
        />
      </motion.div>

      <motion.div
        ref={img2Ref}
        className="absolute w-[43%] bg-background-secondary border border-border overflow-hidden"
        style={{
          aspectRatio: "3 / 4",
          top: img2Top,
          right: img2Right,
          borderTopLeftRadius: `${scaledBorderRadius}px`,
          borderTopRightRadius: `${scaledBorderRadius}px`,
          borderBottomLeftRadius: `${scaledBorderRadius}px`, // Initial value, will be updated via ref
          borderBottomRightRadius: `${scaledBorderRadius}px`,
        }}
      >
        <ImageWithPlaceholder
          src="/Splash/Rectangle2.png"
          alt=""
          className="w-full h-full object-cover"
        />
      </motion.div>

      <motion.div
        ref={img3Ref}
        className="absolute w-[43%] bg-background-secondary border border-border overflow-hidden"
        style={{
          aspectRatio: "3 / 4",
          bottom: img3Bottom,
          left: img3Left,
          borderTopLeftRadius: `${scaledBorderRadius}px`,
          borderTopRightRadius: `${scaledBorderRadius}px`, // Initial value, will be updated via ref
          borderBottomLeftRadius: `${scaledBorderRadius}px`,
          borderBottomRightRadius: `${scaledBorderRadius}px`,
        }}
      >
        <ImageWithPlaceholder
          src="/Splash/Rectangle3.png"
          alt=""
          className="w-full h-full object-cover"
        />
      </motion.div>

      <motion.div
        ref={img4Ref}
        className="absolute w-[23%] bg-background-secondary border border-border overflow-hidden"
        style={{
          aspectRatio: "10 / 13",
          bottom: img4Bottom,
          right: img4Right,
          borderTopLeftRadius: `${scaledBorderRadius}px`, // Initial value, will be updated via ref
          borderTopRightRadius: `${scaledBorderRadius}px`,
          borderBottomLeftRadius: `${scaledBorderRadius}px`,
          borderBottomRightRadius: `${scaledBorderRadius}px`,
        }}
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
