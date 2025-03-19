import { ScenarioRequestType, StepRequestType } from "@/openapi-types";

export const sampleAction =  {
  title: "example_title",
  actionType: "ARIES_OOB",
  text: "example_text",
  proofRequest: {
    attributes: {
      attribute1: {
        attributes: ["attribute1", "attribute2"],
        restrictions: ["restriction1", "restriction2"],
      },
    },
    predicates: {
      predicate1: {
        name: "example_name",
        type: "example_type",
        value: "example_value",
        restrictions: ["restriction1", "restriction2"],
      },
    },
  },
}

export const sampleScenario: ScenarioRequestType = {
  name: "example_name",
  description: "example_description",
  type: "ISSUANCE" as "ISSUANCE" | "PRESENTATION",
  issuer: "3de59a17-222e-4c92-a22a-118eff7032b5",
  steps: [],
  personas: [],
};

export const createDefaultStep = ({
  title,
  description,
}: {
  title: string;
  description: string;
}): StepRequestType => ({
  title,
  description,
  order: 0,
  type: "HUMAN_TASK",
  actions: [
    sampleAction,
  ],
  subScenario: "",
  asset: "",
});

export const createServiceStep = ({
  title,
  description,
}: {
  title: string;
  description: string;
}): StepRequestType => ({
  title,
  description,
  order: 0,
  type: "SERVICE",
  actions: [
    sampleAction,
  ],
  subScenario: "",  
  asset: "",
});

// TODO create a local step state
// TODO remove all the UI for a new component 
// CREATE Steps and pass back to the parent?

// before create a scenario we need to create each step inside of it
// POST /scenarios/issuances
// {
//   "name": "example_name",
//   "description": "example_description",
//   "issuer": "{{issuerId}}",
//   "steps": [
//       {
//           "title": "example_title",
//           "description": "example_description",
//           "order": 1,
//           "type": "HUMAN_TASK",
//           "asset": "{{assetId}}",
//           "actions": [
//               {
//                   "title": "example_title",
//                   "actionType": "ARIES_OOB",
//                   "text": "example_text",
//                   "proofRequest": {
//                       "attributes": {
//                           "attribute1": {
//                               "attributes": ["attribute1", "attribute2"],
//                               "restrictions": ["restriction1", "restriction2"]
//                           }
//                       },
//                       "predicates": {
//                           "predicate1": {
//                               "name": "example_name",
//                               "type": "example_type",
//                               "value":"example_value",
//                               "restrictions": ["restriction1","restriction2"]
//                           }
//                       }
//                   }
//               }
//           ]
//       }
//   ],
//   "personas": ["{{personaId}}"]
// }