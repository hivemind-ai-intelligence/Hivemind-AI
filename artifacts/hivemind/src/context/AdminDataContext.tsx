import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AdminData {
  hero: {
    headline: string;
    subheadline: string;
    tagline: string;
  };
  owner: {
    name: string;
    title: string;
    bio: string;
  };
  pricing: {
    starter: number;
    professional: number;
    business: number;
  };
  contact: {
    email: string;
    discord: string;
    whatsapp: string;
  };
}

const defaultData: AdminData = {
  hero: {
    headline: "Building The Future Between Humans And AI",
    subheadline: "HiveMind creates websites, AI systems, automation tools and digital infrastructure for the next generation of creators and businesses.",
    tagline: "Humans. AI. One Mind."
  },
  owner: {
    name: "Alex Carter",
    title: "Founder and CEO, HiveMind",
    bio: "Building the bridge between humans and artificial intelligence. 5+ years crafting digital experiences for the next generation of creators and businesses."
  },
  pricing: {
    starter: 49,
    professional: 149,
    business: 349
  },
  contact: {
    email: "hello@hivemind.ai",
    discord: "HiveMind#0001",
    whatsapp: "+1-555-HIVEMIND"
  }
};

interface AdminContextType {
  data: AdminData;
  updateData: (newData: Partial<AdminData>) => void;
}

const AdminDataContext = createContext<AdminContextType | undefined>(undefined);

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AdminData>(() => {
    const saved = localStorage.getItem("hivemind_admin_data");
    return saved ? { ...defaultData, ...JSON.parse(saved) } : defaultData;
  });

  useEffect(() => {
    localStorage.setItem("hivemind_admin_data", JSON.stringify(data));
  }, [data]);

  const updateData = (newData: Partial<AdminData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  return (
    <AdminDataContext.Provider value={{ data, updateData }}>
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData() {
  const context = useContext(AdminDataContext);
  if (context === undefined) {
    throw new Error("useAdminData must be used within an AdminDataProvider");
  }
  return context;
}
