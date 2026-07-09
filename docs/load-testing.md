# Load Testing And Local Observability

This is the verified local end-to-end flow:

```text
API -> JMeter traffic -> /metrics -> Prometheus -> Grafana dashboard
```

The API runs locally with `npm run dev`. JMeter runs from the host machine.
Prometheus and Grafana run in Docker and scrape the host API at
`host.docker.internal:3000/metrics`.

## Prerequisites

- Node dependencies installed with `npm install`.
- Local JMeter installed and available as `jmeter`.
- Docker with Docker Compose support.
- JMeter test plan at `load-tests/jmeter/osint-monitor-smoke.jmx`.
- Local `.env` file created from `.env.example` with Grafana credentials set.

Generated JMeter output should be written under `load-tests/results/`, which is
ignored by git.

## 1. Start The API Locally

```sh
npm run dev
```

The API listens on `127.0.0.1:3000` by default.

Expected checks:

- API health: `http://127.0.0.1:3000/health`
- API metrics: `http://127.0.0.1:3000/metrics`

## 2. Run JMeter Traffic

Preferred npm command:

```sh
npm run load:jmeter
```

Equivalent direct JMeter CLI command:

```sh
jmeter -n \
  -t load-tests/jmeter/osint-monitor-smoke.jmx \
  -l load-tests/results/osint-monitor-smoke.jtl \
  -e \
  -o load-tests/results/report
```

The plan should generate valid finding submissions, duplicate submissions,
invalid submissions, graph reads, health checks, and optionally metrics reads.

Expected checks:

- `load-tests/results/osint-monitor-smoke.jtl` is created.
- `load-tests/results/report/index.html` is created when report generation
  succeeds.
- `http://127.0.0.1:3000/metrics` shows non-zero finding counters after JMeter
  traffic.

## 3. Start Prometheus And Grafana In Docker

Preferred npm command:

```sh
cp .env.example .env
npm run observability:up
```

Equivalent Docker Compose command:

```sh
cp .env.example .env
docker compose up
```

Edit `.env` before starting Grafana if you want credentials other than the
example values.

Prometheus runs at `http://localhost:9090` and scrapes the API at
`host.docker.internal:3000/metrics`.

Grafana runs at `http://localhost:3001`.

Grafana login values are read from `.env`:

- username: `GRAFANA_ADMIN_USER`
- password: `GRAFANA_ADMIN_PASSWORD`

## 4. Verify Prometheus

Open:

- Prometheus UI: `http://localhost:9090`
- Prometheus targets: `http://localhost:9090/targets`

Expected checks:

- The `osint-monitor-api` target is `UP`.
- The scrape endpoint is `host.docker.internal:3000/metrics`.
- Queries return values for:
  - `findings_accepted_total`
  - `findings_rejected_total`
  - `findings_duplicates_total`
  - `graph_nodes_total`
  - `graph_edges_total`

## 5. Verify Grafana

Open `http://localhost:3001`, log in with the credentials from `.env`, and open
the provisioned `OSINT Monitor Quality Harness` dashboard.

Expected dashboard panels:

- `findings_accepted_total`
- `findings_rejected_total`
- `findings_duplicates_total`
- `graph_nodes_total`
- `graph_edges_total`

Run the JMeter plan again while Grafana is open to watch the metrics move.

## Stop Observability

```sh
npm run observability:down
```

Equivalent Docker Compose command:

```sh
docker compose down
```

## Troubleshooting

If Prometheus target is down:

- Confirm the API is still running with `npm run dev`.
- Confirm `http://127.0.0.1:3000/metrics` returns Prometheus text.
- Confirm Docker Compose is using `host.docker.internal:3000` from
  `observability/prometheus/prometheus.yml`.
- Restart Prometheus/Grafana with `npm run observability:down` and
  `npm run observability:up`.

If Grafana has no dashboard or no data:

- Confirm Prometheus target is `UP` at `http://localhost:9090/targets`.
- Confirm Grafana is using the provisioned Prometheus datasource.
- Run `npm run load:jmeter` again to generate fresh traffic.
- Refresh the dashboard time range to the last 15 minutes.

If JMeter report generation fails:

- Make sure `load-tests/jmeter/osint-monitor-smoke.jmx` exists.
- Make sure the API is running before starting JMeter.
- Remove or empty `load-tests/results/report` before regenerating the HTML
  report, because JMeter expects the report output directory to be empty.

## GitHub Secrets

For any GitHub Actions workflow that runs Docker Compose, create repository
secrets named `GRAFANA_ADMIN_USER` and `GRAFANA_ADMIN_PASSWORD`, then expose them
to the Compose step:

```yaml
env:
  GRAFANA_ADMIN_USER: ${{ secrets.GRAFANA_ADMIN_USER }}
  GRAFANA_ADMIN_PASSWORD: ${{ secrets.GRAFANA_ADMIN_PASSWORD }}
```
