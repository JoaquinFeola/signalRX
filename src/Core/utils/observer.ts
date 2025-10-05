import { LocalStorage } from "./localstorage";

type ObserverSubscribeFn<T> = (value: T) => void;
type ObserverSetDataFn<T> = (prev: Readonly<T>) => T;
export type ObserverGetDataFn<T, R> = (prev: Readonly<T>) => R;

interface IObserver<T> {
    subscribe(cb: ObserverSubscribeFn<T>): void;
    setData(e: T | ObserverSetDataFn<T>): void
    getValue(): Readonly<T>;
    getValue<K extends keyof T>(field: K): T[K];
    getValue<R>(cb: (prev: Readonly<T>) => R): R;
}

abstract class Observer<T> implements IObserver<T> {


    protected subs = new Set<ObserverSubscribeFn<T>>();
    protected data?: T;

    subscribe(cb: ObserverSubscribeFn<T>): () => void {
        this.subs.add(cb);
        if (this.data) {
            cb(this.data);
        }
        return () => this.subs.delete(cb);
    };

    protected notify(data: T): void {

        this.subs.forEach(cb => cb(data));
    }

    setData(event: T | ObserverSetDataFn<T>): void {
        if (event instanceof Function) {
            this.setDataCb(event as ObserverSetDataFn<T>)
        } else {
            this.data = event;
            this.notify(event);
        }
    }



    private setDataCb(cb: ObserverSetDataFn<T>): void {
        const oldState: T | undefined = this.data;
        if (!oldState) return;
        const newValues = cb(oldState);

        this.data = newValues;
        this.notify(newValues);
    }

    getValue(): Readonly<T>;
    getValue<K extends keyof T>(field: K): T[K];
    getValue<R>(cb: (prev: Readonly<T>) => R): R;
    getValue(arg?: any): any {
        if (typeof arg === "function") {
            const cb = arg as (prev: Readonly<T>) => any;

            if (!this.data) return cb(undefined as T);
            return cb(this.data);
        }

        if (arg !== undefined) {
            if (!this.data || this.data === null) throw new Error("No data available");
            return (this.data as T)[arg as keyof T];
        }

        if (!this.data) throw new Error("No data available");
        return this.data;
    }


}

export function createObserver<T>(value: T, persist: boolean = false) {
    class Observable extends Observer<T> {

        private readonly storageKey: Readonly<string> = "Store";
        constructor() {
            super();

            if (persist) {
                this.persistable()
            } else {
                this.setData(value);
            }
        }
        private persistable() {
            const ls = new LocalStorage();
            const dataFromLs = ls.getItem<T>(this.storageKey);

            if (!dataFromLs) {
                this.setData(value);
            } else {
                this.setData(dataFromLs);
            }

            this.subscribe(data => {
                ls.setItem(this.storageKey, data)
            })

        }
    }
    const observable = new Observable();

    return observable;
}