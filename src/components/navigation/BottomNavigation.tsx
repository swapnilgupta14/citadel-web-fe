import { Calendar, Search, User } from "lucide-react";
import type { Page } from "../../hooks/useNavigation";

interface BottomNavigationProps {
  activePage: "events" | "explore" | "profile";
  onNavigate: (page: "events" | "explore" | "profile") => void;
}

export const BottomNavigation = ({
  activePage,
  onNavigate,
}: BottomNavigationProps) => {
  const navItems = [
    {
      id: "events" as const,
      label: "Events",
      icon: Calendar,
    },
    {
      id: "explore" as const,
      label: "Explore",
      icon: Search,
    },
    {
      id: "profile" as const,
      label: "Profile",
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[92px] bg-background border-t border-border z-50">
      <div className="flex items-center justify-around h-full px-4 pb-6 pt-2 relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex flex-col items-center justify-center gap-1 flex-1 active:opacity-70 transition-opacity relative"
              aria-label={item.label}
            >
              <Icon
                className={`w-6 h-6 transition-colors ${
                  isActive ? "text-primary" : "text-text-secondary"
                }`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={`text-xs font-medium transition-colors ${
                  isActive ? "text-primary" : "text-text-secondary"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

