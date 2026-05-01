import { useEffect, useRef } from "react";
import type { BlueprintGraph } from "../api/types";
import type { PrefillValue } from "../sources/types";
import { buildGroupedOptions } from "../lib/sourceRegistry";

interface PrefillModalProps {
  isOpen: boolean;
  targetNodeId: string;
  fieldKey: string;
  fieldLabel: string;
  graph: BlueprintGraph;
  onSelect: (value: PrefillValue) => void;
  onClose: () => void;
}

export function PrefillModal({
  isOpen,
  targetNodeId,
  fieldKey,
  fieldLabel,
  graph,
  onSelect,
  onClose,
}: PrefillModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const groups = buildGroupedOptions({ targetNodeId, graph });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Select prefill source for ${fieldLabel}`}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
        }}
      />

      {/* Modal panel */}
      <div
        ref={dialogRef}
        style={{
          position: "relative",
          background: "#ffffff",
          borderRadius: 8,
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          width: 500,
          maxWidth: "90vw",
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>
              Select prefill source
            </div>
            <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>
              Field: <strong>{fieldLabel}</strong> ({fieldKey})
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#9ca3af",
              fontSize: 20,
              lineHeight: 1,
              padding: 4,
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ overflowY: "auto", flex: 1, padding: "12px 0" }}>
          {groups.length === 0 ? (
            <div style={{ padding: "24px 20px", color: "#6b7280", fontSize: 14, textAlign: "center" }}>
              No prefill sources available for this form.
            </div>
          ) : (
            groups.map((group) => (
              <section key={group.groupLabel}>
                <h3
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "#9ca3af",
                    padding: "8px 20px 4px",
                    margin: 0,
                  }}
                >
                  {group.groupLabel}
                </h3>
                {group.options.map((opt) => (
                  <button
                    key={opt.fieldPath}
                    onClick={() => {
                      onSelect({
                        sourceId: opt.sourceId,
                        fieldPath: opt.fieldPath,
                        label: `${group.groupLabel} › ${opt.label}`,
                      });
                      onClose();
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      padding: "9px 20px",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      fontSize: 14,
                      color: "#374151",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#f3f4f6"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                  >
                    {opt.label}
                  </button>
                ))}
              </section>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
