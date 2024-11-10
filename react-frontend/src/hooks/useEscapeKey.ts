// src/hooks/useEscapeKey.ts
import { useEffect } from 'react';

/**
 * Custom hook that triggers a callback function when the Escape key is pressed.
 *
 * @param onEscape - The callback function to be executed when the Escape key is pressed.
 */
export const useEscapeKey = (onEscape: () => void) => {
    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onEscape();
            }
        };

        document.addEventListener('keydown', handleEscapeKey);

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [onEscape]);
};