import type { FastifyInstance } from "fastify";
import { buildEntityGraph } from "../services/build-entity-graph.js";
import type { FindingsStore } from "../store/findings-store.js";

export async function registerGraphRoutes(
  app: FastifyInstance,
  store: FindingsStore,
): Promise<void> {
  app.get("/graph", async () => {
    return buildEntityGraph(store.list());
  });
}