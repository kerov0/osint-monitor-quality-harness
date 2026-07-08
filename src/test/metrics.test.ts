import { describe, expect, it } from "vitest";
import { createAppMetrics } from "../observability/metrics.js";

function readMetric(metricsText: string, name: string): number | undefined {
  const line = metricsText.split("\n").find((entry) => entry.startsWith(`${name} `));

  if (line === undefined) {
    return undefined;
  }

  return Number(line.split(" ")[1]);
}

describe("app metrics", () => {
  it("records finding counts and graph size", async () => {
    const metrics = createAppMetrics();

    metrics.recordFindingAccepted();
    metrics.recordFindingRejected();
    metrics.recordFindingDuplicate();
    metrics.setGraphSize(4, 3);

    const output = await metrics.render();

    expect(readMetric(output, "findings_accepted_total")).toBe(1);
    expect(readMetric(output, "findings_rejected_total")).toBe(1);
    expect(readMetric(output, "findings_duplicates_total")).toBe(1);
    expect(readMetric(output, "graph_nodes_total")).toBe(4);
    expect(readMetric(output, "graph_edges_total")).toBe(3);
  });

  it("starts graph size metrics at zero", async () => {
    const metrics = createAppMetrics();
    const output = await metrics.render();

    expect(readMetric(output, "graph_nodes_total")).toBe(0);
    expect(readMetric(output, "graph_edges_total")).toBe(0);
  });
});
