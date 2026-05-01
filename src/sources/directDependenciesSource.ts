import type { PrefillDataSource, PrefillContext, PrefillOption } from "./types";
import { getDirectDependencies } from "../lib/dag";

export const directDependenciesSource: PrefillDataSource = {
  id: "direct-dependencies",
  displayName: "Direct Form Dependencies",

  getOptions(context: PrefillContext): PrefillOption[] {
    const { targetNodeId, graph } = context;
    const directDeps = getDirectDependencies(targetNodeId, graph);
    const options: PrefillOption[] = [];

    for (const depNode of directDeps) {
      const form = graph.forms.find((f) => f.id === depNode.data.component_id);
      if (!form) continue;

      for (const [fieldKey, fieldSchema] of Object.entries(form.field_schema.properties)) {
        options.push({
          sourceId: "direct-dependencies",
          groupLabel: `${depNode.data.name} (Direct)`,
          fieldPath: `${depNode.id}.${fieldKey}`,
          label: fieldSchema.title || fieldKey,
        });
      }
    }

    return options;
  },
};
