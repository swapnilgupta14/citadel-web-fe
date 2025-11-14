import { useState } from "react";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { motion, type MotionValue } from "framer-motion";

interface ImageWithPlaceholderProps {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  onError?: () => void;
  scale?: MotionValue<number> | number;
}

export const ImageWithPlaceholder = ({
  src,
  alt,
  className = "",
  loading = "lazy",
  onError,
  scale,
}: ImageWithPlaceholderProps) => {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  if (hasError) {
    return <ImagePlaceholder className={className} />;
  }

  const style = scale !== undefined ? { scale } : undefined;

  return (
    <motion.img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      onError={handleError}
      style={style}
    />
  );
};
