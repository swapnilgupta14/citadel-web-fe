import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const useBookingFlow = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [isBookingFlow, setIsBookingFlow] = useState(false);
    const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
    const [pendingEventId, setPendingEventId] = useState<string | null>(null);

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

