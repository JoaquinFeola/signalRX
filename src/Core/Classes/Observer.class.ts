import { IObserver, ObserverGetValueCallback, ObserverSetDataFunction, ObserverSubscribeFunction, ObserverUnsubscribeFunction } from "../Interfaces/Classes/IObserver";

export abstract class Observer<T> implements IObserver<T> {

    protected subs: Set<ObserverSubscribeFunction<T>> = new Set();
    protected value?: T;

    subscribe(cb: ObserverSubscribeFunction<T>): ObserverUnsubscribeFunction {
        this.subs.add(cb);

        if (this.value) {
            cb(this.value)
        };

        return () => this.subs.delete(cb);
    }

    setValue(callback: ObserverSetDataFunction<T>): void;
    setValue(newState: T): void;
    setValue(newState: T | ObserverSetDataFunction<T>): void {
        if (newState instanceof Function) {
            const callback = newState as ObserverSetDataFunction<T>;
            this.setValueCb(callback);

            return;
        };

        this.value = newState;
        this.notify(newState);
    }

    private setValueCb(cb: ObserverSetDataFunction<T>): void {
        const oldState: T | undefined = this.value;
        if (!oldState) return;
        const newValue = cb(oldState);
        this.value = newValue;
        this.notify(newValue);
    }


    getValue(): Readonly<T>;
    getValue<R>(callback: ObserverGetValueCallback<T, R>): R;
    getValue<R>(callback?: ObserverGetValueCallback<T, R>): Readonly<T> | R {
        if (!this.value) throw new Error("Cannot get value from undefined");

        return callback ? callback(this.value) : this.value as Readonly<T>;
    }

    private notify(value: T): void {
        this.subs.forEach(cb => cb(value));
    }

    clearSubscriptions(): void {
        this.subs.clear();
    }

}