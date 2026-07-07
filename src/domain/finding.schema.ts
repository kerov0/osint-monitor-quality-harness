import { z } from "zod";

export const findingInputSchema = z.object({
  source: z.string().min(1),
  url: z.string().url(),
  title: z.string().min(1),
  vendor: z.string().min(1),
  category: z.string().min(1),
  confidence: z.number().min(0).max(1),
  observedAt: z.string().datetime(),
});

export type FindingInput = z.infer<typeof findingInputSchema>;