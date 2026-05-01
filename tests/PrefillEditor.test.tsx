import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PrefillEditor } from "../src/components/PrefillEditor";
import { FieldRow } from "../src/components/FieldRow";
import type { BlueprintNode, FormDefinition } from "../src/api/types";
import type { PrefillValue } from "../src/sources/types";

const mockNode: BlueprintNode = {
  id: "node-b",
  type: "form",
  data: { id: "bp_c_b", component_id: "form-b", name: "Form B", prerequisites: ["node-a"], input_mapping: {} },
};

const mockForm: FormDefinition = {
  id: "form-b",
  name: "Form B",
  field_schema: {
    type: "object",
    properties: {
      email: { title: "Email", avantos_type: "short-text", format: "email" },
      name: { title: "Name", avantos_type: "short-text" },
    },
    required: ["email", "name"],
  },
};

const mockMappedValue: PrefillValue = {
  sourceId: "direct-dependencies",
  fieldPath: "node-a.email",
  label: "Form A (Direct) › Email",
};

describe("PrefillEditor", () => {
  it("renders all fields from form.field_schema.properties", () => {
    render(
      <PrefillEditor
        node={mockNode}
        form={mockForm}
        nodeMapping={{}}
        onClear={vi.fn()}
        onOpenModal={vi.fn()}
      />
    );
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
  });

  it("shows 'Not configured' for unmapped fields", () => {
    render(
      <PrefillEditor
        node={mockNode}
        form={mockForm}
        nodeMapping={{}}
        onClear={vi.fn()}
        onOpenModal={vi.fn()}
      />
    );
    const notConfigured = screen.getAllByText("Not configured");
    expect(notConfigured).toHaveLength(2);
  });

  it("shows the mapped value label for a configured field", () => {
    render(
      <PrefillEditor
        node={mockNode}
        form={mockForm}
        nodeMapping={{ email: mockMappedValue }}
        onClear={vi.fn()}
        onOpenModal={vi.fn()}
      />
    );
    expect(screen.getByText(mockMappedValue.label)).toBeInTheDocument();
  });

  it("calls onOpenModal with the correct fieldKey when clicking an unmapped row", () => {
    const onOpenModal = vi.fn();
    render(
      <PrefillEditor
        node={mockNode}
        form={mockForm}
        nodeMapping={{}}
        onClear={vi.fn()}
        onOpenModal={onOpenModal}
      />
    );
    // Click the Name row (unmapped)
    fireEvent.click(screen.getByText("Name").closest("div")!.parentElement!);
    expect(onOpenModal).toHaveBeenCalledWith("name");
  });

  it("calls onClear with the correct fieldKey when clicking the X button", () => {
    const onClear = vi.fn();
    render(
      <PrefillEditor
        node={mockNode}
        form={mockForm}
        nodeMapping={{ email: mockMappedValue }}
        onClear={onClear}
        onOpenModal={vi.fn()}
      />
    );
    fireEvent.click(screen.getByLabelText("Clear prefill for Email"));
    expect(onClear).toHaveBeenCalledWith("email");
  });
});

describe("FieldRow", () => {
  const emailSchema = { title: "Email", avantos_type: "short-text" };

  it("shows 'Not configured' when no mapped value", () => {
    render(
      <FieldRow
        fieldKey="email"
        fieldSchema={emailSchema}
        mappedValue={undefined}
        onClear={vi.fn()}
        onClick={vi.fn()}
      />
    );
    expect(screen.getByText("Not configured")).toBeInTheDocument();
  });

  it("shows the mapped value label when configured", () => {
    render(
      <FieldRow
        fieldKey="email"
        fieldSchema={emailSchema}
        mappedValue={mockMappedValue}
        onClear={vi.fn()}
        onClick={vi.fn()}
      />
    );
    expect(screen.getByText(mockMappedValue.label)).toBeInTheDocument();
  });

  it("renders the X button only when a value is mapped", () => {
    const { rerender } = render(
      <FieldRow
        fieldKey="email"
        fieldSchema={emailSchema}
        mappedValue={undefined}
        onClear={vi.fn()}
        onClick={vi.fn()}
      />
    );
    expect(screen.queryByLabelText("Clear prefill for Email")).toBeNull();

    rerender(
      <FieldRow
        fieldKey="email"
        fieldSchema={emailSchema}
        mappedValue={mockMappedValue}
        onClear={vi.fn()}
        onClick={vi.fn()}
      />
    );
    expect(screen.getByLabelText("Clear prefill for Email")).toBeInTheDocument();
  });

  it("calls onClick when the unmapped row is clicked", () => {
    const onClick = vi.fn();
    render(
      <FieldRow
        fieldKey="email"
        fieldSchema={emailSchema}
        mappedValue={undefined}
        onClear={vi.fn()}
        onClick={onClick}
      />
    );
    fireEvent.click(screen.getByText("Email").closest("div")!.parentElement!);
    expect(onClick).toHaveBeenCalled();
  });

  it("calls onClear when X is clicked and does not call onClick", () => {
    const onClear = vi.fn();
    const onClick = vi.fn();
    render(
      <FieldRow
        fieldKey="email"
        fieldSchema={emailSchema}
        mappedValue={mockMappedValue}
        onClear={onClear}
        onClick={onClick}
      />
    );
    fireEvent.click(screen.getByLabelText("Clear prefill for Email"));
    expect(onClear).toHaveBeenCalled();
    expect(onClick).not.toHaveBeenCalled();
  });
});
