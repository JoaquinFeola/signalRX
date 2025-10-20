
export type ObserverSubscribeFunction<T> = (value: T) => void;
export type ObserverUnsubscribeFunction = () => void;

export type ObserverSetDataFunction<T> = (e: Readonly<T>) => T;
export type ObserverGetValueCallback<T, R> = (prev: Readonly<T>) => R;

export interface IObserver<T> {
    subscribe(cb: ObserverSubscribeFunction<T>): ObserverUnsubscribeFunction;

    setValue(callback: ObserverSetDataFunction<T>): void;
    setValue(newState: T): void;

    getValue(): Readonly<T>;
    getValue<R>(callback: ObserverGetValueCallback<T, R>): R;

    clearSubscriptions(): void;
}


