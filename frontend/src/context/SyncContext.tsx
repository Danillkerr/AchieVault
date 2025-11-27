import React, { useState, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import apiClient from "../services/apiClient";
import { SyncContext } from "./useSyncContext";

export const SyncProvider = ({ children }: { children: React.ReactNode }) => {
  const [isSyncing, setIsSyncingState] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const isSyncingRef = useRef(false);

  const triggerSync = useCallback(async () => {
    if (isSyncingRef.current) return;

    isSyncingRef.current = true;
    setIsSyncingState(true);

    try {
      const res = await apiClient.post<{ status: string }>(`/sync/`);

      if (res.data.status === "queued") {
        const toastId = toast.loading("Updating data from Steam...");

        setTimeout(() => {
          isSyncingRef.current = false;
          setIsSyncingState(false);
          toast.success("Data updated!", { id: toastId });
          setRefreshKey((prev) => prev + 1);
        }, 5000);
      } else {
        isSyncingRef.current = false;
        setIsSyncingState(false);
      }
    } catch (error) {
      console.error("Sync error", error);
      isSyncingRef.current = false;
      setIsSyncingState(false);
    }
  }, []);

  return (
    <SyncContext.Provider value={{ triggerSync, refreshKey, isSyncing }}>
      {children}
    </SyncContext.Provider>
  );
};
