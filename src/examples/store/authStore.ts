import { Signal } from "@/Core/Classes/Signal.class";

interface AuthSignalState {
  token: string | null;
  isAuthenticated: boolean;
}

export const authSignal = new Signal<string>("aaaa", {
  storage: {
    name: "auth-store",
    storageType: "localstorage",
    values: true
  }
});

