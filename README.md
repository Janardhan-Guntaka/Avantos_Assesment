# Journey Builder — Avantos Frontend Challenge

A React + TypeScript app that renders a DAG of forms and provides a prefill mapping UI.

## Quick Start

### 1. Start the mock server

```bash
git clone https://github.com/mosaic-avantos/frontendchallengeserver
cd frontendchallengeserver
npm install
npm start        # runs on http://localhost:3000
```

### 2. Start the app

```bash
cd avantos-journey-builder   # this repo
npm install
npm run dev      # runs on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173).

## Running Tests

```bash
npm test          # run all tests once
npm run test:watch  # watch mode
```

## What It Does

- Fetches a blueprint graph (`GET /api/v1/demo/actions/blueprints/demo/graph`)
- Lists all forms in a sidebar — click any form to open its prefill editor
- The prefill editor shows each field with its current source, or "Not configured"
- Click a field to open the source picker modal (grouped by source type)
- Click ✕ on a configured field to clear it

## How to Add a New Prefill Data Source

1. Create `src/sources/myNewSource.ts` implementing `PrefillDataSource`:

```typescript
import type { PrefillDataSource, PrefillContext, PrefillOption } from "./types";

export const myNewSource: PrefillDataSource = {
  id: "my-new-source",           // must be unique
  displayName: "My New Source",  // shown as group header in modal

  getOptions(context: PrefillContext): PrefillOption[] {
    // Return options relevant to context.targetNodeId and context.graph.
    // Return [] if nothing is available for this form.
    return [
      {
        sourceId: "my-new-source",
        groupLabel: "My Group",
        fieldPath: "mySource.someField",
        label: "Some Field",
      },
    ];
  },
};
```

2. Open `src/sources/index.ts` and add two lines:

```typescript
import { myNewSource } from "./myNewSource";
registerSource(myNewSource);
```

That's it. The new source automatically appears in the modal grouped under its `displayName`. No changes to components, hooks, or the registry itself are needed.

## Architecture

```
src/
  api/           # API types + fetch function
  lib/
    dag.ts           # Pure DAG traversal (getDirectDependencies, getTransitiveDependencies)
    sourceRegistry.ts  # Plugin registry (registerSource, buildGroupedOptions)
  sources/
    types.ts          # PrefillDataSource interface — the plugin contract
    directDependenciesSource.ts
    transitiveDependenciesSource.ts
    globalDataSource.ts
    index.ts          # Only file that registers sources
  components/    # React UI components
  hooks/         # useBlueprintGraph, usePrefillMapping
  App.tsx        # Root component, owns state
tests/           # Vitest + React Testing Library
```

### Plugin Architecture

The `PrefillDataSource` interface in `src/sources/types.ts` is the extension point. Each source receives a `PrefillContext` (target node ID + full graph) and returns a list of `PrefillOption` objects. Sources are registered once at startup via `registerSource()` in `src/sources/index.ts`. `buildGroupedOptions()` in the registry iterates all registered sources and groups their results for display in the modal.

**Adding a source requires: 1 new file + 2 new lines in `src/sources/index.ts`.**

## Tech Stack

| | |
|---|---|
| Framework | React 18 + TypeScript 5 |
| Build | Vite 6 |
| Data fetching | TanStack Query v5 |
| Testing | Vitest + React Testing Library |
