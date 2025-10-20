
# 💡 SignalJS

**SignalJS** is a lightweight and highly optimized library for managing **signals** as global reactive stores in a simple, efficient, and intuitive way.

---

## 🚀 Installation

```bash
npm install signaljs
# or
yarn add signaljs
```

---

## 🧩 Example Usage

### 🧱 Create a Signal Store

```typescript
import { Signal } from "signalJS";

interface AuthSignalState {
  isAuthenticated: boolean;
  token: string | null;
}

export const authSignalStore: Signal<AuthSignalState> = new Signal<AuthSignalState>({
  isAuthenticated: false,
  token: null,
} /* Initial State */);
```

---

### 📥 Get Data

```typescript
import { Signal } from "signalJS";

interface AuthSignalState {
  isAuthenticated: boolean;
  token: string | null;
}

export const authSignalStore: Signal<AuthSignalState> = new Signal<AuthSignalState>({
  isAuthenticated: false,
  token: null,
});

/* Get the full store state */
const signalData = authSignalStore.getValue();

/* Get a partial value */
const token = authSignalStore.getValue(value => value.token);

/* Map to a custom object */
const newData = authSignalStore.getValue(value => ({
  valueToken: value.token,
  authenticated: value.isAuthenticated,
}));
```

---

### ⚙️ Update Data

```typescript
import { Signal } from "signalJS";

interface AuthSignalState {
  isAuthenticated: boolean;
  token: string | null;
}

const authSignalStore: Signal<AuthSignalState> = new Signal<AuthSignalState>({
  isAuthenticated: false,
  token: null,
});

/* Method 1: Update partially using a callback */
authSignalStore.setData(prev => ({ ...prev, token: "token example" }));

/* Method 2: Replace the entire store */
authSignalStore.setData({ isAuthenticated: true, token: "token example" });
```

---

### 📡 Subscribe to the Signal

```typescript
import { Signal } from "signalJS";

interface AuthSignalState {
  isAuthenticated: boolean;
  token: string | null;
}

const authSignalStore: Signal<AuthSignalState> = new Signal<AuthSignalState>({
  isAuthenticated: false,
  token: null,
});

/* Subscribe to changes */
const unsubscribe = authSignalStore.subscribe(value => {
  console.log(value); // { isAuthenticated: false, token: null }
});
```

> The `subscribe` callback is automatically triggered whenever the signal value is updated through `signal.setData()`.

---

### 🧽 Clear All Subscriptions

```typescript
import { Signal } from "signalJS";

interface AuthSignalState {
  isAuthenticated: boolean;
  token: string | null;
}

const authSignalStore: Signal<AuthSignalState> = new Signal<AuthSignalState>({
  isAuthenticated: false,
  token: null,
});

/* Clear all active subscriptions */
authSignalStore.clearSubscriptions();
```

---

## ⚙️ Signal Configuration

### 💾 Built-in Storage Configuration

```typescript
import { Signal } from "signalJS";

interface AuthSignalState {
  isAuthenticated: boolean;
  token: string | null;
}

const authSignalStore: Signal<AuthSignalState> = new Signal<AuthSignalState>(
  {
    isAuthenticated: false,
    token: null,
  },
  {
    storage: {
      name: "<your-storage-key>",
      storageType: "localstorage" | "sessionstorage" | "custom",
      values: {
        token: true,           // Save this property to storage
        isAuthenticated: false // Do not save this property
      },
    },
  } /* Signal config */
);
```

---

### 💾 Custom Storage Configuration

```typescript
import { Signal } from "signalJS";

interface AuthSignalState {
  isAuthenticated: boolean;
  token: string | null;
}

const authSignalStore: Signal<AuthSignalState> = new Signal<AuthSignalState>(
  {
    isAuthenticated: false,
    token: null,
  },
  {
    storage: {
      name: "<your-storage-key>",
      storageType: "custom",
      customStorage: {
        getValue() {
          // Your custom implementation
        },
        setValue() {
          // Your custom implementation
        },
        deleteValue() {
          // Your custom implementation
        },
      },
    },
  } /* Signal config */
);

/* You can use the `CustomSignalConfigStorage<T>` interface to type your custom storage */
```

---

## ✅ Summary

* `getValue()` → Retrieve the full or partial signal state.
* `setData()` → Update or replace the current signal data.
* `subscribe()` → Listen to signal changes in real-time.
* `clearSubscriptions()` → Remove all active signal subscriptions.
* `storage` → Persist specific values using localStorage, sessionStorage, or a custom storage engine.

---

## 💡 Key Features

* ⚡ **Reactive** — Signals update all subscribers automatically.
* 💾 **Persistent** — Store values in browser storage easily.
* 🧠 **Type-safe** — Fully typed with TypeScript generics.
* 🧩 **Modular** — Works seamlessly in any frontend or backend environment.
* 🪶 **Lightweight** — Zero dependencies, minimal footprint.

---

## Contributing

If you want to contribute, please **fork this repository** and create a **pull request**.
Direct pushes to `main` are not allowed.

## 📜 License

MIT © 2025 — Created with ❤️ by [Joaquin Feola](https://github.com/JoaquinFeola)

---


