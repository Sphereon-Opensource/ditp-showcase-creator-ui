import { z } from "zod";


export const credentialSchema = z.object({
  credentialId: z.string().optional(),
  schemaId: z.string().min(1, "Issuer name is required"),
  icon: z.string().optional(),
  proofRequestCheckbox: z.boolean().optional(),
  issuanceCheckbox: z.boolean().optional(),
  
});

export type CredentialImportFormData = z.infer<typeof credentialSchema>;
  