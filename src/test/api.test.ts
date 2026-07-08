import type { FastifyInstance } from "fastify";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { buildApp } from "../app.js";
import { makeFinding, validFinding } from "./finding-fixtures.js";

describe("Fastify API", () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    app = await buildApp({ logger: false });
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  it("reports health", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/health",
    });

    expect(response.statusCode).toBe(200);

    const body = response.json<{
      status: string;
      service: string;
      timestamp: string;
    }>();

    expect(body.status).toBe("ok");
    expect(body.service).toBe("monitoring-data-quality-demo");
    expect(Date.parse(body.timestamp)).not.toBeNaN();
  });

  it("accepts a valid finding", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/findings",
      payload: validFinding,
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toEqual({
      status: "accepted",
      id: expect.any(String),
    });
  });

  it("rejects an invalid finding", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/findings",
      payload: makeFinding({
        url: "not-a-url",
        confidence: 2,
        observedAt: "not-a-date",
      }),
    });

    expect(response.statusCode).toBe(400);

    const body = response.json<{
      status: string;
      errors: Array<{ path: string; message: string }>;
    }>();

    expect(body.status).toBe("rejected");
    expect(body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "url" }),
        expect.objectContaining({ path: "confidence" }),
        expect.objectContaining({ path: "observedAt" }),
      ]),
    );
  });

  it("detects duplicate findings", async () => {
    const first = await app.inject({
      method: "POST",
      url: "/findings",
      payload: validFinding,
    });
    const firstBody = first.json<{ id: string }>();

    const duplicate = await app.inject({
      method: "POST",
      url: "/findings",
      payload: makeFinding({
        title: "Same finding from another mention",
        vendor: "  ACME   Corp  ",
        category: "credential   leak",
      }),
    });

    expect(duplicate.statusCode).toBe(200);
    expect(duplicate.json()).toEqual({
      status: "duplicate",
      existingId: firstBody.id,
    });
  });

  it("lists accepted findings", async () => {
    await app.inject({
      method: "POST",
      url: "/findings",
      payload: validFinding,
    });
    await app.inject({
      method: "POST",
      url: "/findings",
      payload: makeFinding({
        url: "https://example.com/forum-post",
        title: "Forum post observed",
        vendor: "Beta Ltd",
        category: "Malware",
      }),
    });

    const response = await app.inject({
      method: "GET",
      url: "/findings",
    });

    expect(response.statusCode).toBe(200);

    const body = response.json<{
      findings: Array<{
        url: string;
        normalizedVendor: string;
        normalizedCategory: string;
      }>;
    }>();

    expect(body.findings).toHaveLength(2);
    expect(body.findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          url: validFinding.url,
          normalizedVendor: "acme corp",
          normalizedCategory: "credential leak",
        }),
        expect.objectContaining({
          url: "https://example.com/forum-post",
          normalizedVendor: "beta ltd",
          normalizedCategory: "malware",
        }),
      ]),
    );
  });

  it("returns expected graph nodes and edges", async () => {
    await app.inject({
      method: "POST",
      url: "/findings",
      payload: validFinding,
    });

    const response = await app.inject({
      method: "GET",
      url: "/graph",
    });

    expect(response.statusCode).toBe(200);

    const body = response.json<{
      nodes: Array<{ id: string; type: string; label: string }>;
      edges: Array<{ from: string; to: string; type: string }>;
    }>();

    expect(body.nodes).toEqual(
      expect.arrayContaining([
        { id: "source:osint-feed", type: "source", label: "osint-feed" },
        { id: "vendor:acme corp", type: "vendor", label: "Acme Corp" },
        {
          id: "category:credential leak",
          type: "category",
          label: "Credential Leak",
        },
        {
          id: "url:https://example.com/leak",
          type: "url",
          label: "https://example.com/leak",
        },
      ]),
    );
    expect(body.edges).toEqual(
      expect.arrayContaining([
        {
          from: "source:osint-feed",
          to: "url:https://example.com/leak",
          type: "reported",
        },
        {
          from: "vendor:acme corp",
          to: "url:https://example.com/leak",
          type: "listed",
        },
        {
          from: "url:https://example.com/leak",
          to: "category:credential leak",
          type: "classified_as",
        },
      ]),
    );
  });
});
