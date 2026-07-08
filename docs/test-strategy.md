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
- Helper tests cover text normalization, duplicate-key creation, and duplicate
  store inserts.

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

## Not Covered In This Step

The current suite does not yet cover load testing, Grafana dashboards, CI,
deployment, persistent storage, authentication, authorization, real OSINT data
collection, or browser-based workflows. Those remain valid next phases; they are
just outside this test-and-docs pass.
