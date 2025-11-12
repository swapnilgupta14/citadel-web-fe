import { useState } from "react";
import { ImagePlaceholder } from "./ImagePlaceholder";

interface ImageWithPlaceholderProps {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  onError?: () => void;
}

export const ImageWithPlaceholder = ({
  src,
  alt,
  className = "",
  loading = "lazy",
  onError,
}: ImageWithPlaceholderProps) => {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  if (hasError) {
    return <ImagePlaceholder className={className} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      onError={handleError}
    />
  );
};

