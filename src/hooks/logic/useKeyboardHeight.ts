import { useState, useEffect } from 'react';

export const useKeyboardHeight = () => {
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    useEffect(() => {
        if (typeof window === 'undefined' || !window.visualViewport) {
            return;
        }

        const visualViewport = window.visualViewport;
        const windowHeight = window.innerHeight;

        const updateKeyboardHeight = () => {
            const currentHeight = visualViewport.height;
            const heightDiff = windowHeight - currentHeight;

            if (heightDiff > 150) {
                setKeyboardHeight(heightDiff);
            } else {
                setKeyboardHeight(0);
            }
        };

        visualViewport.addEventListener('resize', updateKeyboardHeight);
        visualViewport.addEventListener('scroll', updateKeyboardHeight);
        updateKeyboardHeight();

        return () => {
            visualViewport.removeEventListener('resize', updateKeyboardHeight);
            visualViewport.removeEventListener('scroll', updateKeyboardHeight);
        };
    }, []);

    return keyboardHeight;
};

