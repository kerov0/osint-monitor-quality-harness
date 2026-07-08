import type { FindingInput } from "./finding.schema";

export type Finding = FindingInput & {
    id: string;
    normalizedVendor: string;
    normalizedCategory: string;
    duplicateKey: string;
    createdAt: string;
};
