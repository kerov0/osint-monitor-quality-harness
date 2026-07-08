import { Counter, Gauge, Registry } from "prom-client";

export type AppMetrics = {
  contentType: string;
  recordFindingAccepted: () => void;
  recordFindingRejected: () => void;
  recordFindingDuplicate: () => void;
  setGraphSize: (nodeCount: number, edgeCount: number) => void;
  render: () => Promise<string>;
};

export function createAppMetrics(): AppMetrics {
  const registry = new Registry();

  const findingsAcceptedTotal = new Counter({
    name: "findings_accepted_total",
    help: "Total number of accepted findings.",
    registers: [registry],
  });
  const findingsRejectedTotal = new Counter({
    name: "findings_rejected_total",
    help: "Total number of rejected finding submissions.",
    registers: [registry],
  });
  const findingsDuplicatesTotal = new Counter({
    name: "findings_duplicates_total",
    help: "Total number of duplicate finding submissions.",
    registers: [registry],
  });
  const graphNodesTotal = new Gauge({
    name: "graph_nodes_total",
    help: "Current number of nodes returned by the graph endpoint.",
    registers: [registry],
  });
  const graphEdgesTotal = new Gauge({
    name: "graph_edges_total",
    help: "Current number of edges returned by the graph endpoint.",
    registers: [registry],
  });

  graphNodesTotal.set(0);
  graphEdgesTotal.set(0);

  return {
    contentType: registry.contentType,
    recordFindingAccepted: () => {
      findingsAcceptedTotal.inc();
    },
    recordFindingRejected: () => {
      findingsRejectedTotal.inc();
    },
    recordFindingDuplicate: () => {
      findingsDuplicatesTotal.inc();
    },
    setGraphSize: (nodeCount, edgeCount) => {
      graphNodesTotal.set(nodeCount);
      graphEdgesTotal.set(edgeCount);
    },
    render: () => registry.metrics(),
  };
}
