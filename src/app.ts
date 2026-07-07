import Fastify from "fastify";
import { registerFindingsRoutes } from "./routes/findings.routes.js";
import { registerGraphRoutes } from "./routes/graph.routes.js";
import { registerHealthRoutes } from "./routes/health.routes.js";
import { FindingsStore } from "./store/findings-store.js";

export async function buildApp() {
  const app = Fastify({
    logger: true,
  });

  const store = new FindingsStore();

  await registerHealthRoutes(app);
  await registerFindingsRoutes(app, store);
  await registerGraphRoutes(app, store);

  return app;
}