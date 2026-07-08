# OSINT Monitor Quality Harness

A simulation harness for internet-monitoring data-quality workflows. It models
the core loop of ingesting synthetic OSINT findings, validating their shape,
normalizing entity fields, detecting duplicates, storing accepted observations,
and projecting them into a graph-like structure.

The goal is to provide a clean base environment that can be exercised by tests
now and expanded later with dashboards, load tests, CI checks, deployment, and
more realistic data sources.

## Current Capabilities

- Zod validation for incoming finding payloads.
- Duplicate detection based on URL, normalized vendor, and normalized category.
- In-memory listing of accepted findings.
- A graph projection that links sources, vendors, URLs, and categories.
- Prometheus metrics for finding outcomes and graph size.
- Dockerized Prometheus/Grafana config for local observability.
- JMeter load-test run documentation for a manually supplied test plan.
- GitHub Actions CI for install, typecheck, and tests.
- Fastify route tests using `app.inject()`.
- Focused helper tests for normalization and duplicate-key behavior.

## Run Locally

Install dependencies:

```sh
npm install
```

Start the API:

```sh
npm run dev
```

By default, the server listens on `127.0.0.1:3000`.

Useful endpoints:

- `GET /health`
- `POST /findings`
- `GET /findings`
- `GET /graph`
- `GET /metrics`

Example finding payload:

```json
{
  "source": "osint-feed",
  "url": "https://example.com/leak",
  "title": "Leaked credentials observed",
  "vendor": "Acme Corp",
  "category": "Credential Leak",
  "confidence": 0.92,
  "observedAt": "2026-07-08T10:30:00.000Z"
}
```

## Test

Run the Vitest suite:

```sh
npm test
```

Run TypeScript checks:

```sh
npm run typecheck
```

The test suite covers valid and invalid finding ingestion, duplicate detection,
finding listing, graph output, the health endpoint, metrics output, and the core
normalization and duplicate-key helpers.

See [docs/test-strategy.md](docs/test-strategy.md) for the current test
boundary and likely next phases.

## Load Testing And Observability

The expected local flow is:

1. Start the API with `npm run dev`.
2. Run the manually created JMeter plan at
   `load-tests/jmeter/osint-monitor-smoke.jmx`.
3. Start Dockerized Prometheus and Grafana with `docker compose up`.
4. Verify Prometheus is scraping `host.docker.internal:3000/metrics`.
5. View the Grafana dashboard at `http://localhost:3001`.

See [docs/load-testing.md](docs/load-testing.md) for commands and verification
steps.

## Project Structure

```text
.github/
docker-compose.yml
src/
  app.ts
  server.ts
  domain/
  observability/
  routes/
  services/
  store/
  test/
docs/
  load-testing.md
  test-strategy.md
observability/
  prometheus/
  grafana/
```

## Not Implemented In This Step

Deployment automation, authentication, persistent storage, and real collection
integrations remain later slices.
