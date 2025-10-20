import { SignalConfigStorage } from "../SignalConfigStorage.interface";

export type SignalSubscribeFunction<T> = (value: T) => void;
export type SignalSetDataFunction<T> = (e: Readonly<T>) => T;
export type SignalGetValueCallback<T, R> = (prev: Readonly<T>) => R;

export interface ISignal<T> {
    subscribe(callback: SignalSubscribeFunction<T>): () => void;
    resetValue(): void;
}

export interface SignalConfig<T> {
    storage?: SignalConfigStorage<T>;
}


