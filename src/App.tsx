import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useBlueprintGraph } from "./hooks/useBlueprintGraph";
import { usePrefillMapping } from "./hooks/usePrefillMapping";
import { FormList } from "./components/FormList";
import { PrefillEditor } from "./components/PrefillEditor";
import { PrefillModal } from "./components/PrefillModal";
import type { PrefillValue } from "./sources/types";

// Register all data source plugins (side-effect import)
import "./sources/index";

const TENANT_ID = "demo";
const BLUEPRINT_ID = "demo";

const queryClient = new QueryClient();

function JourneyBuilder() {
  const { graph, isLoading, isError, error } = useBlueprintGraph(TENANT_ID, BLUEPRINT_ID);
  const { mapping, setFieldMapping, clearFieldMapping } = usePrefillMapping();

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [modalFieldKey, setModalFieldKey] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div style={centeredStyle}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>⏳</div>
          <div style={{ color: "#6b7280" }}>Loading blueprint graph…</div>
        </div>
      </div>
    );
  }

  if (isError || !graph) {
    return (
      <div style={centeredStyle}>
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>⚠️</div>
          <div style={{ color: "#ef4444", fontWeight: 600, marginBottom: 8 }}>Failed to load blueprint</div>
          <div style={{ color: "#6b7280", fontSize: 14 }}>
            {error?.message ?? "Unknown error"}
          </div>
          <div style={{ color: "#9ca3af", fontSize: 13, marginTop: 12 }}>
            Make sure the mock server is running on port 3000.
          </div>
        </div>
      </div>
    );
  }

  const selectedNode = graph.nodes.find((n) => n.id === selectedNodeId) ?? null;
  const selectedForm = selectedNode
    ? graph.forms.find((f) => f.id === selectedNode.data.component_id) ?? null
    : null;

  const handleSelect = (value: PrefillValue) => {
    if (selectedNodeId && modalFieldKey) {
      setFieldMapping(selectedNodeId, modalFieldKey, value);
    }
  };

  const modalFieldSchema =
    selectedForm && modalFieldKey
      ? selectedForm.field_schema.properties[modalFieldKey]
      : null;

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <FormList
        nodes={graph.nodes.filter((n) => n.type === "form")}
        selectedNodeId={selectedNodeId}
        onSelectForm={setSelectedNodeId}
      />

      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#f9fafb" }}>
        {/* Header bar */}
        <header style={{ padding: "14px 24px", borderBottom: "1px solid #e5e7eb", background: "#ffffff", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>Journey Builder</span>
          <span style={{ fontSize: 13, color: "#9ca3af" }}>· Prefill Configuration</span>
        </header>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {selectedNode && selectedForm ? (
            <PrefillEditor
              node={selectedNode}
              form={selectedForm}
              nodeMapping={mapping[selectedNode.id] ?? {}}
              onClear={(fieldKey) => clearFieldMapping(selectedNode.id, fieldKey)}
              onOpenModal={(fieldKey) => setModalFieldKey(fieldKey)}
            />
          ) : (
            <div style={centeredStyle}>
              <div style={{ textAlign: "center", color: "#9ca3af" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>←</div>
                <div style={{ fontSize: 15 }}>Select a form to configure its prefill mapping</div>
              </div>
            </div>
          )}
        </div>
      </main>

      {selectedNode && modalFieldKey && modalFieldSchema && (
        <PrefillModal
          isOpen={true}
          targetNodeId={selectedNode.id}
          fieldKey={modalFieldKey}
          fieldLabel={modalFieldSchema.title || modalFieldKey}
          graph={graph}
          onSelect={handleSelect}
          onClose={() => setModalFieldKey(null)}
        />
      )}
    </div>
  );
}

const centeredStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  minHeight: "60vh",
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <JourneyBuilder />
    </QueryClientProvider>
  );
}
