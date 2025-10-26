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
        super();
        this.initializeValue();
        if (config.storage) {
            this.initializeStorageValues();
            this.initializeStorage()
        };
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

        this.initializeStorageType();
        if (storage && this.hasStorageValue()) {

            const storedValue = this.storage.getValue(storage.name);
            if (!storedValue) return;
            const parsedValue: T = JSON.parse(storedValue);

            this.value = parsedValue;

        } else {
            this.value = this.initialState;
        }
        this.saveToStorage(this.value)

    }

    private saveToStorage(value: Partial<T>) {
        if (!this.config.storage) return;
        const partializeValue = this.partializeStorageValue(value);

        this.storage.setValue(this.config.storage.name, partializeValue);
    }

    private partializeStorageValue(value: Partial<T>) {
        if (typeof value === "object") {
            if (!this.storageValues) return;
            const valuesToSave: Record<keyof T, boolean> = Object.fromEntries(
                Object.entries(this.storageValues)
                    .filter(sv => sv[1] == true)
            ) as Record<keyof T, boolean>;

            const partializedValuesToSave: Partial<T> = {};

            for (const valueKey in valuesToSave) {
                partializedValuesToSave[valueKey] = value?.[valueKey];
            }
            return partializedValuesToSave
        };

        return value;
    }
    private initializeStorageType() {
        const { storage } = this.config;

        if (!storage) return;

        const storages: Record<SignalStorageTypes, SignalStorage | undefined> = {
            custom: storage.customStorage,
            localstorage: LocalStorageAdapter,
            sessionstorage: SessionStorageAdapter
        }

        this.storage = storages[storage.storageType] as SignalStorage;
    }

    private initializeStorage() {

        const { storage } = this.config;
        if (!storage) return;


        this.subscribe(value => {

            this.saveToStorage(value);
        })
    }

    private initializeStorageValues() {
        const { storage } = this.config;
        if (!storage) return;

        if (typeof this.value === "object" && this.value !== null) {
            const storageValues: Record<keyof T, boolean> = (storage.values ?? {}) as Record<keyof T, boolean>;
            const newStoredValues: Record<keyof T, boolean> = {} as Record<keyof T, boolean>;

            for (const valueKey in this.value) {
                newStoredValues[valueKey] = storageValues[valueKey] ?? true;
            }

            this.storageValues = newStoredValues as SignalConfigStorage<T>["values"];
        }

    }

    // private initializeStorage() {
    //     this.initializeStorageValues();
    //     const { storage } = this.config;
    //     if (!storage) return;


    //     const storages: Record<SignalStorageTypes, SignalStorage | undefined> = {
    //         custom: this.config.storage?.customStorage,
    //         localstorage: LocalStorageAdapter,
    //         sessionstorage: SessionStorageAdapter
    //     };

    //     const storageSelected = storages[storage.storageType];

    //     if (!storageSelected) {
    //         console.warn(`[Signal] Invalid or missing storage adapter for type: ${storage.storageType}`)
    //         return;
    //     }
    //     this.storage = storageSelected;

    //     this.subscribe((value) => {

    //         if ( typeof value == "object" && this.storageValues && value ) {
    //             const valuesToSave: [keyof T, boolean][] = Object.entries(this.storageValues)
    //                                         .filter(value => value[1] == true) as [keyof T, boolean][];

    //             for (const valueToSave of valuesToSave) {
    //                 this.saveToStorage(value[valueToSave[0] as keyof T] as T);
    //             }
    //         }
    //      /*    if (typeof value === "object" && this.storageValues && this.storageValues !== true) {
    //             const selectedKeys = Object.entries(this.storageValues)
    //                 .filter(([, shouldSave]) => shouldSave)
    //                 .map(([key]) => key);

    //             const filtered = Object.fromEntries(
    //                 selectedKeys.map((k) => [k, value?.[k as keyof T]])
    //             ) as Partial<T>;

    //             this.saveToStorage(filtered as T);
    //             return;
    //         }

    //         if (this.storageValues === true || typeof value !== "object") {
    //             this.saveToStorage(value as T);
    //         } */
    //     });
    // }

    // private initializeStorageValues() {
    //     const { storage } = this.config;
    //     if (!storage || !this.value) return;

    //     if ( typeof this.value != "object"  ) {
    //         this.storageValues = storage.values ? storage.values : true;
    //         return;
    //     }

    //     const storedValues: Record<keyof T, boolean> = storage.values as Record<keyof T, boolean>; 

    //     for (const key in this.value) {
    //          storedValues[key as keyof T] = storedValues[key as keyof T] ?? true;
    //     }
    //     console.log(storedValues)
    //     this.storageValues = storedValues as SignalConfigStorage<T>["values"];

    // }

};


