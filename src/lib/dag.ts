import type { BlueprintGraph, BlueprintNode } from "../api/types";

function buildNodeIndex(graph: BlueprintGraph): Map<string, BlueprintNode> {
  const index = new Map<string, BlueprintNode>();
  for (const node of graph.nodes) {
    index.set(node.id, node);
  }
  return index;
}

/**
 * Returns nodes that the given node directly depends on (its immediate prerequisites).
 * Uses node.data.prerequisites as the authoritative source.
 */
export function getDirectDependencies(
  nodeId: string,
  graph: BlueprintGraph
): BlueprintNode[] {
  const nodeIndex = buildNodeIndex(graph);
  const node = nodeIndex.get(nodeId);
  if (!node) return [];

  return node.data.prerequisites
    .map((prereqId) => nodeIndex.get(prereqId))
    .filter((n): n is BlueprintNode => n !== undefined);
}

/**
 * Returns ALL ancestor nodes reachable via the prerequisite DAG (not including the node itself).
 * Uses BFS; a visited set prevents infinite loops if cycles somehow exist.
 */
export function getTransitiveDependencies(
  nodeId: string,
  graph: BlueprintGraph
): BlueprintNode[] {
  const nodeIndex = buildNodeIndex(graph);
  const visited = new Set<string>();
  const result: BlueprintNode[] = [];
  const queue: string[] = [nodeId];

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const current = nodeIndex.get(currentId);
    if (!current) continue;

    for (const prereqId of current.data.prerequisites) {
      if (!visited.has(prereqId)) {
        visited.add(prereqId);
        const prereqNode = nodeIndex.get(prereqId);
        if (prereqNode) {
          result.push(prereqNode);
          queue.push(prereqId);
        }
      }
    }
  }

  return result;
}
