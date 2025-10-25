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
        const { storage } = this.config;
        if (!storage) return;


        const storages: Record<SignalStorageTypes, SignalStorage | undefined> = {
            custom: this.config.storage?.customStorage,
            localstorage: LocalStorageAdapter,
            sessionstorage: SessionStorageAdapter
        };

        const storageSelected = storages[storage.storageType];

        if (!storageSelected) {
            console.warn(`[Signal] Invalid or missing storage adapter for type: ${storage.storageType}`)
            return;
        }
        this.storage = storageSelected;

        this.subscribe((value) => {

            if (typeof value === "object" && this.storageValues && this.storageValues !== true) {
                const selectedKeys = Object.entries(this.storageValues)
                    .filter(([, shouldSave]) => shouldSave)
                    .map(([key]) => key);

                const filtered = Object.fromEntries(
                    selectedKeys.map((k) => [k, value?.[k as keyof T]])
                ) as Partial<T>;

                this.saveToStorage(filtered as T);
                return;
            }

            if (this.storageValues === true || typeof value !== "object") {
                this.saveToStorage(value as T);
            }
        });
    }


    private initializeStorageValues() {
        const { storage } = this.config;
        if (!storage) return;

        if (!this.value || typeof this.value !== "object") {
            (storage.values)
                ? this.storageValues = storage.values
                : this.storageValues = true
            this.storageValues = storage.values;
            return;
        }


        const storedValues = storage.values ?? {};
        const falseMap = Object.fromEntries(
            Object.entries(storedValues).filter(([, value]) => value === false)
        ) as Partial<Record<keyof T, boolean>>;

        const computedValues = Object.fromEntries(
            Object.keys(this.value).map((key) => [
                key,
                falseMap[key as keyof T] ?? true,
            ])
        ) as Record<keyof T, boolean>;

        this.storageValues = computedValues as SignalConfigStorage<T>["values"];
    }
};


