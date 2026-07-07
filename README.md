# osint-monitor-quality-harness
A small system that ingests synthetic “internet monitoring” findings, normalizes them, validates them, links entities into a graph-like structure, and tests the flow end-to-end.



### Proposed Structure

```
src/
  server.ts
  routes/
    findings.routes.ts
    graph.routes.ts
    health.routes.ts
    metrics.routes.ts
  domain/
    finding.schema.ts
    finding.types.ts
  services/
    normalize-finding.ts
    deduplicate-findings.ts
    build-entity-graph.ts
  store/
    in-memory-store.ts
  observability/
    metrics.ts

tests/
  unit/
  integration/
  fixtures/

docs/
  demo-script.md
  test-strategy.md
```