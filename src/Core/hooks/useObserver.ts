import { useSyncExternalStore } from "react";
import { createObserver, ObserverGetDataFn } from "../utils/observer";

export function useObserver<T, R>(observer: ReturnType<typeof createObserver<T>>, getStateFn: ObserverGetDataFn<T, R>) {
    const snapshot = (): R => {
        if (getStateFn === undefined) {
            return observer.getValue() as R;
        }
        return observer.getValue(getStateFn) as R;
    };
    return useSyncExternalStore(
        (cb) => observer.subscribe(cb),
        snapshot
    );
} 