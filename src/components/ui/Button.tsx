import { type ButtonHTMLAttributes, type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "disabled";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-background shadow-lg active:scale-95 cursor-pointer",
  secondary:
    "bg-background-secondary text-text-primary hover:bg-background-tertiary active:bg-background-tertiary",
  disabled: "bg-background-tertiary text-background cursor-not-allowed",
};

export const Button = ({
  variant = "primary",
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) => {
  const effectiveVariant = disabled ? "disabled" : variant;

  return (
    <button
      className={`w-full min-h-[3.5rem] rounded-full flex items-center justify-center text-lg font-semibold transition-all ${variantStyles[effectiveVariant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
