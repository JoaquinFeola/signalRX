export class LocalStorage {

    getItem<T>(key: string): T | null {
        const value: string | null = localStorage.getItem(key)

        if (!value) return null;

        return JSON.parse(value) as T;
    }
    setItem<T>(key: string, body: T): void {
        localStorage.setItem(key, JSON.stringify(body));
    }

    deleteItem(key: string): void {
        localStorage.removeItem(key);
    }
}

