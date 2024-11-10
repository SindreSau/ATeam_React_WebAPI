// src/hooks/usePersistedState.ts
import { useState, useEffect } from 'react';

function usePersistedState<T>(
    key: string,
    defaultValue: T,
    storage = localStorage
): [T, (value: T) => void] {
    // First check URL, then storage, then default
    const [value, setValue] = useState<T>(defaultValue);

    // Load initial value from storage
    useEffect(() => {
        const storedValue = storage.getItem(key);
        if (storedValue !== null) {
            setValue(JSON.parse(storedValue));
        }
    }, [key, storage]);

    // Update storage when value changes
    useEffect(() => {
        storage.setItem(key, JSON.stringify(value));
    }, [key, value, storage]);

    return [value, setValue];
}

export default usePersistedState;