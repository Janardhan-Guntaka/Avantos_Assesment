import type { BlueprintGraph } from "../api/types";

export interface PrefillContext {
  targetNodeId: string;
  graph: BlueprintGraph;
}

export interface PrefillOption {
  sourceId: string;
  groupLabel: string;
  fieldPath: string;
  label: string;
}

export interface PrefillValue {
  sourceId: string;
  fieldPath: string;
  label: string;
}

/** nodeId → (fieldKey → PrefillValue) */
export type PrefillMapping = Record<string, Record<string, PrefillValue>>;

/**
 * Plugin contract for prefill data sources.
 * Implement this interface and register via registerSource() to add a new source.
 * No other code changes are needed.
 */
export interface PrefillDataSource {
  readonly id: string;
  readonly displayName: string;
  getOptions(context: PrefillContext): PrefillOption[];
}
