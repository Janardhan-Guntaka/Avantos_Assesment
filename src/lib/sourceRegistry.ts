import type { PrefillDataSource, PrefillContext, PrefillOption } from "../sources/types";

const registry: PrefillDataSource[] = [];
const registeredIds = new Set<string>();

export function registerSource(source: PrefillDataSource): void {
  if (registeredIds.has(source.id)) {
    throw new Error(`Data source with id "${source.id}" is already registered.`);
  }
  registry.push(source);
  registeredIds.add(source.id);
}

export function getSources(): PrefillDataSource[] {
  return [...registry];
}

export interface OptionGroup {
  groupLabel: string;
  options: PrefillOption[];
}

/**
 * Collects options from all registered sources for the given context.
 * Sources with no options for this context are omitted.
 */
export function buildGroupedOptions(context: PrefillContext): OptionGroup[] {
  const groups: OptionGroup[] = [];

  for (const source of registry) {
    const options = source.getOptions(context);
    if (options.length === 0) continue;

    const byGroup = new Map<string, PrefillOption[]>();
    for (const opt of options) {
      const existing = byGroup.get(opt.groupLabel) ?? [];
      existing.push(opt);
      byGroup.set(opt.groupLabel, existing);
    }

    for (const [groupLabel, groupOptions] of byGroup) {
      groups.push({ groupLabel, options: groupOptions });
    }
  }

  return groups;
}

/** Reset registry — for use in tests only */
export function _resetRegistry(): void {
  registry.length = 0;
  registeredIds.clear();
}
