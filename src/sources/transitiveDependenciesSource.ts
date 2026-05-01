import type { PrefillDataSource, PrefillContext, PrefillOption } from "./types";
import { getDirectDependencies, getTransitiveDependencies } from "../lib/dag";

export const transitiveDependenciesSource: PrefillDataSource = {
  id: "transitive-dependencies",
  displayName: "Transitive Form Dependencies",

  getOptions(context: PrefillContext): PrefillOption[] {
    const { targetNodeId, graph } = context;
    const allAncestors = getTransitiveDependencies(targetNodeId, graph);
    const directDepIds = new Set(
      getDirectDependencies(targetNodeId, graph).map((n) => n.id)
    );

    // Only return ancestors that are NOT direct dependencies to avoid duplication
    const transitiveOnly = allAncestors.filter((n) => !directDepIds.has(n.id));
    const options: PrefillOption[] = [];

    for (const depNode of transitiveOnly) {
      const form = graph.forms.find((f) => f.id === depNode.data.component_id);
      if (!form) continue;

      for (const [fieldKey, fieldSchema] of Object.entries(form.field_schema.properties)) {
        options.push({
          sourceId: "transitive-dependencies",
          groupLabel: `${depNode.data.name} (Transitive)`,
          fieldPath: `${depNode.id}.${fieldKey}`,
          label: fieldSchema.title || fieldKey,
        });
      }
    }

    return options;
  },
};
