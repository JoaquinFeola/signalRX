import { SignalStorage } from "../Interfaces/SignalStorage.interface";

export const LocalStorageAdapter: SignalStorage = {
    deleteValue: key => localStorage.removeItem(key),
    getValue: key => localStorage.getItem(key),
    setValue: (key, value) => localStorage.setItem(key, JSON.stringify(value))
}