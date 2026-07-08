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
finding listing, graph output, the health endpoint, and the core normalization
and duplicate-key helpers.

See [docs/test-strategy.md](docs/test-strategy.md) for the current test
boundary and likely next phases.

## Project Structure

```text
src/
  app.ts
  server.ts
  domain/
  routes/
  services/
  store/
  test/
docs/
  test-strategy.md
```

## Not Implemented In This Step

This pass adds the API tests and documentation only. Grafana dashboards, JMeter
load tests, CI, deployment automation, authentication, persistent storage, and
real collection integrations are natural follow-on slices, but they are not part
of this specific change.
