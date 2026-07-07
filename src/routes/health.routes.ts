import type { FastifyInstance } from "fastify";

export async function registerHealthRoutes(app: FastifyInstance): Promise<void> {
  app.get("/health", async () => {
    return {
      status: "ok",
      service: "monitoring-data-quality-demo",
      timestamp: new Date().toISOString(),
    };
  });
}