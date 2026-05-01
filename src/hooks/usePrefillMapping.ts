import { useState, useCallback } from "react";
import type { PrefillMapping, PrefillValue } from "../sources/types";

interface UsePrefillMappingResult {
  mapping: PrefillMapping;
  setFieldMapping: (nodeId: string, fieldKey: string, value: PrefillValue) => void;
  clearFieldMapping: (nodeId: string, fieldKey: string) => void;
  getFieldMapping: (nodeId: string, fieldKey: string) => PrefillValue | undefined;
}

export function usePrefillMapping(): UsePrefillMappingResult {
  const [mapping, setMapping] = useState<PrefillMapping>({});

  const setFieldMapping = useCallback(
    (nodeId: string, fieldKey: string, value: PrefillValue) => {
      setMapping((prev) => ({
        ...prev,
        [nodeId]: { ...(prev[nodeId] ?? {}), [fieldKey]: value },
      }));
    },
    []
  );

  const clearFieldMapping = useCallback(
    (nodeId: string, fieldKey: string) => {
      setMapping((prev) => {
        const nodeMapping = { ...(prev[nodeId] ?? {}) };
        delete nodeMapping[fieldKey];
        return { ...prev, [nodeId]: nodeMapping };
      });
    },
    []
  );

  const getFieldMapping = useCallback(
    (nodeId: string, fieldKey: string): PrefillValue | undefined =>
      mapping[nodeId]?.[fieldKey],
    [mapping]
  );

  return { mapping, setFieldMapping, clearFieldMapping, getFieldMapping };
}
