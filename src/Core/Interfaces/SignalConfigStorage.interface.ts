import { SignalStorage } from "./SignalStorage.interface";

export type SignalStorageTypes = "localstorage" | "sessionstorage" | "custom";

interface BaseSignalConfigStorage<T> {
    name: string;
    values?: T extends string | number
    ? boolean
    : Partial<Record<keyof T, boolean>>;
    storageType: SignalStorageTypes;
}

interface CustomSignalConfigStorage<T> extends BaseSignalConfigStorage<T> {
    storageType: "custom";
    customStorage: SignalStorage;
}

interface BuiltinSignalConfigStorage<T> extends BaseSignalConfigStorage<T> {
    storageType: Exclude<SignalStorageTypes, "custom">;
    customStorage?: never;
}

export type SignalConfigStorage<T> = CustomSignalConfigStorage<T> | BuiltinSignalConfigStorage<T>;
