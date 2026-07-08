# Load Testing And Local Observability

This flow assumes the API runs locally, the JMeter plan is created manually, and
Prometheus/Grafana run in Docker.

## Prerequisites

- Node dependencies installed with `npm install`.
- Local JMeter installed and available as `jmeter`.
- Docker with Docker Compose support.
- JMeter test plan at `load-tests/jmeter/osint-monitor-smoke.jmx`.

Generated JMeter output should be written under `load-tests/results/`, which is
ignored by git.

## 1. Start The API

```sh
npm run dev
```

The API listens on `127.0.0.1:3000` by default.

## 2. Run JMeter

Run the smoke/load plan in non-GUI mode:

```sh
jmeter -n \
  -t load-tests/jmeter/osint-monitor-smoke.jmx \
  -l load-tests/results/osint-monitor-smoke.jtl \
  -e \
  -o load-tests/results/report
```

The plan should generate valid finding submissions, duplicate submissions,
invalid submissions, graph reads, health checks, and optionally metrics reads.

## 3. Start Prometheus And Grafana

```sh
docker compose up
```

Prometheus runs at `http://localhost:9090` and scrapes the API at
`host.docker.internal:3000/metrics`.

Grafana runs at `http://localhost:3001`.

Default Grafana login:

- username: `admin`
- password: `admin`

## 4. Verify The Flow

In Prometheus, confirm the `osint-monitor-api` target is healthy.

In Grafana, open the provisioned `OSINT Monitor Quality Harness` dashboard. The
panels should show values for:

- `findings_accepted_total`
- `findings_rejected_total`
- `findings_duplicates_total`
- `graph_nodes_total`
- `graph_edges_total`

Run the JMeter plan again while Grafana is open to watch the metrics move.
