import type { ProtectedPage } from "../storage/navigationPersistence";

export const getCurrentPageFromPath = (path: string): ProtectedPage => {
    if (
        path === "/events" ||
        path === "/location" ||
        path === "/area-selection" ||
        path === "/quiz" ||
        path === "/personality-quiz" ||
        path.startsWith("/events/")
    ) {
        return "events";
    }

    if (path === "/profile" || path.startsWith("/profile/")) {
        return "profile";
    }

    if (path === "/explore") {
        return "explore";
    }

    return "events";
};

export const shouldShowBottomNav = (pathname: string): boolean => {
    return (
        pathname !== "/location" &&
        pathname !== "/area-selection" &&
        pathname !== "/quiz" &&
        pathname !== "/personality-quiz" &&
        pathname !== "/finding-matches" &&
        !pathname.startsWith("/events/") &&
        (pathname === "/profile" || !pathname.startsWith("/profile/"))
    );
};

export const shouldPersistPage = (pathname: string): boolean => {
    return (
        pathname !== "/location" &&
        pathname !== "/area-selection" &&
        pathname !== "/personality-quiz" &&
        pathname !== "/finding-matches" &&
        !pathname.startsWith("/events/")
    );
};

