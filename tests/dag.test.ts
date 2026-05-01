import { describe, it, expect } from "vitest";
import { getDirectDependencies, getTransitiveDependencies } from "../src/lib/dag";
import { testGraph } from "./fixtures";

describe("getDirectDependencies", () => {
  it("returns empty array for a root node with no prerequisites", () => {
    expect(getDirectDependencies("node-a", testGraph)).toEqual([]);
  });

  it("returns the single direct parent for Form B", () => {
    const result = getDirectDependencies("node-b", testGraph);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("node-a");
  });

  it("returns both direct parents for Form F", () => {
    const result = getDirectDependencies("node-f", testGraph);
    const ids = result.map((n) => n.id).sort();
    expect(ids).toEqual(["node-d", "node-e"].sort());
  });

  it("returns empty array for an unknown nodeId", () => {
    expect(getDirectDependencies("non-existent", testGraph)).toEqual([]);
  });

  it("does not include transitive ancestors — only direct ones", () => {
    // Form D's only direct prereq is Form B; Form A is transitive
    const result = getDirectDependencies("node-d", testGraph);
    const ids = result.map((n) => n.id);
    expect(ids).toContain("node-b");
    expect(ids).not.toContain("node-a");
  });
});

describe("getTransitiveDependencies", () => {
  it("returns empty array for a root node", () => {
    expect(getTransitiveDependencies("node-a", testGraph)).toEqual([]);
  });

  it("returns [A] for Form B (B directly depends on A)", () => {
    const result = getTransitiveDependencies("node-b", testGraph);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("node-a");
  });

  it("returns [B, A] for Form D", () => {
    const result = getTransitiveDependencies("node-d", testGraph);
    const ids = result.map((n) => n.id);
    expect(ids).toContain("node-a");
    expect(ids).toContain("node-b");
    expect(ids).toHaveLength(2);
  });

  it("returns all 4 ancestors for Form F", () => {
    const result = getTransitiveDependencies("node-f", testGraph);
    const ids = result.map((n) => n.id).sort();
    expect(ids).toEqual(["node-a", "node-b", "node-c", "node-d", "node-e"].sort());
  });

  it("does not include the target node itself", () => {
    const result = getTransitiveDependencies("node-f", testGraph);
    const ids = result.map((n) => n.id);
    expect(ids).not.toContain("node-f");
  });

  it("returns no duplicate nodes even when multiple paths exist", () => {
    // Form F → D → B → A and F → E → C → A: A should appear only once
    const result = getTransitiveDependencies("node-f", testGraph);
    const ids = result.map((n) => n.id);
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size);
  });

  it("handles a graph with a single root node", () => {
    const singleNodeGraph = {
      nodes: [{ id: "only", type: "form", data: { id: "bp_c_only", component_id: "form-only", name: "Only", prerequisites: [], input_mapping: {} } }],
      edges: [],
      forms: [],
    };
    expect(getTransitiveDependencies("only", singleNodeGraph)).toEqual([]);
  });
});
