import { ISignal, SignalSubscribeFunction, SignalConfig, } from '../Interfaces/Classes/ISignal';
import { SignalConfigStorage, SignalStorageTypes } from '../Interfaces/SignalConfigStorage.interface';
import { SignalStorage } from '../Interfaces/SignalStorage.interface';
import { LocalStorageAdapter } from '../StorageAdapters/LocalStorage.adapter';
import { SessionStorageAdapter } from '../StorageAdapters/SessionStorage.adapter';
import { Observer } from './Observer.class';

export class Signal<T> extends Observer<T> implements ISignal<T> {
    protected subs = new Set<SignalSubscribeFunction<T>>();

    private storage: SignalStorage = LocalStorageAdapter;
    private storageValues: SignalConfigStorage<T>["values"];

    constructor(
        private initialState: T,
        private config: SignalConfig<T> = {} as SignalConfig<T>
    ) {
        super()

        this.initializeValue();
        if (config.storage) this.initializeStorage();
    };


    public resetValue() {
        this.setValue(this.initialState);
    }

    protected hasStorageValue(): boolean {
        if (!this.config.storage) return false;

        const storageValue = this.storage.getValue(this.config.storage.name);
        if (!storageValue || storageValue.toLowerCase() == "undefined") return false;

        return true;
    };

    private initializeValue() {
        const { storage } = this.config;

        if (storage && this.hasStorageValue()) {
            const stored = this.storage.getValue(storage.name);
            if (stored) {
                this.value = JSON.parse(stored);
                return;
            }
        }
        this.value = this.initialState;
        if (storage) { this.saveToStorage(this.value); }
    }

    private saveToStorage(value: T) {
        if (this.config.storage) {
            this.storage.setValue(this.config.storage.name, value);
        }
    }


    private initializeStorage() {
        this.initializeStorageValues();
        const storages: Record<SignalStorageTypes, SignalStorage> = {
            custom: this.config.storage?.customStorage as SignalStorage,
            localstorage: LocalStorageAdapter,
            sessionstorage: SessionStorageAdapter
        };

        if ( this.config.storage ) this.storage = storages[this.config.storage?.storageType]

        this.subscribe((value) => {
            if (typeof value == "object" && this.storageValues) {
                const toSave = Object.fromEntries(
                    Object.entries(this.storageValues).filter(([, v]) => v == true)
                );

                const newSaveValue: Partial<T> = {};

                Object.keys(toSave).map(k => {
                    return newSaveValue[k as keyof T] = value?.[k as keyof T]
                });

                this.saveToStorage(newSaveValue as T)
            } else {
                this.saveToStorage(value);
            }
            if (this.storageValues == true) {
                this.saveToStorage(value as T);
            }
        });
    }


    private initializeStorageValues() {
        if (!this.value || !this.config.storage?.values) return;
        if (typeof this.value !== "object") {
            this.storageValues = this.config.storage.values;
            return;
        };

        const storedValues = this.config.storage.values;

        const falseMap = Object.fromEntries(
            Object.entries(storedValues).filter(([, value]) => value === false)
        ) as Partial<Record<keyof T, boolean>>;

        const computedValues = Object.fromEntries(
            Object.keys(this.value).map(key => [
                key,
                falseMap[key as keyof T] ?? true,
            ])
        ) as Record<keyof T, boolean>;

        this.storageValues = computedValues as SignalConfigStorage<T>["values"];

    }
};


