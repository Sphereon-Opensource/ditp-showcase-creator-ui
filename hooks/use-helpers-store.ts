import { create } from "zustand";
import { persist } from "zustand/middleware";


// this is a temporaty store for the helpers
// issuer id and cred definition will be part of the credentials
// this store will be removed when the credentials are part of the showcase
interface HelpersStore {
  selectedCredentialDefinitionIds: string[];
  issuerId: string;

  setSelectedCredentialDefinitionIds: (ids: string[]) => void;

  setIssuerId: (issuerId: string) => void;
  
  reset: () => void;
}

const initialState = {
  issuerId: "",
  selectedCredentialDefinitionIds: [] as string[],
};

export const useHelpersStore = create<HelpersStore>()(
  persist(
    (set) => ({
      ...initialState,
    
      setSelectedCredentialDefinitionIds: (selectedCredentialDefinitionIds) => set({ selectedCredentialDefinitionIds }),

      setIssuerId: (issuerId: string) => set({ issuerId }),

      reset: () => set(initialState),
    }),
    {
      name: 'helpers-store',
    }
  )
);