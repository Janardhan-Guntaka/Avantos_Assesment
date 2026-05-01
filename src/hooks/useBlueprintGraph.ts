import { useQuery } from "@tanstack/react-query";
import { fetchBlueprintGraph } from "../api/blueprintApi";
import type { BlueprintGraph } from "../api/types";

interface UseBlueprintGraphResult {
  graph: BlueprintGraph | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export function useBlueprintGraph(
  tenantId: string,
  blueprintId: string
): UseBlueprintGraphResult {
  const query = useQuery({
    queryKey: ["blueprintGraph", tenantId, blueprintId],
    queryFn: () => fetchBlueprintGraph(tenantId, blueprintId),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  return {
    graph: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as Error | null,
  };
}
