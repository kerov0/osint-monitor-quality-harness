import Fastify from "fastify";
import { createAppMetrics } from "./observability/metrics.js";
import { registerFindingsRoutes } from "./routes/findings.routes.js";
import { registerGraphRoutes } from "./routes/graph.routes.js";
import { registerHealthRoutes } from "./routes/health.routes.js";
import { registerMetricsRoutes } from "./routes/metrics.routes.js";
import { FindingsStore } from "./store/findings-store.js";

export async function buildApp(options: { logger?: boolean } = {}) {
  const app = Fastify({
    logger: options.logger ?? true,
  });

  const store = new FindingsStore();
  const metrics = createAppMetrics();

  await registerHealthRoutes(app);
  await registerFindingsRoutes(app, store, metrics);
  await registerGraphRoutes(app, store, metrics);
  await registerMetricsRoutes(app, metrics);

  return app;
}
