import { useOutletContext } from "react-router-dom";
import type { ProtectedLayoutContextType } from "../../types/layout";

export const useProtectedLayout = () => {
    return useOutletContext<ProtectedLayoutContextType>();
};

