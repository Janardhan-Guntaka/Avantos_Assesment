import type { FieldSchema } from "../api/types";
import type { PrefillValue } from "../sources/types";

interface FieldRowProps {
  fieldKey: string;
  fieldSchema: FieldSchema;
  mappedValue: PrefillValue | undefined;
  onClear: () => void;
  onClick: () => void;
}

export function FieldRow({ fieldKey, fieldSchema, mappedValue, onClear, onClick }: FieldRowProps) {
  const isMapped = mappedValue !== undefined;

  return (
    <div
      onClick={isMapped ? undefined : onClick}
      role={isMapped ? undefined : "button"}
      tabIndex={isMapped ? undefined : 0}
      onKeyDown={isMapped ? undefined : (e) => e.key === "Enter" && onClick()}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        borderBottom: "1px solid #f3f4f6",
        cursor: isMapped ? "default" : "pointer",
        background: isMapped ? "#ffffff" : "#ffffff",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => {
        if (!isMapped) (e.currentTarget as HTMLDivElement).style.background = "#f9fafb";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = "#ffffff";
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>
          {fieldSchema.title || fieldKey}
        </div>
        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
          {fieldKey} · {fieldSchema.avantos_type}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 12, flexShrink: 0 }}>
        {isMapped ? (
          <>
            <span
              style={{
                fontSize: 13,
                color: "#1d4ed8",
                background: "#eff6ff",
                borderRadius: 4,
                padding: "2px 8px",
                maxWidth: 200,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={mappedValue.label}
            >
              {mappedValue.label}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); onClear(); }}
              aria-label={`Clear prefill for ${fieldSchema.title || fieldKey}`}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#9ca3af",
                fontSize: 16,
                lineHeight: 1,
                padding: 4,
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#ef4444"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#9ca3af"; }}
            >
              ✕
            </button>
          </>
        ) : (
          <span style={{ fontSize: 13, color: "#9ca3af" }}>Not configured</span>
        )}
      </div>
    </div>
  );
}
