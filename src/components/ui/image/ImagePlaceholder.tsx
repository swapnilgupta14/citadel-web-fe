import { Image } from "lucide-react";

interface ImagePlaceholderProps {
  className?: string;
}

export const ImagePlaceholder = ({ className = "" }: ImagePlaceholderProps) => {
  return (
    <div
      className={`flex items-center justify-center bg-background-tertiary ${className}`}
    >
      <Image className="w-12 h-12 text-text-secondary" strokeWidth={1.5} />
    </div>
  );
};
