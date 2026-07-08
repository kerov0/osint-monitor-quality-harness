import { describe, expect, it } from "vitest";
import {
  createDuplicateKey,
  normalizeText,
} from "../services/normalize-finding.js";
import { FindingsStore } from "../store/findings-store.js";
import { makeFinding } from "./finding-fixtures.js";

describe("normalization and duplicate keys", () => {
  it("normalizes casing and whitespace", () => {
    expect(normalizeText("  ACME\t\tCorp\n")).toBe("acme corp");
  });

  it("builds duplicate keys from URL and normalized entity fields", () => {
    const key = createDuplicateKey(
      makeFinding({
        vendor: "  ACME   Corp  ",
        category: "credential   leak",
      }),
    );

    expect(key).toBe("https://example.com/leak|acme corp|credential leak");
  });

  it("uses duplicate keys to detect duplicate store inserts", () => {
    const store = new FindingsStore();
    const first = store.add(makeFinding());
    const second = store.add(
      makeFinding({
        title: "Same issue seen again",
        vendor: " ACME  CORP ",
        category: "Credential   Leak",
      }),
    );

    expect(first.status).toBe("accepted");

    if (first.status !== "accepted") {
      throw new Error("Expected first finding to be accepted");
    }

    expect(second).toEqual({
      status: "duplicate",
      existingFinding: first.finding,
    });
    expect(store.list()).toHaveLength(1);
  });
});
