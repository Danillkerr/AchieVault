import { createContext, useContext } from "react";

export interface SyncContextType {
  triggerSync: (userId: string) => Promise<void>;
  refreshKey: number;
  isSyncing: boolean;
}
export const SyncContext = createContext<SyncContextType | null>(null);

export const useSync = () => {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error("useSync must be used within a SyncProvider");
  }
  return context;
};
