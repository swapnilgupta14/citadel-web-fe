import { type ButtonHTMLAttributes, type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "disabled";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-background shadow-lg active:scale-95 cursor-pointer",
  secondary:
    "bg-background-secondary text-text-primary hover:bg-background-tertiary active:bg-background-tertiary",
  disabled: "bg-background-tertiary text-background cursor-not-allowed",
};

const getLoaderColorClass = (variant: ButtonVariant): string => {
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

const BouncingDotsLoader = ({ colorClass }: { colorClass: string }) => {
  return (
    <div className="flex items-center justify-center gap-1.5">
      <span
        className={`w-2 h-2 rounded-full ${colorClass} animate-bounce`}
        style={{ animationDelay: "0ms", animationDuration: "600ms" }}
      />
      <span
        className={`w-2 h-2 rounded-full ${colorClass} animate-bounce`}
        style={{ animationDelay: "150ms", animationDuration: "600ms" }}
      />
      <span
        className={`w-2 h-2 rounded-full ${colorClass} animate-bounce`}
        style={{ animationDelay: "300ms", animationDuration: "600ms" }}
      />
    </div>
  );
};

export const Button = ({
  variant = "primary",
  children,
  className = "",
  disabled,
  isLoading = false,
  ...props
}: ButtonProps) => {
  const effectiveVariant = disabled || isLoading ? "disabled" : variant;
  const loaderColorClass = getLoaderColorClass(variant);

  return (
    <button
      className={`w-full min-h-[3.5rem] rounded-full flex items-center justify-center text-lg font-semibold transition-all ${variantStyles[effectiveVariant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <BouncingDotsLoader colorClass={loaderColorClass} />
      ) : (
        children
      )}
    </button>
  );
};
