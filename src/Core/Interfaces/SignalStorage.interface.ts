export interface SignalStorage {
    getValue(key: string): string | null;
    setValue<T>(key: string, value: T): void;
    deleteValue(key: string): void;
};
