// hooks/use-showcase-creation.ts
import { useState, useCallback } from "react";
import { useShowcaseStore } from "@/hooks/use-showcases-store";
import { useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/apiService";
import { 
  Persona, 
  ScenarioRequestType, 
  StepRequestType,
  AriesOOBActionRequest,
  IssuanceScenarioResponse
} from "@/openapi-types";
import { sampleAction } from "@/lib/steps";

export const useShowcaseCreation = () => {
  const { 
    displayShowcase, 
    selectedPersonaIds,
    selectedCredentialDefinitionIds,
    setScenarioIds,
    issuerId
  } = useShowcaseStore();
  
  // Track scenarios being created for each persona
  const [personaScenarios, setPersonaScenarios] = useState(() => {
    // Initialize with default scenarios for selected personas
    const initialScenarios = new Map<string, ScenarioRequestType>();
    
    // Extract personas from displayShowcase that are selected
    const personas = (displayShowcase.personas || []).filter(
      (persona: Persona) => selectedPersonaIds.includes(persona.id)
    );
    
    // Create a default scenario for each persona
    personas.forEach((persona: Persona) => {
      initialScenarios.set(persona.id, {
        name: `${persona.name}'s Journey`,
        description: `Onboarding scenario for ${persona.name}`,
        type: "ISSUANCE",
        steps: [
          {
            title: `Meet ${persona.name}`,
            description: `Welcome to this showcase. Here you'll learn about digital credentials with ${persona.name}.`,
            order: 0,
            type: "HUMAN_TASK",
            actions: [
              sampleAction,
            ]
          }
        ],
        personas: [persona.id],
        hidden: false,
        issuer: issuerId
      });
    });
    
    return initialScenarios;
  });
  
  // Track currently active persona (for UI)
  const [activePersonaId, setActivePersonaId] = useState<string | null>(() => {
    // Set the first selected persona as active by default
    const personas = (displayShowcase.personas || []).filter(
      (persona: Persona) => selectedPersonaIds.includes(persona.id)
    );
    return personas.length > 0 ? personas[0].id : null;
  });
  
  // Extract personas from displayShowcase that are selected
  const selectedPersonas = (displayShowcase.personas || []).filter(
    (persona: Persona) => selectedPersonaIds.includes(persona.id)
  );
  
  // Update steps for a specific persona's scenario
  const updatePersonaSteps = useCallback((personaId: string, steps: StepRequestType[]) => {
    setPersonaScenarios(prevScenarios => {
      if (!prevScenarios.has(personaId)) {
        return prevScenarios;
      }
      
      const newScenarios = new Map(prevScenarios);
      newScenarios.set(personaId, {
        ...prevScenarios.get(personaId)!,
        steps: steps
      });
      
      return newScenarios;
    });
  }, []);
  
  // Add an action to a step
  const addActionToStep = useCallback((
    personaId: string, 
    stepIndex: number, 
    action: typeof AriesOOBActionRequest._type
  ) => {
    setPersonaScenarios(prevScenarios => {
      if (!prevScenarios.has(personaId)) {
        return prevScenarios;
      }
      
      const scenario = prevScenarios.get(personaId)!;
      const steps = [...scenario.steps];
      
      if (stepIndex < 0 || stepIndex >= steps.length) {
        return prevScenarios;
      }
      
      const step = steps[stepIndex];
      const actions = [...(step.actions || []), action];
      
      steps[stepIndex] = { ...step, actions };
      
      const newScenarios = new Map(prevScenarios);
      newScenarios.set(personaId, {
        ...scenario,
        steps: steps
      });
      
      return newScenarios;
    });
  }, []);
  
  // Add a scenario for a new persona
  const addPersonaScenario = useCallback((persona: Persona) => {
    setPersonaScenarios(prevScenarios => {
      // Skip if already exists
      if (prevScenarios.has(persona.id)) {
        return prevScenarios;
      }
      
      // Create default scenario
      const defaultScenario: ScenarioRequestType = {
        name: `${persona.name}'s Journey`,
        description: `Onboarding scenario for ${persona.name}`,
        type: "ISSUANCE",
        steps: [
          {
            title: `Meet ${persona.name}`,
            description: `Welcome to this showcase. Here you'll learn about digital credentials with ${persona.name}.`,
            order: 0,
            type: "HUMAN_TASK",
            actions: []
          }
        ],
        personas: [persona.id],
        hidden: false,
        issuer: issuerId
      };
      
      // Create a new map to avoid direct state mutation
      const newScenarios = new Map(prevScenarios);
      newScenarios.set(persona.id, defaultScenario);
      return newScenarios;
    });
  }, []);
  
  // Create a single issuance scenario
  const createIssuanceScenario = useMutation({
    mutationFn: async (scenario: ScenarioRequestType) => {
      const response = await apiClient.post('/scenarios/issuances', scenario) as typeof IssuanceScenarioResponse._type;
      return response;
    }
  });
  
  // Complete the entire flow - create all scenarios and update the showcase
  const completeShowcaseCreation = useCallback(async () => {
    try {
      // Create all scenarios first
      const scenarioPromises = Array.from(personaScenarios.values()).map(
        scenario => createIssuanceScenario.mutateAsync(scenario)
      );
      
      const createdScenarios = await Promise.all(scenarioPromises);
      const scenarioIds = createdScenarios.map((s: typeof IssuanceScenarioResponse._type) => s.issuanceScenario.id);
      
      // Update our store with the newly created scenario IDs
      setScenarioIds(scenarioIds);
      
      return {
        scenarioIds,
        scenarios: createdScenarios
      };
    } catch (error) {
      console.error('Error completing showcase creation:', error);
      throw error;
    }
  }, [personaScenarios, createIssuanceScenario, setScenarioIds]);
  
  return {
    selectedPersonas,
    selectedCredentialDefinitionIds,
    personaScenarios,
    activePersonaId,
    setActivePersonaId,
    updatePersonaSteps,
    addActionToStep,
    addPersonaScenario,
    completeShowcaseCreation,
    isSaving: createIssuanceScenario.isPending
  };
};