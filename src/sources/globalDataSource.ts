import type { PrefillDataSource, PrefillContext, PrefillOption } from "./types";

const GLOBAL_OPTIONS: Omit<PrefillOption, "sourceId">[] = [
  { groupLabel: "Current User", fieldPath: "global.currentUser.email",      label: "Email" },
  { groupLabel: "Current User", fieldPath: "global.currentUser.fullName",   label: "Full Name" },
  { groupLabel: "Current User", fieldPath: "global.currentUser.department", label: "Department" },
  { groupLabel: "Organization",  fieldPath: "global.org.name",              label: "Organization Name" },
  { groupLabel: "Organization",  fieldPath: "global.org.id",                label: "Organization ID" },
  { groupLabel: "Date / Time",   fieldPath: "global.now.isoDate",           label: "Today's Date (ISO)" },
  { groupLabel: "Date / Time",   fieldPath: "global.now.timestamp",         label: "Current Timestamp" },
];

export const globalDataSource: PrefillDataSource = {
  id: "global-data",
  displayName: "Global Data",

  // Global options are always available regardless of context
  getOptions(_context: PrefillContext): PrefillOption[] {
    return GLOBAL_OPTIONS.map((opt) => ({ ...opt, sourceId: "global-data" }));
  },
};
