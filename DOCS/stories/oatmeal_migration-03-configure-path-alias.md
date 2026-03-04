# Story 03: Configure `@` Path Alias

**Goal:** Enable the `@` alias used by the Oatmeal components so imports resolve
without needing to rewrite them after copying.

## Tasks

1. Open `tsconfig.json` in the workspace root.
2. Note that your `compilerOptions` already has `"baseUrl": "./src"`. In Next.js, to make `@/components/...` point to `./src/components/...` while `baseUrl` is `src`, set the paths list relative to that base URL. Add this to `compilerOptions.paths`:
   ```json
   "paths": {
     "@/*": ["*"],
     // ... keep existing aliases like "@lib/*"
   }
   ```
   *(Note: Because `baseUrl` is `src`, using `"*"` inside paths means it resolves starting from `src/`.)*
3. Restart the dev server. Next.js natively picks up `tsconfig.json` mappings without custom Webpack config, so `import { Button } from '@/components/elements/button'` will parse perfectly once copied.

## Acceptance Criteria

* `tsconfig.json` contains the updated alias paths.
* There are no TypeScript resolution errors regarding `@/` in your editor.
* Next.js compiles without errors regarding the new aliases.

---

This story reduces friction when copying the reference components into the project.