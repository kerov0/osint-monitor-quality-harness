import { randomUUID } from "node:crypto";
import type { FindingInput } from "../domain/finding.schema.js";
import type { Finding } from "../domain/finding.types.js";
import { createDuplicateKey, normalizeText } from "../services/normalize-finding.js";

export type StoreResult =
  | { status: "accepted"; finding: Finding }
  | { status: "duplicate"; existingFinding: Finding };

export class FindingsStore {
  private readonly findingsById = new Map<string, Finding>();
  private readonly duplicateIndex = new Map<string, string>();

  add(input: FindingInput): StoreResult {
    const duplicateKey = createDuplicateKey(input);
    const existingId = this.duplicateIndex.get(duplicateKey);

    if (existingId !== undefined) {
      const existingFinding = this.findingsById.get(existingId);

      if (existingFinding === undefined) {
        throw new Error(`Duplicate index points to missing finding: ${existingId}`);
      }

      return {
        status: "duplicate",
        existingFinding,
      };
    }

    const finding: Finding = {
      ...input,
      id: randomUUID(),
      normalizedVendor: normalizeText(input.vendor),
      normalizedCategory: normalizeText(input.category),
      duplicateKey,
      createdAt: new Date().toISOString(),
    };

    this.findingsById.set(finding.id, finding);
    this.duplicateIndex.set(duplicateKey, finding.id);

    return {
      status: "accepted",
      finding,
    };
  }

  list(): Finding[] {
    return [...this.findingsById.values()];
  }
}