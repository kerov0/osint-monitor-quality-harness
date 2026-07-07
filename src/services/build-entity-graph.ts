import type { Finding } from "../domain/finding.types.js";

export type GraphNode = {
  id: string;
  type: "source" | "vendor" | "category" | "url";
  label: string;
};

export type GraphEdge = {
  from: string;
  to: string;
  type: "reported" | "listed" | "classified_as";
};

export type EntityGraph = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

export function buildEntityGraph(findings: Finding[]): EntityGraph {
  const nodes = new Map<string, GraphNode>();
  const edges: GraphEdge[] = [];

  for (const finding of findings) {
    const sourceId = `source:${finding.source}`;
    const vendorId = `vendor:${finding.normalizedVendor}`;
    const categoryId = `category:${finding.normalizedCategory}`;
    const urlId = `url:${finding.url}`;

    nodes.set(sourceId, { id: sourceId, type: "source", label: finding.source });
    nodes.set(vendorId, { id: vendorId, type: "vendor", label: finding.vendor });
    nodes.set(categoryId, { id: categoryId, type: "category", label: finding.category });
    nodes.set(urlId, { id: urlId, type: "url", label: finding.url });

    edges.push(
      { from: sourceId, to: urlId, type: "reported" },
      { from: vendorId, to: urlId, type: "listed" },
      { from: urlId, to: categoryId, type: "classified_as" },
    );
  }

  return {
    nodes: [...nodes.values()],
    edges,
  };
}