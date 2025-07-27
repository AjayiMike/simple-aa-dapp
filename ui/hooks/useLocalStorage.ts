import { useCallback, useEffect, useSyncExternalStore } from "react";

const namespace = "simple-aa-dapp-v1";

function dispatchStorageEvent(
    key: string,
    newValue: string | null | undefined
) {
    window.dispatchEvent(new StorageEvent("storage", { key, newValue }));
}
const setLocalStorageItem = (key: string, value: unknown) => {
    const stringifiedValue = JSON.stringify(value);
    window.localStorage.setItem(key, stringifiedValue);
    dispatchStorageEvent(key, stringifiedValue);
};

const removeLocalStorageItem = (key: string) => {
    window.localStorage.removeItem(key);
    dispatchStorageEvent(key, null);
};

const useLocalStorageSubscribe = (callback: (event: StorageEvent) => void) => {
    window.addEventListener("storage", callback);
    return () => window.removeEventListener("storage", callback);
};

const getLocalStorageServerSnapshot = () => {
    console.log("useLocalStorage is a client-only hook");
    return null;
};

export function useLocalStorage(_key: string, initialValue: unknown) {
    const key = `${namespace}-${_key}`;
    const getSnapshot = () => window.localStorage.getItem(key);

    const store = useSyncExternalStore(
        useLocalStorageSubscribe,
        getSnapshot,
        getLocalStorageServerSnapshot
    );

    const setState = useCallback(
        (v: unknown) => {
            try {
                const nextState =
                    typeof v === "function" ? v(JSON.parse(store ?? "{}")) : v;

                if (nextState === undefined || nextState === null) {
                    removeLocalStorageItem(key);
                } else {
                    setLocalStorageItem(key, nextState);
                }
            } catch (e) {
                console.warn(e);
            }
        },
        [key, store]
    );

    useEffect(() => {
        if (
            window.localStorage.getItem(key) === null &&
            typeof initialValue !== "undefined"
        ) {
            setLocalStorageItem(key, initialValue);
        }
    }, [key, initialValue]);

    return [store ? JSON.parse(store) : initialValue, setState];
}
