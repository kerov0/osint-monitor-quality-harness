import type { FastifyInstance } from "fastify";
import type { AppMetrics } from "../observability/metrics.js";

export async function registerMetricsRoutes(
  app: FastifyInstance,
  metrics: AppMetrics,
): Promise<void> {
  app.get("/metrics", async (_request, reply) => {
    return reply
      .header("Content-Type", metrics.contentType)
      .send(await metrics.render());
  });
}
