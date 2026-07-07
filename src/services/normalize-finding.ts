import type { FindingInput } from "../domain/finding.schema.js";

export function normalizeText(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function createDuplicateKey(input: FindingInput): string {
  const normalizedVendor = normalizeText(input.vendor);
  const normalizedCategory = normalizeText(input.category);

  return `${input.url}|${normalizedVendor}|${normalizedCategory}`;
}