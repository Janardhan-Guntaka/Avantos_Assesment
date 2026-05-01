import type { BlueprintNode } from "../api/types";

interface FormListProps {
  nodes: BlueprintNode[];
  selectedNodeId: string | null;
  onSelectForm: (nodeId: string) => void;
}

export function FormList({ nodes, selectedNodeId, onSelectForm }: FormListProps) {
  return (
    <nav style={{ width: 220, borderRight: "1px solid #e5e7eb", padding: "16px 0", overflowY: "auto" }}>
      <h2 style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", padding: "0 16px 8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        Forms
      </h2>
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {nodes.map((node) => (
          <li key={node.id}>
            <button
              onClick={() => onSelectForm(node.id)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "10px 16px",
                border: "none",
                background: selectedNodeId === node.id ? "#eff6ff" : "transparent",
                borderLeft: selectedNodeId === node.id ? "3px solid #3b82f6" : "3px solid transparent",
                color: selectedNodeId === node.id ? "#1d4ed8" : "#374151",
                fontWeight: selectedNodeId === node.id ? 600 : 400,
                fontSize: 14,
                cursor: "pointer",
                transition: "background 0.15s",
              }}
            >
              {node.data.name}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
