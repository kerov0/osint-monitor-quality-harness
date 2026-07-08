# Test Strategy

## Purpose

The tests verify the first executable slice of the monitoring-data quality
simulation. The focus is the behavior that anchors the environment: validation,
normalization, duplicate detection, listing, graph projection, and health
reporting.

## Current Coverage

- API tests use Fastify `app.inject()` against the real app factory.
- A valid finding is accepted and returns an ID.
- An invalid finding is rejected with validation errors.
- A duplicate finding returns the existing finding ID.
- Accepted findings can be listed.
- The graph endpoint returns the expected nodes and edges.
- The health endpoint returns service status and a parseable timestamp.
- The metrics endpoint returns Prometheus text output.
- Metrics tests assert finding outcome counters and graph size values.
- Helper tests cover text normalization, duplicate-key creation, and duplicate
  store inserts.
- CI runs `npm ci`, `npm run typecheck`, and `npm test`.

## Fixture Approach

Tests use one readable base finding fixture and small overrides per scenario.
That keeps each assertion tied to the behavior under test instead of large test
payload setup.

## How To Run

```sh
npm test
npm run typecheck
```

Both commands are part of the definition of done for changes in this repo.

## Not Covered By Automated Tests

The automated suite does not execute JMeter, Prometheus, Grafana, deployment,
persistent storage, authentication, authorization, real OSINT data collection,
or browser-based workflows. JMeter and Dockerized observability are verified
manually with the flow in [load-testing.md](load-testing.md).
