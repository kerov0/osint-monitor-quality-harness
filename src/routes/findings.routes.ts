import type { FastifyInstance } from "fastify";
import { findingInputSchema } from "../domain/finding.schema.js";
import type { AppMetrics } from "../observability/metrics.js";
import type { FindingsStore } from "../store/findings-store.js";

export async function registerFindingsRoutes(
  app: FastifyInstance,
  store: FindingsStore,
  metrics: AppMetrics,
): Promise<void> {
  app.post("/findings", async (request, reply) => {
    const parsed = findingInputSchema.safeParse(request.body);

    if (!parsed.success) {
      metrics.recordFindingRejected();

      return reply.status(400).send({
        status: "rejected",
        errors: parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const result = store.add(parsed.data);

    if (result.status === "duplicate") {
      metrics.recordFindingDuplicate();

      return reply.status(200).send({
        status: "duplicate",
        existingId: result.existingFinding.id,
      });
    }

    metrics.recordFindingAccepted();

    return reply.status(201).send({
      status: "accepted",
      id: result.finding.id,
    });
  });

  app.get("/findings", async () => {
    return {
      findings: store.list(),
    };
  });
}
