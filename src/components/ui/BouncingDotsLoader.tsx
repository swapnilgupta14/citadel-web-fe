interface BouncingDotsLoaderProps {
  colorClass?: string;
  variant?: "primary" | "secondary" | "disabled";
}

const getLoaderColorClass = (variant: string): string => {
  switch (variant) {
    case "primary":
      return "bg-primary";
    case "secondary":
      return "bg-white";
    case "disabled":
      return "bg-white";
    default:
      return "bg-white";
  }
};

export const BouncingDotsLoader = ({
  colorClass,
  variant = "primary",
}: BouncingDotsLoaderProps) => {
  const effectiveColorClass = colorClass || getLoaderColorClass(variant);

  return (
    <div className="flex items-center justify-center gap-1.5">
      <span
        className={`w-2 h-2 rounded-full ${effectiveColorClass} animate-bounce`}
        style={{ animationDelay: "0ms", animationDuration: "600ms" }}
      />
      <span
        className={`w-2 h-2 rounded-full ${effectiveColorClass} animate-bounce`}
        style={{ animationDelay: "150ms", animationDuration: "600ms" }}
      />
      <span
        className={`w-2 h-2 rounded-full ${effectiveColorClass} animate-bounce`}
        style={{ animationDelay: "300ms", animationDuration: "600ms" }}
      />
    </div>
  );
};

