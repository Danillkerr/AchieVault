import React, { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import apiClient from "@/services/apiClient";
import { SyncContext } from "./useSyncContext";

export const SyncProvider = ({ children }: { children: React.ReactNode }) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const queryClient = useQueryClient();

  const isSyncingRef = useRef(false);

  const syncMutation = useMutation({
    mutationFn: async () => {
      const res = await apiClient.post<{ status: string }>(`/sync/`);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.status === "queued") {
        const toastId = toast.loading("Updating data from Steam...");

        setTimeout(() => {
          isSyncingRef.current = false;
          toast.success("Data updated!", { id: toastId });

          setRefreshKey((prev) => prev + 1);
          queryClient.invalidateQueries({ queryKey: ["profile"] });
          queryClient.invalidateQueries({ queryKey: ["achievements"] });
          queryClient.invalidateQueries({ queryKey: ["library"] });
        }, 5000);
      } else {
        isSyncingRef.current = false;
      }
    },
    onError: (error) => {
      console.error("Sync error", error);
      isSyncingRef.current = false;
      toast.error("Sync failed");
    },
  });

  const triggerSync = async () => {
    if (isSyncingRef.current) return;
    isSyncingRef.current = true;
    syncMutation.mutate();
  };

  return (
    <SyncContext.Provider
      value={{
        triggerSync,
        refreshKey,
        isSyncing: syncMutation.isPending || isSyncingRef.current,
      }}
    >
      {children}
    </SyncContext.Provider>
  );
};
