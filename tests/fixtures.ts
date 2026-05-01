import type { BlueprintGraph } from "../src/api/types";

/**
 * Minimal test fixture with the same DAG structure as the real mock server:
 * A → B → D → F
 * A → C → E → F
 *
 * Each form has two fields: email and name.
 */
export const testGraph: BlueprintGraph = {
  nodes: [
    { id: "node-a", type: "form", data: { id: "bp_c_a", component_id: "form-a", name: "Form A", prerequisites: [], input_mapping: {} } },
    { id: "node-b", type: "form", data: { id: "bp_c_b", component_id: "form-b", name: "Form B", prerequisites: ["node-a"], input_mapping: {} } },
    { id: "node-c", type: "form", data: { id: "bp_c_c", component_id: "form-c", name: "Form C", prerequisites: ["node-a"], input_mapping: {} } },
    { id: "node-d", type: "form", data: { id: "bp_c_d", component_id: "form-d", name: "Form D", prerequisites: ["node-b"], input_mapping: {} } },
    { id: "node-e", type: "form", data: { id: "bp_c_e", component_id: "form-e", name: "Form E", prerequisites: ["node-c"], input_mapping: {} } },
    { id: "node-f", type: "form", data: { id: "bp_c_f", component_id: "form-f", name: "Form F", prerequisites: ["node-d", "node-e"], input_mapping: {} } },
  ],
  edges: [
    { source: "node-a", target: "node-b" },
    { source: "node-a", target: "node-c" },
    { source: "node-b", target: "node-d" },
    { source: "node-c", target: "node-e" },
    { source: "node-d", target: "node-f" },
    { source: "node-e", target: "node-f" },
  ],
  forms: [
    {
      id: "form-a",
      name: "Form A",
      field_schema: {
        type: "object",
        properties: {
          email: { title: "Email", avantos_type: "short-text", format: "email" },
          name: { title: "Name", avantos_type: "short-text" },
        },
        required: ["email", "name"],
      },
    },
    {
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
    },
    {
      id: "form-c",
      name: "Form C",
      field_schema: {
        type: "object",
        properties: {
          email: { title: "Email", avantos_type: "short-text" },
          name: { title: "Name", avantos_type: "short-text" },
        },
        required: ["email", "name"],
      },
    },
    {
      id: "form-d",
      name: "Form D",
      field_schema: {
        type: "object",
        properties: {
          email: { title: "Email", avantos_type: "short-text" },
          name: { title: "Name", avantos_type: "short-text" },
        },
        required: ["email", "name"],
      },
    },
    {
      id: "form-e",
      name: "Form E",
      field_schema: {
        type: "object",
        properties: {
          email: { title: "Email", avantos_type: "short-text" },
          name: { title: "Name", avantos_type: "short-text" },
        },
        required: ["email", "name"],
      },
    },
    {
      id: "form-f",
      name: "Form F",
      field_schema: {
        type: "object",
        properties: {
          email: { title: "Email", avantos_type: "short-text" },
          name: { title: "Name", avantos_type: "short-text" },
        },
        required: ["email", "name"],
      },
    },
  ],
};
