import type { BlueprintGraph } from "./types";
import localGraph from "../data/graph.json";

const BASE_URL = "/api/v1";

/**
 * Fetches the blueprint graph from the mock server.
 * Falls back to the bundled graph.json if the server is unreachable,
 * so the app works without running the mock server locally.
 */
export async function fetchBlueprintGraph(
  tenantId: string,
  blueprintId: string
): Promise<BlueprintGraph> {
  try {
    const res = await fetch(
      `${BASE_URL}/${tenantId}/actions/blueprints/${blueprintId}/graph`
    );
    if (!res.ok) throw new Error(`${res.status}`);
    return res.json() as Promise<BlueprintGraph>;
  } catch {
    return localGraph as unknown as BlueprintGraph;
  }
}
