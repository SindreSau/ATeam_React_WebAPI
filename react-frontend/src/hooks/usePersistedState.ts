import { useState, useEffect, useCallback } from 'react';

function usePersistedState<T>(
    key: string,
    defaultValue: T,
    urlValue: T | null,
    storage = localStorage
): [T, (value: T) => void] {
    // Initialize state with URL value if present, then storage value, then default
    const [value, setValue] = useState<T>(() => {
        if (urlValue !== null) {
            return urlValue;
        }

        const storedValue = storage.getItem(key);
        if (storedValue !== null) {
            try {
                return JSON.parse(storedValue);
            } catch {
                return defaultValue;
            }
        }

        return defaultValue;
    });

    // Memoized setter that updates both state and storage
    const setPersistedValue = useCallback((newValue: T) => {
        setValue(newValue);
        storage.setItem(key, JSON.stringify(newValue));
    }, [key, storage]);

    // Effect to handle URL value changes
    useEffect(() => {
        if (urlValue !== null && urlValue !== value) {
            setPersistedValue(urlValue);
        }
    }, [urlValue, value, setPersistedValue]);

    return [value, setPersistedValue];
}

export default usePersistedState;