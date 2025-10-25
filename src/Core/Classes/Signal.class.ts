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
        if (config.storage) this.initializeStorage();
        this.initializeValue();
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
            try {
                if (stored) {
                    this.value = JSON.parse(stored);
                    return;
                }
            } catch {
                console.warn(`[Signal] Invalid JSON in storage: ${storage.name}`);
            }
        }

        this.value = this.initialState;
        if (storage) this.saveToStorage(this.value);
    }

    private saveToStorage(value: T) {
        if (!this.config.storage) return;

        this.storage.setValue(this.config.storage.name, value);
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

            if ( typeof value == "object" && this.storageValues && value ) {
                const valuesToSave: [keyof T, boolean][] = Object.entries(this.storageValues)
                                            .filter(value => value[1] == true) as [keyof T, boolean][];

                for (const valueToSave of valuesToSave) {
                    this.saveToStorage(value[valueToSave[0] as keyof T] as T);
                }
            }
         /*    if (typeof value === "object" && this.storageValues && this.storageValues !== true) {
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
            } */
        });
    }

    private initializeStorageValues() {
        const { storage } = this.config;
        if (!storage || !this.value) return;
        
        if ( typeof this.value != "object"  ) {
            this.storageValues = storage.values ? storage.values : true;
            return;
        }
        
        const storedValues: Record<keyof T, boolean> = storage.values as Record<keyof T, boolean>; 
        // const computedValues: Record<keyof T, boolean>;

        for (const key in this.value) {
            if ( storedValues[key as keyof T] == undefined ) storedValues[key as keyof T] = true;
        }
        console.log(storedValues)
        this.storageValues = storedValues as SignalConfigStorage<T>["values"];

    }
    /* private initializeStorageValues() {
        const { storage } = this.config;
        if (!storage) return;

        if (!this.value || typeof this.value !== "object") {
            // Storage para tipos primitivos o si no hay objeto
            this.storageValues = storage.values ?? true;
            return;
        }

        const storedValues: SignalConfigStorage<T>["values"];  = storage.values ?? {} as SignalConfigStorage<T>["values"];;
        const computedValues: Record<keyof T, boolean> = {} as any;

        Object.keys(this.value).forEach((key) => {
            computedValues[key as keyof T] = storedValues[key as keyof T]  as SignalConfigStorage<T>["values"] ?? true;
        });

        this.storageValues = computedValues as SignalConfigStorage<T>["values"];
    } */
};


