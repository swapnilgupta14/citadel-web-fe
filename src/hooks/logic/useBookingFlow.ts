import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const BOOKING_FLOW_KEY = "bookingFlowState";

const getStoredBookingState = () => {
    try {
        const stored = sessionStorage.getItem(BOOKING_FLOW_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.error("Error reading booking flow state:", error);
    }
    return { isBookingFlow: false, selectedSlotId: null, pendingEventId: null };
};

const saveBookingState = (isBookingFlow: boolean, selectedSlotId: string | null, pendingEventId: string | null) => {
    try {
        sessionStorage.setItem(BOOKING_FLOW_KEY, JSON.stringify({
            isBookingFlow,
            selectedSlotId,
            pendingEventId
        }));
    } catch (error) {
        console.error("Error saving booking flow state:", error);
    }
};

export const useBookingFlow = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const initialState = getStoredBookingState();
    const [isBookingFlow, setIsBookingFlow] = useState(initialState.isBookingFlow);
    const [selectedSlotId, setSelectedSlotId] = useState<string | null>(initialState.selectedSlotId);
    const [pendingEventId, setPendingEventId] = useState<string | null>(initialState.pendingEventId);

    useEffect(() => {
        saveBookingState(isBookingFlow, selectedSlotId, pendingEventId);
    }, [isBookingFlow, selectedSlotId, pendingEventId]);

    useEffect(() => {
        if (location.pathname === "/finding-matches" && !isBookingFlow) {
            navigate("/events");
        }
    }, [location.pathname, isBookingFlow, navigate]);

    const startBookingFlow = (slotId: string) => {
        setSelectedSlotId(slotId);
        setIsBookingFlow(true);
        navigate("/location");
    };

    const cancelBookingFlow = () => {
        setIsBookingFlow(false);
        setSelectedSlotId(null);
        navigate("/events");
    };

    const completePersonalityQuiz = async () => {
        if (!isBookingFlow || !selectedSlotId) {
            setIsBookingFlow(false);
            setSelectedSlotId(null);
            navigate("/events");
            return;
        }

        setPendingEventId(selectedSlotId);
        navigate("/finding-matches");
    };

    const completeProgressLoader = () => {
        const targetEventId = pendingEventId || selectedSlotId;

        if (targetEventId) {
            navigate(`/events/${targetEventId}`);
            setPendingEventId(null);
        } else {
            navigate("/events");
        }

        setTimeout(() => {
            setIsBookingFlow(false);
            setSelectedSlotId(null);
        }, 100);
    };

    const resetBookingFlow = () => {
        setIsBookingFlow(false);
        setSelectedSlotId(null);
        setPendingEventId(null);
    };

    return {
        isBookingFlow,
        selectedSlotId,
        pendingEventId,
        startBookingFlow,
        cancelBookingFlow,
        completePersonalityQuiz,
        completeProgressLoader,
        resetBookingFlow,
    };
};

