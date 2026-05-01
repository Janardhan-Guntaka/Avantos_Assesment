import { describe, it, expect, beforeEach } from "vitest";
import { directDependenciesSource } from "../src/sources/directDependenciesSource";
import { transitiveDependenciesSource } from "../src/sources/transitiveDependenciesSource";
import { globalDataSource } from "../src/sources/globalDataSource";
import { registerSource, buildGroupedOptions, _resetRegistry } from "../src/lib/sourceRegistry";
import { testGraph } from "./fixtures";
import type { PrefillContext } from "../src/sources/types";

const ctx = (targetNodeId: string): PrefillContext => ({ targetNodeId, graph: testGraph });

describe("directDependenciesSource", () => {
  it("has id 'direct-dependencies'", () => {
    expect(directDependenciesSource.id).toBe("direct-dependencies");
  });

  it("returns empty array for a root node (Form A)", () => {
    expect(directDependenciesSource.getOptions(ctx("node-a"))).toEqual([]);
  });

  it("returns fields from Form A when querying Form B", () => {
    const options = directDependenciesSource.getOptions(ctx("node-b"));
    expect(options.length).toBeGreaterThan(0);
    const fieldPaths = options.map((o) => o.fieldPath);
    expect(fieldPaths.some((p) => p.startsWith("node-a."))).toBe(true);
  });

  it("sets sourceId to 'direct-dependencies' on each option", () => {
    const options = directDependenciesSource.getOptions(ctx("node-b"));
    expect(options.every((o) => o.sourceId === "direct-dependencies")).toBe(true);
  });

  it("returns fields from both parents for Form F", () => {
    const options = directDependenciesSource.getOptions(ctx("node-f"));
    const hasDNodeFields = options.some((o) => o.fieldPath.startsWith("node-d."));
    const hasENodeFields = options.some((o) => o.fieldPath.startsWith("node-e."));
    expect(hasDNodeFields).toBe(true);
    expect(hasENodeFields).toBe(true);
  });

  it("includes email and name fields in the label/fieldPath", () => {
    const options = directDependenciesSource.getOptions(ctx("node-b"));
    const fieldPaths = options.map((o) => o.fieldPath);
    expect(fieldPaths).toContain("node-a.email");
    expect(fieldPaths).toContain("node-a.name");
  });
});

describe("transitiveDependenciesSource", () => {
  it("returns empty array for a root node", () => {
    expect(transitiveDependenciesSource.getOptions(ctx("node-a"))).toEqual([]);
  });

  it("does NOT return direct dependency fields (no overlap with directDependenciesSource)", () => {
    // Form D: direct = B, transitive only = A
    const options = transitiveDependenciesSource.getOptions(ctx("node-d"));
    const fieldPaths = options.map((o) => o.fieldPath);
    // Form B (direct) should NOT appear
    expect(fieldPaths.some((p) => p.startsWith("node-b."))).toBe(false);
    // Form A (transitive) SHOULD appear
    expect(fieldPaths.some((p) => p.startsWith("node-a."))).toBe(true);
  });

  it("returns Form A fields when querying Form D (A is transitive, B is direct)", () => {
    const options = transitiveDependenciesSource.getOptions(ctx("node-d"));
    expect(options.some((o) => o.fieldPath === "node-a.email")).toBe(true);
  });

  it("Form F gets A, B, C as transitive (D, E are direct)", () => {
    const options = transitiveDependenciesSource.getOptions(ctx("node-f"));
    const fieldPaths = options.map((o) => o.fieldPath);
    // A, B, C are transitive
    expect(fieldPaths.some((p) => p.startsWith("node-a."))).toBe(true);
    expect(fieldPaths.some((p) => p.startsWith("node-b."))).toBe(true);
    expect(fieldPaths.some((p) => p.startsWith("node-c."))).toBe(true);
    // D, E are direct — must NOT be included
    expect(fieldPaths.some((p) => p.startsWith("node-d."))).toBe(false);
    expect(fieldPaths.some((p) => p.startsWith("node-e."))).toBe(false);
  });

  it("sets sourceId to 'transitive-dependencies' on each option", () => {
    const options = transitiveDependenciesSource.getOptions(ctx("node-d"));
    expect(options.every((o) => o.sourceId === "transitive-dependencies")).toBe(true);
  });
});

describe("globalDataSource", () => {
  it("always returns a non-empty array regardless of context", () => {
    expect(globalDataSource.getOptions(ctx("node-a")).length).toBeGreaterThan(0);
    expect(globalDataSource.getOptions(ctx("node-f")).length).toBeGreaterThan(0);
  });

  it("sets sourceId to 'global-data' on every option", () => {
    const options = globalDataSource.getOptions(ctx("node-a"));
    expect(options.every((o) => o.sourceId === "global-data")).toBe(true);
  });

  it("includes a Current User email option", () => {
    const options = globalDataSource.getOptions(ctx("node-a"));
    expect(options.some((o) => o.fieldPath === "global.currentUser.email")).toBe(true);
  });
});

describe("buildGroupedOptions (source registry)", () => {
  beforeEach(() => {
    _resetRegistry();
  });

  it("omits groups where the source returns no options", () => {
    registerSource(directDependenciesSource);
    // Root node → direct source returns [] → should be omitted
    const groups = buildGroupedOptions(ctx("node-a"));
    expect(groups.every((g) => g.options.length > 0)).toBe(true);
  });

  it("returns one group per non-empty source", () => {
    registerSource(directDependenciesSource);
    registerSource(globalDataSource);
    // Form B: direct source has options, global source always has options
    const groups = buildGroupedOptions(ctx("node-b"));
    expect(groups.length).toBeGreaterThanOrEqual(2);
  });

  it("throws when registering a source with a duplicate id", () => {
    registerSource(directDependenciesSource);
    expect(() => registerSource(directDependenciesSource)).toThrow();
  });

  it("groups options by their groupLabel within each source", () => {
    registerSource(globalDataSource);
    const groups = buildGroupedOptions(ctx("node-a"));
    // Global data should produce multiple groups (Current User, Organization, Date/Time)
    expect(groups.length).toBeGreaterThan(1);
  });
});
