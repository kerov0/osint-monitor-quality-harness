import type { FastifyInstance } from "fastify";
import type { AppMetrics } from "../observability/metrics.js";
import { buildEntityGraph } from "../services/build-entity-graph.js";
import type { FindingsStore } from "../store/findings-store.js";

export async function registerGraphRoutes(
  app: FastifyInstance,
  store: FindingsStore,
  metrics: AppMetrics,
): Promise<void> {
  app.get("/graph", async () => {
    const graph = buildEntityGraph(store.list());

    metrics.setGraphSize(graph.nodes.length, graph.edges.length);

    return graph;
  });
}
