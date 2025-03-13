// DATA to the server

// {
//   "name": "example_name",
//   "description": "example_description",
//   "status": "ACTIVE",
//   "hidden": false,
//   "scenarios": ["{{issuanceScenarioId}}", "{{presentationScenarioId}}"],
//   "credentialDefinitions": ["{{credentialDefinitionId}}"],

// DATA for the UI
// {
//   "name": "example_name",
//   "description": "example_description",
//   "status": "ACTIVE",
//   "hidden": false,
//   "scenarios": [{
//     "name": "example_name",
//     "description": "example_description",
//     "image": "example_image",
//     "credentials": ["{{credentialDefinitionId}}"]
//   }, {
//     "name": "example_name",
//     "description": "example_description",
//     "image": "example_image",
//     "credentials": ["{{credentialDefinitionId}}"]
//   }]
// }

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ShowcaseRequestType, PersonaRequestType } from "@/openapi-types";

interface ShowcaseStore {
  showcase: ShowcaseRequestType;  
  displayShowcase: any;
  currentStep: 'info' | 'personas' | 'scenarios' | 'review';
  
  // Selection states
  selectedPersonaIds: string[];
  selectedCredentialDefinitionIds: string[];
  
  // Basic setters
  setShowcaseName: (name: string) => void;
  setShowcaseDescription: (description: string) => void;
  setPersonaIds: (personaIds: string[]) => void;
  setDisplayPersonas: (personas: PersonaRequestType[]) => void;
  setScenarioIds: (scenarioIds: string[]) => void;
  
  // Persona selection functions
  setSelectedPersonaIds: (ids: string[]) => void;
  toggleSelectedPersona: (personaId: string) => void;
  clearSelectedPersonas: () => void;
  
  // Credential definition functions
  setCredentialDefinitionIds: (ids: string[]) => void;
  setDisplayCredentialDefinitions: (definitions: any[]) => void;
  setSelectedCredentialDefinitionIds: (ids: string[]) => void;
  toggleSelectedCredentialDefinition: (definitionId: string) => void;
  clearSelectedCredentialDefinitions: () => void;
  
  // Navigation
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  setStep: (step: 'info' | 'personas' | 'scenarios' | 'review') => void;

  reset: () => void;
}

const initialState = {
  showcase: {
    name: "",
    description: "",
    status: "ACTIVE",
    hidden: false,
    scenarios: [],
    credentialDefinitions: [],
    personas: [],
  } as ShowcaseRequestType,
  displayShowcase: {
    name: "",
    description: "",
    status: "ACTIVE",
    hidden: false,
    scenarios: [],
    credentialDefinitions: [{
      "id": "86a96d6d-91c9-4357-984d-1f6b162fdfae",
      "name": "example_name",
      "credentialSchema": {
          "id": "fef1a6de-886b-4c2f-bbfe-4d1c68511c0d",
          "name": "example_name",
          "version": "example_version",
          "identifierType": "DID",
          "identifier": "did:sov:XUeUZauFLeBNofY3NhaZCB",
          "source": "CREATED",
          "attributes": [
              {
                  "id": "4cc8199e-a50b-4bb9-9c38-592e30606a05",
                  "name": "example_attribute_name1",
                  "value": "example_attribute_value1",
                  "type": "STRING",
                  "createdAt": "2025-03-13T09:47:37.632Z",
                  "updatedAt": "2025-03-13T09:47:37.632Z"
              }
          ],
          "createdAt": "2025-03-13T09:47:37.632Z",
          "updatedAt": "2025-03-13T09:47:37.632Z"
      },
      "identifierType": "DID",
      "identifier": "did:sov:XUeUZauFLeBNofY3NhaZCB",
      "version": "example_version",
      "type": "ANONCRED",
      "representations": [],
      "createdAt": "2025-03-13T09:49:24.713Z",
      "updatedAt": "2025-03-13T09:49:24.713Z"
    }],
    personas: [],
  },
  currentStep: 'info' as const,
  selectedPersonaIds: [] as string[],
  selectedCredentialDefinitionIds: ["86a96d6d-91c9-4357-984d-1f6b162fdfae"] as string[],
};

export const useShowcaseStore = create<ShowcaseStore>()(
  persist(
    (set) => ({
      ...initialState,
      
      setShowcaseName: (name) => set((state) => ({
        showcase: { ...state.showcase, name },
        displayShowcase: { ...state.displayShowcase, name }
      })),
      
      setShowcaseDescription: (description) => set((state) => ({
        showcase: { ...state.showcase, description },
        displayShowcase: { ...state.displayShowcase, description }
      })),
      
      setPersonaIds: (personaIds) => set((state) => ({
        showcase: { ...state.showcase, personas: personaIds }
      })),

      setDisplayPersonas: (personas) => set((state) => ({
        displayShowcase: { ...state.displayShowcase, personas }
      })),
      
      setScenarioIds: (scenarioIds) => set((state) => ({
        showcase: { ...state.showcase, scenarios: scenarioIds }
      })),
      
      // Persona selection functions
      setSelectedPersonaIds: (ids) => set({ selectedPersonaIds: ids }),
      
      toggleSelectedPersona: (personaId) => set((state) => {
        const newSelectedIds = state.selectedPersonaIds.includes(personaId)
          ? state.selectedPersonaIds.filter(id => id !== personaId)
          : [...state.selectedPersonaIds, personaId];
        
        return { selectedPersonaIds: newSelectedIds };
      }),
      
      clearSelectedPersonas: () => set({ selectedPersonaIds: [] }),
      
      // Credential definition functions
      setCredentialDefinitionIds: (ids) => set((state) => ({
        showcase: { ...state.showcase, credentialDefinitions: ids }
      })),
      
      setDisplayCredentialDefinitions: (definitions) => set((state) => ({
        displayShowcase: { ...state.displayShowcase, credentialDefinitions: definitions }
      })),
      
      setSelectedCredentialDefinitionIds: (ids) => set({ selectedCredentialDefinitionIds: ids }),
      
      toggleSelectedCredentialDefinition: (definitionId) => set((state) => {
        const newSelectedIds = state.selectedCredentialDefinitionIds.includes(definitionId)
          ? state.selectedCredentialDefinitionIds.filter(id => id !== definitionId)
          : [...state.selectedCredentialDefinitionIds, definitionId];
        
        return { selectedCredentialDefinitionIds: newSelectedIds };
      }),
      
      clearSelectedCredentialDefinitions: () => set({ selectedCredentialDefinitionIds: [] }),
      
      goToNextStep: () => set((state) => {
        const steps = ['info', 'personas', 'scenarios', 'review'];
        const currentIndex = steps.indexOf(state.currentStep);
        const nextIndex = Math.min(currentIndex + 1, steps.length - 1);
        return { currentStep: steps[nextIndex] as any };
      }),
      
      goToPreviousStep: () => set((state) => {
        const steps = ['info', 'personas', 'scenarios', 'review'];
        const currentIndex = steps.indexOf(state.currentStep);
        const prevIndex = Math.max(currentIndex - 1, 0);
        return { currentStep: steps[prevIndex] as any };
      }),
      
      setStep: (step) => set({ currentStep: step }),

      reset: () => set(initialState),
    }),
    {
      name: 'showcase-store',
    }
  )
);