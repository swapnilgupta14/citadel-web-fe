import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BottomNavigation } from "../navigation/BottomNavigation";
import { ExplorePage } from "../../pages/ExplorePage";
import { EventsPage } from "../../pages/EventsPage";
import { ProfilePage } from "../../pages/ProfilePage";

type ProtectedPage = "events" | "explore" | "profile";

const pageVariants = {
  initial: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  animate: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0,
  }),
};

const pageTransition = {
  type: "tween" as const,
  ease: "easeInOut" as const,
  duration: 0.3,
};

export const ProtectedPagesLayout = () => {
  const [currentPage, setCurrentPage] = useState<ProtectedPage>("explore");
  const [direction, setDirection] = useState(0);

  const handleNavigate = (page: ProtectedPage) => {
    const pageOrder: ProtectedPage[] = ["events", "explore", "profile"];
    const currentIndex = pageOrder.indexOf(currentPage);
    const newIndex = pageOrder.indexOf(page);

    setDirection(newIndex - currentIndex);
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "events":
        return <EventsPage />;
      case "explore":
        return <ExplorePage />;
      case "profile":
        return <ProfilePage />;
      default:
        return <ExplorePage />;
    }
  };

  return (
    <div className="flex h-full flex-col bg-background relative">
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentPage}
            custom={direction}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="absolute inset-0"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </div>
      <BottomNavigation activePage={currentPage} onNavigate={handleNavigate} />
    </div>
  );
};
