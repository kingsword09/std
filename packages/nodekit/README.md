# @kingsword09/nodekit

### Deno

#### Example

```ts
import { which } from "jsr:@kingsword09/nodekit";

// Sync
const denoExecPath = which.sync("deno");

// Async
const denoExecPath = await which.async("deno");
```

---

### Node

#### Installation

```bash
# pnpm >= 10.9.0
# https://pnpm.io/cli/add#install-from-the-jsr-registry
pnpm add jsr:@kingsword09/nodekit
```

##### package.json

```json
{
  "dependencies": {
    "@kingsword09/nodekit": "jsr:0.0.1"
  }
}
```

#### Example

```ts
import { which } from "@kingsword09/nodekit";

// Sync
const denoExecPath = which.sync("deno");

// Async
const denoExecPath = await which.async("deno");
```
