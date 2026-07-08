import type { FindingInput } from "../domain/finding.schema.js";

export const validFinding = {
  source: "osint-feed",
  url: "https://example.com/leak",
  title: "Leaked credentials observed",
  vendor: "Acme Corp",
  category: "Credential Leak",
  confidence: 0.92,
  observedAt: "2026-07-08T10:30:00.000Z",
} satisfies FindingInput;

export function makeFinding(overrides: Partial<FindingInput> = {}): FindingInput {
  return {
    ...validFinding,
    ...overrides,
  };
}
