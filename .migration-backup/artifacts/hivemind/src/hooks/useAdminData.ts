import { useContext } from "react";
import { AdminDataContext } from "@/context/AdminDataContext";

export function useAdminData() {
  const context = useContext(AdminDataContext);
  if (context === undefined) {
    throw new Error("useAdminData must be used within an AdminDataProvider");
  }
  return context;
}
