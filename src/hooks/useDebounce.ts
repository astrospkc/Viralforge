import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 500) {
    const [debouncedValue, setDebouncedValue] = useState(value)
    useEffect(() => {
        const time = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)
        return () => clearTimeout(time)
    }, [value, delay])
    return debouncedValue
}