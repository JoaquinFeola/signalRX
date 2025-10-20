import { SignalStorage } from "../Interfaces/SignalStorage.interface";

export const SessionStorageAdapter: SignalStorage = {
    deleteValue: key => sessionStorage.removeItem(key),
    getValue: key => sessionStorage.getItem(key),
    setValue: (key, value) => sessionStorage.setItem(key, JSON.stringify(value))
}