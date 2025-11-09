import type { ReactNode } from "react";

interface MobileLayoutProps {
  children: ReactNode;
}

export const MobileLayout = ({ children }: MobileLayoutProps) => {
  return <div className="relative h-full bg-background">{children}</div>;
};
