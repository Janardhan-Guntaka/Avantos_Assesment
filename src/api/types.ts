export interface FieldSchema {
  title: string;
  avantos_type: string;
  format?: string;
  type?: string;
}

export interface FormFieldSchema {
  type: "object";
  properties: Record<string, FieldSchema>;
  required: string[];
}

export interface FormDefinition {
  id: string;
  name: string;
  description?: string;
  field_schema: FormFieldSchema;
}

export interface BlueprintNodeData {
  id: string;
  component_id: string;
  name: string;
  prerequisites: string[];
  input_mapping: Record<string, unknown>;
  component_key?: string;
  component_type?: string;
}

export interface BlueprintNode {
  id: string;
  type: string;
  data: BlueprintNodeData;
}

export interface Edge {
  source: string;
  target: string;
}

export interface BlueprintGraph {
  nodes: BlueprintNode[];
  edges: Edge[];
  forms: FormDefinition[];
}
