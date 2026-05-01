import type { BlueprintNode, FormDefinition } from "../api/types";
import type { PrefillValue } from "../sources/types";
import { FieldRow } from "./FieldRow";

interface PrefillEditorProps {
  node: BlueprintNode;
  form: FormDefinition;
  nodeMapping: Record<string, PrefillValue>;
  onClear: (fieldKey: string) => void;
  onOpenModal: (fieldKey: string) => void;
}

export function PrefillEditor({ node, form, nodeMapping, onClear, onOpenModal }: PrefillEditorProps) {
  const fields = Object.entries(form.field_schema.properties);

  return (
    <div style={{ flex: 1, padding: 24, overflowY: "auto" }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: 0 }}>
          {node.data.name}
        </h2>
        <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>
          Configure which data should prefill each field of this form.
        </p>
      </div>

      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          overflow: "hidden",
          background: "#ffffff",
        }}
      >
        {/* Table header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 16px",
            background: "#f9fafb",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Field</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Prefill Source</span>
        </div>

        {fields.length === 0 ? (
          <div style={{ padding: 24, color: "#6b7280", fontSize: 14, textAlign: "center" }}>
            This form has no configurable fields.
          </div>
        ) : (
          fields.map(([fieldKey, fieldSchema]) => (
            <FieldRow
              key={fieldKey}
              fieldKey={fieldKey}
              fieldSchema={fieldSchema}
              mappedValue={nodeMapping[fieldKey]}
              onClear={() => onClear(fieldKey)}
              onClick={() => onOpenModal(fieldKey)}
            />
          ))
        )}
      </div>
    </div>
  );
}
