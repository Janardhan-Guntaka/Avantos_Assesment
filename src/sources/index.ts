import { registerSource } from "../lib/sourceRegistry";
import { directDependenciesSource } from "./directDependenciesSource";
import { transitiveDependenciesSource } from "./transitiveDependenciesSource";
import { globalDataSource } from "./globalDataSource";

// Registration order controls display order in the modal.
// To add a new source: create a file implementing PrefillDataSource,
// import it here, and call registerSource(). Nothing else needs to change.
registerSource(directDependenciesSource);
registerSource(transitiveDependenciesSource);
registerSource(globalDataSource);
